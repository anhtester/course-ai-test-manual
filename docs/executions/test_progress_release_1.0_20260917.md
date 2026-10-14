# Báo Cáo Tiến Độ Kiểm Thử — Perfex CRM · Release 1.0 · Kỳ 1

| | |
|---|---|
| Kỳ báo cáo | 17-09-2026 → 17-09-2026 (1 ngày làm việc) · múi giờ UTC+07:00 |
| Loại kỳ | **Kỳ mốc gốc (baseline), trước giai đoạn thực thi.** Plan lập ngày 17-09-2026 và chưa duyệt, thực thi bắt đầu 30-09-2026. Chọn kỳ này theo quyết định của QA Lead ngày 17-09-2026 |
| Mốc · Plan | Release 1.0 · [test_plan_release_1.0.md](../test-plans/test_plan_release_1.0.md) v1.1 (🟨 Draft, chưa duyệt) |
| Báo cáo kỳ trước | Đây là kỳ đầu tiên |
| Người lập | Anh Tester — QA Lead (agent hỗ trợ) |
| Nguồn dữ liệu | 1 execution report (`LOGIN`, 20-08-2026) · 0 retest report · 6 bug report · 1 bộ TC (`LOGIN`) · danh mục `docs/testcases/README.md` · `docs/bugs/README.md` · không có `traceability_matrix.md` · không có `reports/` |
| Nội dung | Lập theo nội dung báo cáo tiến độ của ISTQB CTFL v4.0 mục 5.3.2 |

---

## 1. Tóm tắt kỳ

> ## ⚪ KỲ MỐC GỐC — CHƯA ĐỦ CĂN CỨ KẾT LUẬN ĐÚNG HAY TRỄ TIẾN ĐỘ
>
> Kỳ này không có hoạt động kiểm thử nào: 0 TC mới, 0 lần chạy, 0 bug mới, 0 bug được fix. Hiện chưa có mốc nào 🔴 hoặc 🟡, nhưng **5/9 mốc của plan chưa có ngày** (duyệt plan, code freeze, release, báo cáo tổng hợp, tần suất báo cáo tiến độ) nên không thể kết luận "đúng tiến độ" (R10). Vướng lớn nhất là `CUST` và `PRJ` **chưa có TC nào** (0/178 REQ), trong khi hạn viết và review là trước 30-09-2026, tức còn 8 ngày làm việc (R1). **Cần QA Lead quyết:** duyệt plan và chốt ngày code freeze, release, tần suất báo cáo tiến độ trước 30-09-2026.

Mọi số **luỹ kế** trong báo cáo lấy từ lần chạy ngày 20-08-2026 trên **bản demo dùng chung**. Chúng chỉ là điểm xuất phát, **không** thay cho kết quả trên môi trường test riêng của đợt này (plan mục 3.5, R2).

---

## 2. Tiến độ so với kế hoạch

| Mốc | Hạn theo plan (7.1) | Thực tế | Trạng thái | Bằng chứng |
|---|---|---|---|---|
| Anh Tester duyệt plan | ❓ | — | ⚪ Không có hạn để so | Plan v1.1 ghi `🟨 Draft`, mục 10 chưa có chữ ký |
| Hoàn tất viết và review TC `CUST`, `PRJ` | Trước 30-09-2026 | 0 TC | ⏳ Chưa tới hạn · **chưa bắt đầu** | `docs/testcases/README.md`: không có dòng `CUST` hay `PRJ`, độ phủ 0/79 và 0/104. Kỳ đầu nên không dự báo được, xem ghi chú dưới bảng |
| Môi trường test sẵn sàng | 27-09-2026 | — | ⏳ Chưa tới hạn | Tiêu chí vào #2, #3, #9 đang `❓` (plan 4.1) |
| Smoke xác nhận môi trường | 28-09-2026 → 29-09-2026 | — | ⏳ Chưa tới hạn | Tiêu chí vào #10 đang `❓` |
| Bắt đầu thực thi | 30-09-2026 | — | ⏳ Chưa tới hạn | Tiêu chí vào: 2/10 ✅ · 3/10 🟨 · 5/10 ❓ (plan 4.1) |
| Báo cáo tiến độ | ❓ tần suất | Kỳ 1 lập 17-09-2026 | ⚪ Không có lịch để so | File này |
| Code freeze | ❓ | — | ⚪ Không có hạn để so | Plan 7.1 |
| Release | ❓ | — | ⚪ Không có hạn để so | Plan 7.1 |
| Báo cáo tổng hợp | ❓ | — | ⚪ Không có hạn để so | Plan 7.1 |

