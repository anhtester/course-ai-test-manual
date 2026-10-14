"""User Guide Markdown → HTML 1 file (mục lục cố định, ảnh bấm phóng to, video phát tại chỗ, sáng/tối).

    python scripts/user-guide/md2html.py <user_guide.md> <out.html> [--standalone] [--lang vi|en] [--release]

  --standalone  nhúng MỌI ảnh (nén JPEG q78) và video MP4 ≤ 25 MB vào HTML — gửi 1 file là xem được hết, không cần thư mục images/ video/
  --lang        ngôn ngữ chữ giao diện (mục lục, nút, gợi ý) — khớp ngôn ngữ tài liệu. Mặc định vi
  --release     bản phát hành: cắt mọi đoạn giữa <!-- internal:start --> và <!-- internal:end --> (mục "Vùng chưa xác minh"…).
                Không thấy cặp đánh dấu nào ⇒ báo lỗi, không xuất (tránh lỡ gửi khách ghi chú nội bộ)

Trong Markdown:
  ảnh   ![Chú thích](images/x.png)                      → figure + chú thích = alt
  video <video src="video/x.mp4" title="Chú thích" controls></video>   → trình phát, chú thích = title (không có thì tên file)
  ghi chú/cảnh báo: đoạn bắt đầu bằng 💡 ❗ ⚠️ 🛑 📌 → khung màu
Cần: pip install markdown pillow
"""
import base64, html, json, re, sys
from pathlib import Path
import markdown

for _s in (sys.stdout, sys.stderr):
    _s.reconfigure(encoding='utf-8', errors='replace')

I18N = {
    'vi': dict(toc_title='Mục lục', viewer='Xem ảnh', close='Đóng', prev='Ảnh trước', next='Ảnh sau', theme='Đổi giao diện sáng/tối',
               hint='Click ảnh để phóng to · ← → chuyển ảnh · Esc đóng'),
    'en': dict(toc_title='Contents', viewer='Image viewer', close='Close', prev='Previous image', next='Next image', theme='Toggle light/dark theme',
               hint='Click an image to zoom · ← → previous/next · Esc to close'),
}

args = [a for a in sys.argv[1:] if not a.startswith('--')]
STANDALONE, RELEASE = '--standalone' in sys.argv, '--release' in sys.argv
LANG = sys.argv[sys.argv.index('--lang') + 1] if '--lang' in sys.argv else 'vi'
args = [a for a in args if a != LANG]
src, dst = Path(args[0]), Path(args[1])
base = src.parent
text = src.read_text(encoding='utf-8')

if RELEASE:
    text, n = re.subn(r'<!--\s*internal:start\s*-->.*?<!--\s*internal:end\s*-->', '', text, flags=re.S | re.I)
    if not n:
        sys.exit('--release: không thấy <!-- internal:start --> … <!-- internal:end --> — đánh dấu mục nội bộ trước khi xuất bản phát hành')
    print(f'--release: đã cắt {n} đoạn nội bộ')

# Dòng tiếp nối trong danh sách thụt 3 cách; python-markdown cần 4.
lines = []
for ln in text.splitlines():
    if ln.startswith('   ') and not ln.startswith('    '):
        ln = ' ' + ln
        if ln.strip().startswith(('💡', '❗', '⚠️', '🛑', '📌')):
            lines.append('')
    if re.match(r'^(\d+\. |- )', ln) and lines and lines[-1].strip() and not re.match(r'^\s*(\d+\. |- )', lines[-1]):
        lines.append('')
    lines.append(ln)
body = markdown.markdown('\n'.join(lines), extensions=['tables', 'toc', 'sane_lists'])


def callout(m):
    inner = m.group(1)
    for mark, cls in (('❗', 'caution'), ('⚠️', 'warning'), ('🛑', 'danger'), ('💡', 'tip'), ('📌', 'note')):
        if inner.lstrip().startswith(mark):
            return f'<div class="callout {cls}">{inner}</div>'
    return m.group(0)
body = re.sub(r'<p>(.*?)</p>', callout, body, flags=re.S)
body = re.sub(r'<blockquote>\s*(.*?)\s*</blockquote>', lambda m: f'<div class="callout note">{m.group(1)}</div>', body, flags=re.S)

