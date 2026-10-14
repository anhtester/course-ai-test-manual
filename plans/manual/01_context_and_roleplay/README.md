# Bước 1: Khởi tạo ngữ cảnh (Context & Role-play)

---

## Mục đích

Thiết lập vai trò **Senior QA Engineer** và nạp bối cảnh dự án để AI định hình tư duy chuyên gia kiểm thử. Bước này giới hạn không gian kiến thức của AI, giúp câu trả lời chuyên sâu và sát thực tế hơn.

## Cách sử dụng

1. Mở file `prompt.txt` trong thư mục này.
2. Copy nội dung bên dưới dòng `---START---`.
3. Thay thế các phần trong `[...]` bằng dữ liệu thực tế:
   - **Tên dự án / tính năng** cần test
   - **Bối cảnh hệ thống** (mô tả ngắn về app hiện tại)
   - **Mục tiêu MVP** (phạm vi kiểm thử đợt này)
   - **Tài liệu đính kèm** (Requirements, User Stories, Figma, PDF...)
   - **Ảnh giao diện** (evidence) của từng màn hình / trạng thái sẽ test
   - **Thông tin chốt từ đầu:** nền tảng · tiền tố TC ID · bộ TC đã có chưa · **độ hạt GỘP/TÁCH** · **năng lực kiểm thử của QA** (gọi API, truy vấn CSDL, xem audit log…) · số role
4. Paste vào AI chat và gửi.
5. Chờ AI trả **Danh mục Evidence** + tóm tắt scope + **"Tôi đã hiểu bối cảnh và sẵn sàng"** rồi mới sang Bước 2.

## Lưu ý

- Tài liệu càng chi tiết → AI phân tích càng chính xác.
- **Ảnh giao diện là bằng chứng, tài liệu chỉ là mô tả.** Hai bên mâu thuẫn thì AI viết TC theo ảnh và hỏi lại ở Bước 2. Thiếu ảnh cho vùng nào → TC vùng đó gắn `@NeedsVerify`, không suy diễn nhãn / thứ tự / giá trị mặc định.
- **Độ hạt chốt ở đây là rẻ nhất.** GỘP (mặc định) ~35–45 TC, TÁCH ~75–90 TC cho module cỡ Login — phủ yêu cầu như nhau. Đổi độ hạt sau khi đã có script automation / kết quả chạy trỏ vào là cắt đứt truy vết.
- **Đã có bộ TC** → AI chỉ sinh BỔ SUNG cho REQ chưa có TC (TC ID nối tiếp). REQ đã có TC mà vừa đổi thì dùng `/update-testcases-from-impact`, không chạy lại 6 bước.
- Bước này chỉ cần chạy **1 lần** duy nhất đầu conversation.

