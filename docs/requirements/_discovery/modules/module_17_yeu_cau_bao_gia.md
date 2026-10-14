# Khám phá module: Yêu cầu báo giá — Estimate Request (`ESTREQ`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

| Mục | Giá trị |
|---|---|
| Tên trên UI | Estimate Request |
| Bí danh | Yêu cầu báo giá |
| Prefix | `ESTREQ` |
| Route | `/admin/estimate_request` |
| Loại màn hình | Danh sách + **trình tạo biểu mẫu** (New Form) |
| CRUD | ✅ **New Form** (tạo biểu mẫu) · quản lý yêu cầu nhận được · **Export** |
| Status flow | ✅ Có cột **Status** (chưa liệt kê được giá trị — bảng đang rỗng) |
| Ước độ lớn | 1 danh sách + 1 form builder · ~15–20 REQ |
| Risk | 🟡 Trung bình — biểu mẫu công khai ra ngoài, đầu vào từ người lạ (cần kiểm validation và chống spam) |

## Màn hình danh sách

- Cột: `#` · Email · Tags · Assigned · Status · Created
- Trạng thái dữ liệu tại thời điểm khảo sát: **No entries found** (rỗng)
- Thanh công cụ: **New Form** · **Export**

⚠️ Bảng rỗng nên **không quan sát được** giá trị Status thật, cũng như hành vi của các nút thao tác trên dòng. Recon cấp module cần tạo dữ liệu mẫu — **môi trường dùng chung**, phải thống nhất cách dọn trước khi làm.

## Vùng chưa xác minh

- Toàn bộ trình tạo biểu mẫu (New Form): loại field hỗ trợ, bắt buộc, thứ tự.
- URL công khai của biểu mẫu và luồng khách gửi yêu cầu.
- Luồng **chuyển yêu cầu → Estimate**.

## Evidence

| Tệp | Màn hình | Trạng thái |
|---|---|---|
| [estimate_request_list_fullpage.png](../evidence/estimate_request_list_fullpage.png) | Danh sách yêu cầu báo giá | **Rỗng** (No entries found) |
