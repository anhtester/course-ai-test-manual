# Khám phá module: Báo cáo (`REP`)

> Tầng khám phá — **KHÔNG chứa mã REQ**. Về index: [system_map.md](../system_map.md)

| Mục | Giá trị |
|---|---|
| Tên trên UI | Reports |
| Bí danh | Báo cáo |
| Prefix | `REP` |
| Route | `/admin/reports/*` (6 trang) |
| Loại màn hình | Báo cáo — bảng số liệu + biểu đồ + bộ lọc kỳ |
| CRUD | Không (chỉ xem / xuất) |
| Status flow | Không có |
| Ước độ lớn | 6 trang báo cáo × nhiều bộ lọc · ~20–30 REQ |
| Risk | 🟡 Trung bình — số liệu tổng hợp; sai công thức khó phát hiện bằng mắt, phải đối chiếu dữ liệu nguồn |

## 6 trang báo cáo

| Trang | Route |
|---|---|
| Sales | `/admin/reports/sales` |
| Expenses | `/admin/reports/expenses` |
| Expenses vs Income | `/admin/reports/expenses_vs_income` |
| Leads | `/admin/reports/leads` |
| Timesheets overview | `/admin/staff/timesheets?view=all` |
| KB Articles | `/admin/reports/knowledge_base_articles` |

Trang **Sales** có các mục con quan sát được: *Sales Report* · *Invoices Report* · *Items Report* (đọc từ nội dung trang).

> **Timesheets overview** nằm ở route `/admin/staff/...` nhưng được đặt trong menu Reports → giữ ở module `REP` theo cách hệ thống trình bày, ghi chú route khác nhánh để không nhầm với `PROF`.

## Vùng chưa xác minh

- Bộ lọc kỳ (từ ngày – đến ngày, theo tháng/quý/năm) trên từng báo cáo.
- Công thức tính từng chỉ số — cần đối chiếu với dữ liệu nguồn ở `INV` / `EXP` / `LEAD`.
- Xuất báo cáo (PDF/Excel) nếu có.

## Evidence

| Tệp | Màn hình | Trạng thái |
|---|---|---|
| [reports_sales_fullpage.png](../evidence/reports_sales_fullpage.png) | Báo cáo Sales | Mặc định |
