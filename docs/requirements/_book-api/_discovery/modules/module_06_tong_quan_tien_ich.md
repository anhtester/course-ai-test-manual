# Khám phá — Tổng quan (`DASH`) · Tiện ích hệ thống (`SYS`)

> Tầng khám phá — **không** chứa mã REQ. Index: [`../system_map.md`](../system_map.md) · Trạng thái recon: [`../../README.md`](../../README.md)
>
> Gộp chung file vì cả hai là module nhỏ, không có entity nghiệp vụ riêng. Gộp file **không** gộp prefix.

## `DASH` — mặt Android (module mới, cấp 19-09-2026)

Chỉ có trên app — mặt API không có operation riêng; số liệu lấy từ danh sách của các module khác.

| Màn hình | Đường đi | Thành phần quan sát được |
|---|---|---|
| **Dashboard** | Tab 1, màn hình mặc định khi mở app | Banner "RESTful API Book Management" · thẻ **"Book management sign in"** + mô tả tiếng Việt (chưa đăng nhập) — đổi thành **"Welcome \<tên\>"** + mô tả khác (đã đăng nhập) · 4 bộ đếm: `User mgt total: N users` · `Book mgt total: N books` · `Category mgt total: N categories` · `Promotion mgt total: N promotions` |

- Bộ đếm hiện `0` trước rồi mới ra số thật (dump lúc tải: `total: 0 users`; ảnh chụp sau đó: `2671 users`) — TC phải chờ theo điều kiện, không assert ngay.
- Bộ đếm là **tổng toàn hệ thống**, đổi liên tục do nhiều người dùng chung dữ liệu → không assert giá trị cụ thể.
- Chưa thử: bấm vào 4 thẻ bộ đếm có điều hướng không.

Evidence: [android_dash_overview.png](../evidence/android_dash_overview.png) (chưa đăng nhập)

## `SYS` — không có UI

Chỉ có `POST /api/status` ở mặt API ([`../api_map.md` mục 2.8](../api_map.md#28-sys--system)). Không màn hình nào trên app.
