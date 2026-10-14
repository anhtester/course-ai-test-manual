---
description: Retest bug đã được dev fix trên build mới — chấm FIXED/NOT_FIXED/PARTIAL, chạy regression quanh vùng fix, cập nhật lịch sử bug. Hỗ trợ 2 mode — RETEST (chỉ verify bug) và FULL (verify + regression).
skills:
  - skills-manual-test-executor
  - skills-bug-reporter
---

# Workflow: Retest Bug Đã Fix

> **BẮT BUỘC (MANDATORY SKILL):** Bạn PHẢI nạp và đọc kỹ **`skills-manual-test-executor`** (thứ tự thao tác browser, 4 trạng thái kết quả, quy tắc auto-skip, evidence) và **`skills-bug-reporter`** (template bug, mục **Lịch sử retest**, thang Severity/Priority) trước khi bắt đầu.

Workflow này đóng **vòng lặp cuối** của quy trình kiểm thử: dev báo đã fix → QA xác minh trên build mới → xác nhận đóng bug hoặc mở lại, **kèm regression quanh vùng vừa sửa**.

## ⚠️ Nguyên tắc thực thi

- **Tất cả output bằng Tiếng Việt**
- **KHÔNG chấm FIXED vì "không thấy lỗi nữa"** — phải chạy **đúng Steps to Reproduce trong bug report gốc**, không rút gọn, không đi đường khác
- **KHÔNG sửa bug report gốc** cho khớp hành vi mới — chỉ **thêm** mục Lịch sử retest. Nội dung gốc là bằng chứng lịch sử
- Fix xong mà sinh lỗi khác ở chỗ khác là chuyện **thường xuyên** — đó là lý do Mode FULL tồn tại, đừng bỏ qua vì "bug đã fix rồi"

## 2 Chế độ (Mode)

| Mode | Khi nào dùng | Phạm vi |
|---|---|---|
| **RETEST** | Bug nhỏ, fix cô lập (sai chính tả, lệch UI, đổi message) | Chỉ verify đúng bug đó |
| **FULL** (mặc định) | Mọi bug Severity 🔴 Critical / 🟠 Major, hoặc fix đụng logic dùng chung | Verify bug + regression quanh vùng fix |

> User không nói mode → chọn theo **Severity của bug**: Critical/Major → FULL · Minor/Trivial → RETEST. Ghi rõ đã chọn mode nào và vì sao.

---

## Bước 0: Thu thập đầu vào

| Cần có | Nguồn | Bắt buộc |
|---|---|---|
| Bug cần retest | File `docs/bugs/<module>/<nền-tảng>/BUG_*.md`, hoặc Jira key qua `/fetch-jira-requirements` | ✅ |
| **Build / version mới** | User cung cấp | ✅ |
| Môi trường + tài khoản | `.env` hoặc user | ✅ |
| Môi trường dùng chung? | User — bật quy tắc auto-skip của skill executor | ✅ |

⛔ **Chốt chặn — build phải khác build lúc log bug.** Đối chiếu cột `Build / Version` trong bug report gốc với build hiện tại:

| Tình huống | Xử lý |
|---|---|
| Build mới **khác** build lúc log bug | Chạy tiếp |
| Build **giống hệt** | ⛔ **DỪNG, báo user** — retest trên đúng build đã lỗi là vô nghĩa, kết quả chỉ tái hiện lại bug cũ |
| Bug gốc **không ghi build** | Cảnh báo user, hỏi xác nhận rồi mới chạy. Ghi vào report là "không đối chiếu được build" |

---

## Bước 1: Đọc bug gốc & dựng lại bối cảnh

Trích từ bug report gốc, **không diễn giải lại**:

1. **Steps to Reproduce** — chép nguyên văn, sẽ chạy đúng từng bước
2. **Expected Result** — đây là chuẩn chấm điểm, KHÔNG dùng cảm nhận cá nhân
3. **Actual Result** cũ — để so sánh hành vi trước/sau
4. **TC ID · REQ ID liên quan** — dùng cho Bước 3 (chọn phạm vi regression). Bug từ mục checklist ghi thêm **mã mục** (`CL-…-<nn>`) — mục không có TC thì REQ ID là neo duy nhất để chọn regression
5. **Test data đã dùng** — data cũ có thể đã bị xoá; cần data mới thì sinh theo quy tắc traceable (`CLAUDE.md` mục 7) và ghi rõ đã đổi

