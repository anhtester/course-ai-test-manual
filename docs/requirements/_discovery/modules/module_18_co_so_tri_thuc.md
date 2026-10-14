# Khám phá module: Cơ sở tri thức — Knowledge Base (`KB`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

| Mục | Giá trị |
|---|---|
| Tên trên UI | Knowledge Base |
| Bí danh | Cơ sở tri thức, Bài viết hướng dẫn |
| Prefix | `KB` |
| Route | `/admin/knowledge_base` · tạo mới `/admin/knowledge_base/article` |
| Loại màn hình | Danh sách + trình soạn thảo bài viết + quản lý **Groups** |
| CRUD | ✅ **New Article** · Sửa · Xoá · **Groups** · **Export** |
| Status flow | Không có cột trạng thái ở danh sách (có thể có Published/Draft trong form — chưa xác minh) |
| Ước độ lớn | Danh sách 3 cột + form soạn thảo + nhóm · ~12–18 REQ |
| Risk | 🟢 Thấp — nội dung tĩnh, không dính tiền hay quyền |

## Màn hình danh sách

- Cột: Article Name · Group · Date Published
- Thanh công cụ: **New Article** · **Groups** (modal có **Save** / **Close**) · **Export**

## Vùng chưa xác minh

- Form soạn bài: editor, slug, trạng thái xuất bản, thứ tự hiển thị, đánh giá hữu ích (helpful/not helpful).
- Trang KB phía cổng khách hàng — ngoài khu `/admin`.
- Báo cáo **KB Articles** (thuộc module `REP`) lấy số liệu từ đây.

## Evidence

| Tệp | Màn hình | Trạng thái |
|---|---|---|
| [knowledge_base_list_fullpage.png](../evidence/knowledge_base_list_fullpage.png) | Danh sách bài viết | Mặc định |
