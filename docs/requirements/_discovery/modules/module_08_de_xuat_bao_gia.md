# Khám phá module: Đề xuất — Proposals (`PROP`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

| Mục | Giá trị |
|---|---|
| Tên trên UI | Proposals |
| Bí danh | Đề xuất, Proposal |
| Prefix | `PROP` |
| Route | `/admin/proposals` · tạo mới `/admin/proposals/proposal` · chi tiết `/admin/proposals/list_proposals/{id}` |
| Loại màn hình | Danh sách + form chứng từ có soạn thảo nội dung |
| CRUD | ✅ **New Proposal** · Sửa · Xoá · **Export** |
| Status flow | ✅ **Draft · Sent · Open · Revised · Declined · Accepted** (đọc từ widget Proposal overview trên Dashboard) |
| Ước độ lớn | Form chứng từ + editor nội dung + item · ~30–40 REQ |
| Risk | 🔴 Cao — chứng từ có tiền, gửi ra ngoài cho khách hàng/lead, có luồng phản hồi từ khách |

## Màn hình danh sách

- Cột: Proposal # · Subject · To · Total · Date · Open Till · Project · Tags · Date Created · Status
- Thanh công cụ: **New Proposal** · **Export** · bộ lọc **Add Rule** / **Apply**

## Trạng thái quan sát được (Dashboard — widget *Proposal overview*)

| Trạng thái | Số liệu tại thời điểm khảo sát |
|---|---|
| Draft | 0 |
| Sent | 1 |
| Open | 4 |
| Revised | 0 |
| Declined | 0 |
| Accepted | 0 |

Thông báo hệ thống có mục *"Proposal Declined - PRO-000146"* → khách hàng **tự đổi trạng thái** được từ phía cổng khách hàng.

## Vùng chưa xác minh

- Form tạo đề xuất: gửi cho Customer hay Lead, item, thuế, ngày hết hạn (Open Till).
- Luồng **chuyển Proposal → Estimate / Invoice**.
- Bình luận của khách hàng trên đề xuất, luồng chấp nhận/từ chối từ cổng khách hàng.

## Evidence

| Tệp | Màn hình | Trạng thái |
|---|---|---|
| [proposals_list_fullpage.png](../evidence/proposals_list_fullpage.png) | Danh sách Proposals | Mặc định |
| [dashboard_overview_fullpage.png](../evidence/dashboard_overview_fullpage.png) | Widget *Proposal overview* | Thấy đủ 6 trạng thái |
