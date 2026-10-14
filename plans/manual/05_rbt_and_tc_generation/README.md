# Bước 5: Sinh Test Case chi tiết (RBT & Test Case Generation)


---

## Mục đích

Sinh Test Case chi tiết dựa trên chiến lược **Risk-Based Testing (RBT)**: rủi ro cao → test kỹ, rủi ro thấp → test cơ bản.

## Cách sử dụng

1. Đảm bảo đã review và xác nhận scenarios ở Bước 4.
2. Gửi file `prompt.txt` cho AI, tùy chỉnh phần `[Gợi ý]` nếu cần.
3. AI sinh test cases **lần lượt từng vòng** (V1 Smoke → V2 Functional → V3 Technical → V4 Non-functional), đầy đủ: REQ ID, Title, Pre-condition, Steps, Expected Result, Test Data, Risk Level, Priority, Tags. Câu trả lời quá dài → AI chia Part, gõ "Tiếp tục".
4. Review kết quả → sang Bước 6.

## Mẹo quan trọng

### Chia nhỏ khi nhiều module
Nếu Bước 4 có >5 modules, **đừng bảo AI sinh hết 1 lần**. Thay vào đó:
```
Hãy sinh Test Case cho Module 1 và Module 2 trước tiên.
```
Sau khi review xong, tiếp tục:
```
Tiếp tục sinh Test Case cho Module 3 và Module 4.
```
Trong mỗi module AI vẫn đi đủ V1 → V4.

### Viết bằng thứ người dùng nhìn thấy
Expected Result mô tả hiện tượng trên màn hình, **không** dùng `document.title`, selector, mã HTTP. Yêu cầu không nhìn thấy được (cookie, header bảo mật) tách xuống dòng `🔧 Ghi chú kỹ thuật (cần DevTools):` + tag `@TechCheck`.

### Độ hạt GỘP — gộp đúng cách
Chỉ gộp biến thể **cùng trường, cùng thao tác, cùng loại phản hồi** (Bảng biến thể, mã `a` `b` `c`…, tối đa 6) hoặc các quan sát tĩnh cùng màn hình (Bảng kiểm). Khác trường, khác loại phản hồi (trình duyệt chặn vs máy chủ báo lỗi) → **không** được gộp.

### Test Data phải cụ thể
AI sẽ sinh test data giả lập sát thực tế thay vì placeholder:
- ✅ `test_customer_01@domain.com` thay vì ❌ `email hợp lệ`
- ✅ `KH-2026-0012` thay vì ❌ `mã số hợp lệ`

### Risk Level quyết định độ sâu
Áp đúng mức đã duyệt ở Bước 4. Số TC điển hình ở độ hạt GỘP, module cỡ Login:

| Mức rủi ro | Độ sâu | Số TC | Bao phủ |
|------------|--------|-------|---------|
| **Cao** (`High`) | Đầy đủ | 40–60 | Đủ mọi nhánh của cả 4 vòng |
| **Trung bình** (`Medium`) | Tiêu chuẩn | 20–30 | V1 + V2 đủ · V3 `Permission`/`Security` · V4 `Responsive`/`Accessibility` |
| **Thấp** (`Low`) | Tối giản | 8–12 | V1 đủ 6 nhánh (**không rút**) · V2 chỉ nhánh có ràng buộc · V3/V4 phần lớn `⏭️` |

Bốn thứ **không bao giờ rút**: toàn bộ V1 · `Required` + `Validation` khi có field nhập · `Permission` khi ≥2 role · `Security` khi chạm dữ liệu người dùng khác.

### Kỹ thuật thiết kế Test Case

Prompt đã tích hợp 4 kỹ thuật kinh điển để AI sinh test case có hệ thống:

| Kỹ thuật | Khi nào dùng | Ví dụ |
|----------|-------------|-------|
| **Equivalence Partitioning** | Trường có nhiều loại input | Tuổi: <18, 18-60, >60 |
| **Boundary Value Analysis** | Trường có min/max | Password 6-20 ký tự: test 5,6,20,21 |
| **Decision Table** | Logic nhiều điều kiện kết hợp | Login: email + password + active status |
| **State Transition** | Đối tượng có workflow/trạng thái | Đơn hàng: Mới → Xử lý → Giao → Hoàn thành |

Validation từng trường đối soát **đủ từng mục** của bảng 15 loại field (Mật khẩu 7 mục, Email 9 mục) — `1 positive + 2 negative` chỉ là sàn tối thiểu.
