---
name: skills-test-progress-reporter
description: Skill lập báo cáo tiến độ kiểm thử định kỳ (ngày/tuần) trong một đợt — so tiến độ với Master Test Plan, gom chỉ số viết TC · thực thi · lỗi · độ phủ trong kỳ, nêu trở ngại, rủi ro mới, kế hoạch kỳ tới và đề xuất điều chỉnh. Bám nội dung test progress report của ISTQB CTFL v4.0 mục 5.3.2.
---

# Test Progress Reporter

Purpose: Trả lời câu hỏi PM/QA Lead hỏi **giữa đợt**: *"Kỳ này test tới đâu rồi, có kịp không, đang vướng gì, kỳ tới làm gì?"* — bằng số liệu truy được về file, đủ để **điều chỉnh kế hoạch kịp thời** thay vì phát hiện trễ vào ngày release.

---

## When to Use

- Đến kỳ báo cáo theo lịch đã chốt ở Master Test Plan (mục 7.1 · 2.4)
- PM/QA Lead hỏi *"tuần này thế nào"*
- Họp giao ban kiểm thử cần một trang số liệu
- Nghi đợt đang trễ — cần so thực tế với kế hoạch

### Ranh giới với hai skill gần giống

| Skill | Phạm vi thời gian | Trả lời | Kết luận |
|---|---|---|---|
| `skills-test-report-analyzer` | **Một** lần chạy | Vì sao lần chạy này fail | Gom nhóm root cause |
| **Skill này** | **Một kỳ** trong đợt (ngày/tuần) | Đang đúng tiến độ không, vướng gì | **Đề xuất điều chỉnh** — không khuyến nghị release |
| `skills-test-summary-reporter` | **Cả đợt**, tại mốc kết thúc | Có release được không | Khuyến nghị go/no-go |

> ⛔ Báo cáo tiến độ **KHÔNG** đưa khuyến nghị go/no-go. Ảnh chụp tiêu chí exit giữa đợt chỉ là **xu hướng** — ghi rõ *"chưa phải đánh giá kết thúc"*. Kết luận release là việc của `/generate-test-summary-report` ở cuối đợt.

---

## Chuẩn tham chiếu

ISTQB CTFL v4.0 mục **5.3.2 Purpose, Content and Audience for Test Reports** — test progress report *"support the ongoing control of the testing"*, thường lập *"on a regular basis (e.g., daily, weekly, etc.)"* và gồm:

| ISTQB CTFL v4.0 — 5.3.2 | Mục trong báo cáo |
|---|---|
| Test period | Đầu báo cáo |
| Test progress (e.g., ahead or behind schedule), including any notable deviations | 1 · 2 |
| Impediments for testing, and their workarounds | 4 |
| Test metrics (see section 5.3.1 for examples) | 3 |
| New and changed risks within testing period | 5 |
| Testing planned for the next period | 6 |

Chỉ số lấy theo các nhóm của mục **5.3.1 Metrics used in Testing**: tiến độ dự án · tiến độ kiểm thử · chất lượng sản phẩm · lỗi · rủi ro · độ phủ · chi phí. Mục **7. Đề xuất điều chỉnh** bám *control directives* ở phần mở đầu mục 5.3 (sắp lại ưu tiên, đánh giá lại tiêu chí vào/ra, điều chỉnh lịch, bổ sung nguồn lực).

Giáo trình ghi ISO/IEC/IEEE 29119-3 gọi loại tài liệu này là **test status report** và có template trong chuẩn.

> ⚠️ Ghi *"lập theo nội dung báo cáo tiến độ của ISTQB CTFL v4.0 mục 5.3.2"* — **KHÔNG** viết "tuân thủ ISTQB" hay "tuân thủ ISO/IEC/IEEE 29119". Không ghi số điều khoản 29119-3.

---

## Nguyên tắc số liệu

