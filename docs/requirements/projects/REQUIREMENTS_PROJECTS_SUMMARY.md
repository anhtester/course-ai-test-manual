# Đặc tả Yêu cầu — Module Dự án (`PRJ`)

> Điểm vào cấp hệ thống: [../README.md](../README.md) · Bản đồ khám phá: [../_discovery/modules/module_05_du_an.md](../_discovery/modules/module_05_du_an.md)

| Mục | Giá trị |
|---|---|
| **Hệ thống** | Perfex CRM — Anh Tester Demo |
| **Module** | Dự án (Projects) |
| **Prefix** | `PRJ` |
| **Route** | `/admin/projects` · `/admin/projects/project` (tạo) · `/admin/projects/project/{id}` (sửa) · `/admin/projects/view/{id}?group=<tab>` (chi tiết) · `/admin/projects/gantt` · `/admin/projects/delete/{id}` · `/admin/projects/export_project_data/{id}` |
| **Nền tảng** | Web ✅ · Mobile — chưa có · API — chưa có |
| **Nguồn phân tích** | Khảo sát UI thực tế + đọc DOM + tầng network — chi tiết trình duyệt ở file nền tảng web |
| **Ngày phân tích** | 14-08-2026 |
| **Tài khoản dùng khảo sát** | 1 tài khoản duy nhất — "Admin Example", `staff-id-2` |
| **Môi trường dùng chung** | **CÓ** — đã tạo 1 dự án thử nghiệm (`RECON_PRJ_1786652163351`, id `2695`) và **đã xoá sạch**; số bản ghi trở lại đúng **118** như trước khi khảo sát |
| **Tổng số REQ** | **104** |
| **Dải mã đã dùng** | `REQ-PRJ-01` → `REQ-PRJ-104` · `AMB-PRJ-01` → `AMB-PRJ-16` · `RISK-PRJ-01` → `RISK-PRJ-07` |
| **Mã kế tiếp** | Đợt phân tích sau bắt đầu từ `REQ-PRJ-105` · `AMB-PRJ-17` · `RISK-PRJ-08` — **KHÔNG đánh lại từ 01** |

---

## 1. Tổng quan

Module Dự án quản lý vòng đời một dự án từ lúc mở tới lúc kết thúc, và là **điểm gom dữ liệu** của phần lớn nghiệp vụ vận hành: công việc, chấm công, mốc tiến độ, tài liệu, thảo luận, cùng toàn bộ chứng từ bán hàng (báo giá, đề xuất, hoá đơn, đăng ký định kỳ, chi phí, giấy báo có) và hợp đồng, phiếu hỗ trợ.

Đây là **module lớn nhất hệ thống** tính theo số màn hình: một biểu mẫu 2 tab, một trang chi tiết **17 tab**, một trang Gantt tổng, cùng các hộp thoại sao chép / lập hoá đơn / đổi trạng thái.

Module gồm **4 màn hình chính**:

| Màn hình | Route | Vai trò |
|---|---|---|
| Danh sách dự án | `/admin/projects` | Bảng server-side, bảng tổng quan theo trạng thái, tìm kiếm, bộ lọc tuỳ biến, xuất dữ liệu |
| Thêm dự án | `/admin/projects/project` | Biểu mẫu 2 tab: `Project` · `Project Settings` |
| Chi tiết dự án | `/admin/projects/view/{id}` | 17 tab nghiệp vụ + thanh thao tác nhanh |
| Gantt tổng | `/admin/projects/gantt` | Biểu đồ Gantt toàn bộ dự án, lọc theo trạng thái và thành viên |

### Trong phạm vi

- Toàn bộ CRUD dự án: xem danh sách, tạo, sửa, sao chép, xoá
- Vòng đời trạng thái 5 mức và hai lối đổi trạng thái (biểu mẫu sửa · menu nhanh ở trang chi tiết)
- Cấu hình hiển thị cho cổng khách hàng: `Visible Tabs` và 18 công tắc quyền
- Kiểu tính phí (`Billing Type`) và các trường giá phụ thuộc
- Quản lý thành viên dự án, tiến độ dự án
- Bộ lọc tuỳ biến 6 tiêu chí, bộ lọc lưu sẵn, xuất dữ liệu 4 định dạng
- Các tab **thuộc về dự án**: Overview · Milestones · Timesheets · Files · Discussions · Gantt · Notes · Activity
- Các tab **chiếu dữ liệu** từ module khác ở mức "màn hình tồn tại và hiển thị đúng cột"