> Bug gốc **thiếu Steps to Reproduce hoặc thiếu Expected** → không retest được một cách khách quan. Báo user, đề nghị bổ sung bug report trước.

---

## Bước 2: Chạy lại đúng steps (verify bug)

Theo thứ tự thao tác browser bắt buộc của skill executor: `navigate → wait → snapshot → interact` (KHÔNG resize).

**Chạy đúng steps gốc, tối thiểu 2 lần** — fix "lúc được lúc không" là dấu hiệu fix chưa triệt để, phải phát hiện ở đây chứ không phải ở production.

### 4 trạng thái retest

| Trạng thái | Khi nào | Hành động tiếp |
|---|---|---|
| ✅ **FIXED** | Chạy đủ steps, Actual **khớp hoàn toàn** Expected trong bug gốc, lặp 2 lần đều vậy | Đề xuất đóng bug |
| ❌ **NOT_FIXED** | Lỗi cũ vẫn tái hiện | Mở lại bug — ghi Lịch sử retest, **KHÔNG** tạo bug mới trùng nội dung |
| 🟡 **PARTIAL** | Lỗi gốc hết, nhưng hành vi mới **vẫn lệch** Expected, hoặc chỉ hết ở một phần trường hợp | Ghi rõ phần nào hết / phần nào còn. Giữ bug ở trạng thái mở |
| ⚠️ **CANNOT_VERIFY** | Không dựng được pre-condition, môi trường lỗi, mất quyền, data gốc không còn | Ghi nguyên nhân chặn — **KHÔNG** chấm FIXED |

> **Quy tắc vàng:** không quan sát được kết quả → `CANNOT_VERIFY`, tuyệt đối không suy đoán "chắc fix rồi". Giống hệt quy tắc BLOCKED của skill executor.

**Evidence bắt buộc:** screenshot trạng thái sau khi chạy steps — cả khi FIXED. Ảnh FIXED chính là bằng chứng đóng bug.

---

## Bước 3: Regression quanh vùng fix (Mode FULL)

> Bỏ qua nếu Mode RETEST.

Fix là **thay đổi code** — mà mọi thay đổi code đều có thể làm hỏng thứ đang chạy tốt. Bước này giới hạn thiệt hại đó.

### Chọn phạm vi — theo thứ tự vòng tròn lan ra

| Vòng | Chọn gì | Nguồn tra |
|---|---|---|
| **1. Cùng REQ** | Mọi TC map về **cùng REQ ID** với bug | `docs/testcases/<module>/` hoặc RTM |
| **2. Cùng màn hình** | TC thao tác trên **cùng màn hình / cùng form** | File TC của module |
| **3. Luồng dùng chung** | Nếu fix đụng thành phần dùng chung (validate, phân quyền, search, export) → TC của **module khác** dùng cùng thành phần đó | `_discovery/system_map.md` mục phụ thuộc |

> Bug sinh từ **mục checklist** mà REQ của nó chưa có TC nào (RTM xếp 🟠) → vòng 1 không có TC để chọn: chạy lại **mục checklist gốc** (mã mục) như một đơn vị regression, và ghi vào mục Đề xuất của report *"REQ chỉ có checklist — nên sinh TC"*.

⚠️ **Phải có giới hạn.** Regression không phải chạy lại cả suite:

- **Trần mặc định: 15 TC.** Vượt → báo user, đề nghị chạy `/execute-test-cases` cho cả module thay vì nhét vào retest
- Vòng 3 chỉ mở khi fix **thực sự** đụng thành phần dùng chung — suy đoán "biết đâu ảnh hưởng" thì không mở
- Ghi rõ trong report: đã chọn bao nhiêu TC, theo vòng nào, **và cố ý bỏ những gì**

Chạy nhóm TC đã chọn theo đúng quy trình `skills-manual-test-executor` — chấm PASS/FAIL/BLOCKED/SKIPPED như bình thường.

🔴 **TC regression FAIL = regression do fix gây ra** → đây là **bug MỚI**, không phải bug cũ. Tạo bug riêng bằng `/create-bug-report`, ghi rõ ở mục Ghi chú: *"phát sinh sau khi fix BUG_xxx"*.

---

## Bước 4: Xuất Retest Report

File: `docs/executions/<module>/<nền-tảng>/retest_<timestamp>/retest_report.md` — `<nền-tảng>` lấy theo thư mục của bug (`docs/bugs/<module>/<nền-tảng>/`). Bug cũ nằm thẳng ở `docs/bugs/<module>/` → nền tảng lấy từ dòng `Môi trường` của bug
Evidence: `docs/executions/<module>/<nền-tảng>/retest_<timestamp>/evidence/`

