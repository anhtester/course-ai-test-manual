---
description: Sinh ma trận truy vết (RTM) Requirements ↔ Test Cases ↔ Automation Scripts — chỉ ra requirement chưa cover, TC chưa automate, và orphan tests.
skills:
  - skills-coverage-traceability
  - skills-requirements-analyzer
  - skills-rbt-manual-testing
---

# Workflow: Sinh Ma Trận Truy Vết (RTM)

> **BẮT BUỘC (MANDATORY SKILL):** Bạn PHẢI nạp và đọc kỹ nội dung của skill **`skills-coverage-traceability`** (tại `.claude/skills/skills-coverage-traceability/SKILL.md`) trước khi bắt đầu.

## ⚠️ Nguyên tắc thực thi

- **Tất cả output bằng Tiếng Việt**
- **KHÔNG bịa mapping** — không chắc thì để trống và đưa vào mục "cần xác nhận"
- Mapping suy luận (theo tên/mô tả, không có ID) phải đánh dấu ⚠️ và tách riêng khỏi mapping có ID
- KHÔNG tự ý sửa file TC/test gốc để thêm ID — chỉ đề xuất

## Phạm vi

| Lệnh | Phạm vi |
|---|---|
| `/generate-traceability-matrix` | Mọi module có REQ **và** TC |
| `/generate-traceability-matrix login, customers` | Đúng các module chỉ định — file chung chỉ thay dòng của các module này, giữ nguyên dòng module khác |

## Input cần thu thập

| Nguồn | Bắt buộc? | Ghi chú |
|---|---|---|
| Requirements (markdown/Jira export/user stories) | Cần ≥2 nguồn | Có thể lấy từ `/fetch-jira-requirements`. Ghi lại Story chứa từng REQ |
| Manual test cases (markdown/Excel/CSV) | Cần ≥2 nguồn | Index TC có bảng *REQ cố ý KHÔNG có TC* — nguồn của trạng thái ⏭️ |
| Automation scripts (path thư mục test) | Cần ≥2 nguồn | Agent tự scan `.spec.ts`, `*Test.java`, `.py` |
| Checklist (`docs/checklists/**/checklist_*.md`) | Nguồn phụ — không tính vào "≥2 nguồn" | Agent tự quét — smoke/regression lấy file mới nhất theo ngày, post-hotfix lấy mọi file, release lấy file của mốc (luật ở skill, bảng *Nguồn trong `docs/`*) |
| Kết quả chạy (`docs/executions/<module>/<nền-tảng>/run_*/`, `retest_*/`) | Nguồn phụ | Kết quả **mới nhất của từng TC**, không phải lần chạy mới nhất. Bỏ qua lần chạy checklist |
| Bug (`docs/bugs/README.md`) | Nguồn phụ | Chỉ bug **đang mở**, nối qua cột `TC liên quan` |

> Có đủ 3 nguồn chính → RTM 3 tầng đầy đủ. Chỉ có 2 nguồn → RTM 2 chiều, ghi rõ ở ô `Nguồn đã quét`. Chỉ có 1 nguồn → dừng, hỏi user bổ sung. Nguồn nào không có thì **ẩn cột** tương ứng, không in cột toàn `—`.

## Các bước thực hiện

### Bước 1: Thu thập & Trích xuất
1. Đọc từng nguồn, xác định format ID (`REQ-xxx`, `TC_xxx`, tên test method, mã mục checklist `CL-…-<nn>`)
2. Liệt kê đầy đủ: REQ IDs (kèm Story + trạng thái REQ), TC IDs (kèm Priority, cột `Automation` dự kiến, Tags), test methods (kèm file path), mục checklist có `REQ ID`, kết quả mới nhất từng TC, bug đang mở theo TC
3. Nếu TC/test không có ID chuẩn → ghi nhận để đề xuất bổ sung ID ở output

### Bước 2: Mapping & Trạng thái
1. Map bằng ID trước (chuẩn nhất)
2. Map bằng nội dung cho phần không có ID → đánh dấu ⚠️
3. Ghi nhận quan hệ n-n đầy đủ
4. Gán **đúng một** trạng thái cho mỗi REQ theo bảng *Trạng thái của một REQ* trong skill: ⏭️ Loại trừ · 🔴 Chưa có TC · 🟠 Chỉ có checklist · 🟡 Thủ công · 🟣 Automate một phần · ✅ Đã automate
5. ⏭️ **chỉ** khi tài liệu có căn cứ (bảng *REQ cố ý KHÔNG có TC*, REQ ⚪ Chưa implement / 🔴 Deprecated). Không có căn cứ → 🔴, agent **không** tự quyết loại trừ

