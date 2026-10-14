# Bước 6: Chuẩn hóa Format (Template Mapping)


---

## Mục đích

Đóng gói toàn bộ Test Cases đã sinh ở Bước 5 sang bảng Markdown chuẩn, chạy **Quality Gate 11 tiêu chí**, xuất kèm các bảng đối soát — sẵn sàng copy sang **Excel**, **Google Sheets**, hoặc import thẳng lên **Jira/TestRail/Xray/Zephyr**.

## Cách sử dụng

1. Gửi file `prompt.txt` sau khi đã review test cases ở Bước 5.
2. AI sẽ xuất bảng Markdown với format:
   ```
   | TC ID | REQ ID | Module | Risk Level | Test Scenario | Pre-Condition | Test Steps | Test Data | Expected Result | Priority | Automation | Auto Type | Tags |
   ```
   kèm theo, đúng thứ tự: **Bảng Đối Soát Coverage** · **Bảng Đối Soát Evidence** · **Bảng Đối soát loại kiểm thử (4 vòng)** · **Rà soát đặc tính chất lượng ISO/IEC 25010:2023** · **Đối soát cột Automation**.
3. Lưu thành file `docs/testcases/<module>/<nền-tảng>/test_cases_<module>_<nền-tảng>.md` để mở bằng `scripts/testcases-viewer/bundle.html` và xuất Excel, hoặc copy bảng → paste vào công cụ quản lý test.

> ⚠️ **Giữ nguyên tên cột tiếng Anh** — viewer map cột theo tên; dịch tên cột là mất cột.

## Quality Gate 11 tiêu chí

Độ hạt nhất quán · TC ID duy nhất · Step ↔ Expected khớp 1-1 · Test data cụ thể · Validation đủ từng mục bảng loại field · Automation metadata · Coverage REQ (cả chiều ngược: TC gánh nhiều REQ) · Evidence · Ngôn ngữ nhìn thấy được · ISO/IEC 25010 · Đối soát 4 vòng. Tiêu chí nào 🔴 thì AI phải bổ sung trước khi xuất.

## Quy tắc TC ID

Format mặc định: `[DỰ_ÁN]_[MODULE]_TC_[SỐ]`

Ví dụ: `CRM_CUST_TC_001`, `CRM_LOGIN_TC_001`

Nếu dự án có quy ước ID riêng, thay đổi trong phần `[Tùy chỉnh]` của prompt.txt.

## Xử lý khi quá dài

Nếu bảng vượt giới hạn độ dài một câu trả lời, AI sẽ chia thành **Part 1, Part 2...** tại ranh giới nhóm chức năng và chờ bạn gõ "Tiếp tục". Đảm bảo:
- Không bỏ sót TC nào giữa các phần
- Số thứ tự TC ID liên tục giữa các phần