> **Vì sao mốc viết TC chưa chấm 🟡:** muốn chấm 🟡 phải có tốc độ viết TC của kỳ trước. Đây là kỳ đầu và tốc độ bằng 0 vì chưa bắt đầu, nên chưa tính được. Plan đã đánh giá khả năng xảy ra R1 là **Cao**. Báo cáo kỳ 2 phải đo **số REQ `CUST`/`PRJ` đã có TC mỗi ngày** rồi so với con số cần đạt: 178 REQ ÷ 8 ngày làm việc ≈ 22,3 REQ/ngày (cả viết lẫn review).

**Sai lệch đáng chú ý:** chưa có mốc nào qua hạn. Sai lệch chính nằm ở **chính plan**: 5 mốc chưa có ngày, và không có ước lượng công sức (7.2). Vì vậy các kỳ sau cũng không phát hiện sớm được trễ hạn hay thiếu người, trừ khi chốt các ô treo 8 và 9.

**Công sức:** — Plan chưa có ước lượng ở mục 7.2 (ô treo 9), nên không có gì để so.

---

## 3. Chỉ số kiểm thử

### 3.1 Chuẩn bị testware

| Module × nền tảng | TC trong kỳ (mới / sửa) | TC luỹ kế | Đã review | Nguồn |
|---|---|---|---|---|
| `LOGIN` × Web | 0 / 0 | 50 (70 biến thể) | — *không tìm thấy bằng chứng review qua `/review-testcases` trong Nhật ký thay đổi* | [`TEST_CASES_LOGIN_SUMMARY.md`](../testcases/login/TEST_CASES_LOGIN_SUMMARY.md) — Nhật ký thay đổi, dòng mới nhất 11-09-2026 |
| `CUST` × Web | 0 / 0 | **0** | — | [`docs/testcases/README.md`](../testcases/README.md) mục 2 |
| `PRJ` × Web | 0 / 0 | **0** | — | [`docs/testcases/README.md`](../testcases/README.md) mục 2 |

### 3.2 Thực thi manual

> **Chưa bắt đầu (đọc dòng này trước các tỷ lệ bên dưới):**
> - `CUST` × Web và `PRJ` × Web chưa có TC và chưa có lần chạy nào.
> - `LOGIN` × Web còn **9 TC** (`TC_042` → `TC_050`) chưa chạy lần nào.
> - **Chưa có lần chạy nào trên môi trường test riêng của đợt này.**

| Module × nền tảng | Chạy trong kỳ | Chưa chạy (luỹ kế) | ✅ PASS | ❌ FAIL | ⚠️ BLOCKED | ⏭️ SKIP | Pass rate | Nguồn |
|---|---|---|---|---|---|---|---|---|
| `LOGIN` × Web — **trong kỳ** | 0 | — | 0 | 0 | 0 | 0 | — | Không có `run_*` nào có epoch trong kỳ |
| `LOGIN` × Web — *luỹ kế, bản demo* | — | 9 | 32 | 6 | 2 | 1 | 80,0% (32/40) | [`run_1787215085`](login/web/run_1787215085/execution_report.md) — 20-08-2026 |
| `CUST` × Web | 0 | toàn bộ (chưa có TC) | — | — | — | — | — | — |
| `PRJ` × Web | 0 | toàn bộ (chưa có TC) | — | — | — | — | — | — |

> Pass rate = PASS / (PASS + FAIL + BLOCKED). BLOCKED ở dòng luỹ kế: `TC_014` (mật khẩu demo chỉ có chữ số, không đảo hoa/thường được) và `TC_034` (cần task đang bấm giờ, thuộc module `TASK`). Dòng SKIP: `TC_026` (`@Slow`, chờ 65 phút, bỏ theo yêu cầu người dùng).

### 3.3 Automation *(báo riêng, không cộng vào 3.2)*

| Suite | Số lần chạy trong kỳ | Lần gần nhất: PASS / FAIL | Nguồn |
|---|---|---|---|
| — | 0 | Không có dữ liệu. Repo chưa có project automation (R5) | Không có thư mục `reports/` |

### 3.4 Lỗi

