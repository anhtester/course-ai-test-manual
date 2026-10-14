# AI-DRIVEN RISK-BASED TESTING FRAMEWORK (AI-RBT)

**Mục tiêu:**
Tận dụng tốc độ của AI để thực thi chi tiết, kết hợp với tư duy chiến lược RBT (Risk-Based Testing) của con người để tối ưu hóa nguồn lực kiểm thử và nâng cao tối đa chất lượng test cases.

## 📌 Nguyên Tắc Cốt Lõi

1. **Human Strategy:** Con người xác định chiến lược, mức độ rủi ro và tiêu chuẩn.
2. **AI Execution:** AI thực hiện phân tích, viết TCs và rà soát lỗ hổng.
3. **Human Verification:** Con người kiểm tra lại kết quả của AI trước khi chốt.

---

## 🚀 Quy Trình Tổng Quan (6 Bước)

1. **Context & Role-play (Khởi tạo ngữ cảnh):** Khởi tạo tư duy chuyên gia QA/Tester cho AI bằng cách định hình vai trò và cung cấp bối cảnh dự án · đọc hết ảnh giao diện (evidence) · chốt độ hạt GỘP/TÁCH và năng lực kiểm thử của QA.
2. **Analysis & QnA (Phân tích yêu cầu):** AI đọc tài liệu và phân tích yêu cầu để làm rõ các điểm mờ (Ambiguity) — kể cả chỗ tài liệu mâu thuẫn với ảnh giao diện — trước khi viết kịch bản.
3. **Decomposition (Phân rã module):** Phân rã hệ thống thành các Module (Feature Mapping - FM) nhỏ hơn để dễ dàng đánh giá.
4. **Traceability (Đảm bảo độ bao phủ):** Thiết lập ma trận truy vết để đảm bảo độ bao phủ yêu cầu (Coverage), xếp scenarios theo **4 vòng** (Smoke → Functional → Technical → Non-functional).
   - AI tự chấm **mức rủi ro** từng module theo tiêu chí cố định và đề xuất **độ sâu** tương ứng — *con người duyệt hoặc sửa tại checkpoint này* (Human Checkpoint).
5. **RBT & TC Generation (Sinh Test Case chi tiết):**
   - Áp dụng chiến lược Risk-Based Testing theo mức rủi ro đã duyệt (Cao → Đầy đủ · Trung bình → Tiêu chuẩn · Thấp → Tối giản), sinh **tuần tự V1 → V4**.
   - Viết bằng **thứ người dùng nhìn thấy** — phần cần DevTools tách xuống `🔧 Ghi chú kỹ thuật` + tag `@TechCheck`; vùng chưa có ảnh gắn `@NeedsVerify`.
   - Độ hạt **GỘP** (Bảng biến thể / Bảng kiểm) hoặc **TÁCH** theo đã chốt ở Bước 1.
   - Validation chuyên biệt **15 loại Input Field Types** (Text, Email, Phone, Date, Number, Dropdown, Checkbox/Radio, File Upload, Password, Textarea, OTP/MFA, Date Range, Rich Text, Multi-Select, Range Slider) — đối soát **đủ từng mục**.
   - Tích hợp **Scenarios Chuyên Sâu & Non-Functional** (Race Condition / Double Submit, Session & Network Resilience, Localization & UTF-8 / Emoji, Keyboard Accessibility A11y, HTTP Status Codes).
6. **Template Mapping & AI Quality Gate (Chuẩn hóa Format & Metadata):**
   - Đóng gói toàn bộ Test Cases vào bảng Markdown chuẩn kèm Metadata Automation đầy đủ (`Automation`, `Auto Type`, `Tags`).
   - Kiểm định qua **AI Self-Quality Gate 11 Tiêu Chí** (Độ hạt nhất quán, Unique ID, 1-1 Step-Expected, Concrete Test Data, Field Coverage, Automation Metadata, Requirement Coverage, Evidence, Ngôn ngữ kiểm chứng, ISO/IEC 25010, Đối soát 4 vòng) và xuất kèm các bảng đối soát.

*(Mỗi bước trên tương ứng với 1 thư mục con trong thư mục này, bao gồm `README.md` hướng dẫn chi tiết và `prompt.txt` chứa câu lệnh mẫu cho AI).*

---

## ⚠️ Lưu ý Quan Trọng: Chiến Lược Thực Thi (Execution Strategy)

Đối với phần **Manual Testing** (Đi từ Yêu cầu chức năng / Figma), bạn **BẮT BUỘC phải chạy tuần tự thủ công từng prompt một** (hoặc dùng command `/generate-testcases-manual-rbt` trên Claude Code) thay vì gộp chung thành một câu prompt sơ khai.

**Lý do:**
1. **Điểm nghẽn ở Bước 2 (Analysis & QnA):** AI cần thời gian phân tích và đưa ra các câu hỏi (Ambiguities) về logic của Requirement để bạn giải đáp. Nếu chạy 1 lèo, AI sẽ tự đoán mò logic dẫn đến viết Test Case sai trầm trọng.
2. **Điểm chốt chặn Nhân sự (Human in the loop):** Ở Bước 4, con người (Tester) duyệt mức rủi ro AI đã chấm và bảng 4 vòng trước khi cho AI sinh kịch bản chi tiết ở Bước 5.
3. **Chống Ảo giác (Hallucination) & Đảm bảo Tiêu Chuẩn Cao:** Việc xé nhỏ từng bước kết hợp kiểm định qua AI Self-Quality Gate sẽ mang lại chất lượng Test Case tuyệt đối nhất.
