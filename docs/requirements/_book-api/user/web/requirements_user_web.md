# Đặc tả Yêu cầu — Module Người dùng (`USER`) · Nền tảng Web

> Index module (metadata · phân quyền · trạng thái · Story · AMB/RISK · Nhật ký): [../REQUIREMENTS_USER_SUMMARY.md](../REQUIREMENTS_USER_SUMMARY.md) · Danh mục hệ thống: [../../README.md](../../README.md) · Bản đồ: [../../_discovery/modules/module_02_nguoi_dung.md](../../_discovery/modules/module_02_nguoi_dung.md)

| Mục | Giá trị |
|---|---|
| **Hệ thống** | AnhTester Book Management (mã hệ thống `BK`) |
| **Module** | Người dùng — màn hình `User Management` (`/user-management`) |
| **Nền tảng** | **Web** ✅ — `https://book.anhtester.com` |
| **Trình duyệt khảo sát** | Google Chrome 153 (Playwright MCP, headed), viewport đo được `1600 × 750`, `navigator.language = en-US`. Mọi AC về hiển thị **chỉ đúng với trình duyệt + viewport này** |
| **Tầng network** | ✅ Quan sát **thụ động** request do UI phát sinh. **Không** gọi API trực tiếp |
| **Phương pháp** | Thao tác thật ngày 25-09-2026 — khách và 2 tài khoản tự tạo; sửa/xoá **chỉ** trên 2 tài khoản đó. Ảnh chụp danh sách **làm mờ** mọi dòng không phải tài khoản test (chèn CSS `filter: blur` tạm thời trước khi chụp — không đổi dữ liệu) |
| **REQ trong file này** | **7** — `19` · `32` · `34` · `37` · `39` · `40` · `42`. 31 REQ khác kiểm khớp trên Android ngày 26-09-2026 → **chuyển lên** [index mục 3.2](../REQUIREMENTS_USER_SUMMARY.md#32-dùng-chung-android--web) (`Android · Web`). Trước đó: **38** — `REQ-BK-USER-02` → `42` trừ `33` · `35` · `38`. 4 REQ `01` · `33` · `35` · `38` kiểm chứng khớp trên API (25-09-2026) → **chuyển lên index** (dùng chung `Web · API`), mã giữ nguyên. `REQ-BK-USER-30` sửa 25-09-2026 (`DEMO-AMB-2509B`) |

> **Thang `Nguồn`:** `Kiểm chứng thực tế` = đã thao tác trên web và xác nhận bằng ảnh hoặc số liệu DOM/network ghi trong AC · `API · <METHOD> <path> → <status>` = quan sát thụ động request do UI gửi.

---

## 2. Bản đồ phủ tài liệu

Không có tài liệu nào cho màn hình này — toàn bộ REQ sinh từ khảo sát thực tế. Mặt API đã có bản đồ (`api_map.md` mục 2.2 · phát hiện F-01 · F-02 · F-06 · F-07) nhưng **chưa có REQ** — các rule server quan sát được trên web (email trùng, trạng thái Active) ghi ở đây với nền tảng `Web`; khi sinh REQ mặt API sẽ mở rộng nền tảng theo skill 2.2.

---

## 3. Yêu cầu Chức năng

### 3.1. Danh sách · tìm kiếm · sắp xếp · phân trang (STORY-BK-USER-01)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|

### 3.2. Bộ lọc nâng cao (STORY-BK-USER-02)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|

### 3.3. Quyền thao tác theo trạng thái đăng nhập (STORY-BK-USER-03)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-BK-USER-19 | Khách không có nút tạo và nút thao tác dòng | | Chưa đăng nhập → **không** có nút `New user` · **không** có cột nút ⋮ | 🟢 | — | Kiểm chứng thực tế · `web_user_list_guest_viewport.png` · đọc DOM |

### 3.4. Thêm người dùng (STORY-BK-USER-04)

> ↗️ 31 REQ (`02 → 18` · `20 → 31` · `36` · `41`) **đã chuyển lên index** mục 3.2 ngày 26-09-2026 (kiểm khớp trên Android). REQ còn lại ở file này chưa kiểm được trên Android — lý do ở [../mobile/requirements_user_mobile.md mục 2](../mobile/requirements_user_mobile.md#2-bản-đồ-phủ-tài-liệu).

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-BK-USER-32 | Add user: mật khẩu xác nhận phải khớp | | Password `a` · Confirmation `b` → `Password confirmation does not match.` | 🟢 | — | Kiểm chứng thực tế · đọc lỗi bằng DOM |
| REQ-BK-USER-34 | Tạo người dùng thành công | | Điền hợp lệ → `Save` → thông báo `Created successfully.` · hộp thoại đóng · người dùng mới ở **đầu** danh sách, cột Active `Active`. Network: `POST /api/user` → **201**, body gồm `name` · `email` · `password` · `phone` · `address` · `isActive` | 🟢 | — | Kiểm chứng thực tế · `web_user_add_success_toast_viewport.png` · API · POST /api/user → 201 |

### 3.5. Sửa người dùng (STORY-BK-USER-05)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-BK-USER-37 | Cập nhật thành công | | Sửa Name → `Update` → thông báo `Updated successfully.` · hộp thoại đóng · dòng hiển thị Name mới. Network: `PATCH /api/user/<id>` → **200** | 🟢 | — | Kiểm chứng thực tế · `web_user_update_success_toast_viewport.png` · API · PATCH /api/user/{id} → 200 |
| REQ-BK-USER-39 | Tắt Active for login đánh dấu người dùng Inactive | Tác dụng: REQ-BK-AUTH-100 (không đăng nhập được) | Update → tắt `Active for login` → dòng hiển thị nhãn `Inactive` (đỏ), biểu tượng khoá trên avatar đổi màu đỏ · request `isActive: false` | 🟢 | — | Kiểm chứng thực tế · `web_user_update_success_toast_viewport.png` · `web_user_inactive_login_blocked_viewport.png` |
| REQ-BK-USER-40 | Bật lại Active for login cho đăng nhập lại | | Người dùng `Inactive` → Update → bật `Active for login` → nhãn `Active` · đăng nhập tài khoản đó thành công | 🟢 | — | Kiểm chứng thực tế · API · PATCH /api/user/{id} → 200 · POST /api/login → 200 |

### 3.6. Xoá người dùng (STORY-BK-USER-06)

| REQ ID | Tên yêu cầu | Mô tả | Acceptance Criteria | Trạng thái | Cập nhật lần cuối | Nguồn |
|---|---|---|---|---|---|---|
| REQ-BK-USER-42 | Xác nhận xoá gỡ người dùng khỏi danh sách | | `Delete` trong hộp xác nhận → thông báo `Deleted successfully.` · dòng biến mất khỏi danh sách. Network: `DELETE /api/user/<id>` → **200** | 🟢 | — | Kiểm chứng thực tế · API · DELETE /api/user/{id} → 200 · đọc danh sách sau xoá |

**Tổng đợt Web: 42 REQ** (7 còn ở file này + 4 ở index 3.1 + 31 ở index 3.2) — Danh sách 10 (`01 → 10`) · Bộ lọc 8 (`11 → 18`) · Quyền 5 (`19 → 23`) · Thêm 12 (`24 → 35`) · Sửa 5 (`36 → 40`) · Xoá 2 (`41 → 42`) → `10 + 8 + 5 + 12 + 5 + 2 = 42 ✔`

> ↑ `REQ-BK-USER-01` · `33` · `35` · `38` **đã chuyển lên index** [`../REQUIREMENTS_USER_SUMMARY.md` mục 3](../REQUIREMENTS_USER_SUMMARY.md#31-web--api) ngày 25-09-2026 — kiểm chứng khớp trên API, `Nền tảng` = `Web · API`. Mã giữ nguyên; ảnh evidence ở lại `web/evidence/`. Tổng module: 42 REQ web = 38 ở file này + 4 ở index.

---

## 4. Đặc tả Trường Dữ liệu (Field Spec)

| Màn hình | Field (Label) | Loại UI (DOM) | Required | Ràng buộc quan sát được | REQ liên quan | Ghi chú |
|---|---|---|---|---|---|---|
| Danh sách | Search user | `input` placeholder `Search user (name, email, phone or address)` | — | Chờ ngừng gõ rồi mới gửi (1 request) | 08 · 09 | Bị ẩn khi bảng lọc mở |
| Danh sách | Số dòng mỗi trang | combobox | — | `5` · `10` · `15` · `20` · `25` · `50` · `100` · mặc định `5` | 04 · 05 · 07 | |
| Bộ lọc | Field | combobox · `data-value` = `name` · `email` · `phone` · `address` · `isActive` · `createdAt` · `updatedAt` | — | Mặc định `name` | 12 · 14 | |
| Bộ lọc | Operator | combobox · `data-value` = `equals` · `not` · `contains` · `startsWith` · `endsWith` | — | Mặc định `equals`, đặt lại khi đổi Field | 13 · 14 | Chưa thử Operator với Field kiểu ngày / `Is Active` |
| Bộ lọc | Value | `input` nhãn `Value` | — | Tự áp dụng khi gõ | 15 | |
| Bộ lọc | Nối điều kiện | combobox `AND` · `OR` | — | Mặc định `AND` | 16 | Chỉ có từ điều kiện thứ 2 |
| Add / Update user | Upload photo | `input[type=file][name=avatar]` · `accept` 7 định dạng ảnh | ❌ | ≤ 3.0 MB (theo dòng chữ) | 24 | **Chưa** thử tải — `AMB-BK-USER-05` |
| Add / Update user | Name | `input[name=name]` · `required` | ✅ | ≤ 250 ký tự | 26 · 30 | |
| Add / Update user | Phone | `input[name=phone]` | ❌ | Không kiểm định dạng | — | |
| Add / Update user | Division · Ward · Address | `#address-division` · `#address-ward` · `textarea#address` | ❌ | Ward khoá khi Division trống, Address khoá khi Ward trống | 24 | Cùng thành phần với Sign up — REQ-BK-AUTH-76 → 80 |
| Add / Update user | Email | `input[name=email]` · `required` | ✅ | Định dạng email · không trùng (server 422) | 27 · 31 · 33 | |
| Add user | Password · Password Confirmation | `input[type=password]` · `required` | ✅ | Confirmation phải khớp | 28 · 29 · 32 | |
| Update user | Password · Password Confirmation | `input[type=password]` | ❌ | Để trống = giữ mật khẩu cũ | 36 · 38 | |
| Add / Update user | Active for login | `input[type=checkbox][name=isActive]` (công tắc) | — | Mặc định bật khi thêm | 25 · 39 · 40 | |

---

## 5. Validation & thông báo (nguyên văn)

| REQ | Điều kiện | Thông báo | Vị trí |
|---|---|---|---|
| 26 | Name trống | `Name is required.` | Dưới ô |
| 27 | Email trống | `Email is required.` | Dưới ô |
| 28 | Password trống (Add user) | `Password is required.` | Dưới ô |
| 29 | Confirmation trống (Add user) | `Password confirmation is required.` | Dưới ô |
| 30 | Name > 250 ký tự | `Name must be less than 250 characters.` | Dưới ô |
| 31 | Email sai định dạng | `Invalid email address` | Dưới ô |
| 32 | Confirmation ≠ Password | `Password confirmation does not match.` | Dưới ô |
| 33 | Email đã tồn tại | `Email already exists.` | Dưới ô **và** thông báo nổi |
| 34 | Tạo thành công | `Created successfully.` | Thông báo nổi |
| 37 | Cập nhật thành công | `Updated successfully.` | Thông báo nổi |
| 41 | Bấm Delete | `Confirm delete` / `Confirm you want to delete user "<Name>".` | Hộp thoại |
| 42 | Xoá thành công | `Deleted successfully.` | Thông báo nổi |
| 09 | Không có kết quả | `No Data` | Vùng bảng |

---

## 6. Luồng người dùng

```
/user-management ─┬─ gõ Search ─► lọc (1 request sau khi ngừng gõ)
                  ├─ icon lọc ─► bảng lọc (Field · Operator · Value · Add filter · Clear filter)
                  ├─ bấm tiêu đề cột ─► asc ⇄ desc
                  └─ [đã đăng nhập] New user ─► Add user ─ Save ─► "Created successfully." ─► dòng mới ở đầu
                                   ⋮ (dòng người khác) ─┬─ Edit ─► Update user ─ Update ─► "Updated successfully."
                                                        └─ Delete ─► Confirm delete ─ Delete ─► "Deleted successfully."
                                   ⋮ (dòng "You") ─► Edit · Delete khoá
```

---

## 7. Yêu cầu phi chức năng quan sát được

| Hạng mục | Quan sát | Ghi chú |
|---|---|---|
| Dữ liệu cá nhân công khai | Khách thấy email · số điện thoại · địa chỉ của mọi người dùng | F-01 · `AMB-BK-02` · `RISK-BK-USER-01` |
| Định dạng ngày giờ | `25 Th09 2026` + `12:58 AM` — tháng tiếng Việt, giờ 12h AM/PM, theo múi giờ trình duyệt | `AMB-BK-USER-07` — TC **không** assert khớp tuyệt đối |
| Khối lượng dữ liệu | ≈ 2.700 người dùng (543 trang × 5) lúc khảo sát, phần lớn là tài khoản test của đợt trước | `RISK-BK-USER-03` |

---

## 8. Ghi chú kỹ thuật cho automation

| Vấn đề | Chi tiết |
|---|---|
| Hàng đệm trong `tbody` | Khi ít kết quả, bảng chèn thêm 1 `<tr>` rỗng (`td[colspan=6]`) → đếm dòng phải lọc `tr` có > 1 ô |
| Nút ⋮ và icon lọc không nhãn | Không có `aria-label` → bắt theo vị trí trong dòng (`tbody tr:nth-child(n) td:last-child button`) hoặc theo quan hệ với tên người dùng |
| Icon lọc cạnh tiêu đề cột | `th button.MuiIconButton-root` — nút không nhãn đứng sau nhãn cột |
| Chọn Operator trước Field | Đổi Field reset Operator (REQ-14) → luôn chọn **Field trước**, Operator sau |
| Menu ⋮ | `role=menu` › `role=menuitem` `Edit` / `Delete`; mục khoá có `aria-disabled=true` |
| Dòng dữ liệu test | Luôn tìm dòng bằng email riêng của test (`auto_<module>_<timestamp>`), không dựa vào vị trí — danh sách sắp theo `Updated` nên thứ tự đổi liên tục |

---

## 9. Danh mục Evidence

Thư mục [`evidence/`](evidence/). **Mọi ảnh đã mở lại xác nhận đúng trạng thái.** Dòng của người khác đã **làm mờ**; chỉ dòng của 2 tài khoản test (`auto_web_*@auto.test`) hiện rõ.

| Ảnh | Trạng thái | REQ |
|---|---|---|
| `web_user_list_guest_viewport.png` | Khách xem danh sách (không New user, không ⋮) | 01 · 02 · 19 |
| `web_user_pagesize_open_viewport.png` | Ô số dòng mở — 7 lựa chọn | 04 |
| `web_user_search_result_viewport.png` | Tìm theo `auto_web_<timestamp>` — 1 kết quả | 08 |
| `web_user_search_no_data_viewport.png` | Tìm chuỗi không tồn tại — hình `No Data` | 09 |
| `web_user_filter_field_open_viewport.png` | Bảng lọc mở, danh sách Field mở | 11 · 12 |
| `web_user_filter_email_contains_viewport.png` | Email · Contains · Value → 1 kết quả | 15 |
| `web_user_filter_two_conditions_viewport.png` | 2 điều kiện, ô nối `AND` | 16 |
| `web_user_row_menu_self_disabled_viewport.png` | Dòng `You` — Edit/Delete mờ | 21 · 22 |
| `web_user_row_menu_other_enabled_viewport.png` | Dòng người khác — Edit/Delete dùng được | 20 · 23 |
| `web_user_add_dialog_default_viewport.png` | Add user mặc định | 24 · 25 |
| `web_user_add_empty_submit_viewport.png` | Save trống — 4 lỗi | 26 → 29 |
| `web_user_add_email_exists_viewport.png` | Email trùng — lỗi + thông báo nổi | 33 |
| `web_user_add_success_toast_viewport.png` | `Created successfully.`, người dùng mới đầu danh sách | 03 · 34 |
| `web_user_update_dialog_default_viewport.png` | Update user điền sẵn | 36 |
| `web_user_update_success_toast_viewport.png` | `Updated successfully.`, nhãn `Inactive` | 37 · 39 |
| `web_user_inactive_login_blocked_viewport.png` | Sign in tài khoản Inactive → `User account is disabled.` | 39 · AUTH-100 |
| `web_user_delete_confirm_viewport.png` | Hộp `Confirm delete` | 41 |

REQ không có ảnh riêng, truy bằng số liệu DOM/network ghi trong AC: 05 · 06 · 07 · 10 · 13 · 14 · 17 · 18 · 30 · 31 · 32 · 35 · 38 · 40 · 42.

---

## 10. Dữ liệu test — tạo / dọn

| Bản ghi | Tạo bởi | Dùng cho | Dọn |
|---|---|---|---|
| User `auto_web_<timestamp>_a@auto.test` | Sign up (module `AUTH`) | Tài khoản thao tác chính | ✅ Xoá bằng tài khoản B (REQ-42) |
| User `auto_web_<timestamp>_b@auto.test` | Add user (REQ-34) | Sửa · Inactive · Active lại · xoá A | ⚠️ **Còn sót** — không tự xoá chính mình được (REQ-22) · `RISK-BK-USER-04` |

Không sửa/xoá bản ghi có sẵn nào. Tạo 2 · dọn 1 · còn sót 1.