```markdown
# Retest Report — <Module> · Build <version>

| Thông tin | Nội dung |
|---|---|
| Retest ID | retest_1785700456 |
| Mode | FULL (verify + regression) |
| Bug retest | BUG_customers_1785612000_TC011 |
| Build lúc log bug → Build retest | v2.4.1 → v2.4.3 |
| Môi trường | `<URL>` — Staging |
| Tài khoản | `<tài khoản test>` (`<role>`) |
| Người thực hiện | <tên tester> (agent hỗ trợ) |
| Thời gian | 12-08-2026 14:10 → 14:55 (45 phút) |
| Môi trường dùng chung? | Có — auto-skip TC phá huỷ đang BẬT |

## 1. Kết quả verify bug

| | |
|---|---|
| Bug | BUG_customers_1785612000_TC011 — Search chuỗi SQL injection làm trang báo lỗi cơ sở dữ liệu |
| Severity gốc | 🔴 Critical |
| TC / REQ liên quan | CRM_CUST_TC_011 · REQ-CUST-04 |
| **Kết quả** | ✅ **FIXED** |
| Expected (theo bug gốc) | Bảng hiển thị trạng thái "không có kết quả", trang không báo lỗi |
| Actual lần này | Bảng hiển thị "Không tìm thấy kết quả", không có thông báo lỗi |
| Số lần lặp | 2/2 đều đúng |
| Evidence | ![](evidence/BUG_customers_1785612000_TC011_retest_fixed.png) |

## 2. Regression quanh vùng fix

**Phạm vi đã chọn:** 8 TC — vòng 1 (cùng `REQ-CUST-04`): 5 TC · vòng 2 (cùng màn hình danh sách): 3 TC
**Cố ý bỏ:** TC export (vòng 3) — fix chỉ đụng tầng search, không đụng export

| TC ID | Test Scenario | Kết quả | Ghi chú |
|---|---|---|---|
| CRM_CUST_TC_009 | Search theo tên đầy đủ | ✅ PASS | — |
| CRM_CUST_TC_012 | Search ký tự đặc biệt `%` | ❌ FAIL | **Regression mới** — xem mục 3 |

| Trạng thái | Số lượng |
|---|---|
| ✅ PASS | 7 |
| ❌ FAIL | 1 |
| ⚠️ BLOCKED | 0 |
| ⏭️ SKIPPED | 0 |

## 3. Regression phát sinh do fix

### REG #1 — CRM_CUST_TC_012 · Search ký tự đặc biệt `%`

| | |
|---|---|
| Expected | Trả về danh sách khách hàng có tên chứa `%` |
| Actual | Trả về 0 kết quả với mọi từ khoá chứa `%` |
| Nghi ngờ nguyên nhân | Bộ lọc escape ký tự thêm khi fix SQL injection đã escape luôn wildcard hợp lệ |
| Bug mới | BUG_customers_1785700456_TC012 |
| Evidence | ![](evidence/CRM_CUST_TC_012_regression.png) |

## 4. Dữ liệu đã tạo & dọn dẹp

| Dữ liệu | ID | Nơi tạo | Đã xoá? |
|---|---|---|---|

## 5. Kết luận & đề xuất

| Bug | Trạng thái đề xuất | Lý do |
|---|---|---|
| BUG_customers_1785612000_TC011 | ✅ **Đóng** | Đã fix, verify 2/2 lần |
| BUG_customers_1785700456_TC012 | 🆕 **Mở mới** | Regression do chính bản fix trên gây ra |

- Fix giải quyết đúng lỗi gốc nhưng làm hỏng search wildcard — **cần fix bổ sung trước khi release**
- Đề nghị dev thu hẹp phạm vi escape, chỉ escape ký tự nguy hiểm thay vì escape toàn bộ
```

---

## Bước 5: Cập nhật bug report gốc

Thêm mục **Lịch sử retest** vào cuối file `docs/bugs/<module>/<nền-tảng>/BUG_*.md` (template ở `skills-bug-reporter`). **Thêm dòng mới lên đầu bảng**, không sửa nội dung cũ:

```markdown
## Lịch sử retest

| Ngày | Build | Kết quả | Retest report | Ghi chú |
|---|---|---|---|---|
| 12-08-2026 | v2.4.3 | ✅ FIXED | [retest_1785700456](../../../executions/customers/web/retest_1785700456/retest_report.md) | Kèm 1 regression mới: BUG_customers_1785700456_TC012 |
| 08-08-2026 | v2.4.2 | ❌ NOT_FIXED | [retest_1785350000](…) | Lỗi vẫn tái hiện 2/2 lần |
```

> Link retest report tính **tương đối từ file bug** `docs/bugs/<module>/<nền-tảng>/` → lùi 3 cấp về `docs/`: `../../../executions/<module>/<nền-tảng>/retest_<timestamp>/retest_report.md`. Bug cũ nằm thẳng ở `docs/bugs/<module>/` thì lùi 2 cấp.

**Đồng bộ cột `Trạng thái` ở danh mục `docs/bugs/README.md`** — sửa đúng dòng của bug (và thêm dòng cho bug regression mới), dùng từ khoá `scripts/bugs-viewer` nhận:

| Kết quả retest | Ghi vào cột `Trạng thái` |
|---|---|
| ✅ FIXED | `🟢 Đã đóng (retest <DD-MM-YYYY>)` |
| ❌ NOT_FIXED | `🔴 **Đang mở** — NOT_FIXED <DD-MM-YYYY>` |
| 🟡 PARTIAL | `🔴 **Đang mở** — PARTIAL <DD-MM-YYYY>` |
| ⚠️ CANNOT_VERIFY | `⚠️ Cần rà lại — CANNOT_VERIFY <DD-MM-YYYY>` |

Bỏ bước này thì danh mục vẫn báo bug đã FIXED là *Đang mở* — người đọc danh mục (hoặc bugs-viewer khi chỉ nạp danh mục) thấy sai trạng thái.

Bug **đẩy lên Jira** → cập nhật trạng thái tương ứng qua `skills-jira-integration`; **không** tự đóng ticket, chỉ chuyển sang trạng thái chờ xác nhận trừ khi user cho phép rõ ràng.

---

## Bàn giao

**Checklist trước khi báo xong:**

- [ ] Đã đối chiếu build mới ≠ build lúc log bug
- [ ] Chạy **đúng** Steps to Reproduce gốc, không rút gọn
- [ ] Lặp tối thiểu 2 lần, kết quả nhất quán (lệch nhau → ghi rõ, không làm tròn thành FIXED)
- [ ] Có screenshot **kể cả khi FIXED**
- [ ] Mode FULL: đã ghi rõ phạm vi regression đã chọn **và phần cố ý bỏ**
- [ ] TC regression FAIL đã tách thành **bug mới**, không gộp vào bug cũ
- [ ] Đã thêm dòng vào Lịch sử retest của bug gốc, **không** sửa nội dung gốc
- [ ] Đã cập nhật cột `Trạng thái` của bug trong `docs/bugs/README.md` khớp kết quả retest
- [ ] Dữ liệu test đã dọn (môi trường dùng chung)

**Báo cáo cho user:** kết quả từng bug (FIXED/NOT_FIXED/PARTIAL/CANNOT_VERIFY) · số regression phát hiện · bug đề xuất đóng · bug đề xuất mở mới · khuyến nghị có nên đưa fix này lên production không.

---

## Anti-Patterns (NGHIÊM CẤM)

| ❌ Sai | ✅ Đúng |
|---|---|
| Chấm FIXED vì "thử qua thấy ổn" | Chạy **đúng** steps gốc, đủ số lần, đối chiếu Expected gốc |
| Sửa Expected trong bug gốc cho khớp hành vi mới | Hành vi mới lệch Expected = `PARTIAL`, giữ bug mở |
| Gộp regression mới vào bug cũ rồi mở lại bug cũ | Regression là **bug mới** — tạo report riêng, link về bug gốc |
| Chạy lại cả suite cho "chắc ăn" | Regression có trần 15 TC; vượt thì dùng `/execute-test-cases` |
| Bỏ regression vì "chỉ sửa một dòng" | Một dòng vẫn đủ làm hỏng luồng khác — đó là lý do có Mode FULL |
| Retest trên đúng build đã log bug | Dừng, hỏi user build mới |

---

## Mối quan hệ với workflows khác

```
/execute-test-cases  ──FAIL──→  /create-bug-report  ──dev fix──→  /retest-fixed-bugs
                                        ↑                               │
                                        └────── regression mới ─────────┘
                                                                        │
                                                        ✅ FIXED hết ────┴──→  /generate-test-summary-report
```