### Bước 3: Tính Metrics & Phát Hiện Gap
1. Mẫu số = REQ trong phạm vi (đã trừ ⏭️). Requirement / Platform / Automation Coverage, pass rate lần chạy gần nhất
2. Lập **Việc cần làm** theo thứ tự trong skill (🔴 → 🟠 → ❌ FAIL → ▶️ chưa chạy → 🗑️ → ⚠️ → 🟡 automate), mỗi việc kèm command
3. **⬛ Ngoài tầm nhìn của RTM — điểm mù, BẮT BUỘC kiểm:**
   Đọc `docs/requirements/README.md`, xếp module vào 3 nhóm: ⬜ chưa khảo sát (`Trạng thái recon` = ⬜ / 🟨 / ⏸️) · 📄 có REQ nhưng chưa có TC · 🕓 có REQ + TC nhưng chưa sinh RTM.
   Những module này **không có mặt** trong mọi %, nên RTM tính đúng công thức vẫn ra coverage cao — trong khi cả vùng đó chưa ai chạm tới. Không nêu ra thì con số RTM **gây hiểu nhầm nghiêm trọng**. Nhóm 📄 ghi kèm Requirement Coverage toàn hệ thống **nếu tính cả** các module đó.
   Chưa có file danh mục (chưa chạy `/discover-system`) → ghi rõ: *"Chưa khảo sát cấp hệ thống — không kết luận được RTM đã phủ hết hệ thống hay chưa"*.

### Bước 4: Xuất RTM (CHECKPOINT)
1. Ghi **file module** `docs/traceability/<module>/traceability_matrix_<module>.md` cho từng module trong phạm vi — theo *RTM Template — file module* của skill
2. Ghi/cập nhật **file chung** `docs/traceability/traceability_matrix.md` — theo *RTM Template — file chung*: thay dòng của module vừa sinh, giữ nguyên dòng module khác, tính lại `Tổng` · ⬛ · Việc cần làm · Bản đồ tài liệu. Mốc git lấy bằng `git log -1 --format=%h`
3. Tự kiểm theo *Quy tắc trình bày* của skill: có câu tóm tắt · thanh tiến độ · ma trận nhóm theo Story · không cột toàn `—` · không bảng rỗng · danh sách > 20 dòng đã bọc `<details>`
4. Nếu user cần import Excel → nhắc dùng nút **↓ Excel** của `traceability-viewer`, hoặc sinh thêm `.csv` cùng tên, cùng thư mục
5. Có RTM cũ ở vị trí khác → nhắc user gỡ, **không** tự xoá
6. **⏸️ Trình bày kết quả** — câu tóm tắt của file chung + bảng độ phủ theo module, nhấn mạnh 🔴, 🟠, ⏭️ (để user xác nhận căn cứ loại trừ) và ⚠️
7. Đề xuất bước tiếp theo theo mục **Việc cần làm** của file chung

## Output

- **File chung** `docs/traceability/traceability_matrix.md` — tóm tắt · ⬛ ngoài tầm nhìn (đặt **trên** mọi con số) · độ phủ theo module có dòng `Tổng` · việc cần làm gộp mọi module · Bản đồ tài liệu (Ngày sinh + Mốc git từng module)
- **File module** `docs/traceability/<module>/traceability_matrix_<module>.md` — tóm tắt · tổng quan có thanh tiến độ + phân bổ 6 trạng thái · việc cần làm · ma trận chi tiết **theo Story** · ⏭️ REQ loại trừ · 🟡 TC chưa automate (bảng Priority × Automation dự kiến + danh sách trong `<details>`) · Kiểm tra khác (🔴 🟠 ⚪ 🧩 🗑️ ⚠️)
- File `.csv` cùng tên (nếu user yêu cầu)

> 📊 **Xem trực quan:** mở `scripts/traceability-viewer/bundle.html` rồi kéo thả cả thư mục `docs/traceability/` vào. Trang này tự tính lại chỉ số từ ma trận chi tiết (không tin bảng tổng), lọc theo module · Story · trạng thái, cảnh báo module ⬛ và file module bị cũ hơn file chung, xuất Excel nhiều sheet. Nhắc user điều này ở bước bàn giao.
