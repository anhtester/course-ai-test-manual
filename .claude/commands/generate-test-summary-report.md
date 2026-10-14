---
description: Tổng hợp kết quả kiểm thử toàn dự án tại một mốc (release/sprint/UAT) thành báo cáo gửi PM/khách — gộp nhiều execution report, bug đang mở, độ phủ RTM, kèm khuyến nghị go/no-go có căn cứ.
skills:
  - skills-test-summary-reporter
  - skills-test-report-analyzer
  - skills-bug-reporter
  - skills-coverage-traceability
---

# Workflow: Báo Cáo Tổng Hợp Kiểm Thử

> **BẮT BUỘC (MANDATORY SKILL):** Bạn PHẢI nạp và đọc kỹ **`skills-test-summary-reporter`** (tại `.claude/skills/skills-test-summary-reporter/SKILL.md`) — đặc biệt mục **Ranh giới nghề nghiệp** và **Tiêu chí Exit** — trước khi bắt đầu.

Workflow này trả lời đúng ba câu hỏi mà PM/khách hàng hỏi trước mỗi lần release: *đã test những gì · còn lỗi gì · có release được không.*

## ⚠️ Nguyên tắc thực thi

- **Tất cả output bằng Tiếng Việt**, viết cho người **không đọc code** — tránh thuật ngữ automation
- **QA khuyến nghị, PM quyết định** — không tự tuyên bố cấm/cho release
- **Chốt tiêu chí exit TRƯỚC khi xem kết quả** — nhìn số rồi mới đặt ngưỡng là hợp thức hoá kết quả
- **KHÔNG bịa số.** Thiếu dữ liệu thì ghi "không có dữ liệu", không ước lượng
- **KHÔNG đưa credentials, dữ liệu khách hàng thật** vào báo cáo — báo cáo này thường được gửi ra ngoài

---

## Bước 0: Chốt phạm vi & tiêu chí (CHECKPOINT — hỏi user)

> **Đọc Master Test Plan trước khi hỏi.** Mốc đã có `docs/test-plans/test_plan_<mốc>.md` (slug chữ thường không dấu, VD `release_v2.4`) thì phạm vi, tiêu chí exit và người nhận **đã được công bố** — lấy từ plan, chỉ hỏi phần plan để `❓`.

| Cần chốt | Ghi chú | Có plan thì lấy ở |
|---|---|---|
| **Mốc báo cáo** | Release v2.4 · Sprint 12 · UAT đợt 2 — dùng làm tiêu đề và slug `<mốc>` của tên file | Tên file plan |
| **Phạm vi module × nền tảng** | Cặp module × nền tảng nào nằm trong đợt release này. ⚠️ Module **ngoài** phạm vi vẫn phải nêu ở mục 2 nếu chưa test, nhưng không tính vào tiêu chí #7 | Mục 2.1 · 2.2 |
| **Build / Version** | Bắt buộc — báo cáo không gắn build là báo cáo không dùng được | Hỏi user — build thực tế có thể khác build dự kiến trong plan |
| **Tiêu chí exit của dự án** | Thứ tự nguồn theo mục **Tiêu chí Exit** của skill: plan → user → bộ mặc định (**GHI RÕ là mặc định của agent, cần PM xác nhận**) | Mục 4.2 |
| **Người nhận báo cáo** | PM nội bộ hay khách hàng — quyết định mức chi tiết kỹ thuật | Mục 2.4 |

⏸️ **Chốt xong mới sang Bước 1.** Đây là bước duy nhất bắt buộc hỏi user; các bước sau agent tự chạy.

---

## Bước 1: Thu thập dữ liệu

Glob theo bảng Input của skill, **ghi lại đường dẫn từng file** để làm cột nguồn trong báo cáo:

