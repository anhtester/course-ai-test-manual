---
description: Lập báo cáo tiến độ kiểm thử một kỳ (ngày/tuần) trong đợt — so thực tế với Master Test Plan, chỉ số viết TC · thực thi · lỗi · độ phủ trong kỳ, trở ngại, rủi ro mới, kế hoạch kỳ tới, đề xuất điều chỉnh. Bám ISTQB CTFL v4.0 mục 5.3.2. KHÔNG khuyến nghị go/no-go.
skills:
  - skills-test-progress-reporter
  - skills-test-report-analyzer
  - skills-bug-reporter
  - skills-coverage-traceability
---

# Workflow: Báo Cáo Tiến Độ Kiểm Thử

> **BẮT BUỘC (MANDATORY SKILL):** Bạn PHẢI nạp và đọc kỹ **`skills-test-progress-reporter`** (tại `.claude/skills/skills-test-progress-reporter/SKILL.md`) — đặc biệt mục **Xác định kỳ báo cáo**, **So tiến độ với kế hoạch** và **Nguyên tắc số liệu** — trước khi bắt đầu.

Workflow này trả lời câu hỏi giữa đợt: *kỳ này làm được gì · có kịp mốc không · đang vướng gì · kỳ tới làm gì.*

## ⚠️ Chọn đúng workflow

| User cần | Workflow đúng |
|---|---|
| *"Lần chạy vừa rồi fail vì sao"* | `/analyze-test-report` — một lần chạy |
| *"Tuần này test tới đâu, có kịp không"* | **Workflow này** — một kỳ trong đợt |
| *"Có release được không"* | `/generate-test-summary-report` — cuối đợt |
| *"Lịch/phạm vi cần đổi"* | `/generate-master-test-plan` — cập nhật plan |

## ⚠️ Nguyên tắc thực thi

- **Tất cả output bằng Tiếng Việt**, viết cho PM/QA Lead đọc — ngắn, số liệu đặt trước lời bình
- **KHÔNG bịa số, KHÔNG ước lượng thay dữ liệu** — thiếu thì ghi `—` hoặc *"không có dữ liệu"*
- **KHÔNG khuyến nghị go/no-go** — chỉ ảnh chụp xu hướng tiêu chí exit, ghi rõ *chưa phải đánh giá kết thúc*
- **KHÔNG sửa plan trong báo cáo** — đề xuất ở mục 7, cập nhật plan bằng `/generate-master-test-plan`
- 🔒 Không credentials, không URL có token, không dữ liệu khách hàng thật — báo cáo thường được gửi ra ngoài đội

---

## Bước 0: Xác định mốc và kỳ báo cáo

1. **Mốc:** user nêu → dùng slug. Không nêu → tìm `docs/test-plans/test_plan_*.md`:
   - Đúng 1 plan chưa có báo cáo tổng hợp tương ứng → dùng plan đó, báo user
   - Nhiều plan đang mở → hỏi user chọn
   - Không có plan → vẫn chạy được, nhưng báo trước: *"không có Master Test Plan — báo cáo chỉ có số liệu, không kết luận đúng/trễ tiến độ"*. Hỏi user tên mốc để đặt tên file
2. **Kỳ:** theo bảng *Xác định kỳ báo cáo* của skill. Công bố kỳ đã chọn trong câu trả lời đầu tiên
3. **Số thứ tự kỳ:** đếm `docs/executions/test_progress_<slug>_*.md` có `Đến ngày` trước kỳ này, +1
4. File `test_progress_<slug>_<YYYYMMDD>.md` của **cùng ngày cuối kỳ** đã có → cập nhật tại chỗ, ghi thời điểm cập nhật

---

## Bước 1: Thu thập dữ liệu

Glob theo bảng **Input** của skill, **ghi lại đường dẫn từng file** để làm cột nguồn:

1. `docs/test-plans/test_plan_<slug>.md` — mục 2.1 · 3.6 · 4.2 · 6 · 7.1 · 7.2 · 8.1
2. Báo cáo tiến độ kỳ trước cùng mốc — số luỹ kế · trạng thái rủi ro · kế hoạch đã hứa cho kỳ này
3. `docs/executions/<module>/<nền-tảng>/run_*/` và `retest_*/` — **lọc theo epoch trong kỳ**; thêm `docs/executions/_release/<nền-tảng>/run_*/` (checklist Release-readiness). Phân loại từng lần chạy theo ô `Loại nguồn` — lần chạy checklist báo ở bảng riêng, không cộng vào số bộ TC
4. `docs/bugs/README.md` → `BUG_*.md` — bug phát hiện trong kỳ (epoch trong tên file) · bug fix/đóng trong kỳ (Lịch sử retest)
5. `docs/testcases/README.md` → index từng module trong phạm vi — Nhật ký thay đổi trong kỳ
6. `docs/traceability/traceability_matrix.md` — nếu có: file chung, lấy độ phủ theo module + ⬛ module ngoài RTM; cần tới từng REQ thì theo `## Bản đồ tài liệu` sang `docs/traceability/<module>/traceability_matrix_<module>.md`. Không có file chung thì đọc thẳng file module; RTM kiểu cũ ở chỗ khác vẫn đọc
7. `reports/` — automation, nếu có

> 📂 Mục 3–4 quét **cả** kiểu cũ không có tầng nền tảng (`docs/executions/<module>/run_*/` · `docs/bugs/<module>/BUG_*.md`).

**Xử lý dữ liệu thiếu:**