| Severity | Mới trong kỳ | Fix & verify trong kỳ | Đang mở (luỹ kế) | Thay đổi so với kỳ trước |
|---|---|---|---|---|
| 🔴 Critical | 0 | 0 | 1 (`TC039`) | — |
| 🟠 Major | 0 | 0 | 0 | — |
| 🟡 Minor | 0 | 0 | 3 (`TC004` · `TC016` · `TC028`) | — |
| 🟢 Trivial | 0 | 0 | 2 (`TC018` · `TC029`) | — |

Nguồn: [`docs/bugs/README.md`](../bugs/README.md) mục 1 và tên file `BUG_login_*.md`. Epoch của cả 6 bug đều trước kỳ (02-08-2026 và 20-08-2026). Mục *Lịch sử retest* của cả 6 file không có dòng nào trong kỳ. **Chưa đối chiếu Jira**: plan chưa chốt nguồn chính (ô treo 12).

**Regression phát sinh trong kỳ:** 0. Không có retest report.

> Cả 6 bug được xác nhận trên **bản demo**. Plan (3.5 · R8) yêu cầu retest lại trên môi trường mới. `BUG_login_1787226515_TC018` có thể không phải lỗi.

### 3.5 Độ phủ

| Chỉ số | Kỳ này | Kỳ trước | Nguồn |
|---|---|---|---|
| REQ trong phạm vi có ≥ 1 TC | `LOGIN` 39/39 · `CUST` 0/78 · `PRJ` 0/100 → **39/217 (18,0%)** | — | [`docs/testcases/README.md`](../testcases/README.md) mục 2 · số REQ trong phạm vi theo plan 2.1 |
| REQ Critical có TC PASS | — Không có dữ liệu | — | Chưa có `traceability_matrix.md` |

> Mẫu số 217 dùng 78 REQ 🟢 của `CUST` và 100 REQ 🟢 của `PRJ` (plan 2.1). Chưa gồm 5 REQ ⚪ đang chờ quyết định đưa lại vào phạm vi (ô treo 3).

### 3.6 Ảnh chụp tiêu chí exit — xu hướng giữa đợt

> ⚠️ **Chưa phải đánh giá kết thúc.** Bảng chỉ cho thấy khoảng cách còn lại tới ngưỡng. Kết luận release thuộc `/generate-test-summary-report` cuối đợt.
>
> ⚠️ Các cột *Hiện tại* lấy từ lần chạy ngày 20-08-2026 trên **bản demo**, chỉ có `LOGIN`. Đây là điểm xuất phát, không phải kết quả của đợt Release 1.0.

| # | Tiêu chí (theo plan 4.2) | Ngưỡng | Hiện tại | Khoảng cách | Xu hướng so với kỳ trước |
|---|---|---|---|---|---|
| 1 | Bug **Critical** đang mở | 0 | 1 (`BUG_login_1785678750_TC039`) | Còn 1 | — |
| 2 | Bug **Major** đang mở | 0 | 0 | Đạt ngưỡng | — |
| 3 | Pass rate TC **Priority High** | ≥ 95% | `LOGIN`: Priority `High` 12/16 = 75,0% · Priority `Critical` 10/10 = 100% · gộp cả hai 22/26 = 84,6% | Thiếu 20,0 điểm (chỉ tính `High`) · thiếu 10,4 điểm (tính gộp) | — |
| 4 | Pass rate toàn bộ TC đã chạy | ≥ 90% | 80,0% (32/40) | Thiếu 10,0 điểm | — |
| 5 | Tỷ lệ **BLOCKED** | ≤ 5% | 5,0% (2/40) | Chạm ngưỡng | — |
| 6 | REQ Critical có ≥ 1 TC PASS | 100% | — Không có RTM | — | — |
| 7 | Cặp module × nền tảng đã có TC **và** đã chạy | 100% | 1/3 (33,3%): chỉ có `LOGIN` × Web | Còn 2 cặp | — |

> Pass rate theo priority lấy cột `Priority` trong [`TEST_CASES_LOGIN_SUMMARY.md`](../testcases/login/TEST_CASES_LOGIN_SUMMARY.md), ghép với cột trạng thái của `run_1787215085`. 4 TC Priority `High` bị FAIL là `TC_016` · `TC_028` · `TC_029` · `TC_039`, ứng với 4 bug đang mở. Plan chưa nói rõ tiêu chí #3 có tính cả TC Priority `Critical` hay không, nên bảng ghi cả hai cách. Nên làm rõ khi duyệt plan (mục 7).