1. **Mọi con số truy được về file nguồn** — mỗi bảng có cột nguồn. Không gõ số từ trí nhớ, không ước lượng
2. **Chỉ tính sự kiện TRONG kỳ** cho các cột "trong kỳ"; số **luỹ kế** tách cột riêng. Trộn hai loại là số tuần nào cũng "tăng mạnh"
3. **Manual và automation báo riêng** — không cộng
4. **BLOCKED không phải PASS · SKIPPED không phải PASS** — tách riêng, nêu lý do
5. **Phần chưa bắt đầu đứng trước tỷ lệ** — cặp module × nền tảng chưa có TC hoặc chưa chạy nêu trước pass rate
6. **Không có Master Test Plan → không kết luận "trễ" hay "đúng hạn"** — ghi *"không có mốc kế hoạch để so"*, chỉ báo số liệu
7. **Số liệu mâu thuẫn giữa nguồn** (markdown ↔ Jira) → nêu cả hai, ghi nguồn chính theo plan mục 5.3

---

## Xác định kỳ báo cáo

| Tình huống | Từ ngày | Đến ngày |
|---|---|---|
| User nêu rõ kỳ | Theo user | Theo user |
| Đã có báo cáo tiến độ trước của cùng mốc | Ngày sau `Đến ngày` của báo cáo gần nhất | Hôm nay |
| Chưa có báo cáo nào | `Bắt đầu thực thi` ở plan mục 7.1 — hoặc ngày duyệt plan nếu chưa tới ngày thực thi | Hôm nay |

**Quy đổi thời điểm từ tên file** (theo múi giờ máy đang chạy, ghi múi giờ vào báo cáo):

| File | Thời điểm |
|---|---|
| `run_<epoch>` · `retest_<epoch>` | Epoch giây → ngày giờ chạy |
| `BUG_<module>_<epoch>_<TC_ID>.md` | Epoch giây → ngày **phát hiện** |
| Bug đã fix / đã đóng | Dòng mới nhất trong mục **Lịch sử retest** của file bug, hoặc cột ngày trong danh mục bug |
| TC mới viết / đã review | **Nhật ký thay đổi** của `TEST_CASES_<TÊN_MODULE>_SUMMARY.md` |

---

## Input

| Nguồn | Lấy gì | Bắt buộc |
|---|---|---|
| `docs/test-plans/test_plan_<slug>.md` | Phạm vi module × nền tảng (2.1) · chỉ số theo dõi (3.6) · tiêu chí exit (4.2) · lịch (7.1) · ước lượng (7.2) · rủi ro dự án (8.1) · nhân lực (6) | Nên có |
| `docs/executions/test_progress_<slug>_*.md` | Báo cáo kỳ trước — số luỹ kế · rủi ro · **kế hoạch kỳ này đã hứa** | Nếu có |
| `docs/executions/<module>/<nền-tảng>/run_*/execution_report.md` · kiểu cũ `docs/executions/<module>/run_*/` | Kết quả chạy manual trong kỳ · lý do BLOCKED — phân loại **bộ TC / checklist** theo ô `Loại nguồn` | ✅ |
| `docs/executions/_release/<nền-tảng>/run_*/execution_report.md` | Lần chạy checklist Release-readiness trong kỳ | Nếu có |
| `docs/executions/<module>/<nền-tảng>/retest_*/retest_report.md` · kiểu cũ | Bug đã verify · regression phát sinh | Nếu có |
| `docs/bugs/README.md` + `BUG_*.md` (cả hai kiểu thư mục) | Bug mới · đã fix · đang mở theo Severity | ✅ |
| `docs/testcases/README.md` + index từng module | Số TC · Nhật ký thay đổi (TC viết/review trong kỳ) | ✅ |
| `docs/traceability/traceability_matrix.md` — file chung, độ phủ theo module (không có thì `docs/traceability/<module>/`; RTM kiểu cũ ở chỗ khác vẫn đọc) | Độ phủ REQ ↔ TC · ⬛ module ngoài RTM | Nếu có |
| `reports/` | Kết quả automation trong kỳ | Nếu có |

> 📂 Tài liệu sinh trước khi có tầng nền tảng **không** bị di chuyển — quét **cả** `<module>/<nền-tảng>/` lẫn `<module>/`.
>
> Đội dùng Jira làm nguồn chính cho bug → lấy qua `skills-jira-integration`; không lấy được thì ghi rõ *"chưa đối chiếu Jira"*.

