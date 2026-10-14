# Khám phá module: Đăng ký định kỳ — Subscriptions (`SUB`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

| Mục | Giá trị |
|---|---|
| Tên trên UI | Subscriptions |
| Bí danh | Đăng ký định kỳ, Gói thuê bao |
| Prefix | `SUB` |
| Route | `/admin/subscriptions` · tạo mới `/admin/subscriptions/create` |
| Loại màn hình | Danh sách + form |
| CRUD | ✅ **New Subscription** · Sửa · Xoá · **Export** |
| Status flow | ✅ Cột **Status** + cột **Next Billing Cycle** + **Last Sent** |
| Ước độ lớn | Form + chu kỳ billing + tích hợp cổng thanh toán · ~25–35 REQ |
| Risk | 🔴 Cao — tự động sinh hoá đơn theo chu kỳ; sai chu kỳ là thu tiền sai khách hàng |

## Màn hình danh sách

- Cột: `#` · Subscription Name · Customer · Project · Status · Next Billing Cycle · Date Subscribed · Last Sent
- Thanh công cụ: **New Subscription** · **Export** · bộ lọc **Add Rule** / **Apply**

## Vùng chưa xác minh

- Giá trị đầy đủ của **Status** (Active / Future / Past due / Unpaid / Canceled…).
- Form tạo: chu kỳ (ngày/tuần/tháng/năm), số lần lặp, ngày bắt đầu, thuế, cổng thanh toán.
- Quan hệ với Hoá đơn: mỗi kỳ sinh 1 hoá đơn tự động — kiểm chứng ở tầng module.
- Phụ thuộc cấu hình cổng thanh toán (Stripe) — nằm trong khu Setup (403, ngoài phạm vi đợt này).

## Evidence

| Tệp | Màn hình | Trạng thái |
|---|---|---|
| [subscriptions_list_fullpage.png](../evidence/subscriptions_list_fullpage.png) | Danh sách Subscriptions | Mặc định |
