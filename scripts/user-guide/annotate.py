"""Vẽ highlight lên ẢNH CÓ SẴN — cùng kiểu với ug-lib.js: khung đỏ + huy hiệu số thứ tự click + nhãn đen + dải chú thích đáy.
Dùng cho Mode DOC (ảnh evidence có sẵn) hoặc khi không chạy được trình duyệt. Mode LIVE/VIDEO highlight bằng ug-lib.js (chính xác theo DOM).

    python scripts/user-guide/annotate.py --grid <ảnh.png>            # 1) sinh <ảnh>.grid.png có lưới toạ độ 100 px để đọc vị trí khung
    python scripts/user-guide/annotate.py <spec.json>                  # 2) vẽ theo spec

spec.json (một object hoặc mảng object; đường dẫn tương đối theo vị trí file spec):
{
  "image": "../../requirements/login/web/evidence/login-form.png",
  "out": "images/p1-1-s2-sign-in.png",
  "caption": "Part 1 · Sign in · Step 2 — Enter your email",        // tuỳ chọn
  "marks": [ {"box": [x, y, w, h], "n": 2, "label": "Email"},       // toạ độ theo PIXEL ẢNH gốc
             {"box": [x, y, w, h], "n": 3, "label": "Password"} ]
}
Sau khi vẽ PHẢI mở lại ảnh xác nhận khung đúng chỗ (toạ độ đọc bằng mắt dễ lệch).
Cần: pip install pillow
"""
import json, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

for _s in (sys.stdout, sys.stderr):
    _s.reconfigure(encoding='utf-8', errors='replace')

RED, DARK, WHITE = (225, 29, 72), (17, 24, 39), (255, 255, 255)


def font(size, bold=True):
    for name in (('arialbd.ttf', 'Arial Bold.ttf', 'DejaVuSans-Bold.ttf') if bold else ('arial.ttf', 'Arial.ttf', 'DejaVuSans.ttf')):
        for d in ('', 'C:/Windows/Fonts/', '/Library/Fonts/', '/usr/share/fonts/truetype/dejavu/'):
            try:
                return ImageFont.truetype(d + name, size)
            except OSError:
                pass
    return ImageFont.load_default()


def grid(path):
    im = Image.open(path).convert('RGB')
    d = ImageDraw.Draw(im, 'RGBA'); f = font(12, False)
    for x in range(0, im.width, 100):
        d.line([(x, 0), (x, im.height)], fill=(0, 120, 255, 90)); d.text((x + 2, 2), str(x), fill=(0, 80, 200), font=f)
    for y in range(0, im.height, 100):
        d.line([(0, y), (im.width, y)], fill=(0, 120, 255, 90)); d.text((2, y + 2), str(y), fill=(0, 80, 200), font=f)
    out = Path(path).with_suffix('.grid.png'); im.save(out); print('grid:', out)


def hit(a, b):
    return a[0] < b[2] and a[2] > b[0] and a[1] < b[3] and a[3] > b[1]


def draw(spec, base):
    im = Image.open(base / spec['image']).convert('RGB')
    d = ImageDraw.Draw(im, 'RGBA')
    fb, fl, fc = font(15), font(12), font(15)
    cap_h = 40 if spec.get('caption') else 0
    boxes = []
    for m in spec['marks']:
        x, y, w, h = m['box']; p = 4
        r = (x - p, y - p, x + w + p, y + h + p); boxes.append(r)
        d.rounded_rectangle((r[0] - 4, r[1] - 4, r[2] + 4, r[3] + 4), 9, outline=RED + (46,), width=4)
        d.rounded_rectangle(r, 6, outline=RED, width=3)
    placed = []
    for m, r in zip(spec['marks'], boxes):
        if m.get('n') is not None:
            t = str(m['n']); tw = d.textlength(t, font=fb); bw = max(26, tw + 12)
            bx, by = max(2, r[0] - 14), max(2, r[1] - 14)
            d.rounded_rectangle((bx, by, bx + bw, by + 26), 13, fill=RED)
            d.text((bx + (bw - tw) / 2, by + 4), t, fill=WHITE, font=fb)
        if m.get('label'):
            tw = d.textlength(m['label'], font=fl) + 16; th = 24
            others = [o for o in boxes if o is not r]
            for cx, cy in ((r[0], r[3] + 8), (r[2] + 10, r[1]), (r[0], r[1] - th - 10), (r[2] - tw - 6, r[1] + 6)):
                c = (min(max(4, cx), im.width - tw - 4), cy, 0, 0); c = (c[0], c[1], c[0] + tw, c[1] + th)
                if c[1] >= 4 and c[3] <= im.height - cap_h - 6 and not any(hit(c, o) for o in others + placed):
                    break
            placed.append(c)
            d.rounded_rectangle(c, 5, fill=DARK); d.text((c[0] + 8, c[1] + 5), m['label'], fill=WHITE, font=fl)
    if cap_h:
        d.rectangle((0, im.height - cap_h, im.width, im.height), fill=DARK + (235,))
        d.line((0, im.height - cap_h, im.width, im.height - cap_h), fill=RED, width=3)
        d.text((16, im.height - cap_h + 10), spec['caption'], fill=WHITE, font=fc)
    out = base / spec['out']; out.parent.mkdir(parents=True, exist_ok=True); im.save(out)
    print('OK', out)


if __name__ == '__main__':
    if len(sys.argv) > 2 and sys.argv[1] == '--grid':
        grid(sys.argv[2])
    else:
        spec_path = Path(sys.argv[1])
        specs = json.loads(spec_path.read_text(encoding='utf-8'))
        for s in (specs if isinstance(specs, list) else [specs]):
            draw(s, spec_path.parent)