| Tình huống | Xử lý |
|---|---|
| Cặp module × nền tảng trong phạm vi **không có lần chạy nào** | Nêu ở dòng *Chưa bắt đầu* mục 3.2, **trước** mọi tỷ lệ |
| Kỳ **không có** lần chạy nào | Vẫn lập báo cáo — tiến độ bằng 0 là thông tin quan trọng. Mục 4 phải giải thích vì sao |
| Không có báo cáo kỳ trước | Cột *kỳ trước* / *xu hướng* ghi `—`, không dự báo |
| Plan có ước lượng 7.2 nhưng không có công sức thực tế | Hỏi user ở Bước 3; không có → `—` |
| Jira là nguồn chính mà không đọc được | Ghi *chưa đối chiếu Jira*, dùng `docs/bugs/` và nêu rõ |

---

## Bước 2: Tính toán

| Tính | Quy tắc |
|---|---|
| Trạng thái từng mốc plan 7.1 | Theo bảng *So tiến độ với kế hoạch* của skill — **mỗi trạng thái phải có bằng chứng** |
| Tốc độ kỳ · phần còn lại · dự báo | Chỉ khi có ≥ 1 kỳ dữ liệu đầy đủ; ghi công thức |
| Pass rate | PASS / (PASS + FAIL + BLOCKED) — lấy lần chạy mới nhất của mỗi TC trong kỳ |
| Bug mới / fix trong kỳ | Theo ngày phát hiện và dòng Lịch sử retest — **không** đếm theo ngày sửa file |
| Xu hướng tiêu chí exit | So giá trị hiện tại với kỳ trước; chưa có kỳ trước → `—` |
| Rủi ro | Mỗi dòng plan 8.1 + rủi ro mới kỳ trước: 🟡 Theo dõi · 🔴 Đã xảy ra · 🟢 Đã giảm/đóng — kèm diễn biến dẫn số liệu |

---

## Bước 3: Hỏi user phần không có trong file (một lượt)

Chỉ hỏi khi thật sự thiếu — **bỏ qua cả bước** nếu không thiếu gì:

| Hỏi | Khi nào |
|---|---|
| Công sức thực tế đã bỏ ra trong kỳ (người-ngày) | Plan có ước lượng 7.2 |
| Trở ngại không để lại dấu vết trong file + **thời lượng** | Luôn hỏi một câu gọn: *"Kỳ này có trở ngại nào ngoài những gì agent thấy trong file không (môi trường sập, chờ tài khoản, đổi người…)? Mất bao lâu?"* |
| Việc kỳ tới có thay đổi so với lịch plan không | Có mốc plan rơi vào kỳ tới |

User không trả lời được → ghi `—`, **không** tự điền.

---

## Bước 4: Xuất báo cáo

File: `docs/executions/test_progress_<slug>_<YYYYMMDD>.md` — **gốc `docs/executions/`**, cạnh báo cáo tổng hợp cùng slug (plan ở `docs/test-plans/`).

Theo **Report Template** trong skill, đủ 7 mục đúng thứ tự:

| Mục | Vì sao ở vị trí đó |
|---|---|
| 1. Tóm tắt kỳ | Người đọc bận — trạng thái chung và việc cần quyết ở dòng đầu |
| 2. Tiến độ so với kế hoạch | Trả lời *"có kịp không"* trước khi đi vào chi tiết |
| 3. Chỉ số kiểm thử | Căn cứ cho mục 1–2; phần chưa bắt đầu đứng trước tỷ lệ |
| 4. Trở ngại & cách xử lý | Giải thích vì sao số ra như vậy |
| 5. Rủi ro mới & thay đổi | Theo dõi đúng register của plan |
| 6. Kế hoạch kỳ tới | Có đối chiếu với việc kỳ trước đã hứa |
| 7. Đề xuất điều chỉnh | Việc cần người quyết — dẫn số liệu ở mục 2–5 |

---

## Bàn giao

**Checklist trước khi báo xong:** dùng nguyên **Quality Checklist** của skill. Bốn mục hay sai nhất:

- [ ] Số **trong kỳ** tách khỏi số **luỹ kế**
- [ ] Mỗi trạng thái mốc có **bằng chứng**; không có plan thì **không** kết luận đúng/trễ
- [ ] Mục 3.6 ghi *chưa phải đánh giá kết thúc* — không có khuyến nghị go/no-go
- [ ] Đề xuất đụng lịch/phạm vi ghi **cần cập nhật plan**

**Báo cáo cho user:** trạng thái chung (🟢/🟡/🔴) · mốc có vấn đề · TC chạy trong kỳ và pass rate · bug Critical/Major mới · trở ngại lớn nhất · đề xuất cần quyết · đường dẫn file.

Đề xuất đụng tới plan → nhắc user chạy `/generate-master-test-plan` để cập nhật, **không** tự sửa plan.

---

## Mối quan hệ với workflows khác

```
/generate-master-test-plan ── lịch · chỉ số · tiêu chí · rủi ro ─────────┐
                                                                         ▼
/execute-test-cases ─┐                                  ┌─→ kỳ 1 ─→ kỳ 2 ─→ … ─┐
/retest-fixed-bugs  ─┼─→  /generate-test-progress-report┤                      │
/create-bug-report  ─┘                                  └─→ đề xuất điều chỉnh │
                                                              │                │
                              /generate-master-test-plan ◄────┘ (cập nhật plan)│
                                                                               ▼
                                                     /generate-test-summary-report
```

| Nhầm lẫn thường gặp | Workflow đúng |
|---|---|
| *"Báo cáo tuần gửi PM"* | **Workflow này** |
| *"Tổng kết đợt gửi khách, release được không"* | `/generate-test-summary-report` |
| *"12 TC fail hôm qua là do đâu"* | `/analyze-test-report` |