1. `docs/test-plans/test_plan_<mốc>.md` — nếu có: tiêu chí exit (4.2, gồm bảng bổ sung) · mục tiêu (1.1) · phạm vi (2.1, 2.2) · lịch & ước lượng (7.1, 7.2) · rủi ro dự án (8.1)
1b. `docs/executions/test_progress_<mốc>_*.md` — nếu có: chỉ số từng kỳ, thời lượng trở ngại, rủi ro đã xảy ra, sai lệch so với lịch
2. `docs/executions/<module>/<nền-tảng>/run_*/execution_report.md` — kết quả manual từng module × nền tảng. **Phân loại từng lần chạy** theo ô `Loại nguồn` ở header: `Bộ TC` hay `Checklist <loại>` (thiếu ô → `Nguồn TC` nằm trong `docs/checklists/` là checklist)
2b. `docs/executions/_release/<nền-tảng>/run_*/execution_report.md` — kết quả checklist Release-readiness của mốc (`Nguồn TC` = `checklist_release_<mốc>.md`); quy từng mục về module theo cột `Module`
3. `docs/executions/<module>/<nền-tảng>/retest_*/retest_report.md` — bug đã verify + regression phát sinh
4. `docs/bugs/README.md` (danh mục) rồi `docs/bugs/<module>/<nền-tảng>/BUG_*.md` — đọc `Severity`, `Lịch sử retest` để biết bug nào còn mở
5. `docs/requirements/README.md` — **bắt buộc**, lấy module còn ⬜/🟨/⏸️
6. `docs/traceability/traceability_matrix.md` — nếu có: file chung, lấy độ phủ theo module + ⬛ module ngoài RTM (nhóm 📄 *có REQ, chưa có TC* phải nêu trong báo cáo); cần tới từng REQ thì theo `## Bản đồ tài liệu` sang file module. Không có file chung thì đọc thẳng `docs/traceability/<module>/`; RTM kiểu cũ ở chỗ khác vẫn đọc. Đọc `Ngày sinh` / `Mốc git` **từng module** ở Bản đồ tài liệu — module có RTM cũ hơn lần sửa TC cuối thì ghi rõ là đã cũ
7. `reports/` — kết quả automation, nếu có

> 📂 Mục 2–4 quét **cả** kiểu cũ không có tầng nền tảng (`docs/executions/<module>/run_*/` · `docs/bugs/<module>/BUG_*.md`) — tài liệu cũ không bị di chuyển, bỏ sót là mất lần chạy và bug.

**Xử lý dữ liệu thiếu:**

| Tình huống | Xử lý |
|---|---|
| Module trong phạm vi nhưng **không có execution report** | Ghi vào mục 2 "chưa được kiểm thử" — **KHÔNG** bỏ qua im lặng |
| Không có `docs/bugs/` (đội dùng Jira) | Lấy qua `skills-jira-integration`. Không lấy được → ghi rõ "không đối chiếu được tình hình bug", và **hạ mức tin cậy của khuyến nghị** |
| Không có `docs/requirements/README.md` | ⚠️ Không xác định được vùng mù → ghi rõ: *"chưa khảo sát cấp hệ thống, không kết luận được đã phủ hết hệ thống hay chưa"* |
| Nhiều run **bộ TC** cùng một module × nền tảng | Gộp: **mỗi TC lấy kết quả của lần chạy mới nhất có chạy TC đó** — không lấy nguyên run mới nhất (run chạy lại 3 TC BLOCKED sẽ thay số của cả 36 TC). Nêu trend ở phần ghi chú nếu có khác biệt đáng kể |
| Có run **checklist** | Báo ở bảng 4b riêng, **không** cộng vào bảng bộ TC. Cách tính vào tiêu chí exit theo bảng *Kết quả checklist trong các tiêu chí* của skill |
| Module × nền tảng **chỉ** có run checklist | Tiêu chí #7 chưa đạt — ghi *"chỉ rà checklist <loại>"* ở mục 2 |
| Mục checklist FAIL (build mới) mà `TC ID liên quan` PASS ở run bộ TC (build cũ) | Regression — nêu ở mục 5, ghi cả hai nguồn |

⚠️ **Số liệu mâu thuẫn giữa các nguồn → nêu ra cả hai**, không tự chọn số đẹp hơn.

---

## Bước 2: Đối chiếu tiêu chí Exit

Chấm **từng** tiêu chí đã chốt ở Bước 0: `✅ Đạt` / `❌ Không đạt` / `🟡 Ngoại lệ chờ duyệt` / `➖ Không áp dụng`, kèm **số thực tế**.

⛔ Không có mức "gần đạt". 94.8% với ngưỡng 95% là **không đạt** — có thể chấp nhận, nhưng phải ghi là ngoại lệ và nêu ai duyệt.

---

## Bước 3: Kết luận khuyến nghị

| Khuyến nghị | Khi nào | Bắt buộc kèm |
|---|---|---|
| 🟢 **GO** | Đạt toàn bộ tiêu chí | **Vẫn phải** liệt kê rủi ro tồn đọng (nợ kiểm thử, vùng chưa phủ) |
| 🟡 **GO có điều kiện** | Đạt phần lớn; phần thiếu có workaround hoặc nằm ngoài phạm vi người dùng | Danh sách điều kiện đánh số + rủi ro nếu vẫn release |
| 🔴 **NO-GO** | Còn bug Critical mở, hoặc luồng nghiệp vụ chính chưa chạy được | Nêu **đích danh** bug/vùng chặn và việc cần làm để gỡ |

