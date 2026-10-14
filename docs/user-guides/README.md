# Danh mục Hướng dẫn sử dụng — Perfex CRM (Anh Tester Demo)

> **Tài liệu viết cho người dùng cuối đọc**, không phải cho QA/Dev. Nguồn dữ liệu là `docs/requirements/<module>/` — hướng dẫn **dùng lại** kết quả khảo sát ở đó nhưng **không** chép nội dung sang: requirements nói *hệ thống phải làm gì*, hướng dẫn nói *người dùng làm thế nào*.
>
> Sinh và cập nhật bằng `/generate-user-guide`.

---

## 1. Bảng danh mục

| Module | Đối tượng đọc | Áp dụng cho phiên bản | Số việc | Phiên bản tài liệu | Còn ⚠️ chưa xác minh | Trạng thái phát hành | Cập nhật |
|---|---|---|---|---|---|---|---|
| [Đăng nhập & Đăng xuất](login/user_guide_login.md) | Nhân viên nội bộ (`Admin`, `Project Manager`) | Trạng thái khảo sát 18-08-2026 | 3 thủ tục + 6 FAQ | v1.0 | **4** | 🟨 Nội bộ — chưa gỡ mục 6 | 09-09-2026 |

**Bảng mã trạng thái phát hành:** 🟨 Nội bộ (còn mục *Vùng chưa xác minh*) · ✅ Đã gỡ mục 6, sẵn sàng gửi ra ngoài · ⚠️ Nghi lỗi thời (UI đã đổi)

---

## 2. Module chưa có hướng dẫn

Chỉ viết được hướng dẫn cho module **đã recon** (xem `docs/requirements/README.md`).

| Module | Đã recon? | Ghi chú |
|---|---|---|
| Khách hàng (`CUST`) | ✅ 79 REQ | Viết được ngay |
| Dự án (`PRJ`) | ✅ 104 REQ | Viết được ngay — module lớn, cân nhắc tách `parts/` |
| 20 module còn lại | ⬜ Chưa khảo sát | Phải chạy `/generate-requirements-from-website` trước |

---

## 3. Quy tắc bất biến

| Quy tắc | Lý do |
|---|---|
| Tên file index **luôn** `user_guide_<module>.md` | Mọi tham chiếu đọc theo mẫu `docs/user-guides/<module>/user_guide_<module>.md` |
| Ảnh nằm ở `<module>/images/`, đặt tên **theo việc** (`them-khach-hang-buoc-2.png`) | UI đổi thì nhìn tên biết ngay phải chụp lại tấm nào |
| 🔒 Ảnh phải dùng **dữ liệu mẫu** | Tài liệu này phát ra ngoài. Ảnh có tên người, email, số tiền thật là rò rỉ dữ liệu |
| Mục *Vùng chưa xác minh* là **nội bộ** — gỡ ở bản phát hành | Đừng gửi khách một tài liệu tự khai chỗ nào chưa kiểm |
| Mỗi lần sửa: tăng **Phiên bản tài liệu** + cập nhật **Áp dụng cho phiên bản phần mềm** | Hai dòng này là cách duy nhất người đọc biết tài liệu còn dùng được không |
| UI đổi thì **sửa đúng việc bị ảnh hưởng**, không viết lại cả tài liệu | Bản cũ tra bằng lịch sử git — không có thư mục `archive/` |

---

## 4. Nhật ký danh mục

| Ngày | Thay đổi |
|---|---|
| 09-09-2026 | Khởi tạo danh mục. Viết hướng dẫn module `login` bằng `/generate-user-guide` Mode DOC — nguồn `REQUIREMENTS_LOGIN_SUMMARY.md` (43 REQ) + 9 ảnh evidence đã mở đủ, 4 ảnh được dùng lại |
