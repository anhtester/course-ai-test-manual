# Khám phá — Tệp tin (`FILE`)

> Tầng khám phá — **không** chứa mã REQ. Index: [`../system_map.md`](../system_map.md) · Mặt API: [`../api_map.md` mục 2.6](../api_map.md#2-danh-mục-endpoint) · Trạng thái recon: [`../../README.md`](../../README.md)

## Mặt Android

| Màn hình | Đường đi | Thành phần quan sát được |
|---|---|---|
| **File management** | Tab 5 "File" | Vòng dung lượng `0.7%` · `Used 7.1 MB` · `Maximum 1.00 GB` · công tắc `Preview` · `Small` · ô "Search file..." · breadcrumb thư mục bắt đầu `/` · bảng `Name ↓↑` · `Size` · `Type` · thư mục `$avatar-image` · `$book-image` · `ABC` · `Demo` … |
| Đã đăng nhập | | Nút **"Upload file"** |
| Upload ảnh đại diện | My Profile → "Upload photo" | Giới hạn hiển thị: *\*.jpeg,.jpg\*.png\*.gif\*.webp\*.bmp\*.svg max size of 3.0 MB* — là giới hạn phía app; mặt API chưa khai giới hạn (AMB-BK-07) |

- Chưa mở: thư mục con · upload · đổi tên / sao chép / di chuyển / xoá.

Evidence: [android_file_overview.png](../evidence/android_file_overview.png) (đã đăng nhập)
