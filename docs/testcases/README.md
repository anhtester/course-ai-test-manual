# Danh mục Test Cases — Perfex CRM (Anh Tester Demo)

> **Điểm vào tầng test case.** Mọi workflow đụng tới `docs/testcases/` đọc file này **trước tiên**: module nào đã có TC · **dải TC ID nào đã bị chiếm** · mã kế tiếp · độ phủ so với requirements.

| Mục | Giá trị |
|---|---|
| Hệ thống | Perfex CRM — Anh Tester Demo (`https://crm.anhtester.com`) |
| Tiền tố TC ID | `CRM_` → `CRM_<MODULE>_TC_<3 số>` |
| Nguồn requirements | [`docs/requirements/README.md`](../requirements/README.md) |
| Môi trường | ⚠️ **Dùng chung** — TC phải chỉ đọc hoặc hoàn tác được; cấm thao tác phá huỷ dữ liệu nghiệp vụ |
| Ngày cập nhật | 24-09-2026 |

---

## 1. Danh mục module đã có test cases

| Module | Prefix TC ID | Dải đã dùng | Mã kế tiếp | Số TC | Nền tảng | Độ hạt | REQ bao phủ | Tài liệu | Cập nhật |
|---|---|---|---|---|---|---|---|---|---|
| Đăng nhập / Xác thực | `CRM_LOGIN_TC_` | `001` → `051` | `052` | 51 | Web 51 | GỘP | 40/40 REQ trong phạm vi | [TEST_CASES_LOGIN_SUMMARY.md](login/TEST_CASES_LOGIN_SUMMARY.md) | 19-09-2026 |
| Khách hàng | `CRM_CUST_TC_` | `001` → `129` | `130` | 129 | Web 129 | GỘP | 84/84 REQ | [TEST_CASES_CUSTOMERS_SUMMARY.md](customers/TEST_CASES_CUSTOMERS_SUMMARY.md) | 19-09-2026 |

### Namespace hệ thống khác

| Namespace | Hệ thống | Trạng thái |
|---|---|---|
| `_book-api/` | AnhTester Book Management (hệ thống thứ hai — Web · API · Android) | **522 TC** — `AUTH` 193 (`BK_AUTH_TC_001` → `193`) · `USER` 149 (`BK_USER_TC_001` → `149`) · `BOOK` 180 (`BK_BOOK_TC_001` → `180`) — danh mục riêng: [`_book-api/README.md`](_book-api/README.md) |


### Độ hạt test case của từng module

| Module | Độ hạt | Vì sao | Bản đối chiếu |
|---|---|---|---|
| `LOGIN` | **GỘP** | Biến thể cùng một trường nằm chung 1 TC dưới dạng Bảng biến thể — 51 TC (41 gốc + 9 bổ sung theo 4 vòng + 1 bổ sung theo `AMB-LOGIN-19`) · **71 biến thể** | Bản TÁCH 82 TC và bản 41 TC trước khi bổ sung: tra bằng git (thư mục `archive/` đã bỏ 19-09-2026 — tra bằng `git log -- docs/testcases/login/`) |
| `CUST` | **GỘP** | Sinh lần đầu ở độ hạt mặc định — 129 TC · **155 biến thể** · 74 mục bảng kiểm, 5 part (vượt ngưỡng 50) | — (chưa có bản TÁCH) |

> Chọn độ hạt ở **lượt sinh đầu tiên**: `/generate-testcases-from-requirements <đường dẫn> [GỘP|TÁCH]`. Mặc định `GỘP`. Đổi độ hạt sau khi đã có automation / execution report / RTM trỏ vào là **cấm** — xem mục **Độ Hạt Test Case** trong skill.

---

## 2. Độ phủ so với requirements

| Module | REQ có tài liệu | REQ trong phạm vi TC | REQ đã có ≥1 TC | Độ phủ | Ghi chú |
|---|---|---|---|---|---|
| `LOGIN` | 44 | 40 | 40 | **100%** | 4 REQ ngoài phạm vi theo quyết định PO 18-08-2026: `27`, `34`, `35`, `40` |
| `CUST` | 84 | 84 | 84 | **100%** | 2 REQ ⚪ (`81`, `82`) có TC `@AssumptionBased` · 2 REQ 🟡 (`42`, `43`) có TC thiết kế để FAIL |
| `PRJ` | 104 | — | 0 | 0% | Chưa sinh TC |