### Ngoài phạm vi

| Vùng | Lý do |
|---|---|
| Nghiệp vụ chi tiết của Công việc, Phiếu hỗ trợ, Hợp đồng, Hoá đơn, Báo giá, Đề xuất, Đăng ký định kỳ, Chi phí, Giấy báo có | Thuộc module riêng, có prefix riêng. Ở đây chỉ đặc tả **màn hình chiếu** trong dự án |
| Cổng khách hàng (front-end ngoài `/admin`) | Ngoài phạm vi toàn dự án — xem `_discovery/system_map.md` mục 7. Hệ quả: **không kiểm chứng được** 18 công tắc quyền khách hàng có tác dụng thật hay không (`AMB-PRJ-14`) |
| Nội dung tệp xuất (Excel/CSV/PDF) và tệp `Export project data` | Không tải tệp về trên môi trường dùng chung — xem `AMB-PRJ-12` |
| Thao tác tải tệp lên tab Files | Không tải tệp lên môi trường dùng chung — xem `AMB-PRJ-13` |

---

## Bản đồ tài liệu

Tài liệu vượt ngưỡng 80 REQ nên file nền tảng web được chia tiếp theo Story (skill `skills-requirements-analyzer` mục 5.1 + 5.2 + 5.3). File này là **index bất biến**; chi tiết REQ nằm ở các file dưới.

| Nền tảng | File | Story | REQ bao phủ | Số REQ |
|---|---|---|---|---|
| Chung ≥ 2 nền tảng | chính file này | — | — (module mới có một nền tảng) | 0 |
| Web | [web/requirements_projects_web.md](web/requirements_projects_web.md) | — | Bản đồ phủ tài liệu · Phi chức năng · Danh mục Evidence (không chứa dòng REQ) | 0 |
| Web | [web/stories/story_01_danh_sach_loc_xuat.md](web/stories/story_01_danh_sach_loc_xuat.md) | STORY-PRJ-01 | `REQ-PRJ-01` → `REQ-PRJ-23` | 23 |
| Web | [web/stories/story_02_tao_du_an.md](web/stories/story_02_tao_du_an.md) | STORY-PRJ-02 | `REQ-PRJ-24` → `REQ-PRJ-41` | 18 |
| Web | [web/stories/story_03_cau_hinh_du_an.md](web/stories/story_03_cau_hinh_du_an.md) | STORY-PRJ-03 | `REQ-PRJ-42` → `REQ-PRJ-52` | 11 |
| Web | [web/stories/story_04_kiem_tra_du_lieu.md](web/stories/story_04_kiem_tra_du_lieu.md) | STORY-PRJ-04 | `REQ-PRJ-53` → `REQ-PRJ-59` | 7 |
| Web | [web/stories/story_05_sua_va_trang_thai.md](web/stories/story_05_sua_va_trang_thai.md) | STORY-PRJ-05 | `REQ-PRJ-60` → `REQ-PRJ-68` | 9 |
| Web | [web/stories/story_06_sao_chep_du_an.md](web/stories/story_06_sao_chep_du_an.md) | STORY-PRJ-06 | `REQ-PRJ-69` → `REQ-PRJ-74` | 6 |
| Web | [web/stories/story_07_trang_chi_tiet.md](web/stories/story_07_trang_chi_tiet.md) | STORY-PRJ-07 | `REQ-PRJ-75` → `REQ-PRJ-86` | 12 |
| Web | [web/stories/story_08_tab_thuoc_du_an.md](web/stories/story_08_tab_thuoc_du_an.md) | STORY-PRJ-08 | `REQ-PRJ-87` → `REQ-PRJ-97` | 11 |
| Web | [web/stories/story_09_tab_chieu_module_khac.md](web/stories/story_09_tab_chieu_module_khac.md) | STORY-PRJ-09 | `REQ-PRJ-98` → `REQ-PRJ-101` | 4 |
| Web | [web/stories/story_10_xoa_va_xuat_du_an.md](web/stories/story_10_xoa_va_xuat_du_an.md) | STORY-PRJ-10 | `REQ-PRJ-102` → `REQ-PRJ-104` | 3 |

**Tự kiểm chứng:** 23 + 18 + 11 + 7 + 9 + 6 + 12 + 11 + 4 + 3 = **104 REQ** — khớp tổng ở bảng metadata. Mọi REQ thuộc **đúng một** Story, không mồ côi, không trùng.

