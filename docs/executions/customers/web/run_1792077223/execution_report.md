# Execution Report — Customers · Bộ TC (Part 01 Smoke nhóm C–D + Part 02 nhóm E)

| Thông tin | Nội dung |
|---|---|
| Run ID | `run_1792077223` |
| Nền tảng | `web` |
| Loại nguồn | `Bộ TC` |
| Nguồn TC | [`part_01_web_smoke.md`](../../../../testcases/customers/web/parts/part_01_web_smoke.md) (`TC_011` → `TC_016`) · [`part_02_web_danh_sach.md`](../../../../testcases/customers/web/parts/part_02_web_danh_sach.md) (`TC_017` → `TC_020`) |
| Phạm vi | 10 TC kế tiếp chưa chạy: `CRM_CUST_TC_011` → `CRM_CUST_TC_020` (kế hoạch 10 TC/ngày). Loại 0 TC `@Deprecated`. Login: 51/51 TC đã có kết quả từ trước → không còn TC chưa chạy. Customers: 10/129 đã chạy ở [run_1791988426](../run_1791988426/execution_report.md) |
| Môi trường | `https://crm.anhtester.com` — Perfex CRM demo (dùng chung) |
| Build / Version | Không có thông tin |
| Tài khoản | Admin (`EMAIL_ADMIN` trong biến môi trường — không ghi mật khẩu) |
| Người thực hiện | Agent chạy theo lịch (scheduled routine) |
| Bắt đầu → Kết thúc | 15-10-2026 22:13 → 22:25 (giờ máy chủ UTC) |
| Môi trường dùng chung? | Có — auto-skip TC phá huỷ đang BẬT (10 TC này không có TC phá huỷ; xoá khách hàng test do chính run tạo là bước dọn `D1`) |

> ⚠️ **Ngoại lệ so với Browser Rules** (giống run trước): môi trường cloud không có Google Chrome và không có màn hình → chạy **Chromium headless của Playwright, viewport `1600×750`** bằng script, đối chiếu Expected qua DOM, màu tính toán và ảnh chụp; không có `browser_snapshot` của MCP. Đề nghị chạy lại các TC giao diện (TC_013, 015, 016) trên headed khi có máy.

## 1. Tổng kết

| Trạng thái | Số lượng | Tỷ lệ |
|---|---|---|
| ✅ PASS | 10 | 100% |
| ❌ FAIL | 0 | 0% |
| ⚠️ BLOCKED | 0 | 0% |
| ⏭️ SKIPPED | 0 | 0% |
| **Tổng** | **10** | 100% |

> **Pass rate (không tính SKIPPED):** 10/10 = 100%. Tích luỹ Customers: 20/129 TC đã chạy (19 PASS · 1 FAIL `TC_006` do TC hard-code số).

## 2. Kết quả từng TC

