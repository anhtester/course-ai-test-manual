"""Đổi video Playwright (.webm) sang MP4 — AN TOÀN, không làm mất bản gốc — và (tuỳ chọn) gộp thành 1 video trọn luồng.

    python scripts/user-guide/webm2mp4.py <thư mục video> [--cuts cuts.tsv] [--default-cut 0] [--keep]
                                          [--concat full_walkthrough.mp4 [--order p1_a,p2_b,...]]

Cần ffmpeg + ffprobe trong PATH.

cuts.tsv: mỗi dòng `<tên không đuôi><TAB><số giây cắt đầu>` — cắt đoạn trang đang tải ở đầu video. Chấp nhận CRLF/LF, dòng trống, `#` ghi chú.

Bảo đảm:
  1. Mỗi file: ffmpeg → kiểm MP4 TỒN TẠI, > 1 KB và ffprobe đọc được thời lượng > 0 → mới coi là thành công.
  2. CHỈ xoá `.webm` của file đã chuyển thành công. File lỗi GIỮ NGUYÊN .webm, in `FAIL`, mã thoát != 0.
  3. `page@*.webm` (file thô Playwright sinh kèm) chỉ bị xoá khi KHÔNG còn file nào lỗi.
  4. --concat: gộp các MP4 theo --order (mặc định thứ tự tên file, bỏ qua chính file đích) bằng concat demuxer `-c copy`
     (các phần quay cùng kích thước nên không cần mã hoá lại); file danh sách đặt CẠNH các mp4 rồi xoá.
"""
import argparse, pathlib, subprocess, sys

for _s in (sys.stdout, sys.stderr):   # console Windows mặc định cp1252 — in tiếng Việt sẽ sập script giữa chừng
    _s.reconfigure(encoding='utf-8', errors='replace')

ap = argparse.ArgumentParser()
ap.add_argument('video_dir')
ap.add_argument('--cuts', help='file tsv: tên<TAB>giây')
ap.add_argument('--default-cut', type=float, default=None, help='giây cắt cho file không có trong cuts.tsv (mặc định: không cắt)')
ap.add_argument('--keep', action='store_true', help='không xoá .webm kể cả khi thành công')
ap.add_argument('--concat', help='tên MP4 gộp trọn luồng, VD full_walkthrough.mp4')
ap.add_argument('--order', help='thứ tự gộp: danh sách tên không đuôi, phân cách dấu phẩy')
a = ap.parse_args()

vd = pathlib.Path(a.video_dir)
cuts = {}
if a.cuts:
    for ln in pathlib.Path(a.cuts).read_text(encoding='utf-8').splitlines():
        ln = ln.strip()
        if not ln or ln.startswith('#'):
            continue
        parts = [p.strip() for p in ln.replace('\t', ' ').rsplit(None, 1)]
        try:
            cuts[parts[0]] = float(parts[1])
        except (ValueError, IndexError):
            print('BỎ QUA dòng không hợp lệ:', repr(ln))


def duration(p):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', str(p)], capture_output=True, text=True)
    try:
        return float(r.stdout.strip())
    except ValueError:
        return 0.0


def ok_mp4(p):
    return p.exists() and p.stat().st_size >= 1024 and duration(p) > 0


fails, done = [], []
for w in sorted(p for p in vd.glob('*.webm') if not p.name.startswith('page@')):
    name = w.stem
    ss = cuts.get(name, a.default_cut)
    out = w.with_suffix('.mp4')
    cmd = ['ffmpeg', '-nostdin', '-v', 'error', '-y'] + (['-ss', f'{ss:g}'] if ss else []) + ['-i', str(w), '-c:v', 'libx264', '-preset', 'veryfast',
           '-crf', '28', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(out)]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode == 0 and ok_mp4(out):
        done.append(w)
        print(f'OK   {name}.mp4 ({out.stat().st_size // 1024} KB, {duration(out):.1f}s, cắt {ss or 0:g}s)')
    else:
        fails.append(name)
        if out.exists():
            out.unlink()
        print(f'FAIL {name}: ffmpeg rc={r.returncode} {r.stderr.strip()[:200]} — GIỮ NGUYÊN {w.name}')

if not a.keep:
    for w in done:
        w.unlink()
    if not fails:
        for p in vd.glob('page@*.webm'):
            p.unlink()
    else:
        print(f'{len(fails)} file lỗi — giữ lại page@*.webm và .webm lỗi để làm lại')

if a.concat and not fails:
    target = vd / a.concat
    names = [n.strip() for n in a.order.split(',')] if a.order else [p.stem for p in sorted(vd.glob('*.mp4')) if p.name != target.name]
    missing = [n for n in names if not (vd / f'{n}.mp4').exists()]
    if missing:
        print('FAIL concat: thiếu', ', '.join(missing)); sys.exit(1)
    lst = vd / '_concat.txt'
    lst.write_text(''.join(f"file '{n}.mp4'\n" for n in names), encoding='utf-8')
    r = subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst.name, '-c', 'copy', target.name], cwd=vd, capture_output=True, text=True)
    lst.unlink()
    if r.returncode == 0 and ok_mp4(target):
        print(f'OK   {target.name} ({target.stat().st_size // 1024} KB, {duration(target):.1f}s) = ' + ' + '.join(names))
    else:
        print(f'FAIL concat: {r.stderr.strip()[:200]}'); sys.exit(1)

print(f'Xong: {len(done)} OK · {len(fails)} FAIL')
sys.exit(1 if fails else 0)