> Các module còn lại đã cấp prefix REQ nhưng **chưa recon requirements** — xem `docs/requirements/README.md`.

---

## 3. Cấu trúc thư mục chuẩn

```
docs/testcases/
├── README.md                                   ← FILE NÀY — danh mục toàn hệ thống
└── <module>/
    ├── TEST_CASES_<TÊN_MODULE>_SUMMARY.md                  ← INDEX — TÊN FILE BẤT BIẾN · Bản đồ tài liệu, KHÔNG chứa dòng TC
    ├── web/test_cases_<module>_web.md          ← TC chạy trên web (tương tự mobile/ · api/)
    ├── <nền-tảng>/parts/part_NN_<nền-tảng>_<slug>.md ← khi tách (>40 TC TÁCH · >50 TC GỘP)
    ├── impact/impact_plan_<TICKET-ID>.md       ← Mode DELTA — kế hoạch, trước khi duyệt
    ├── impact/delta_tc_<TICKET-ID>.md          ← Mode DELTA APPLY — TC đã sửa theo nền tảng, input của /update-automation-from-impact
    └── impact/automation_plan_<TICKET-ID>.md   ← /update-automation-from-impact — script đã sửa theo ticket
```

**Quy tắc bất biến:**

| Quy tắc | Lý do |
|---|---|
| Tên index **luôn** `TEST_CASES_<TÊN_MODULE>_SUMMARY.md` | `/execute-test-cases`, `/review-testcases`, `/generate-automation-from-testcases`, `/generate-traceability-matrix` đều đọc theo mẫu đường dẫn cố định |
| **KHÔNG** nhét số phiên bản vào tên index (`_v2`, `_new`, `_improved`) | Bản mới **thay thế** tại chỗ; bản cũ tra bằng **lịch sử git** — không có thư mục `archive/` |
| **KHÔNG đổi / đánh lại TC ID** khi cập nhật | TC ID là khoá nối sang `allure.label('testId', ...)`, cột TC ID của RTM, và execution report cũ |
| **KHÔNG xoá dòng TC** — chức năng gỡ thì gắn tag `@Deprecated` ở cột `Tags` + tiền tố `🗑️ Deprecated (<mã ticket>, <ngày>) —` ở `Test Scenario` | Xoá dòng làm script tương ứng thành orphan, không phát hiện được tự động |
| Module đã có TC mà requirements đổi → dùng **Mode DELTA** (`/update-testcases-from-impact`) | Chạy lại QUICK/FULL RBT là sinh bộ thứ hai, TC ID đánh lại từ `001` |
| Vượt ngưỡng thì tách `parts/`, cắt tại ranh giới nhóm chức năng — **>40 TC** ở độ hạt TÁCH, **>50 TC** ở độ hạt GỘP | Ngưỡng đếm theo số TC vì người review đọc lần lượt từng TC |

---

## 4. Kết quả thực thi

Kết quả chạy TC **không** nằm trong thư mục này — xem `docs/executions/`:

```
docs/executions/
├── test_summary_<mốc>_<timestamp>.md      ← báo cáo tổng hợp, cắt ngang mọi module
└── <module>/<nền-tảng>/                    ← web · mobile · api
    ├── run_<timestamp>/execution_report.md
    ├── retest_<timestamp>/retest_report.md
    └── analysis_<timestamp>.md
```

Xem nhanh bằng web viewer: `scripts/execution-viewer/bundle.html` (mở offline, không cần cài gì).

---

## 5. Quy trình sử dụng

| Tình huống | Workflow | Ghi chú |
|---|---|---|
| Module **chưa có** TC, requirements đã rõ | `/generate-testcases-from-requirements` | Mode QUICK — 1 lượt |
| Module phức tạp, cần đánh giá rủi ro + RTM | `/generate-testcases-manual-rbt` | Mode FULL RBT — 6 bước có checkpoint |
| Cần checklist tick tay (smoke / hotfix / release) | `/generate-checklist-test` | Không sinh steps chi tiết |
| **Requirements vừa đổi, bộ TC đã có** | `/update-testcases-from-impact` | Mode DELTA — sửa tại chỗ, giữ nguyên TC ID, APPLY ghi `impact/delta_tc_<TICKET-ID>.md` |
| **TC vừa đồng bộ, module đã có automation** | `/update-automation-from-impact` | Đọc `delta_tc_<TICKET-ID>.md`, sửa đúng script web · mobile · API bị ảnh hưởng |
| Chạy TC trên browser thật | `/execute-test-cases` | Xuất execution report vào `docs/executions/` |
| Review chất lượng TC | `/review-testcases` | Rubric 6 tiêu chí |
| Chuyển TC sang automation | `/generate-automation-from-testcases` | Map TC ID sang `allure.label('testId', ...)` |