| TC ID | Test Scenario | Kết quả | Bước fail | Ghi chú |
|---|---|---|---|---|
| CRM_CUST_TC_011 | Khách hàng vừa tạo hiện đúng ở danh sách, mặc định đang hoạt động | ✅ PASS | — | Đúng 1 dòng: Company, Phone `0912345678`, Primary Contact/Email/Groups trống, công tắc `Active` bật, `Date Created` = 15-10-2026. `Total` 2775→2776, `Active` 2766→2767 (+1 đúng) |
| CRM_CUST_TC_012 | "Save and create contact" tạo khách hàng và mở hộp thoại thêm liên hệ | ✅ PASS | — | URL `…/client/{id}?group=contacts&new_contact=true`; hộp thoại `Add new contact` + tên công ty, đủ các ô `Profile image`/`First Name`/`Last Name`/`Position`/`Email`/`Phone`/`Direction`/`Password`; đóng bằng `X`, khách hàng vẫn tồn tại — [ảnh](evidence/CRM_CUST_TC_012_hop_thoai_them_lien_he.png) |
| CRM_CUST_TC_013 | Hồ sơ khách hàng (Admin) có đủ 19 tab và biểu mẫu sửa đúng cấu trúc | ✅ PASS | — | Tiêu đề `#{id} <tên>` + `Profile`; đúng 19 tab theo thứ tự `Profile`→`Map`; biểu mẫu 3 tab `Customer Details`·`Billing & Shipping`·`Customer Admins`; ô `Website` có nút quả cầu; chân form chỉ 1 nút `Save` (nền xanh); ô `Show primary contact…` có trong DOM nhưng **ẩn** — [ảnh](evidence/CRM_CUST_TC_013_ho_so_khach_hang.png) |
| CRM_CUST_TC_014 | Mở hồ sơ khách hàng bằng mọi lối vào | ✅ PASS | — | Cả 3 biến thể `a` `b` `c` cùng URL `…/client/{id}`, tab trình duyệt = tên công ty, tiêu đề `#{id} <tên>`, tab `Profile` |
| CRM_CUST_TC_015 | Mở màn hình Nhập khách hàng và đọc đủ 4 hướng dẫn nguyên văn | ✅ PASS | — | Cả `a` `b`: URL `…/clients/import`, tab `Import`, tiêu đề `Import Customers`; đúng 4 mục nguyên văn, ngày mục 2 = `2026-10-15`; mục 1–3 chữ xanh, mục 4 chữ đỏ — [ảnh](evidence/CRM_CUST_TC_015_man_hinh_nhap_csv.png) |
| CRM_CUST_TC_016 | Biểu mẫu nhập CSV và bảng cột mẫu hiển thị đủ, đúng thứ tự | ✅ PASS | — | 27 cột đúng thứ tự; 4 cột `*` (`Firstname`·`Lastname`·`Email`·`Company`), 5 cột đầu có dòng phụ xanh `Contact field`; `Download Sample` xanh lá; thứ tự `Choose CSV File`·`Groups`·`Default password for all contacts`; mật khẩu gõ vào **hiện rõ chữ** (`type=text`, ghi nhận hiện trạng — xem `TC_106`); 2 nút xanh `Import`·`Simulate Import` — [ảnh](evidence/CRM_CUST_TC_016_bieu_mau_nhap_csv.png) |
| CRM_CUST_TC_017 | Sắp xếp tăng/giảm theo cột Company, #, Date Created | ✅ PASS | — | `a` Company: bấm 1 → giảm, bấm 2 → tăng · `b` `#` và `c` Date Created: bấm 1 → tăng, bấm 2 → giảm; mỗi lúc chỉ 1 cột mang mũi tên. 🔧 `POST /admin/clients/table` có `order[0][column]` (2/1/8) và `order[0][dir]` đúng |
| CRM_CUST_TC_018 | Sắp xếp tăng/giảm theo Primary Contact, Primary Email, Phone, Active, Groups | ✅ PASS | — | 5 biến thể: mũi tên hiện ở cột vừa bấm, đảo chiều ở lần 2, 5 dòng đầu xếp đúng chiều; `d` Active: lần 1 `0…01…1` (nhóm liền nhau), lần 2 toàn `1` |
| CRM_CUST_TC_019 | Đổi số dòng mỗi trang | ✅ PASS | — | Đúng 5 lựa chọn `10`·`25`·`50`·`100`·`All`; `a`→`d` đúng số dòng và `Showing 1 to {n} of 2,775 entries`; `e` All: 2775 dòng, `Showing 1 to 2,775 of 2,775 entries`, chỉ còn trang `1`, trang không treo (cuộn được). Chưa đo thời gian nạp — xem `TC_128` |
| CRM_CUST_TC_020 | Chuyển trang Next/Previous, số trang, ô nhảy trang — bảng nạp tại chỗ | ✅ PASS | — | `Next` → `26 to 50` (`2` active, `Previous` bấm được) · số `3` → `51 to 75` · `Previous` → `26 to 50` · nhảy trang cuối → `2,751 to 2,775 of 2,775`, `Next` bị khoá. Không có điều hướng toàn trang, URL không đổi, khối Summary giữ nguyên. 🔧 4 lần `POST /admin/clients/table` đều `200`, `start` = 25/50/25/2750, `length`=25 |

## 3. Chi tiết TC FAIL

Không có.

## 4. TC BLOCKED

Không có.

## 5. Dữ liệu đã tạo & dọn dẹp

| Dữ liệu | Nơi tạo | Đã xoá? |
|---|---|---|
| auto_cust_tc011_1792077223 | `/admin/clients/client` | ✅ |
| auto_cust_tc012_1792077223 | `/admin/clients/client` | ✅ |
| auto_cust_tc013_1792077223 | `/admin/clients/client` | ✅ |
| auto_cust_tc013_1792077223b (lần chạy lại TC_013 để đo chính xác hiển thị) | `/admin/clients/client` | ✅ |
| auto_cust_tc014_1792077223 | `/admin/clients/client` | ✅ |

> Đối chiếu số liệu hệ thống: `Total/Active/Inactive Customers` trước **2775/2766/9** → sau **2775/2766/9** ✅ (môi trường trả về nguyên trạng).

## 6. Đề xuất bước tiếp theo

- Không có FAIL → không cần `/create-bug-report`.
- Ngày kế tiếp: chạy `CRM_CUST_TC_021` → `CRM_CUST_TC_030` (còn 109 TC Customers chưa chạy).
- Cân nhắc `/review-testcases` mode FIX cho `TC_006` (số `<option>` hard-code) — việc tồn từ run trước.
- Vẫn nên sửa Playwright MCP trong môi trường cloud (Chrome/`executablePath`) để chạy headed đúng quy định.
