# Course AI Test Manual

Kho tài liệu thực hành cho khóa học kiểm thử thủ công (Manual Testing) có hỗ trợ AI. Repo lưu trữ tài liệu đặc tả yêu cầu phần mềm (SRS) và test case được biên soạn dựa trên khảo sát thực tế một hệ thống demo, phục vụ mục đích học tập/luyện tập kỹ năng viết SRS và thiết kế test case.

## Hệ thống khảo sát

- **Sản phẩm:** Perfex CRM – Anh Tester Demo
- **URL:** https://crm.anhtester.com/admin/authentication
- **Module hiện có:** Đăng nhập (Login / Authentication)

## Cấu trúc thư mục

```
docs/
├── SRS-Login-Module.md       # Đặc tả yêu cầu phần mềm cho module Đăng nhập
└── testcases/
    ├── TC_Login.txt           # Test case cho luồng đăng nhập
    └── TC_Dashboard.txt        # Test case cho trang Dashboard
```

- **[docs/SRS-Login-Module.md](docs/SRS-Login-Module.md)** — Mô tả mục đích, phạm vi, yêu cầu chức năng (FR), yêu cầu phi chức năng (NFR), quy tắc nghiệp vụ và ma trận use case cho module Đăng nhập.
- **[docs/testcases/](docs/testcases)** — Các test case thủ công tương ứng, viết theo dạng danh sách bước thực hiện (step-by-step).

## Mục đích sử dụng

Repo được dùng làm ví dụ/bài tập trong khóa học, minh họa quy trình:

1. Khảo sát hệ thống thực tế → biên soạn tài liệu SRS.
2. Từ SRS → thiết kế test case thủ công.
3. Ứng dụng AI hỗ trợ trong việc viết, rà soát tài liệu và test case.

## Giấy phép

Phát hành theo [MIT License](LICENSE).