| Nội dung | Ở đâu |
|---|---|
| Metadata · Tổng quan & phạm vi (mục 1) · Phân rã Story (3) · Ma trận phân quyền (4) · Ma trận trạng thái (5) · AMB & RISK (7) · Nhật ký (9) | **File này** |
| Bản đồ phủ tài liệu (2) · Phi chức năng quan sát được (6) · Danh mục Evidence (8) | [web/requirements_projects_web.md](web/requirements_projects_web.md) |
| Bảng REQ · Đặc tả trường · Validation · Luồng xử lý | [web/stories/](web/stories/) — theo từng Story |
| Ảnh evidence | [web/evidence/](web/evidence/) |

> Quy ước: REQ không ghi trạng thái = 🟢 Active.

---

## 3. Phân rã Epic / Story (Backlog View)

| Story ID | Tên Story | REQ bao phủ | Số REQ | AMB / RISK liên quan | Ghi chú phạm vi |
|---|---|---|---|---|---|
| STORY-PRJ-01 | Danh sách, tìm kiếm, lọc, xuất dữ liệu | REQ-PRJ-01 → 23 | 23 | AMB-PRJ-02 · RISK-PRJ-02, 04, 05 | Bảng server-side; số đếm tổng quan **không khớp** số dòng thật |
| STORY-PRJ-02 | Tạo dự án — thông tin chính | REQ-PRJ-24 → 41 | 18 | AMB-PRJ-06, 09, 10 · RISK-PRJ-06 | Trường giá hiện/ẩn theo `Billing Type` |
| STORY-PRJ-03 | Cấu hình dự án & quyền khách hàng | REQ-PRJ-42 → 52 | 11 | AMB-PRJ-14, 15 | 18 công tắc quyền; **không kiểm chứng được tác dụng** vì cổng khách hàng ngoài phạm vi |
| STORY-PRJ-04 | Kiểm tra dữ liệu đầu vào | REQ-PRJ-53 → 59 | 7 | AMB-PRJ-04, 05, 08, 09, 10 | Kiểm tra phía client; **không có** kiểm tra logic ngày và trùng tên |
| STORY-PRJ-05 | Sửa dự án & vòng đời trạng thái | REQ-PRJ-60 → 68 | 9 | — | Hai lối đổi trạng thái, tuỳ chọn phụ khi chuyển sang `Finished` |
| STORY-PRJ-06 | Sao chép dự án | REQ-PRJ-69 → 74 | 6 | AMB-PRJ-11 | Đặc tả tới mức biểu mẫu; **chưa chạy thật** trên môi trường dùng chung |
| STORY-PRJ-07 | Trang chi tiết & thao tác nhanh | REQ-PRJ-75 → 86 | 12 | AMB-PRJ-06, 07 | Progress 100% khi 0 công việc; "Days Left" ra số âm |
| STORY-PRJ-08 | Các tab nghiệp vụ thuộc dự án | REQ-PRJ-87 → 97 | 11 | AMB-PRJ-13, 16 | Đặc tả tới mức màn hình + biểu mẫu; **chưa chạy CRUD đầy đủ** |
| STORY-PRJ-09 | Tab chiếu dữ liệu từ module khác | REQ-PRJ-98 → 101 | 4 | RISK-PRJ-01 | Chỉ đặc tả cột hiển thị; nghiệp vụ thuộc module gốc |
| STORY-PRJ-10 | Xoá dự án & xuất dữ liệu dự án | REQ-PRJ-102 → 104 | 3 | AMB-PRJ-03, 12 · RISK-PRJ-03 | Xoá thành công nhưng chuyển tới trang lỗi |

**Tổng: 10 Story / 104 REQ** — mọi REQ thuộc đúng một Story, không mồ côi, không trùng.

### 3.1. Hạng mục cấp Epic (cố ý không gán vào Story nào)

| Hạng mục | Vị trí | Lý do không gán |
|---|---|---|
| Ma trận Phân quyền (mục 4) | Index | Cắt ngang mọi Story — cùng một vai trò áp cho toàn module |
| Ma trận Trạng thái (mục 5) | Index | Cắt ngang STORY-PRJ-01, 02, 05, 07 |
| Yêu cầu Phi chức năng (mục 6) | Index | Áp cho toàn module |
| Ambiguity & Risk (mục 7) | Index | Đánh số theo **toàn module**; file story chỉ tham chiếu mã, không nhân bản nội dung |
| Danh mục Evidence (mục 8) | Index | Ảnh dùng chung cho nhiều Story |