---

## 4. Trở ngại & Cách xử lý

QA Lead xác nhận ngày 17-09-2026: ngoài những gì thấy trong file, kỳ này **không có** trở ngại nào khác.

| Trở ngại | Từ ngày | Thời lượng | Ảnh hưởng | Cách xử lý / workaround | Trạng thái |
|---|---|---|---|---|---|
| Chưa có môi trường test riêng. DEV cam kết bàn giao 27-09-2026 | 17-09-2026 (ngày lập plan) | Dự kiến tới 27-09-2026 | Chưa retest được 6 bug, chưa chạy được 9 TC mới của `LOGIN`, chưa kiểm chứng được `AMB-CUST-11` · `26` · `38` · `40` | Trong thời gian chờ, tập trung viết TC `CUST`/`PRJ`. DEV xác nhận lại mốc (R7) | 🟡 Đang chờ, **theo kế hoạch** |
| Plan chưa duyệt, còn 18 ô treo | 17-09-2026 | — | Tiêu chí exit "hiệu lực khi plan được duyệt". Báo cáo tiến độ không so được lịch và công sức | Chốt các ô treo 8 · 9 · 12 · 14 trước 30-09-2026 | 🟡 Đang mở |

> Hai dòng trên là **trạng thái đã có kế hoạch**, không phải sự cố. Ghi lại để báo cáo tổng hợp tính được thời gian chờ thực tế.

---

## 5. Rủi ro mới & Thay đổi trong kỳ

| # | Rủi ro | Kỳ trước | Kỳ này | Diễn biến | Biện pháp |
|---|---|---|---|---|---|
| R1 (plan 8.1) | Không kịp sinh và review TC `CUST`/`PRJ` trước 30-09-2026 | — | 🟡 Theo dõi | Còn 0/178 REQ có TC, 8 ngày làm việc (18-09-2026 → 29-09-2026). Cần ≈ 22,3 REQ/ngày (mục 2) | Lan và Huệ bắt đầu ngày 18-09-2026, review theo từng batch. Kỳ 2 đo tốc độ thực tế |
| R2 (plan 8.1) | Requirements khảo sát trên bản demo, còn đợt này chạy trên môi trường mới | — | 🟡 Theo dõi | Chưa có môi trường mới để so | Smoke 28-09-2026 → 29 |
| R3 (plan 8.1) | 10 AMB 🔴 của `CUST`/`PRJ` chưa có câu trả lời | — | 🟡 Theo dõi | Vẫn 10 🔴. Không có thay đổi trong `docs/requirements/README.md` | Gửi danh sách AMB cho PO ngay đầu kỳ 2 |
| R4 (plan 8.1) | Bug Critical `TC039` đang mở | — | 🟡 Theo dõi | Vẫn mở. Lần retest gần nhất (20-08-2026, bản demo) là `NOT_FIXED` | Retest ngay khi môi trường mới sẵn sàng |
| R5 (plan 8.1) | Chưa có project automation | — | 🟡 Theo dõi | Vẫn chưa có. Người phụ trách automation `❓` | Chỉ định người phụ trách (ô treo 7) |
| R6 (plan 8.1) | Jira và markdown lệch nhau | — | 🟡 Theo dõi | Chưa chốt nguồn chính. Báo cáo này chưa đối chiếu Jira | Chốt ô treo 12 |
| R7 (plan 8.1) | Môi trường sẵn sàng 27-09-2026 (Chủ nhật), chỉ còn 2 ngày làm việc trước ngày bắt đầu | — | 🟡 Theo dõi | Chưa có xác nhận mới từ DEV | DEV xác nhận lại mốc trong kỳ 2 |
| R8 (plan 8.1) | 6 bug xác nhận trên bản demo, `TC018` có thể không phải lỗi | — | 🟡 Theo dõi | Không đổi | Retest cả 6 bug trên môi trường mới |
| R9 (plan 8.1) | Tester `LOGIN` chưa chắc có kỹ năng DevTools | — | 🟡 Theo dõi | Chưa xác nhận (ô treo 16) | Xác nhận kỹ năng trước 30-09-2026 |
| R10 (plan 8.1) | Chưa có ngày code freeze, release và ước lượng công sức | — | 🔴 **Đã xảy ra** | Ngay kỳ 1, báo cáo này đã **không** kết luận được đúng hay trễ tiến độ, và không so được công sức (mục 1, mục 2) | Chốt ô treo 8 và 9 trước 30-09-2026 (mục 7) |