**Chỉ hỏi user những thứ KHÔNG có trong file**, gom một lượt: công sức thực tế đã bỏ ra (khi plan có ước lượng 7.2) · trở ngại không để lại dấu vết trong file (môi trường sập, chờ tài khoản) kèm **thời lượng** · sự kiện ngoài repo (đổi người, đổi lịch). User không có → ghi `—`, không bịa.

---

## So tiến độ với kế hoạch

Mỗi mốc ở plan mục 7.1 chấm một trạng thái, **kèm bằng chứng**:

| Trạng thái | Khi nào | Bằng chứng mẫu |
|---|---|---|
| ✅ Đã xong đúng hạn | Có bằng chứng hoàn thành, ngày ≤ hạn | `Hoàn tất viết TC` → Nhật ký thay đổi TC ghi review xong ngày X |
| ⚠️ Xong nhưng trễ | Có bằng chứng, ngày > hạn | Ghi số ngày trễ |
| 🔴 Quá hạn, chưa xong | Hạn ≤ `Đến ngày`, không có bằng chứng | Ghi số ngày quá hạn |
| 🟡 Có nguy cơ trễ | Chưa tới hạn, phần còn lại vượt năng lực còn lại | Còn 120 TC chưa chạy · 3 ngày · tốc độ kỳ này 25 TC/ngày |
| ⏳ Chưa tới hạn | Hạn > `Đến ngày`, không có dấu hiệu nguy cơ | — |

**Dự báo** chỉ được tính khi có đủ số: *tốc độ kỳ này* = TC đã chạy trong kỳ ÷ số ngày làm việc trong kỳ · *phần còn lại* = TC trong phạm vi chưa chạy. Ghi công thức cạnh con số. Kỳ đầu tiên chưa đủ dữ liệu → **không** dự báo.

**Trạng thái chung của kỳ** (một dòng đầu báo cáo):

| Trạng thái | Điều kiện |
|---|---|
| 🟢 Đúng tiến độ | Không có mốc 🔴 hoặc 🟡 |
| 🟡 Có nguy cơ | Có mốc 🟡, hoặc có mốc ⚠️ đã ảnh hưởng mốc sau |
| 🔴 Trễ tiến độ | Có mốc 🔴 |

---

## Report Template

File: `docs/executions/test_progress_<slug>_<YYYYMMDD>.md` — `YYYYMMDD` là **ngày cuối kỳ**. Chạy lại cho **cùng kỳ** → cập nhật tại chỗ, ghi thời điểm cập nhật; **không** sinh file thứ hai.