### 3.2. Thứ tự triển khai đề xuất

Xếp theo phụ thuộc và rủi ro, **không** theo thứ tự đánh số:

```
1. STORY-PRJ-02  Tạo dự án              ← không có dự án thì mọi Story sau vô nghĩa
2. STORY-PRJ-04  Kiểm tra dữ liệu       ← đi kèm ngay với biểu mẫu tạo
3. STORY-PRJ-01  Danh sách & lọc        ← BLOCKED một phần bởi AMB-PRJ-02 (số đếm sai)
4. STORY-PRJ-07  Trang chi tiết         ← BLOCKED một phần bởi AMB-PRJ-06 (Progress 100%)
5. STORY-PRJ-05  Sửa & vòng đời trạng thái
6. STORY-PRJ-03  Cấu hình & quyền       ← BLOCKED bởi AMB-PRJ-14 — cổng khách hàng ngoài phạm vi
7. STORY-PRJ-10  Xoá & xuất             ← BLOCKED một phần bởi AMB-PRJ-03 (chuyển tới trang lỗi)
8. STORY-PRJ-08  Tab nghiệp vụ          ← BLOCKED bởi AMB-PRJ-13 — cần môi trường riêng để chạy CRUD
9. STORY-PRJ-06  Sao chép dự án         ← BLOCKED bởi AMB-PRJ-11 — thao tác sinh dữ liệu hàng loạt
10. STORY-PRJ-09 Tab chiếu module khác  ← làm sau cùng, phụ thuộc dữ liệu của module gốc
```

---

## 4. Ma trận Phân quyền

> ⚠️ Khảo sát chỉ có **1 tài khoản** ("Admin Example", `staff-id-2`). Khu Setup (`/admin/roles`, `/admin/staff`) trả **403** nên **không đọc được màn hình cấu hình phân quyền** của hệ thống. Chỉ cột Admin là kiểm chứng được.

Ô chọn `Members` của biểu mẫu dự án và ô lọc `Members` xác nhận hệ thống có **3 nhân sự**: `Project Manager` (id 3) · `Admin Anh Tester` (id 1) · `Admin Example` (id 2) — cùng danh sách đã ghi nhận ở module `CUST`. Tên `Project Manager` cho thấy tồn tại ít nhất một vai trò **không phải** quản trị viên, nhưng không có căn cứ nào về quyền của vai trò đó.

| Hành động | Admin | Project Manager | Vai trò khác |
|---|---|---|---|
| Xem danh sách dự án | ✅ | ❔ | ❔ |
| Tìm kiếm, lọc, lưu bộ lọc | ✅ | ❔ | ❔ |
| Xuất dữ liệu danh sách (Excel/CSV/PDF/Print) | ✅ | ❔ | ❔ |
| Tạo dự án mới | ✅ | ❔ | ❔ |
| Sửa dự án | ✅ | ❔ | ❔ |
| Đổi trạng thái dự án | ✅ | ❔ | ❔ |
| Sao chép dự án | ✅ | ❔ | ❔ |
| Xoá dự án | ✅ | ❔ | ❔ |
| Ghim / bỏ ghim dự án | ✅ | ❔ | ❔ |
| Quản lý thành viên dự án | ✅ | ❔ | ❔ |
| Cấu hình `Visible Tabs` & quyền khách hàng | ✅ | ❔ | ❔ |
| Lập hoá đơn cho dự án | ✅ | ❔ | ❔ |
| Xuất dữ liệu dự án (`export_project_data`) | ✅ | ❔ | ❔ |
| Xem Gantt tổng | ✅ | ❔ | ❔ |

```
Đã kiểm chứng: 14 ô · Suy diễn: 0 ô · Chưa rõ: 28 ô
— chưa có tài khoản vai trò "Project Manager" và các vai trò khác (AMB-PRJ-01);
  màn hình cấu hình phân quyền 403 nên không suy diễn được ô nào
```

> ⚠️ Ô `❔` **không** được làm tròn thành `❌`. "Chưa kiểm chứng" khác hẳn "không có quyền".

