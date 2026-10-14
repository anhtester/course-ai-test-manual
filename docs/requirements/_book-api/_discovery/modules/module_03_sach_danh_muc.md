# Khám phá — Sách (`BOOK`) · Danh mục sách (`CAT`)

> Tầng khám phá — **không** chứa mã REQ. Index: [`../system_map.md`](../system_map.md) · Mặt API: [`../api_map.md` mục 2.3 · 2.4](../api_map.md#2-danh-mục-endpoint) · Trạng thái recon: [`../../README.md`](../../README.md)
>
> Gộp chung file vì quan hệ cha–con: danh mục hiện trên app **dưới dạng tab lọc của màn hình Book**. Gộp file **không** gộp prefix.

## `BOOK` — mặt Android

| Màn hình | Đường đi | Thành phần quan sát được |
|---|---|---|
| **Book Management** | Tab 3 "Book" | `Filter` ▾ · `Sort By: Feature` ▾ · hàng tab danh mục (cuộn ngang) · thẻ sách: ảnh bìa · avatar người đăng · ngày (`23 Th12 2025`) · tên sách · lượt xem · giá gốc gạch ngang + giá bán · biểu tượng khuyến mãi / freeship |
| Đã đăng nhập | | Nút **"New book"** · icon **bút** trên thẻ sách (sửa) |

- Thẻ sách đầu tiên hiển thị giá bán **"-1.000 ₫"** (giá gốc 50.000 ₫) — giá âm lọt lên UI, cùng bản chất F-04. Nối AMB-BK-03.
- Icon bút hiện trên sách **không phải của tài khoản đang đăng nhập** — cùng bản chất F-02 (không phân quyền). Chưa bấm thử.
- Chưa mở: Filter · Sort · chi tiết sách · form New book. → **26-09-2026: đã khảo sát ở tầng module** — [`book/mobile/requirements_book_mobile.md`](../../book/mobile/requirements_book_mobile.md)

Evidence: [android_book_overview.png](../evidence/android_book_overview.png) (đã đăng nhập)

## `CAT` — mặt Android

| Màn hình | Đường đi | Thành phần |
|---|---|---|
| Tab danh mục | Tab Book → hàng tab ngang | `All` · `Phương Nam 1` · `Test 11` · `Adventure…` — tên danh mục + số sách |
| ❔ Quản lý danh mục | Icon **⚙** cuối hàng tab (chỉ hiện khi đã đăng nhập) | Chưa bấm — nghi là lối vào tạo / đổi tên / xoá danh mục |

Evidence: [android_cat_overview.png](../evidence/android_cat_overview.png) (cắt vùng tiêu đề + Filter/Sort + hàng tab danh mục)
