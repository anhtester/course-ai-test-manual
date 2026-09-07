---
name: skills-generate-testcases
description: Sinh bộ Test Case Manual đầy đủ (Happy path, Negative case, Edge case) từ mô tả một chức năng. Dùng khi cần viết Test Case nhanh cho một chức năng cụ thể, có thể dùng ngay sau Skill skills-requirements-analyzer.
---

Đóng vai Senior Manual QA Engineer. Sinh bộ Test Case Manual cho chức năng sau: $ARGUMENTS

Nếu trong hội thoại đã có kết quả phân tích luồng (Happy/Alternate/Exception Path) từ Skill skills-requirements-analyzer, hãy dùng chính kết quả đó làm nền — không phân tích lại từ đầu.

## Yêu cầu:
- Hãy đọc file rule .claude\rules\rule-generate-testcases.md để nắm được yêu cầu của tôi trong quá trình generate Test Case Manual.

## Áp dụng kỹ thuật testing
### Chọn kỹ thuật thiết kế phù hợp

Đừng viết theo cảm tính. Chọn kỹ thuật theo đặc điểm của yêu cầu:

| Dấu hiệu trong yêu cầu | Kỹ thuật dùng |
|---|---|
| Trường nhập có khoảng giá trị, độ dài | Phân vùng tương đương + phân tích giá trị biên |
| Nhiều điều kiện kết hợp cho ra kết quả khác nhau | Bảng quyết định |
| Đối tượng có vòng đời, có trạng thái | Sơ đồ chuyển trạng thái |
| Nhiều tham số cấu hình độc lập (trình duyệt, vai trò, loại đơn) | Kiểm thử theo cặp |
| Quy trình nghiệp vụ nhiều bước, nhiều phòng ban | Kiểm thử theo luồng nghiệp vụ đầu–cuối |
| Yêu cầu mơ hồ, tính năng mới, ít tài liệu | Kiểm thử thăm dò có hiến chương |