**Một dấu hiệu về mô hình phân quyền:** cấu hình `settings[hide_tasks_on_main_tasks_table]` (REQ-PRJ-52) mang nhãn *"(admin area)"* — hệ thống có phân biệt khu quản trị với khu khách hàng ở mức dữ liệu. Nhưng đây là ranh giới **admin ↔ khách hàng**, không phải ranh giới giữa các vai trò nhân sự, nên không dùng để suy ma trận trên.

---

## 5. Ma trận Trạng thái

Dự án có đúng **5 trạng thái**. Mã giá trị **không** liên tiếp theo thứ tự hiển thị — điểm bắt buộc phải nhớ khi viết automation.

| Trạng thái | Mã giá trị | Màu | Thứ tự hiển thị |
|---|---|---|---|
| Not Started | `1` | `#475569` | 1 |
| In Progress | `2` | `#2563eb` | 2 |
| On Hold | `3` | `#f97316` | 3 |
| Cancelled | **`5`** | `#94a3b8` | 4 |
| Finished | **`4`** | `#16a34a` | 5 |

> ⚠️ `Cancelled` = `5` và `Finished` = `4` — **ngược** với thứ tự hiển thị trên UI. Automation chọn theo nhãn thì đúng, chọn theo chỉ số thì sai.

| Trạng thái hiện tại | Hành động cho phép | Trạng thái kế tiếp | Ai được thực hiện | REQ |
|---|---|---|---|---|
| *(chưa tồn tại)* | Tạo dự án mới | Bất kỳ trạng thái nào trong 5 · mặc định **In Progress** | Admin ✅ · vai trò khác ❔ | REQ-PRJ-33, 41 |
| **Bất kỳ** | Sửa biểu mẫu → chọn `Status` khác | Bất kỳ trạng thái nào trong 5 | Admin ✅ · vai trò khác ❔ | REQ-PRJ-62 |
| **Bất kỳ** | Menu `More` → `Mark as <trạng thái>` | Trạng thái được chọn | Admin ✅ · vai trò khác ❔ | REQ-PRJ-64 |
| **Bất kỳ** | Sửa · Sao chép · Ghim · Xoá | Không đổi / *(bị xoá)* | Admin ✅ · vai trò khác ❔ | REQ-PRJ-60, 69, 68, 102 |

**Quy tắc chuyển trạng thái quan sát được:**

- **Không có ràng buộc chiều nào** — mọi trạng thái đều chuyển được sang mọi trạng thái còn lại. Không thấy trạng thái cuối (terminal state): dự án `Finished` hoặc `Cancelled` vẫn đổi lại được.
- Menu `Mark as ...` **chỉ liệt kê 4 trạng thái**, bỏ đúng trạng thái hiện tại (REQ-PRJ-65). Kiểm chứng trên dự án `In Progress`: menu hiện `Not Started` · `On Hold` · `Cancelled` · `Finished`.
- Chuyển sang **`Finished`** kích hoạt thêm 2 tuỳ chọn phụ (REQ-PRJ-63, 66) — trạng thái duy nhất có hành vi phụ.

---

## 7. Điểm Mơ Hồ & Rủi Ro

### 7.1. Ambiguities