```markdown
# Báo Cáo Tiến Độ Kiểm Thử — <Dự án> · <Mốc> · Kỳ <số thứ tự>

| | |
|---|---|
| Kỳ báo cáo | <DD-MM-YYYY> → <DD-MM-YYYY> (<N> ngày làm việc) · múi giờ <…> |
| Mốc · Plan | <Mốc> · [test_plan_<slug>.md](../test-plans/test_plan_<slug>.md) v<x> |
| Báo cáo kỳ trước | [test_progress_<slug>_<YYYYMMDD>.md](…) — hoặc `Đây là kỳ đầu tiên` |
| Người lập | <QA Lead> (agent hỗ trợ) |
| Nguồn dữ liệu | <N> execution report · <N> retest report · <N> bug report · <nguồn khác> |
| Nội dung | Lập theo nội dung báo cáo tiến độ của ISTQB CTFL v4.0 mục 5.3.2 |

---

## 1. Tóm tắt kỳ

> ## 🟡 CÓ NGUY CƠ TRỄ
>
> <2–4 câu: đã làm được gì · vướng gì lớn nhất · cần ai quyết định gì>

---

## 2. Tiến độ so với kế hoạch

| Mốc | Hạn theo plan | Thực tế | Trạng thái | Bằng chứng |
|---|---|---|---|---|
| Hoàn tất viết & review TC | 29-09-2026 | 01-10-2026 | ⚠️ Trễ 2 ngày | Nhật ký thay đổi `TEST_CASES_CUSTOMERS_SUMMARY.md` |
| Bắt đầu thực thi | 30-09-2026 | 01-10-2026 | ⚠️ Trễ 1 ngày | `run_1790812345` |
| Code freeze | 24-10-2026 | — | 🟡 Có nguy cơ | Còn 142 TC chưa chạy · tốc độ kỳ này 18 TC/ngày · còn 7 ngày làm việc → cần 20,3 TC/ngày |

**Sai lệch đáng chú ý:** <mô tả sai lệch lớn nhất và nguyên nhân>

**Công sức** *(khi plan có ước lượng mục 7.2)*: thực tế <X> người-ngày / kế hoạch tới hết kỳ <Y> người-ngày → <chênh lệch>.

---

## 3. Chỉ số kiểm thử

### 3.1 Chuẩn bị testware

| Module × nền tảng | TC trong kỳ (mới / sửa) | TC luỹ kế | Đã review | Nguồn |
|---|---|---|---|---|

### 3.2 Thực thi manual

> Chưa bắt đầu: <liệt kê cặp module × nền tảng chưa có lần chạy nào — ĐỌC TRƯỚC các tỷ lệ bên dưới>

| Module × nền tảng | Chạy trong kỳ | Chưa chạy | ✅ PASS | ❌ FAIL | ⚠️ BLOCKED | ⏭️ SKIP | Pass rate | Nguồn |
|---|---|---|---|---|---|---|---|---|

> Pass rate = PASS / (PASS + FAIL + BLOCKED). Nhiều lần chạy trong kỳ → lấy lần mới nhất của mỗi TC. Chỉ tính lần chạy **bộ TC** — lần chạy checklist vào bảng dưới, **không** cộng vào đây (12 mục smoke không phải 12 TC).

**Checklist đã rà trong kỳ** *(báo riêng)*

| Checklist | Loại | Module × nền tảng | Số mục | ✅ PASS | ❌ FAIL | ⚠️ BLOCKED | ⏭️ SKIP | Nguồn |
|---|---|---|---|---|---|---|---|---|

### 3.3 Automation *(báo riêng, không cộng vào 3.2)*

| Suite | Số lần chạy trong kỳ | Lần gần nhất: PASS / FAIL | Nguồn |
|---|---|---|---|

### 3.4 Lỗi

| Severity | Mới trong kỳ | Fix & verify trong kỳ | Đang mở (luỹ kế) | Thay đổi so với kỳ trước |
|---|---|---|---|---|
| 🔴 Critical | | | | |
| 🟠 Major | | | | |
| 🟡 Minor | | | | |
| 🟢 Trivial | | | | |

**Regression phát sinh trong kỳ:** <số · bug nào sinh ra từ bản fix nào>

### 3.5 Độ phủ

| Chỉ số | Kỳ này | Kỳ trước | Nguồn |
|---|---|---|---|
| REQ trong phạm vi có ≥ 1 TC | | | |
| REQ Critical có TC PASS | | | |

### 3.6 Ảnh chụp tiêu chí exit — xu hướng giữa đợt

> ⚠️ **Chưa phải đánh giá kết thúc.** Bảng chỉ cho thấy khoảng cách còn lại tới ngưỡng. Kết luận release thuộc `/generate-test-summary-report` cuối đợt.

| # | Tiêu chí (theo plan 4.2) | Ngưỡng | Hiện tại | Khoảng cách | Xu hướng so với kỳ trước |
|---|---|---|---|---|---|

---

## 4. Trở ngại & Cách xử lý

| Trở ngại | Từ ngày | Thời lượng | Ảnh hưởng | Cách xử lý / workaround | Trạng thái |
|---|---|---|---|---|---|

---

## 5. Rủi ro mới & Thay đổi trong kỳ

| # | Rủi ro | Kỳ trước | Kỳ này | Diễn biến | Biện pháp |
|---|---|---|---|---|---|
| R1 (plan 8.1) | | 🟡 Theo dõi | 🔴 Đã xảy ra | | |
| R-mới-1 | | — | 🟡 Mới phát hiện | | |

**Trạng thái rủi ro:** 🟡 Theo dõi · 🔴 Đã xảy ra · 🟢 Đã giảm/đóng

---

## 6. Kế hoạch kỳ tới

| Việc | Module × nền tảng | Người | Hạn | Căn cứ |
|---|---|---|---|---|

**Đối chiếu kế hoạch kỳ này đã hứa** *(từ báo cáo kỳ trước)*: <N>/<M> việc hoàn thành · việc chưa xong: <…>

> Kế hoạch kỳ tới là **đề xuất** từ lịch plan + phần việc còn lại — QA Lead xác nhận.

---

## 7. Đề xuất điều chỉnh

| Đề xuất | Lý do (dẫn số liệu) | Ai quyết định | Cần sửa plan? |
|---|---|---|---|
| Ưu tiên chạy TC Priority High của `PRJ` trước | 🟡 nguy cơ trễ code freeze · mục 2 | QA Lead | Không |
| Lùi code freeze 2 ngày | Môi trường sập 1,5 ngày · mục 4 | PM | **Có** → `/generate-master-test-plan` cập nhật mục 7.1 |

> Đề xuất nào đụng phạm vi · lịch · nhân lực · tiêu chí → **phải** cập nhật plan bằng `/generate-master-test-plan`, không sửa ngầm trong báo cáo tiến độ.
```

