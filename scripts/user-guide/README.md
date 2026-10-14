# scripts/user-guide — ảnh & video có highlight cho User Guide

Bộ công cụ của skill [`skills-user-guide-writer`](../../.claude/skills/skills-user-guide-writer/SKILL.md) · workflow `/generate-user-guide` (Mode **LIVE** / **VIDEO** / **DOC**, ngôn ngữ `lang`). Không gắn với hệ thống nào — dùng được cho mọi web app chạy qua Playwright MCP.

> ⭐ **Highlight là bắt buộc** ở mọi ảnh, mọi video: khung đỏ quanh vùng thao tác · huy hiệu số thứ tự click (1, 2, 3…) · nhãn đen · dải chú thích đáy màn hình. `ug.shot()` **từ chối** chụp khi chưa khoanh.

| File | Dùng ở mode | Làm gì |
|---|---|---|
| `ug-lib.js` | LIVE · VIDEO | Thư viện overlay + quay: `UG.record()`, `ug.click / fill / look / mark / marks / caption / shot / clear` |
| `boot.js` | LIVE · VIDEO | Nạp `ug-lib.js` + `.env` trên trang Playwright MCP, trả `UG` |
| `rec-template.js` | VIDEO (LIVE dùng y hệt, chỉ bỏ `UG.record`) | Khung kịch bản quay 1 phần — copy rồi điền `<…>` |
| `annotate.py` | DOC (và ảnh có sẵn bất kỳ) | Vẽ **cùng kiểu highlight** lên ảnh có sẵn theo `spec.json`; `--grid` sinh ảnh lưới toạ độ để đọc vị trí khung |
| `webm2mp4.py` | VIDEO | `.webm` → `.mp4` an toàn (kiểm ffprobe rồi mới xoá bản gốc) · `--concat full_walkthrough.mp4 --order …` gộp video trọn luồng |
| `md2html.py` + `template.html` | mọi mode | User Guide `.md` → HTML 1 file: `--standalone` nhúng ảnh + video · `--lang vi\|en` chữ giao diện · `--release` cắt phần `<!-- internal:start -->…<!-- internal:end -->` |

Cần: Playwright MCP (`browser_run_code_unsafe`), Python 3 + `pip install markdown pillow`, `ffmpeg` + `ffprobe` trong PATH (mode VIDEO).

## Mode LIVE / VIDEO — chạy qua Playwright MCP

```js
// .playwright-mcp/user-guide/rec_1.js  — copy từ rec-template.js
async (page) => {
  const ROOT = 'D:/work/my-project';
  await page.goto('file:///' + ROOT + '/scripts/user-guide/boot.js');
  const UG = await eval(await page.evaluate(() => document.body.innerText))(page, { root: ROOT, outDir: ROOT + '/docs/user-guides/<module>/', lang: 'en' });
  return await UG.record('p1_customers_add', async (p, ug) => {          // Mode LIVE: bỏ UG.record, dùng ug = UG trên chính `page`
    ug.section = 'Part 1 · Add a customer';
    await p.goto(UG.env.APP_BASE_URL + '/customers');
    await ug.click(p.getByRole('button', { name: 'New Customer' }), 1, 'Click "New Customer"', 'p1-1-s1-new-customer.png');
    await ug.fill(p.getByLabel('Company'), 'Sample Company ABC', 2, 'Company: enter the company name', null);
    await ug.marks([{ loc: p.getByLabel('Email'), n: 3, label: 'Email' }, { loc: p.getByRole('button', { name: 'Save' }), n: 4, label: 'Click Save' }],
                   'Steps 3–4 — Enter the email, then save');
    await ug.wait(3000); await ug.shot('p1-1-s3-4-email-save.png'); await ug.clear();
  });                                       // 3rd arg { login: UG.formLogin({...}) } — bỏ trống = dùng phiên đang đăng nhập trên trang MCP
}
```

Chạy: `browser_run_code_unsafe filename=<đường dẫn tuyệt đối file>` — file phải nằm trong *allowed roots* của MCP (thường là thư mục project). Kết quả `{ name, err, res }`; `err` ≠ `null` ⇒ xem `video/<name>__error.png`.

| API | Ghi chú |
|---|---|
| `ug.click(loc, n, text, shot?, label?)` | Khoanh + số `n` + chú thích → dừng ~1,3 s → (chụp) → click |
| `ug.fill(loc, value, n, text, shot?, label?)` | Gõ từng ký tự để người xem thấy chữ hiện ra |
| `ug.look(loc, n, text, shot?, label?, ms?)` | Bước kiểm tra kết quả — khoanh, giữ lâu, không thao tác |
| `ug.marks([{loc, n, label}], text)` | ⭐ Một trang nhiều bước — nhiều khung + số cùng lúc; cuộn **một lần** rồi đo; nhãn tự né nhau. Khung nào nằm **ngoài màn hình** ⇒ báo lỗi — tách thành nhiều ảnh |
| `ug.caption(text, ms)` | Chỉ dải chú thích (mở đầu / chuyển cảnh) — **không** tính là highlight |
| `ug.blur(loc, px?)` · `ug.unblur()` | 🔒 Làm mờ dữ liệu của người khác (bảng danh sách, email, số tiền…) — có tác dụng cả trong ảnh lẫn video tới khi trang chuyển |
| `UG.record(name, fn, { login? })` | Quay 1 phần → `video/<name>.webm`; đăng nhập (nếu cần) chạy ở context **không quay** |

Phần tử trong iframe khoanh bình thường (`p.frameLocator(...)`): lớp phủ vẽ ở trang chính theo `boundingBox`.

## Mode DOC — highlight ảnh có sẵn

```bash
python scripts/user-guide/annotate.py --grid docs/requirements/login/web/evidence/login-form.png    # đọc toạ độ trên ảnh lưới
python scripts/user-guide/annotate.py docs/user-guides/login/annotate.json                           # vẽ → images/
```

## Xuất bản

```bash
python scripts/user-guide/webm2mp4.py docs/user-guides/<module>/video --concat full_walkthrough.mp4 --order p1_a,p2_b,p3_c
python scripts/user-guide/md2html.py docs/user-guides/<module>/user_guide_<module>.md docs/user-guides/<module>/user_guide_<module>.html --standalone --lang en --release
```