| Mã | Câu hỏi | Nguy cơ | Mức độ | Assumption tạm | Trạng thái | Kết luận |
|---|---|---|---|---|---|---|
| AMB-PRJ-01 | Xin tài khoản vai trò `Project Manager` và các vai trò khác để kiểm chứng 28 ô đang bỏ trống trong ma trận phân quyền của module `PRJ` | Không kiểm chứng được ranh giới quyền; một vai trò thấp xoá được dự án hoặc xem được tài chính dự án sẽ không bị phát hiện | 🔴 | Mọi vai trò không phải Admin **không** xoá được dự án và **không** đổi được cấu hình `Visible Tabs` | ❓ Chờ trả lời | — |
| AMB-PRJ-02 | Bảng tổng quan đếm **67** dự án `In Progress` nhưng bấm vào lọc ra đúng **60** dòng (lệch 7). Bốn trạng thái còn lại khớp chính xác (53 · 2 · 2 · 1). Số nào đúng? | Mọi test khẳng định theo số đếm đều sai; người dùng mất niềm tin vào số liệu tổng quan; Dashboard cũng đang hiển thị `67 / 125` theo nguồn sai này | 🔴 | Số đếm ở bảng tổng quan **sai**; số dòng thật khi lọc mới đúng (53 + 60 + 2 + 2 + 1 = 118 = tổng bảng) | ❓ Chờ trả lời | Kiểm chứng thực tế 14-08-2026 — lọc lần lượt cả 5 trạng thái, chỉ `In Progress` lệch |
| AMB-PRJ-03 | Xoá dự án thành công nhưng hệ thống chuyển tới `/admin/not_found` kèm thông báo **"Something went wrong. Try again"** và **"Project not found"** thay vì quay về danh sách kèm thông báo thành công. Lỗi hay thiết kế? | Người dùng tưởng xoá thất bại và bấm lại; test thủ công báo nhầm FAIL; automation không có mốc nào để khẳng định xoá thành công | 🔴 | Đây là **lỗi** — sau khi xoá phải chuyển về `/admin/projects` kèm thông báo thành công | ❓ Chờ trả lời | Kiểm chứng thực tế trên dự án id `2695` |
| AMB-PRJ-04 | `Deadline` sớm hơn `Start Date` được chấp nhận ở **cả** phía client lẫn phía máy chủ; dự án tạo ra chỉ bị gắn nhãn *"This project is overdue by N days"*. Lỗi hay cố ý? | Dữ liệu dự án vô nghĩa đi vào hệ thống rồi lan sang Gantt, mốc tiến độ, báo cáo. Danh sách hiện đã có dự án `Test Date Validation` với `Start 15-05-2026` / `Deadline 14-05-2026` | 🔴 | Đây là **lỗi** — `Deadline` phải ≥ `Start Date` | ❓ Chờ trả lời | Kiểm chứng thực tế: tạo dự án `Start 20-08-2026` / `Deadline 01-08-2026` → lưu thành công |
| AMB-PRJ-05 | Thông báo lỗi của trường `Customer` là **"Select and begin typing"** — chính là chuỗi gợi ý (placeholder) của ô chọn, không phải câu báo lỗi. Các trường khác báo đúng "This field is required." | Người dùng không hiểu mình sai gì; test tự động so khớp thông báo lỗi sẽ viết ra khẳng định vô nghĩa | 🟡 | Đây là **lỗi** — phải dùng chung câu "This field is required." | ❓ Chờ trả lời | — |
| AMB-PRJ-06 | Dự án **0 công việc** bật `Calculate progress through tasks` hiển thị **Progress 100%**. Đúng hay phải là 0%? | Báo cáo tiến độ sai hoàn toàn với mọi dự án mới; quản lý nhìn dashboard tưởng dự án đã xong | 🔴 | Đây là **lỗi** — 0 công việc phải cho 0% | ❓ Chờ trả lời | Kiểm chứng thực tế trên dự án id `2695` ngay sau khi tạo |
| AMB-PRJ-07 | Thẻ `Days Left` hiển thị **số âm** (`0 / -19 Days Left`) khi dự án quá hạn. Có phải cách hiển thị mong muốn không? | Số âm trong ô "còn lại bao nhiêu ngày" khó hiểu; không rõ test nên khẳng định giá trị nào | 🟢 | Chấp nhận được — số âm mang nghĩa "quá hạn N ngày", đã có băng cảnh báo riêng ở đầu trang | ❓ Chờ trả lời | — |
| AMB-PRJ-08 | **Tên dự án trùng nhau không bị chặn** ở bất kỳ tầng nào. Danh sách hiện có 2 dự án `Dgrey Project` và hơn 10 dự án `Mua hàng qua app`. Có phải chủ ý không? | Người dùng không phân biệt được dự án nào là dự án nào; automation chọn dự án theo tên sẽ bắt nhầm bản ghi | 🟡 | Là chủ ý — dự án phân biệt bằng `id`, không bằng tên. Khác với `CUST` (có cảnh báo trùng tên, xem `AMB-CUST-02`) | ❓ Chờ trả lời | — |
| AMB-PRJ-09 | **Không trường text nào khai báo `maxlength`.** Giới hạn độ dài thực tế của `name`, `tags`, `description` là bao nhiêu? | Không viết được test biên; nhập quá dài có thể gây lỗi 500 hoặc cắt dữ liệu âm thầm. Danh sách khách hàng đang có bản ghi tên dài 191 ký tự → nghi giới hạn 191 | 🟡 | Giới hạn theo cột CSDL (thường 191–255 ký tự); test biên tạm dùng 255 và 256 | ❓ Chờ trả lời | Lặp lại đúng vấn đề của `AMB-CUST-05` ở module `CUST` |
| AMB-PRJ-10 | `Total Rate`, `Rate Per Hour`, `Estimated Hours` đều là `type=number` **không** khai báo `min` / `max` / `step`. Có chấp nhận số âm, số 0, số thập phân không? | Dự án có giá trị âm đi thẳng vào hoá đơn và báo cáo tài chính | 🟡 | Không có kiểm tra — nhập số âm vẫn lưu | ❓ Chờ trả lời | — |
| AMB-PRJ-11 | `Copy Project` sao chép chính xác những gì? Tệp, thảo luận, ghi chú có được sao chép không (biểu mẫu chỉ nêu Tasks · checklist · assignees · followers · Milestones · Members)? Dự án mới nhận trạng thái nào? | Không viết được kỳ vọng cho `STORY-PRJ-06`; chạy thử trên môi trường dùng chung sẽ sinh dữ liệu rác hàng loạt | 🟡 | Chỉ sao chép đúng 6 nhóm nêu trên biểu mẫu; dự án mới nhận trạng thái mặc định `Not Started` | ❓ Chờ trả lời | Cần môi trường riêng để chạy |
| AMB-PRJ-12 | `Export project data` (`/admin/projects/export_project_data/{id}`) tải về tệp định dạng gì và gồm những dữ liệu nào? | `REQ-PRJ-104` đang ⚪; không viết được kỳ vọng | 🟢 | Tệp nén chứa dữ liệu dự án và tệp đính kèm | ❓ Chờ trả lời | Không tải tệp về trong đợt khảo sát |
| AMB-PRJ-13 | Các tab `Milestones` · `Files` · `Discussions` · `Notes` mới đặc tả tới mức **biểu mẫu và cột bảng**, chưa chạy CRUD đầy đủ (tạo · sửa · xoá · tải tệp). Thông báo thành công / lỗi của từng thao tác là gì? | Toàn bộ `STORY-PRJ-08` chưa test được ở mức hành vi; `REQ-PRJ-89, 91, 93` đang ⚪ | 🟡 | Mỗi thao tác cho một thông báo thành công dạng toast, không chuyển trang | ❓ Chờ trả lời | Cần môi trường riêng để chạy |
| AMB-PRJ-14 | Bỏ chọn một mục trong `Visible Tabs` thì tab đó biến mất ở **khu quản trị** hay chỉ ở **cổng khách hàng**? Tương tự với 18 công tắc quyền khách hàng | Không kiểm chứng được `STORY-PRJ-03` — 11 REQ đang dựa hoàn toàn vào nhãn trên giao diện. Cổng khách hàng nằm ngoài phạm vi toàn dự án | 🔴 | `Visible Tabs` áp cho **cả hai** khu; 18 công tắc quyền chỉ áp cho cổng khách hàng | ❓ Chờ trả lời | Chốt phạm vi cổng khách hàng thì mới kiểm chứng được |
| AMB-PRJ-15 | `Hide project tasks on main tasks table (admin area)` tác động cụ thể thế nào tới module `TASK` — ẩn khỏi bảng chính, hay ẩn khỏi cả bộ lọc và báo cáo? | Ảnh hưởng chéo sang module `TASK` mà bộ test của `PRJ` không phát hiện | 🟡 | Chỉ ẩn khỏi bảng danh sách công việc chính, không ảnh hưởng báo cáo | ❓ Chờ trả lời | — |
| AMB-PRJ-16 | Trường `Order` của mốc tiến độ mặc định `1`. Hai mốc cùng số thứ tự thì sắp xếp thế nào? Số thứ tự có bắt buộc duy nhất không? | Thứ tự hiển thị mốc tiến độ không đoán được → test sắp xếp sẽ không ổn định | 🟢 | Cho phép trùng; trùng thì sắp theo ngày tạo | ❓ Chờ trả lời | — |