---

## Quality Checklist

- [ ] Kỳ báo cáo có **từ ngày → đến ngày** và múi giờ
- [ ] Đủ 6 nội dung ISTQB CTFL v4.0 mục 5.3.2 (bảng *Chuẩn tham chiếu*)
- [ ] Mọi số có cột **nguồn**; số **trong kỳ** tách khỏi số **luỹ kế**
- [ ] Cặp module × nền tảng **chưa bắt đầu** nêu trước mọi tỷ lệ
- [ ] Manual và automation báo **riêng**
- [ ] Mỗi mốc ở mục 2 có **bằng chứng**; dự báo có **công thức**; kỳ đầu không dự báo
- [ ] Mục 3.6 có cảnh báo *chưa phải đánh giá kết thúc*; **không** có khuyến nghị go/no-go
- [ ] Trở ngại có **thời lượng** — không có số thì ghi `—`, không bịa
- [ ] Rủi ro plan 8.1 đều có trạng thái kỳ này
- [ ] Kế hoạch kỳ tới đối chiếu với **kế hoạch kỳ trước đã hứa**
- [ ] Đề xuất đụng tới plan ghi rõ **cần cập nhật plan**
- [ ] Không có credentials, URL có token, dữ liệu khách hàng thật

---

## Anti-Patterns (NGHIÊM CẤM)

| ❌ Sai | ✅ Đúng |
|---|---|
| Cộng dồn số từ đầu đợt rồi gọi là "kỳ này" | Tách cột trong kỳ và luỹ kế |
| "Đúng tiến độ" khi không có plan để so | Ghi *không có mốc kế hoạch để so*, chỉ báo số liệu |
| Dự báo "sẽ xong kịp" từ một ngày chạy | Kỳ đầu không dự báo; có dự báo thì ghi công thức |
| Khuyến nghị "có thể release" giữa đợt | Chỉ ảnh chụp xu hướng tiêu chí exit — kết luận để báo cáo tổng hợp |
| Giấu trở ngại vì "đã xử lý xong" | Vẫn ghi, kèm thời lượng — báo cáo tổng hợp cần số này cho mục Bài học |
| Sửa lịch/phạm vi ngay trong báo cáo tiến độ | Đề xuất ở mục 7, cập nhật plan bằng `/generate-master-test-plan` |
| Tính BLOCKED vào PASS | BLOCKED tách riêng, nêu lý do |

---

## Rules References

- Plan: `/generate-master-test-plan` — lịch 7.1, chỉ số 3.6, tiêu chí exit 4.2, rủi ro 8.1
- Báo cáo cuối đợt dùng lại các báo cáo tiến độ: `skills-test-summary-reporter` (mục *Yếu tố cản trở & Bài học* lấy thời lượng từ mục 4)
- Bug và Lịch sử retest theo template của `skills-bug-reporter`