ASSETS, KEYS = {}, {}
def asset(path):
    f = base / path
    k = str(f.resolve())
    if k not in KEYS:
        suf = f.suffix.lower()
        if suf == '.png':
            try:
                from io import BytesIO
                from PIL import Image
                buf = BytesIO(); Image.open(f).convert('RGB').save(buf, 'JPEG', quality=78, optimize=True, progressive=True)
                uri = 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode()
            except ImportError:
                uri = 'data:image/png;base64,' + base64.b64encode(f.read_bytes()).decode()
        elif suf in ('.jpg', '.jpeg'):
            uri = 'data:image/jpeg;base64,' + base64.b64encode(f.read_bytes()).decode()
        else:
            uri = 'data:video/mp4;base64,' + base64.b64encode(f.read_bytes()).decode()
        KEYS[k] = f'a{len(KEYS)}'; ASSETS[KEYS[k]] = uri
    return KEYS[k]


def img(m):
    alt, path = html.unescape(m.group(1)), m.group(2)
    s = f'data-k="{asset(path)}"' if STANDALONE and (base / path).exists() else f'src="{path}"'
    return f'<figure><img {s} alt="{html.escape(alt)}" loading="lazy"><figcaption>{html.escape(alt)}</figcaption></figure>'
body = re.sub(r'<img alt="([^"]*)" src="([^"]+)"\s*/?>', img, body)
body = re.sub(r'<p>\s*(<figure>.*?</figure>)\s*</p>', r'\1', body, flags=re.S)


def video(m):
    path = m.group(1)
    f = base / path
    t = re.search(r'\stitle="([^"]*)"', m.group(0))
    cap = html.unescape(t.group(1)) if t else path
    s = f'data-k="{asset(path)}"' if STANDALONE and f.exists() and f.stat().st_size <= 25 * 1024 * 1024 else f'src="{path}"'
    return f'<figure class="vid"><video {s} controls preload="metadata"></video><figcaption>{html.escape(cap)}</figcaption></figure>'
body = re.sub(r'<video[^>]*\ssrc="([^"]+)"[^>]*>\s*</video>', video, body)
body = re.sub(r'<p>\s*(<figure class="vid">.*?</figure>)\s*</p>', r'\1', body, flags=re.S)
# Liên kết sang User Guide khác (.md) → bản .html cạnh nó nếu đã xuất (người đọc HTML không mở được .md)
body = re.sub(r'href="([^"#:]+)\.md(#[^"]*)?"', lambda m: f'href="{m.group(1)}.html{m.group(2) or ""}"' if (base / (m.group(1) + '.html')).exists() else m.group(0), body)
body = body.replace('<table>', '<div class="tbl"><table>').replace('</table>', '</table></div>')

toc = ''.join(f'<a class="lvl{lvl}" href="#{hid}">{re.sub("<[^>]+>", "", t)}</a>'
              for lvl, hid, t in re.findall(r'<h([23]) id="([^"]+)">(.*?)</h\1>', body))
m = re.search(r'<h1[^>]*>(.*?)</h1>', body)
title = re.sub('<[^>]+>', '', m.group(1)) if m else src.stem

t = I18N.get(LANG, I18N['en'])
page = (Path(__file__).with_name('template.html').read_text(encoding='utf-8')
        .replace('{{LANG}}', LANG).replace('{{TITLE}}', html.escape(title)).replace('{{TOC}}', toc).replace('{{BODY}}', body)
        .replace('{{JS_I18N}}', json.dumps(t, ensure_ascii=False)))
for k, v in t.items():
    page = page.replace('{{' + k.upper() + '}}', html.escape(v))
if ASSETS:   # bảng tài sản nạp TRƯỚC script lightbox (lightbox đọc .src khi bấm)
    page = page.replace('<!--ASSETS-->', '<script>var A=' + json.dumps(ASSETS) + ";document.querySelectorAll('[data-k]').forEach(function(e){e.src=A[e.getAttribute('data-k')]});</script>")
dst.write_text(page, encoding='utf-8')
print(f'{dst} — {dst.stat().st_size // 1024} KB · {sum(1 for v in ASSETS.values() if v.startswith("data:image"))} ảnh + '
      f'{sum(1 for v in ASSETS.values() if v.startswith("data:video"))} video nhúng · lang={LANG}' + (' · release' if RELEASE else ''))