### 7.2. Risks

| Mã | Rủi ro | Mô tả | Mitigation |
|---|---|---|---|
| RISK-PRJ-01 | Module là điểm gom của 9 module khác | 17 tab của trang chi tiết chiếu dữ liệu từ `TASK`, `TICK`, `CTR`, `PROP`, `EST`, `INV`, `SUB`, `EXP`, `CN`. Một thay đổi ở `PRJ` có thể làm hỏng màn hình của module khác mà bộ test `PRJ` không thấy | Sau mỗi lần sửa `PRJ`, chạy kèm bộ smoke của `TASK` và `INV`. Ưu tiên sinh RTM để thấy rõ liên đới |
| RISK-PRJ-02 | Danh sách ngập dữ liệu rác từ automation cũ | Trong 118 dự án có hơn 50 bản ghi `AUTO_POM_ADD_PROJECT_*`, `AUTO_POM_DELETE_PROJECT_*`, `Project Automation *`, `[AUTO_HT] project *` do các đợt chạy trước để lại và **không dọn** | Mọi bản ghi test dùng tiền tố riêng kèm dấu thời gian và **phải xoá sau khi chạy**. Tuyệt đối **không** khẳng định theo tổng số bản ghi — con số này trôi liên tục |
| RISK-PRJ-03 | Thao tác xoá dùng GET | `GET /admin/projects/delete/{id}` xoá ngay khi mở URL; hộp thoại xác nhận chỉ là lớp chặn phía trình duyệt | **Cấm** đưa URL xoá vào bất kỳ bước điều hướng nào của automation. Chỉ xoá qua liên kết `Delete` + hộp thoại xác nhận, và chỉ với bản ghi do test tạo ra |
| RISK-PRJ-04 | Bảng nạp bất đồng bộ dễ gây khẳng định sai | Mọi thao tác lọc / tìm / phân trang đều đi qua `POST /admin/projects/table`; đọc DOM ngay sau thao tác sẽ thấy dữ liệu cũ | Chờ dòng `Showing … entries` đổi giá trị hoặc chờ request kết thúc; **không** dùng hard sleep |
| RISK-PRJ-05 | Số liệu tổng quan không khớp bảng | `AMB-PRJ-02` — số đếm `In Progress` lệch 7 so với số dòng thật | **Không** viết khẳng định dựa trên số đếm ở bảng tổng quan cho tới khi `AMB-PRJ-02` được trả lời. Khẳng định theo số dòng sau khi lọc |
| RISK-PRJ-06 | Trường giá hiện/ẩn theo `Billing Type` | `Total Rate` và `Rate Per Hour` **vẫn nằm trong DOM** khi bị ẩn. Automation đọc theo `id` mà không kiểm tra khả năng nhìn thấy sẽ điền vào trường không hiển thị và không hề báo lỗi | Luôn kiểm tra trường **hiển thị** trước khi điền; đổi `Billing Type` xong phải chờ trường tương ứng hiện ra |
| RISK-PRJ-07 | Dữ liệu chuẩn thay đổi theo thời gian | Danh sách `Members` (3 nhân sự) và `Customer` (hơn 1.500 khách hàng) đến từ bảng chuẩn mà tài khoản hiện tại không quản lý được | Giả định danh sách cố định trong đợt test; số lượng đổi giữa các lần chạy là do người khác sửa dữ liệu, không phải lỗi sản phẩm |