**Câu chốt bắt buộc có trong mọi báo cáo:**

> ⚠️ Quyết định release thuộc về PM/PO. Báo cáo này cung cấp căn cứ, không thay thế quyết định đó.

---

## Bước 4: Xuất báo cáo

File: `docs/executions/test_summary_<mốc>_<timestamp>.md` — đặt ở **gốc `docs/executions/`** vì báo cáo này cắt ngang mọi module, không thuộc module nào.

Theo **Report Template** trong skill, đủ 9 mục theo đúng thứ tự:

| Mục | Vì sao ở vị trí đó |
|---|---|
| 1. Khuyến nghị | Người đọc bận — kết luận phải nằm ở dòng đầu |
| **2. Vùng chưa kiểm thử** | **Trước mọi tỷ lệ** — nếu không, con số đẹp che mất vùng trắng |
| 3. Đối chiếu tiêu chí exit | Cho thấy khuyến nghị dựa trên chuẩn, không phải cảm tính |
| 4. Kết quả theo module | Manual bộ TC · checklist (4b) · automation — **ba bảng riêng** |
| 5. Tình hình lỗi | Bug đang mở + regression phát sinh trong kỳ |
| 6. Độ phủ yêu cầu | Từ RTM, nếu có |
| 7. Đề xuất hành động | Việc cụ thể, ai làm, command nào |
| 8. Yếu tố cản trở & Bài học | Sau kết quả, trước phụ lục — đọc xong mới hiểu vì sao số ra như vậy |
| 9. Phụ lục — Ánh xạ chuẩn | Cuối cùng, dành cho người nghiệm thu/audit chứ không phải người đọc thường |

> **Mục 8 lấy dữ liệu từ đâu:** BLOCKED trong `execution_report.md` (lý do bị chặn), `retest_report.md` (bản fix nào gây regression), mục 8.1 *Rủi ro dự án* của `docs/test-plans/test_plan_<mốc>.md` (rủi ro nào đã thành hiện thực), và mục 4 · 5 của các `test_progress_<mốc>_*.md` (trở ngại kèm **thời lượng**, rủi ro 🔴 đã xảy ra). **Sai lệch lịch/công sức** so với plan 7.1 · 7.2 cũng đưa vào mục này. **Không hỏi user** những gì có trong file — chỉ hỏi phần thời lượng nếu file không ghi.

> **Chuẩn tham chiếu:** báo cáo bám cấu trúc **ISO/IEC/IEEE 29119-3 — Test Completion Report**. Xem mục *Chuẩn tham chiếu* trong skill trước khi viết mục 9. Ghi **tên mục** chuẩn, **không** ghi số điều khoản; **không** tuyên bố "tuân thủ".

---

## Bàn giao

**Checklist trước khi báo xong:** dùng nguyên **Quality Checklist** của skill (15 mục). Bốn mục hay sai nhất:

- [ ] Vùng chưa test đặt **trước** tỷ lệ
- [ ] Khuyến nghị GO vẫn liệt kê rủi ro
- [ ] Manual và automation **không cộng gộp**; kết quả checklist ở bảng 4b, **không** cộng vào bảng bộ TC
- [ ] Mục 8.1 có **thời lượng thực tế**, mục 8.2 mỗi bài học chỉ đích danh nơi áp dụng

**Báo cáo cho user:** khuyến nghị (GO / GO có điều kiện / NO-GO) · số tiêu chí đạt/tổng · bug Critical & Major đang mở · module chưa test · đường dẫn file báo cáo.

Nhắc user: file này gửi ra ngoài được — kiểm lại lần cuối không có URL nội bộ, tài khoản, hay dữ liệu khách hàng thật trong ảnh đính kèm.

---

## Mối quan hệ với workflows khác

```
/generate-test-progress-report ── số liệu từng kỳ ──────┐
/generate-master-test-plan ── công bố tiêu chí exit ────┤
/execute-test-cases ──┐                                 │
/retest-fixed-bugs  ──┤                                 ▼
/create-bug-report  ──┼──→  /generate-test-summary-report  ──→  PM / PO / khách hàng
/generate-traceability-matrix ──┘                │
                                                 └──→ mở scripts/execution-viewer/bundle.html để xem trực quan
```

| Nhầm lẫn thường gặp | Workflow đúng |
|---|---|
| *"Phân tích giúp lần chạy vừa rồi fail vì sao"* | `/analyze-test-report` — một phạm vi chạy |
| *"Tổng hợp cho tôi báo cáo gửi khách"* | **Workflow này** — toàn dự án tại một mốc |
| *"Requirement nào chưa có test"* | `/generate-traceability-matrix` |