---

## 6. Nhật ký danh mục

| Ngày | Thay đổi |
|---|---|
| 26-09-2026 | `_book-api/` · `USER` +42 TC Mobile (`BK_USER_TC_108` → `149`) · `BOOK` +45 TC Mobile (`BK_BOOK_TC_136` → `180`). Cập nhật dòng namespace (trước đó còn ghi số liệu `AUTH` 20-09-2026) — tổng **522 TC**. Chi tiết ở [`_book-api/README.md`](_book-api/README.md) |
| 24-09-2026 | Rà soát danh mục: bổ sung dòng nhật ký còn thiếu bên dưới (`TC_106` → `108`), cập nhật `Ngày cập nhật`. Không đổi TC nào |
| 20-09-2026 | `_book-api/` · `AUTH` tách `TC_069` · `TC_082` → thêm `BK_AUTH_TC_106` → `108`. API **50 TC**, module **108 TC** |
| 20-09-2026 | `_book-api/` · `AUTH` thêm **47 TC API** (`BK_AUTH_TC_059` → `105`) — module phủ 86/86 REQ |
| 20-09-2026 | Namespace **`_book-api/`** có bộ TC đầu tiên: module `AUTH` · Mobile (Android) · 58 TC · 95 biến thể (`BK_AUTH_TC_001` → `058`). Chi tiết ở danh mục riêng [`_book-api/README.md`](_book-api/README.md) |
| 19-09-2026 | **Quyết định PO.** `LOGIN`: `CRM_LOGIN_TC_039` trỏ sang `REQ-LOGIN-44` mới (ép HTTPS), thêm tiền đề tắt HTTPS-Upgrades của Chrome để tránh PASS giả — độ phủ **40/40**. `CUST`: `TC_119`, `TC_120` gỡ `@AssumptionBased` theo `AMB-CUST-14` ✅. Không thêm TC, TC ID giữ nguyên |
| 19-09-2026 | **`CUST` đồng bộ với DOM thật:** sửa tại chỗ 9 TC (TC ID giữ nguyên) và thêm `CRM_CUST_TC_129` cho `REQ-CUST-84` (khoá đổi tiền tệ khi đã có giao dịch) — 129 TC · 155 biến thể, phủ 84/84 REQ. **`LOGIN`:** `CRM_LOGIN_TC_024` mục 🔧`2` sửa theo kết quả đo — mã CSRF cố định trong phiên, gỡ `@NeedsVerify`; module hết vùng chưa có evidence |
| 19-09-2026 | **Sinh bộ TC module `CUST`** bằng `/generate-testcases-from-requirements` Mode QUICK, độ hạt GỘP, rủi ro Cao → độ sâu Đầy đủ — **128 TC · 153 biến thể**, 5 part ở `customers/web/parts/`, chiếm dải `CRM_CUST_TC_001` → `128`. Phủ 83/83 REQ. 2 TC thiết kế để FAIL (`TC_040` ← `REQ-CUST-43`, `TC_041` ← `REQ-CUST-42`) chờ mở bug · 49 TC `@NeedsVerify` · 5 xung đột tài liệu ↔ ảnh evidence ghi thành ASM, đề nghị cập nhật requirements |
| 19-09-2026 | **`LOGIN` chuyển sang tầng nền tảng + DELTA `adhoc_2026-09-19`.** 51 TC chuyển sang `login/web/test_cases_login_web.md` (1 file dù vượt ngưỡng 50 — quyết định user), index thành Bản đồ tài liệu. Thêm `CRM_LOGIN_TC_051` (gia hạn phiên, `AMB-LOGIN-19` ✅). `TC_026` + `TC_051` là `@PersonalOnly` — QA tự chạy, không qua `/execute-test-cases`. **Bỏ thư mục `archive/`** — bản cũ tra bằng git. Thêm cột `Nền tảng` vào bảng danh mục |
| 17-09-2026 | **Chuỗi delta nối xuống automation.** Delta TC List của Mode DELTA trước đây chỉ hiện trong chat và không có cột nền tảng, nên `/update-automation-from-impact` không nhận được đầu vào ở phiên sau và không biết TC thuộc web, app hay API. Từ nay mode APPLY ghi `impact/delta_tc_<TICKET-ID>.md` (cột Nền tảng · Vòng · Nhánh · dòng `⏸️` cho TC chưa sửa); `/update-automation-from-impact` đọc file này, tách theo nền tảng và ghi kế hoạch vào `impact/automation_plan_<TICKET-ID>.md`. Luật đã vào skill `skills-rbt-manual-testing` (Quality Gate DELTA #7 + anti-pattern) và 2 command. Module `LOGIN` chưa chạy DELTA nào nên không có file cần bổ sung |
| 11-09-2026 | **Bổ sung 9 TC cho bộ `LOGIN` (`TC_042`→`TC_050`) theo Bản Đồ Loại Kiểm Thử 4 Vòng** — `TC_001`→`TC_041` **giữ nguyên hoàn toàn**, execution report `run_1787215085` và 6 bug đang mở vẫn truy vết đúng. Chấm bảng 4 vòng lên bộ TC đang có phát hiện **6 nhánh trống hoặc nông** trong khi Bảng Đối Soát Coverage vẫn xanh 39/39 REQ: `V2 · UI Behavior` (trống) · `V2 · BVA` (trống) · `V2 · Validation` chưa đối soát đủ mục bảng Email/Password · `V3 · Logging` (chưa chấm) · `V4 · Compatibility` (trống) · `V4 · Responsive` (chỉ có TC_033). Recon thật chốt mốc **64 ký tự** cho phần trước `@` (RFC 5321) và xác nhận ô mật khẩu không chặn dán, không có nút hiện/ẩn. Bổ sung **Bảng Đối soát loại kiểm thử (4 vòng)** + **Bảng ISO/IEC 25010:2023** vào cuối tài liệu TC. ⚠️ Phát hiện của `TC_046` cho thấy ca của bug `BUG_login_1787226515_TC018` là **ranh giới chuẩn RFC, không phải lỗi** — đề nghị xem lại bug đó. Khung 4 vòng đã vào skill `skills-rbt-manual-testing` (tiêu chí 10 Self-Quality Gate) và 5 command |
| 20-08-2026 | **Viết lại ngôn ngữ kiểm chứng của bộ TC `LOGIN`** theo phản hồi người dùng: TC chứa quá nhiều kiểm chứng thuộc tính HTML mà tester không cần. Toàn bộ `document.*`, `checkValidity()`, `className`, `offsetParent`, selector CSS, mã HTTP và tab Network được gỡ khỏi phần chính; nội dung cấp kỹ thuật tách xuống dòng `🔧 Ghi chú kỹ thuật (cần DevTools)` và TC gắn tag `@TechCheck` (23/41 TC). **TC ID giữ nguyên `001`→`041`**, không cắt case nào, độ phủ vẫn 39/39 REQ. Luật gốc đã vào skill `skills-rbt-manual-testing` mục **Quy Tắc Ngôn Ngữ Kiểm Chứng** + tiêu chí 8 của Self-Quality Gate, và 2 command sinh TC — lần sinh sau không lặp lại lỗi này |
| 20-08-2026 | **Gộp lại bộ TC `LOGIN`: 82 TC → 41 TC** theo yêu cầu người dùng. Độ phủ REQ không đổi (39/39), không case nào bị bỏ — chỉ đổi cách trình bày sang Bảng biến thể. TC ID đánh lại từ `001` (chấp nhận được vì chưa có script / execution report / RTM nào trỏ vào). Bản TÁCH cũ lưu ở `login/archive/` (thư mục `archive/` đã bỏ 19-09-2026 — tra bằng `git log -- docs/testcases/login/`). Skill và 3 command đã bổ sung tuỳ chọn độ hạt **GỘP / TÁCH** |
| 20-08-2026 | Sinh bộ TC module `LOGIN` bằng `/generate-testcases-from-requirements` Mode QUICK — **82 TC**, 3 part, phủ 39/39 REQ trong phạm vi. Chiếm dải `CRM_LOGIN_TC_001` → `082`. 2 TC (`TC_036`, `TC_063`) **thiết kế để FAIL** theo `REQ-LOGIN-16` và `REQ-LOGIN-25` — chờ mở bug. 10 TC gắn `@NeedsVerify` chờ recon bổ sung |
| 20-08-2026 | Khởi tạo file danh mục. Chốt tiền tố TC ID `CRM_` cho toàn hệ thống, nhất quán với `docs/requirements/README.md` |