---

## 9. Nhật ký Thay đổi

| Ngày | Nguồn | REQ ảnh hưởng | Loại | Tóm tắt thay đổi | TC cần xử lý |
|---|---|---|---|---|---|
| 21-09-2026 | Quy ước đặt tên | — | ✏️ Biên tập | Đổi tên file index `requirements_projects.md` → `REQUIREMENTS_PROJECTS_SUMMARY.md` — quy ước mới: index IN HOA để khác hẳn file nền tảng. Nội dung, mã REQ/TC không đổi; mọi link trỏ tới đã sửa | — |
| 19-09-2026 | Chuyển tầng nền tảng | REQ-PRJ-01 → 104 | ✏️ Biên tập | **Chuyển sang cấu trúc tầng nền tảng** (skill `skills-requirements-analyzer` mục 5.3): `stories/` → `web/stories/`, `evidence/` → `web/evidence/`; mục 2, 6, 8 → `web/requirements_projects_web.md`. Index giữ metadata, phạm vi, Story, ma trận, AMB/RISK, Nhật ký; `## Bản đồ tài liệu` trỏ sang tầng web. **Mã REQ, số mục và nội dung không đổi** | — |
| 14-08-2026 | UI recon | REQ-PRJ-01 → 104 | 🟢 Thêm | Khởi tạo tài liệu từ khảo sát UI thực tế + đọc DOM + tầng network. 104 REQ, 10 Story, 16 AMB (6 🔴), 7 RISK, 31 ảnh evidence. Đã tạo và xoá 1 dự án thử nghiệm trên môi trường dùng chung | — (viết TC mới) |