Kỳ này **không phát hiện rủi ro mới** ngoài register của plan.

**Trạng thái rủi ro:** 🟡 Theo dõi · 🔴 Đã xảy ra · 🟢 Đã giảm/đóng

---

## 6. Kế hoạch kỳ tới

> Plan chưa chốt tần suất báo cáo. Kỳ 2 **đề xuất** là 18-09-2026 → 25-09-2026 (thứ Sáu), để có một kỳ đo tốc độ viết TC trước khi môi trường sẵn sàng.

| Việc | Module × nền tảng | Người | Hạn | Căn cứ |
|---|---|---|---|---|
| Sinh TC theo RBT, review theo từng batch | `CUST` × Web | Lan | Trước 30-09-2026 | Plan 6 · 7.1 · R1 |
| Sinh TC theo RBT, review theo từng batch | `PRJ` × Web | Huệ | Trước 30-09-2026 | Plan 6 · 7.1 · R1 |
| Gửi 10 AMB 🔴 cho PO | `CUST` · `PRJ` | Anh Tester | ❓ | R3 |
| Duyệt plan, chốt ô treo 8 (lịch) · 9 (ước lượng) · 12 (nguồn chính) · 14 (người chấp nhận dừng) | Cả 3 | Anh Tester | Trước 30-09-2026 | R6 · R10 · plan 4.2 |
| Quyết định có đưa 5 REQ ⚪ trở lại phạm vi không (ô treo 3). Nếu có, khảo sát bổ sung **trước** khi sinh TC | `CUST` · `PRJ` | Anh Tester | Trước khi Lan/Huệ sinh TC vùng đó | Plan 2.1 |
| DEV xác nhận lại mốc môi trường 27-09-2026, tài khoản 3 vai trò và dữ liệu nền | Web | Đội DEV | ❓ | R7 · tiêu chí vào #2 · #3 |
| Chỉ định người phụ trách automation | Web | Anh Tester | ❓ | R5 · ô treo 7 |

**Đối chiếu kế hoạch kỳ này đã hứa:** — Đây là kỳ đầu tiên, chưa có báo cáo nào hứa việc cho kỳ này.

> Kế hoạch kỳ tới là **đề xuất** từ lịch plan và phần việc còn lại. QA Lead xác nhận.

---

## 7. Đề xuất điều chỉnh

| Đề xuất | Lý do (dẫn số liệu) | Ai quyết định | Cần sửa plan? |
|---|---|---|---|
| Chốt ngày code freeze, release, báo cáo tổng hợp và tần suất báo cáo tiến độ | 5/9 mốc chưa có ngày. R10 đã xảy ra ngay kỳ 1 (mục 2 · mục 5) | Anh Tester | **Có** → `/generate-master-test-plan` cập nhật mục 7.1 |
| Lập ước lượng công sức cho `CUST`/`PRJ` | Cần ≈ 22,3 REQ/ngày để kịp 30-09-2026, nhưng chưa có ước lượng để biết 2 tester có đủ năng lực không (mục 2 · R1) | Anh Tester + Lan · Huệ | **Có** → mục 7.2 |
| Làm rõ tiêu chí exit #3 có tính cả TC Priority `Critical` không | Bộ TC dùng 4 mức (`Critical` · `High` · `Medium` · `Low`). Hai cách tính cho ra 75,0% và 84,6% (mục 3.6) | Anh Tester | **Có** → mục 4.2 |
| Chốt nguồn chính khi Jira và markdown lệch nhau | Báo cáo này chưa đối chiếu được Jira (mục 3.4 · R6) | Anh Tester | **Có** → mục 5 |
| Nếu đến giữa kỳ 2 tốc độ viết TC thấp hơn ≈ 22,3 REQ/ngày: ưu tiên TC Priority High của `CUST` trước `PRJ`, phần còn lại ghi nợ kiểm thử | Biện pháp đã có ở R1. Thứ tự `CUST` → `PRJ` theo plan 3.2 | Anh Tester | Không. Đổi phạm vi mới phải sửa plan |

> Đề xuất nào đụng phạm vi · lịch · nhân lực · tiêu chí → **phải** cập nhật plan bằng `/generate-master-test-plan`, không sửa ngầm trong báo cáo tiến độ.
