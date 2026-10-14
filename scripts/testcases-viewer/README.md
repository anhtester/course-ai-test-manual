# Test Cases Viewer

Trang web nhỏ gọn để **xem test cases từ file Markdown** — hỗ trợ search, sort và phân nhóm theo module.

Dùng để đọc output của các workflow sinh test case trong repo này:
`/generate-testcases-from-requirements`, `/generate-testcases-manual-rbt`.

---

## Dùng ngay (không cần cài gì)

Mở file [`bundle.html`](bundle.html) bằng trình duyệt (double-click là được) — đây là bản build đã đóng gói toàn bộ HTML/CSS/JS vào 1 file duy nhất, chạy offline.

Sau đó **kéo thả** hoặc bấm **+ Import file .md** để nạp file test cases, ví dụ:
`docs/testcases/login/web/test_cases_login_web.md` — file theo nền tảng (`web/` · `mobile/` · `api/`); file index `TEST_CASES_LOGIN_SUMMARY.md` không chứa dòng TC. Các file nền tảng mang hậu tố riêng nên nạp cùng lúc không đè nhau

> Toàn bộ xử lý chạy trong trình duyệt, không gửi dữ liệu đi đâu. File đã import được lưu vào `localStorage` nên lần mở sau vẫn còn.

---

## Tính năng

| Nhóm | Chi tiết |
|---|---|
| **Import** | Kéo thả hoặc chọn file `.md` · nạp **nhiều file** cùng lúc (mỗi file = 1 tài liệu) · import lại cùng tên file sẽ ghi đè |
| **Sidebar** | Cây `Tài liệu → Nhóm TC` kèm số lượng, click để lọc · nút `✕` gỡ từng file |
| **Search** | Full-text trên TC ID, REQ ID, Test Scenario, Pre-Condition, Test Steps, Test Data, Expected Result, Tags |
| **Filter** | Priority (chọn nhiều) · Automation (Yes/Partial/No) · Tag (`@Smoke`, `@Regression`…) |
| **Sort** | Click header để sort: TC ID (số tự nhiên — `TC_002` trước `TC_010`), Test Scenario, Nhóm, Priority, Risk |
| **Chi tiết** | Click 1 dòng để mở panel Test Steps · Expected Result · Pre-Condition · Test Data (giữ nguyên xuống dòng `<br>` và định dạng `` `code` ``) |
| **Thống kê** | Đếm TC theo Priority, cập nhật theo bộ lọc đang áp |
| **Export** | Xuất **CSV** và **Excel (.xlsx)** — xem mục dưới |

---

## Export CSV / Excel

Hai nút `↓ CSV` và `↓ Excel` trên toolbar xuất **đúng những test case đang hiển thị** — tức là
đã áp bộ lọc, tìm kiếm và thứ tự sort hiện tại. Muốn xuất tất cả thì bấm **Tất cả** ở sidebar
và xoá hết bộ lọc trước.

Cả 2 định dạng đều gồm 13 cột: `TC ID · REQ ID · Module · Risk Level · Test Scenario ·
Pre-Condition · Test Steps · Test Data · Expected Result · Priority · Automation · Auto Type · Tags`.
Thẻ `<br>` được đổi thành xuống dòng thật, markdown inline (`` ` ``, `**`) được gỡ bỏ.

| Định dạng | Đặc điểm |
|---|---|
| **CSV** | Có BOM UTF-8 nên Excel trên Windows đọc đúng tiếng Việt, không bị lỗi font |
| **Excel** | Sheet đầu `Tổng hợp` chứa tất cả, sau đó **mỗi nhóm một sheet riêng**. Có freeze dòng tiêu đề, AutoFilter, wrap text và độ rộng cột đặt sẵn |

Tên file dạng `<tên file nguồn>_<yyyyMMdd-HHmmss>.csv|.xlsx`.

> File `.xlsx` được dựng thủ công bằng zip + Office Open XML (`src/lib/export.ts`) thay vì dùng
> SheetJS — thư viện nặng ~900 KB sẽ làm phình `bundle.html` vốn phải mở offline được. Zip ghi ở
> chế độ STORE (không nén) nên file to hơn bình thường: 54 test case ≈ 185 KB.

---

## Định dạng file Markdown được hỗ trợ

Parser quét mọi bảng Markdown có cột **`TC ID`** và tự nhận diện các cột sau (không phân biệt thứ tự, thiếu cột nào thì bỏ trống cột đó):

```
TC ID · REQ ID · Module · Risk Level · Test Scenario (hoặc Test Title)
Pre-Condition · Test Steps · Test Data · Expected Result
Priority · Automation · Auto Type · Tags
```

Quy ước khác:

- **Nhóm module** lấy từ heading `##`/`###` gần nhất phía trên bảng (VD `### Nhóm C — Validation trường Email Address`); hậu tố `(12 TC)` được lược bỏ
- **Tên tài liệu** lấy từ heading `#` đầu file
- `REQ ID` nhiều mã phân cách bằng dấu phẩy
- `Tags` là các từ bắt đầu bằng `@`
- Pipe trong cell phải escape `\|` (đúng chuẩn Markdown)

Các bảng khác trong file (Assumptions, Decision Table, Coverage…) được **bỏ qua tự động** vì không có cột `TC ID`.

---

## Phát triển

```bash
cd scripts/testcases-viewer
pnpm install
pnpm dev
```

Build lại `bundle.html` sau khi sửa code:

```bash
pnpm run bundle
```

**Stack:** React 18 + TypeScript + Vite (dev) + Parcel (bundle) + Tailwind CSS + shadcn/ui

**Cấu trúc:**

| File | Vai trò |
|---|---|
| `src/lib/parser.ts` | Parse Markdown → mảng `TestCase` (tách cell, nhận diện cột, gom nhóm theo heading) |
| `src/App.tsx` | Toàn bộ UI: import, sidebar, toolbar lọc, bảng, panel chi tiết |
| `src/lib/export.ts` | Xuất CSV và .xlsx (gồm cả bộ ghi zip tối giản, không dùng thư viện ngoài) |
| `src/lib/assets.ts` | **File sinh tự động** — logo + favicon dạng data URI. Không sửa tay |
| `tools/embed-assets.mjs` | Script sinh `assets.ts` và chèn favicon vào `index.html` |
| `bundle.html` | Bản build 1 file — commit vào repo để dùng ngay không cần build |

### Đổi logo / favicon

Thay file trong `public/` rồi chạy:

```bash
pnpm run embed-assets && pnpm run bundle
```

Logo và favicon được **nhúng dạng data URI** chứ không tham chiếu file ngoài, để `bundle.html`
mở bằng `file://` vẫn hiển thị đủ. Nếu đổi tên file logo, sửa hằng `LOGO` trong `tools/embed-assets.mjs`.

Màu thương hiệu `#4DBD44` lấy từ logo, khai báo thành thang `brand-50…900` trong `tailwind.config.js`.
