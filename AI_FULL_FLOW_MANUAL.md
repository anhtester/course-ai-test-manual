# 🔄 AI Full Flow — Manual Testing

> Quy trình đầy đủ dùng AI cho **Manual Testing**, từ hệ thống chưa có gì → tài liệu → test cases → chạy tay → bug report → retest → ma trận truy vết → báo cáo release.
>
> Áp dụng cho tình huống phổ biến nhất: **hệ thống chỉ có UI, không tài liệu, không bộ test cases**.
>
> Hệ thống có thêm **app mobile** hoặc **API** → vẫn đúng các chặng này, mỗi nền tảng một command riêng — xem mục [Ba nền tảng](#ba-nền-tảng--web--mobile--api) ngay dưới.

---

## Toàn cảnh 8 chặng

```
┌─ CHUẨN BỊ TÀI LIỆU ──────────────────────────────────────────────┐
│  0. /discover-system                     → bản đồ module + prefix│  1 lần / hệ thống
│  1. /generate-requirements-from-website  → REQ ID (web)          │  N lần = số module
│     /generate-requirements-from-mobile   → REQ ID (app)          │  × số nền tảng
│     /generate-requirements-from-api      → REQ ID (API)          │
└──────────────────────────────────────────────────────────────────┘
                                  ↓
┌─ SINH & KIỂM TEST CASES ─────────────────────────────────────────┐
│  2. /generate-testcases-manual-rbt       → TC web · TC mobile    │  N lần = số module
│     /generate-testcases-api              → TC API                │
│  3. /review-testcases                    → chấm rubric, lấp gap  │
└──────────────────────────────────────────────────────────────────┘
                                  ↓
┌─ KẾ HOẠCH CHÍNH THỨC (tuỳ chọn) ─────────────────────────────────┐
│  ⊹ /generate-master-test-plan            → phạm vi + tiêu chí exit│  1 lần / đợt — khi PM/khách cần
└──────────────────────────────────────────────────────────────────┘
                                  ↓
┌─ THỰC THI & XỬ LÝ LỖI ───────────────────────────────────────────┐
│  4. /execute-test-cases                  → chạy tay (web)        │  Mỗi đợt kiểm thử
│  5. /analyze-test-report                 → gom nhóm root cause   │
│     /create-bug-report                   → bug report chuẩn      │
│     /retest-fixed-bugs   ←──── dev fix ───┘  → FIXED? regression?│  ↻ lặp tới khi hết bug
│  ⊹ /generate-test-progress-report        → tiến độ kỳ này        │  Hằng tuần — khi có plan chính thức
└──────────────────────────────────────────────────────────────────┘
                                  ↓
┌─ CHỨNG MINH ĐỘ PHỦ ──────────────────────────────────────────────┐
│  6. /generate-traceability-matrix        → RTM                   │  Trước release
└──────────────────────────────────────────────────────────────────┘
                                  ↓
┌─ BÁO CÁO & QUYẾT ĐỊNH ───────────────────────────────────────────┐
│  7. /generate-test-summary-report        → báo cáo tổng kết đợt  │  Mỗi mốc release
│                                            + có nên release không│
└──────────────────────────────────────────────────────────────────┘
```

> 📋 **Bước ⊹ chỉ chạy khi đợt kiểm thử cần kế hoạch chính thức** (khách hàng/PM yêu cầu tài liệu duyệt). Nó công bố phạm vi và tiêu chí exit **trước chặng 4**, chặng 7 chấm lại đúng bộ đó — xem mục [Kế hoạch kiểm thử chính thức](#kế-hoạch-kiểm-thử-chính-thức--trước-chặng-4-tuỳ-chọn).

**Mắt xích giữ cả chuỗi là `REQ ID`.** Chặng 1 sinh ra → chặng 2 ghi vào cột `REQ ID` của mỗi TC → chặng 6 dùng để tính coverage. Đứt ở đâu thì từ đó trở đi không chứng minh được "đã test đủ".

---

## Ba nền tảng — Web · Mobile · API

Khám phá **một lần** cho cả hệ thống, sau đó mỗi module chạy command của **từng nền tảng** nó có. Đầu ra tự vào tầng `web/` · `mobile/` · `api/` của **cùng** thư mục module — chung prefix, chung dải REQ ID và TC ID (CLAUDE.md mục 6b).

| Chặng | Web | Mobile (Android / iOS) | API |
|---|---|---|---|
| 0 · Khám phá | `/discover-system` | `/discover-system` | `/discover-system` |
| 1 · Requirements | `/generate-requirements-from-website` | `/generate-requirements-from-mobile` | `/generate-requirements-from-api` |
| 2 · Test cases | `/generate-testcases-manual-rbt` | `/generate-testcases-manual-rbt` — TC gắn `@Android` / `@iOS` | `/generate-testcases-api` |
| 3 · Review TC | `/review-testcases` | `/review-testcases` | `/review-testcases` |
| 4 · Chạy tay | `/execute-test-cases` | ⚠️ chưa có — chạy bằng automation | ⚠️ chưa có — chạy bằng automation |
| 5 · Bug · retest | `/create-bug-report` · `/retest-fixed-bugs` | `/create-bug-report` (retest ⚠️ chưa có) | `/create-bug-report` (retest ⚠️ chưa có) |
| 6–7 · RTM · báo cáo | `/generate-traceability-matrix` · `/generate-test-summary-report` — gộp mọi nền tảng, độ phủ tính riêng từng nền tảng | ← | ← |

> **Thứ tự nên chạy ở chặng 1:** web → mobile → API. Mặt có giao diện cho tên nghiệp vụ; lượt sau đối chiếu với REQ đã có — rule chạy giống nhau thì REQ được chuyển lên index `REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` (giữ nguyên mã), rule chạy khác thì tách REQ riêng kèm `AMB` hỏi PO.

---

## Chặng 0 — Khám phá hệ thống

> **Chạy 1 lần cho cả hệ thống.** Trả lời câu hỏi: *"hệ thống này có những module nào?"*

```
/discover-system
```

📋 Prompt mẫu: [`prompts/prompt_00_discover_system.txt`](prompts/prompt_00_discover_system.txt)

**Cần chuẩn bị:** URL web · file app hoặc package id + thiết bị (nếu có app) · URL/file tài liệu API — Swagger, Scalar, Postman, `.docx` (nếu có API) · tài khoản (càng nhiều role càng tốt) · tài liệu sẵn có nếu QA đưa được · môi trường có dùng chung không · QA có được gọi API trực tiếp không.

**AI tự chọn mode** — bạn không cần khai:

| Đầu vào | Mode |
|---|---|
| URL, không tài liệu | **UI** |
| URL + tài liệu (kể cả chỉ một phần) | **HYBRID** |
| Chưa có account, chỉ có tài liệu | **DOC** |

AI tự nhận luôn hệ thống có **mấy mặt** (web · app · API) từ những gì bạn đưa, và công bố cả mode lẫn mặt ở câu đầu tiên — sai thì chặn ngay lúc đó.

**⏸️ Checkpoint** — AI dừng, hỏi 3 câu. Câu quan trọng nhất: *"có module nào tôi không thấy được vì thiếu quyền / nằm sâu trong menu / chỉ vào được bằng URL?"* — trả lời ở đây rẻ hơn nhiều so với bổ sung sau.

**Đầu ra:**
```
docs/requirements/README.md                    ← danh mục, mọi module đang ⬜
docs/requirements/_discovery/system_map.md     ← bản đồ web + app (tách modules/ nếu > 8 module)
docs/requirements/_discovery/api_map.md        ← bản đồ API — khi có spec
docs/requirements/_discovery/doc_inventory.md  ← chỉ khi có tài liệu
```

> ⚠️ Chặng này **không sinh REQ ID**, chỉ cấp **prefix** (`CUST`, `PRJ`…). Cấp số REQ khi chưa mở form là chắc chắn phải đánh lại.

**Phát hiện sót module về sau:** nói thẳng *"còn thiếu module Báo cáo, vào bằng `/admin/reports`"* → AI chạy **mode ADD**, chỉ xử lý module đó. Hệ thống đã có bản đồ, nay mới có app hoặc Swagger → *"hệ thống còn có app mobile"* → cũng **mode ADD**, chỉ khám phá mặt mới, giữ nguyên prefix. Muốn rà lại toàn bộ → *"rà lại xem có gì mới"* → **mode DELTA**.

---

## Chặng 1 — Sinh Requirements

> **Chạy lặp, mỗi lần một module × một nền tảng**, theo thứ tự đã chốt ở chặng 0.

```
/generate-requirements-from-website
```

📋 Prompt mẫu: [`prompts/prompt_01_generate_requirements.txt`](prompts/prompt_01_generate_requirements.txt)

| Biến thể | Command | Prompt mẫu |
|---|---|---|
| Module là **app mobile** (hoặc thêm mặt app cho module web đã có) | `/generate-requirements-from-mobile` — mỗi nền tảng một lượt, ghi vào `<module>/mobile/`, chung dải REQ với web | [`prompt_30`](prompts/prompt_30_generate_requirements_from_mobile.txt) |
| Module có **mặt API** — Swagger / Scalar / Postman / tài liệu API `.docx` | `/generate-requirements-from-api` — ghi vào `<module>/api/`, chung prefix và dải REQ với web | [`prompt_29`](prompts/prompt_29_generate_requirements_from_api.txt) |
| Có ticket Jira thay vì UI | `/analyze-requirement-document` | [`prompt_20`](prompts/prompt_20_analyze_requirement_document.txt) |
| Tài liệu đã có, ticket sửa đổi | `/update-requirements-from-ticket` | [`prompt_21`](prompts/prompt_21_update_requirements_from_ticket.txt) |
| Tài liệu vừa đổi, **bộ TC đã có cần đồng bộ** | `/update-testcases-from-impact` | [`prompt_27`](prompts/prompt_27_update_testcases_from_impact.txt) |

**AI làm gì:** đọc bản đồ chặng 0 (khỏi dò đường) → mở từng form → **trigger từng validation lấy message nguyên văn** → đọc DOM bằng `browser_evaluate` → bắt network lấy validation server-side → chụp evidence full-page → sinh `REQ-<PREFIX>-NN`.

**Đầu ra:**
```
docs/requirements/<module>/REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md          ← INDEX, tên file BẤT BIẾN — REQ dùng chung · Bản đồ tài liệu
docs/requirements/<module>/web/requirements_<module>_web.md   ← REQ chỉ áp web
docs/requirements/<module>/web/evidence/*.png
  (app mobile → mobile/ · API → api/ — cùng thư mục module, chung dải REQ)
```
Cộng thêm: `README.md` cập nhật `Trạng thái recon` ⬜ → ✅.

**Xong module này thì lặp lại cho module kế tiếp.** Cột `Trạng thái recon` xanh hết = khảo sát xong hệ thống.

### Kiểm trước khi sang chặng 2

- [ ] Mọi yêu cầu đều có `REQ ID`, cột `Nguồn` không để trống
- [ ] Error message ghi **nguyên văn** từ UI, không diễn đạt lại
- [ ] Evidence chụp **full-page**, có ảnh cho từng trạng thái động (dropdown mở, form lỗi, từng tab)
- [ ] Ma trận phân quyền có **dòng tổng** `Đã kiểm chứng / Suy diễn / Chưa rõ`
- [ ] Ambiguity 🔴 High đã gửi PO — hoặc đã ghi **Assumption tạm** để test tiếp được

---

## Chặng 2 — Sinh Test Cases

> **Chạy lặp, mỗi lần một module.** Chọn đúng 1 trong 3 mode.

| Mode | Command | Prompt mẫu | Khi nào dùng |
|---|---|---|---|
| **FULL RBT** | `/generate-testcases-manual-rbt` | [`prompt_02_generate_test_cases.txt`](prompts/prompt_02_generate_test_cases.txt) | Module lớn · requirements còn mơ hồ · cần đánh giá risk · **bộ TC gốc của module** |
| **QUICK** | `/generate-testcases-from-requirements` | [`prompt_22_generate_testcases_quick.txt`](prompts/prompt_22_generate_testcases_quick.txt) | Requirements đã rõ · scope 1 form / 1 tính năng · cần nhanh |
| **CHECKLIST** | `/generate-checklist-test` | [`prompt_15_generate_checklist.txt`](prompts/prompt_15_generate_checklist.txt) | Rà tay nhanh: smoke · sau hotfix · trước release |

**Đầu ra tương ứng:** FULL RBT / QUICK → TC chi tiết có steps. CHECKLIST → danh sách tick, **không** có steps.

**Theo nền tảng:**
- **Web · Mobile** — cùng 3 mode trên. REQ dùng chung sinh **mỗi nền tảng một TC**, cùng `REQ ID`; TC mobile gắn tag `@Android` / `@iOS`
- **API** — dùng `/generate-testcases-api` ([`prompt_09`](prompts/prompt_09_generate_api_tests.txt)): tự nhận nguồn URL hay file, kiểm chứng gọi thật, đủ 12 status code + OWASP, ghi vào `<module>/api/`

**Ranh giới:** cần **bộ TC lưu trữ / import Jira / giao cho automation** → QUICK hoặc FULL RBT. Cần **tick tay cho nhanh** → CHECKLIST.

💡 **Khuyến nghị:** module đầu tiên của hệ thống làm bằng **FULL RBT** — nó ép trả lời những câu hỏi nghiệp vụ mà sau này kiểu gì cũng phải hỏi. Các module tương tự sau đó dùng QUICK cho nhanh.

**Quy tắc AI bắt buộc tuân thủ ở chặng này:**
- **Mở toàn bộ evidence của nền tảng đang sinh TC** (`<module>/<nền-tảng>/evidence/`) trước khi viết TC — không đọc ảnh mà viết là bịa
- **Ảnh thắng tài liệu** khi hai bên mâu thuẫn
- Evidence thiếu/cắt cụt → TC bị gắn `@NeedsVerify`, **không suy diễn**
- **Write-first** — ghi thẳng vào file, không in cả bảng TC ra chat

**Đầu ra:**
```
docs/testcases/<module>/TEST_CASES_<TÊN_MODULE>_SUMMARY.md               ← INDEX, tên file BẤT BIẾN — tổng hợp · Bản đồ tài liệu · coverage
docs/testcases/<module>/<nền-tảng>/test_cases_<module>_<nền-tảng>.md   ← TC của từng nền tảng: web · mobile · api
docs/testcases/<module>/<nền-tảng>/parts/part_NN_<nền-tảng>_<slug>.md  ← khi file nền tảng > 40 TC (TÁCH) · > 50 TC (GỘP)
docs/checklists/<module>/<nền-tảng>/checklist_<loại>_<YYYYMMDD>.md ← nếu chạy mode CHECKLIST (post-hotfix: checklist_post-hotfix_<TICKET-ID>.md · release: docs/checklists/_release/<nền-tảng>/checklist_release_<mốc>.md)
```

Checklist mang **`Mã checklist`** ở header (`CL-smoke_20261009`) — các chặng sau dựa vào mã này để không nhầm mục `#3` của checklist này với mục `#3` của checklist khác. Đi tiếp thế nào: xem [Luồng checklist](#luồng-checklist--từ-rà-nhanh-tới-báo-cáo-release).

---

## Chặng 3 — Review Test Cases

```
/review-testcases
```

📋 Prompt mẫu: [`prompts/prompt_12_review_testcases.txt`](prompts/prompt_12_review_testcases.txt)

| Mode | Làm gì |
|---|---|
| **REVIEW** (mặc định) | Chấm rubric 6 tiêu chí, chỉ ra TC mơ hồ / trùng lặp / thiếu negative-boundary / coverage gap |
| **FIX** | Như trên + **sửa tại chỗ** các TC bạn duyệt, giữ TC ID, ghi Nhật ký có mốc git — **không** sinh bản sao `_improved` |
| **AUTOMATION** | Chấm độc lập từng TC `Yes` / `Partial` / `No` theo bảng tiêu chí automation, kèm căn cứ trích từ TC · gom **điều kiện cần xin dev** (OTP cố định, hộp thư test, sandbox…) · chỉ ra TC đang gắn sai cột `Automation`. Nhận cả file Excel khách gửi không có cột này |

Nói *"sửa luôn"* / *"cải thiện giùm"* → AI tự chuyển sang **FIX**. Nói *"case nào automate được"* → **AUTOMATION**.

> Chặng này hay bị bỏ qua. Nhưng review 30 phút rẻ hơn nhiều so với chạy tay 50 TC rồi mới phát hiện một nửa viết sai.

> 🤖 **Muốn automate bộ TC này?** Chạy `/review-testcases` Mode **AUTOMATION** trước để biết TC nào làm được và cần xin dev điều kiện gì. Đây là điểm rẽ — bộ TC đã review xong là **đầu vào của** [`AI_FULL_FLOW_AUTOMATION.md`](AI_FULL_FLOW_AUTOMATION.md). Hai flow chạy song song được: automation lo phần regression lặp lại, manual lo phần còn lại.

---

## Kế hoạch kiểm thử chính thức — trước chặng 4 (tuỳ chọn)

```
/generate-master-test-plan
```

📋 Prompt mẫu: [`prompts/prompt_25_generate_master_test_plan.txt`](prompts/prompt_25_generate_master_test_plan.txt)

📝 Phiếu cần điền: [`plans/master-test-plan/test_plan.config.yaml`](plans/master-test-plan/test_plan.config.yaml) — tên ô tiếng Việt, chú thích ghi sẵn giá trị hợp lệ và ô nào bắt buộc

Sinh **Master Test Plan** — tài liệu quản lý để PM/khách hàng **duyệt trước** khi bắt đầu chạy test: kiểm soát tài liệu · mục tiêu & cơ sở kiểm thử · phạm vi · cấp độ, loại, mức độc lập kiểm thử · **kiểm thử phi chức năng** · **chiến lược tự động hoá** · tiêu chí vào/ra · môi trường · **dữ liệu kiểm thử** · **quản lý lỗi** (quy trình, Severity/Priority, thời hạn xử lý) · nhân lực · lịch · **ước lượng công sức & ngân sách** · rủi ro dự án và sản phẩm. Bám cấu trúc ISO/IEC/IEEE 29119-3 và phủ đủ nội dung điển hình của test plan theo **ISTQB CTFL v4.0 mục 5.1.1**. **Không** sinh test scenario, **không** sinh TC.

| Có cần chạy không? | |
|---|---|
| ✅ **Cần** | Khách hàng/PM yêu cầu tài liệu kế hoạch để ký · dự án outsourcing, nghiệm thu hợp đồng · đợt release lớn nhiều module, nhiều người |
| ➖ **Bỏ qua được** | Sprint nội bộ nhỏ, không ai yêu cầu tài liệu duyệt — chặng 7 vẫn chạy được với bộ tiêu chí exit mặc định |
| ❌ **Nhầm workflow** | Muốn biết *"test cái gì, kịch bản nào"* → `/generate-application-test-plan` · *"hệ thống có module nào"* → `/discover-system` |

**Ai cung cấp gì:**

| AI tự lấy từ `docs/` — **không cần khai** | Bạn điền vào `test_plan.config.yaml` — AI không tự biết |
|---|---|
| Danh sách module · nền tảng · số REQ/TC · lần chạy đã có | **Mốc** · module × nền tảng trong đợt · mục tiêu |
| Môi trường đã khảo sát · năng lực kiểm thử của QA | **Ngoài phạm vi bổ sung** + ai chịu trách nhiệm |
| Vùng đã loại khỏi phạm vi (`system_map.md`, bảng ISO 25010, REQ ⚪) | Cấp độ kiểm thử · mức độc lập · loại test · cách chạy TC mobile/API · **ngưỡng phi chức năng** · **chiến lược tự động hoá** |
| Bug đang mở · AMB 🔴 còn treo · rủi ro sản phẩm `RISK-<MODULE>-xx` | **Lịch** · **ước lượng công sức** · **ngân sách** · **nhân lực** |
| Bài học và thời lượng thực tế của báo cáo mốc trước · thang Severity/Priority mặc định | Môi trường · **dữ liệu kiểm thử** đợt này · công cụ · **quy trình lỗi, người phân loại, thời hạn xử lý** · bên liên quan · người review, người duyệt · Test Policy/Strategy tổ chức |

Không muốn điền phiếu → gọi lệnh kèm tên mốc, AI **hỏi một lượt** theo đúng các nhóm của phiếu rồi tự ghi vào `test_plan.config.yaml`. Ô nào bạn chưa có thông tin → AI để `❓` và liệt kê ở **đầu tài liệu**, **không** bịa ngày hay tên người.

**Đầu ra:**
```
docs/test-plans/test_plan_<mốc>.md             ← plan (VD test_plan_release_2.0.md)
docs/test-plans/test_plan_<mốc>.input.yaml      ← bản lưu phiếu đã dùng — để lần cập nhật sau so được đổi gì
```

### ⚠️ Bốn luật của bước này

**1. Mục "Ngoài phạm vi" không được trống.** Có sự cố production, câu hỏi đầu tiên luôn là *"sao QA không test cái này?"* — plan đã ghi rõ thì đó là quyết định được thống nhất, không phải QA bỏ sót.

**2. PM duyệt plan TRƯỚC chặng 4.** Chưa đạt tiêu chí vào (build, tài khoản đủ role, môi trường, TC đã review) thì chưa chạy — chạy sớm là BLOCKED tràn lan, phải chạy lại.

**3. Báo cáo tiến độ và chặng 7 dùng cùng tên mốc.** `/generate-test-progress-report` theo dõi lịch của plan mỗi kỳ; `/generate-test-summary-report` tự tìm `test_plan_<mốc>.md` và chấm lại đúng bộ tiêu chí exit đã công bố, không hỏi lại.

**4. Phạm vi/lịch đổi giữa đợt → sửa `test_plan.config.yaml` rồi gọi lại workflow, KHÔNG xoá plan viết lại.** AI tăng phiên bản, sửa đúng mục đổi, ghi Lịch sử thay đổi, đưa về trạng thái chờ duyệt. Đổi tiêu chí exit sau khi đã chạy test sẽ bị nêu ra ở báo cáo tổng hợp.

---

## Báo cáo tiến độ — trong suốt chặng 4–6 (khi có plan chính thức)

```
/generate-test-progress-report
```

📋 Prompt mẫu: [`prompts/prompt_32_generate_test_progress_report.txt`](prompts/prompt_32_generate_test_progress_report.txt)

Mỗi kỳ (thường hằng tuần) trả lời: **kỳ này làm được gì · có kịp mốc trong plan không · đang vướng gì · kỳ tới làm gì**. Nội dung bám ISTQB CTFL v4.0 mục 5.3.2: kỳ báo cáo · tiến độ so với kế hoạch · trở ngại & cách xử lý · chỉ số · rủi ro mới · kế hoạch kỳ tới — thêm mục **đề xuất điều chỉnh** cho người quản lý.

| So với | Khác ở đâu |
|---|---|
| `/analyze-test-report` | Kia phân tích **một lần chạy** fail vì sao — đây gộp **cả kỳ** và so với lịch |
| `/generate-test-summary-report` (chặng 7) | Kia kết luận **có nên release không** cuối đợt — đây **không** khuyến nghị release, chỉ đề xuất điều chỉnh giữa đợt |

**Đầu ra:** `docs/executions/test_progress_<mốc>_<YYYYMMDD>.md` — ngày cuối kỳ.

### ⚠️ Ba luật của bước này

**1. Không có plan thì không kết luận "trễ" hay "đúng hạn".** Báo cáo vẫn có số liệu, nhưng không có mốc để so.

**2. Số trong kỳ tách khỏi số luỹ kế.** Trộn hai loại là tuần nào cũng thấy "tăng mạnh".

**3. Cần đổi lịch/phạm vi → chỉ đề xuất trong báo cáo, cập nhật plan bằng `/generate-master-test-plan`.** Sửa ngầm trong báo cáo tiến độ là mất dấu thứ đã được duyệt.

---

## Chặng 4 — Thực thi Manual

```
/execute-test-cases
```

📋 Prompt mẫu: [`prompts/prompt_16_execute_test_cases.txt`](prompts/prompt_16_execute_test_cases.txt)

**AI làm gì:** mở browser thật qua Playwright MCP → chạy từng bước theo TC → đối chiếu Expected vs Actual → chấm **PASS / FAIL / BLOCKED / SKIPPED** → thu evidence.

> ⚠️ **Chặng này chỉ chạy được TC web.** Đưa file index thì AI chỉ lấy file `web/`. TC `@Android` / `@iOS` / `@API` hiện chưa có workflow chạy tay — chạy bằng automation ([`AI_FULL_FLOW_AUTOMATION.md`](AI_FULL_FLOW_AUTOMATION.md) chặng 1).

**Đầu ra:**
```
docs/executions/<module>/web/run_<timestamp>/execution_report.md
docs/executions/<module>/web/run_<timestamp>/evidence/<TC_ID>_<mô_tả>.png
  (mỗi lần chạy thuộc đúng một nền tảng — chạy trên trình duyệt nên là web/)
docs/executions/_release/web/run_<timestamp>/execution_report.md    ← khi chạy checklist Release-readiness
```

Header report có ô **`Loại nguồn`** — `Bộ TC` hay `Checklist <loại>`. Chạy checklist thì cột `TC ID` ghi **mã mục** `CL-smoke_20261009-03`, không ghi `#3`.

Report gồm 6 mục: Tổng kết · Kết quả từng TC · Chi tiết FAIL · TC BLOCKED · **Dữ liệu đã tạo & dọn dẹp** · Đề xuất bước tiếp theo.

### ⚠️ Hai luật quan trọng

**1. KHÔNG sửa TC trong lúc chạy.** TC FAIL vì viết sai thì ghi nhận lại, chạy xong mới quay về `/review-testcases` mode FIX. Sửa giữa chừng là mất dấu vết của lần chạy đó.

**2. Môi trường dùng chung → kiểm mục "Dữ liệu đã tạo & dọn dẹp" mỗi lần chạy.** Dữ liệu test phải traceable (`Auto_<Module>_<timestamp>`) và có kế hoạch xoá. Không dọn thì vài lần chạy là môi trường thành bãi rác, và người khác lãnh hậu quả.

---

## Chặng 5 — Xử lý FAIL

| Tình huống | Command | Prompt mẫu | Ghi chú |
|---|---|---|---|
| **Nhiều TC FAIL**, chưa rõ nguyên nhân | `/analyze-test-report` | [`prompt_11_analyze_test_report.txt`](prompts/prompt_11_analyze_test_report.txt) | **Chạy cái này trước** — 12 TC FAIL thường chỉ là 2 bug |
| Đã rõ bug, cần báo cáo | `/create-bug-report` | [`prompt_10_create_bug_report.txt`](prompts/prompt_10_create_bug_report.txt) | Tự lấy evidence từ run vừa rồi, tuỳ chọn đẩy Jira |
| FAIL vì **TC viết sai**, không phải lỗi hệ thống | `/review-testcases` mode FIX | [`prompt_12_review_testcases.txt`](prompts/prompt_12_review_testcases.txt) | Quay lại chặng 3 |
| **Dev báo đã fix**, cần xác minh | `/retest-fixed-bugs` | [`prompt_23_retest_fixed_bugs.txt`](prompts/prompt_23_retest_fixed_bugs.txt) | Đóng vòng lặp bug — xem dưới. Hiện chỉ retest được bug **web**; bug mobile/API xác minh bằng cách chạy lại automation |

**Đầu ra:**
```
docs/executions/<module>/<nền-tảng>/analysis_<timestamp>.md ← gom nhóm theo root cause (nhánh MANUAL)
docs/bugs/<module>/<nền-tảng>/BUG_<module>_<timestamp>_<TC_ID>.md  ← mỗi bug 1 file, hậu tố TC_ID để nhìn tên biết ngay thuộc TC nào
```

Bug từ mục checklist: hậu tố lấy `TC ID liên quan` của mục (mục không có TC thì `CL<số mục>`); checklist release thì bug nằm ở **module của mục**, không nằm ở `_release`.

> Gom nhóm trước rồi mới viết bug report — đỡ tạo 12 bug trùng nhau cho cùng một nguyên nhân.

### Vòng lặp bug — chạy tới khi hết, không phải một chiều

```
TC FAIL → /create-bug-report → dev fix → /retest-fixed-bugs
                    ↑                            │
                    └──── regression mới ────────┘
```

| Kết quả retest | Nghĩa | Làm gì tiếp |
|---|---|---|
| ✅ FIXED | Chạy đúng steps gốc, khớp Expected, lặp ≥ 2 lần | Đề xuất đóng bug |
| ❌ NOT_FIXED | Lỗi cũ vẫn còn | Mở lại **bug cũ**, không tạo bug trùng |
| 🟡 PARTIAL | Hết lỗi gốc nhưng vẫn lệch Expected | Giữ bug mở, ghi rõ phần nào còn |
| ⚠️ CANNOT_VERIFY | Không dựng được pre-condition | **Không** được chấm FIXED |

⚠️ **Hai luật của chặng này:**

1. **Bug Critical/Major luôn chạy mode FULL** — verify xong phải chạy regression quanh vùng fix. Bản fix làm hỏng chỗ khác là chuyện thường xuyên, không phải ngoại lệ.
2. **TC regression FAIL = bug MỚI**, tách riêng, link về bug gốc. Gộp vào bug cũ là mất dấu vết nguyên nhân.

**Đầu ra:** `docs/executions/<module>/<nền-tảng>/retest_<timestamp>/retest_report.md` + mục `Lịch sử retest` thêm vào bug gốc.

---

## Chặng 6 — Ma trận truy vết (RTM)

```
/generate-traceability-matrix
```

📋 Prompt mẫu: [`prompts/prompt_13_generate_traceability_matrix.txt`](prompts/prompt_13_generate_traceability_matrix.txt)

**Ra 5 nhóm phát hiện:**

| Ký hiệu | Nghĩa |
|---|---|
| ⬛ | **Module chưa có tài liệu** — còn ⬜ trong danh mục, nằm **ngoài** phạm vi RTM |
| 🔴 | REQ chưa có TC nào cover |
| 🟠 | REQ **chỉ có mục checklist**, chưa có TC — đã rà nhanh nhưng chưa có cách chạy lại được, **không** tính vào coverage |
| 🟡 | TC chưa được automate |
| ⚪ | Test mồ côi — không map về REQ nào |

**Đầu ra:** `docs/traceability/traceability_matrix.md` (toàn hệ thống) · `docs/traceability/<module>/traceability_matrix_<module>.md` (một module) — ghi đè tại chỗ, header có Ngày sinh · Phạm vi · Mốc git để chặng 7 biết RTM đã cũ hay chưa.

> ⚠️ **Đọc mục ⬛ trước mọi con số phần trăm.** Coverage 95% mà còn 3 module chưa ai khảo sát thì con số đó vô nghĩa — nó chỉ tính trên phần đã có tài liệu.

---

## Chặng 7 — Báo cáo tổng hợp & quyết định release

```
/generate-test-summary-report
```

📋 Prompt mẫu: [`prompts/prompt_24_generate_test_summary_report.txt`](prompts/prompt_24_generate_test_summary_report.txt)

Gộp **mọi** kết quả của cả đợt — execution report nhiều module + bug đang mở + RTM — thành **một** tài liệu gửi PM/khách hàng, kết thúc bằng lời khuyên **có nên release không**, kèm căn cứ:

| Khuyến nghị | Nghĩa |
|---|---|
| 🟢 **GO** | Nên release — đạt đủ tiêu chí exit (vẫn liệt kê rủi ro còn lại) |
| 🟡 **GO có điều kiện** | Release được **nếu** PM chấp nhận vài điểm tồn đọng — báo cáo nêu rõ từng điểm và rủi ro đi kèm |
| 🔴 **NO-GO** | Chưa nên release — còn bug Critical, hoặc luồng nghiệp vụ chính chưa chạy được |

**Ba luật của chặng này:**

| Luật | Vì sao |
|---|---|
| **QA khuyến nghị, PM quyết định** | QA không nắm áp lực thị trường, hợp đồng, chi phí trễ hạn |
| **Khuyến nghị GO vẫn phải kèm rủi ro tồn đọng** | GO trơn không nêu tồn đọng là báo cáo vô trách nhiệm — có sự cố thì không ai biết QA đã cảnh báo hay chưa |
| **Vùng chưa test đứng TRƯỚC mọi tỷ lệ** | Cùng lý do với mục ⬛ của RTM: pass rate đẹp che mất module chưa ai chạm |
| **Kết quả checklist báo bảng riêng, không cộng vào bộ TC** | 12 mục smoke không phải 12 TC — cộng vào là pass rate vô nghĩa. Số của bộ TC lấy kết quả mới nhất của **từng TC**, không lấy nguyên lần chạy mới nhất |

**Tiêu chí exit phải chốt TRƯỚC khi nhìn kết quả.** Nhìn số rồi mới đặt ngưỡng là hợp thức hoá kết quả, không phải đánh giá. Đợt có kế hoạch chính thức thì `/generate-master-test-plan` đã công bố bộ tiêu chí này từ đầu — chặng 7 chỉ chấm lại đúng bộ đó ([luật 3](#kế-hoạch-kiểm-thử-chính-thức--trước-chặng-4-tuỳ-chọn)).

**Đầu ra:** `docs/executions/test_summary_<mốc>_<timestamp>.md`

---

## Luồng checklist — từ rà nhanh tới báo cáo release

Checklist đi **cùng** chuỗi chặng 4 → 7 như bộ TC, chỉ khác cách các chặng sau đếm nó:

```
/generate-checklist-test   → docs/checklists/<module>/<nền-tảng>/checklist_<loại>_<YYYYMMDD>.md     Mã checklist: CL-<loại>_<ngày>
        ↓                     (release: docs/checklists/_release/<nền-tảng>/checklist_release_<mốc>.md — có cột Module)
/execute-test-cases        → execution_report.md — Loại nguồn: Checklist <loại> · mỗi mục mã CL-…-<nn>
        ↓                     (release: docs/executions/_release/<nền-tảng>/run_<timestamp>/)
/create-bug-report         → docs/bugs/<module của mục>/<nền-tảng>/ — trỏ về TC ID liên quan + mã mục
/retest-fixed-bugs         → như bug của bộ TC
        ↓
/generate-traceability-matrix → cột Checklist · REQ chỉ có checklist = 🟠, không tính là đã cover
        ↓
/generate-test-summary-report → bảng 4b "Kết quả rà checklist", tách khỏi bảng bộ TC
```

| Chặng | Checklist được tính thế nào | Vì sao |
|---|---|---|
| 4 · Chạy | Mỗi mục là một đơn vị chạy, mã `CL-<…>-<nn>`. **Không** tick vào file checklist | `#3` trùng giữa mọi checklist; kết quả phải nằm trong execution report để các chặng sau đọc được |
| 6 · RTM | Nguồn **phụ** — REQ chỉ có checklist xếp 🟠 | Checklist không có steps nên không chạy lại hay automate được như TC |
| 7 · Báo cáo | Bảng riêng · **không** vào pass rate TC High / toàn bộ / BLOCKED (#3 · #4 · #5) · tính cho #6 **chỉ** khi REQ không có TC nào · cặp module × nền tảng chỉ có checklist = tiêu chí #7 **chưa đạt** | Checklist là lớp rà nhanh **trên** bộ TC, không thay bộ TC |

> 🚨 **Checklist mới FAIL, bộ TC cũ PASS → tin checklist.** Smoke trên build mới hỏng một mục mà TC liên quan đã PASS ở build trước = build mới đã vỡ. Chặng 7 nêu đây là regression, không để số PASS cũ che đi.

---

## Xem kết quả bằng web viewer

Không cần đọc file `.md` thô. Mở [`scripts/execution-viewer/bundle.html`](scripts/execution-viewer/README.md) (double-click, chạy offline), kéo thả file vào:

| Nạp file | Xem được gì |
|---|---|
| `execution_report.md` · `retest_report.md` (chặng 4–5) | Thống kê PASS/FAIL/BLOCKED/SKIPPED · **so sánh giữa các lần chạy** (🆕 mới fail · 🔁 fail liên tục · ✅ vừa được fix) · cảnh báo BLOCKED > 20%, nợ kiểm thử, data chưa dọn · lần chạy checklist mang nhãn **CHECKLIST**, nạp lẫn với bộ TC thì có cảnh báo trộn đơn vị |
| `docs/traceability/traceability_matrix.md` (chặng 6) | **Độ phủ automation** — REQ nào chưa có TC, REQ **chỉ có checklist**, TC nào chưa automate, REQ mới automate **một phần**, orphan test |

Xuất **CSV** hoặc **Excel** (nhiều sheet, ô trạng thái tô màu) đúng phần đang hiển thị.

Tương tự, [`scripts/testcases-viewer/bundle.html`](scripts/testcases-viewer/README.md) để duyệt và xuất Excel test case ở chặng 2–3.

---

## Vòng lặp khi Requirements thay đổi

Hệ thống đang phát triển thì ticket sẽ liên tục sửa yêu cầu. Đừng sinh lại từ đầu:

```
/update-requirements-from-ticket
        ↓  Impact Report — TC nào stale
   ┌────┴──────────────────────────────────────────┐
   ↓                                               ↓
REQ mới (🟢) → /generate_testcases_*     TC phải sửa (🟡) + TC bị gỡ (🗑️)
                                              → /update-testcases-from-impact
                                                   ↓  Delta TC List — impact/delta_tc_<TICKET-ID>.md
                                              Module đã có automation?
                                                   → /update-automation-from-impact  (web · mobile · API)
   └────────────────────┬─────────────────────────┘
                        ↓
            /execute-test-cases  (chạy lại phần bị ảnh hưởng)
```

> **Tầng thứ ba chỉ chạy khi module đã có automation.** `/update-testcases-from-impact` mode APPLY ghi `delta_tc_<TICKET-ID>.md` — danh sách TC đã sửa kèm nền tảng. `/update-automation-from-impact` đọc đúng file đó, sửa script web · mobile · API tương ứng và chạy lại. Chi tiết: [`AI_FULL_FLOW_AUTOMATION.md`](AI_FULL_FLOW_AUTOMATION.md) chặng 5.

> 🚨 **Không dùng `/review-testcases` mode FIX cho nhánh 🟡.** Nó chấm rubric chất lượng, không đối chiếu với REQ mới — TC viết rất tốt về hành vi **cũ** vẫn đạt 12/12 điểm, và nó không sinh Delta TC List cho automation. Đồng bộ bằng `/update-testcases-from-impact` trước, chấm chất lượng bằng `/review-testcases` sau.

Cột **`TC cần xử lý`** trong Nhật ký thay đổi của tài liệu requirements là **mắt xích cảnh báo duy nhất** cho tester biết TC nào đã lỗi thời. Bỏ qua nó là chạy test trên bộ TC sai mà không biết.

---

## Bảng tra nhanh — chạy bao nhiêu lần

| Chặng | Command | Prompt mẫu | Số lần chạy |
|---|---|---|---|
| 0 | `/discover-system` | [`prompt_00`](prompts/prompt_00_discover_system.txt) | **1 lần** / hệ thống (+ ADD/DELTA khi cần) |
| 1 | `/generate-requirements-from-website` | [`prompt_01`](prompts/prompt_01_generate_requirements.txt) | **N lần** = số module |
| 1" | `/generate-requirements-from-mobile` | [`prompt_30`](prompts/prompt_30_generate_requirements_from_mobile.txt) | **N lần** = số module có mặt app × số nền tảng |
| 1' | `/generate-requirements-from-api` | [`prompt_29`](prompts/prompt_29_generate_requirements_from_api.txt) | **N lần** = số module có mặt API |
| 2 | `/generate-testcases-manual-rbt` | [`prompt_02`](prompts/prompt_02_generate_test_cases.txt) | **N lần** = số module (web + mobile) |
| 2" | `/generate-testcases-api` | [`prompt_09`](prompts/prompt_09_generate_api_tests.txt) | **N lần** = số module có mặt API |
| 2' | `/generate-checklist-test` | [`prompt_15`](prompts/prompt_15_generate_checklist.txt) | Khi cần checklist tick tay — chạy bằng `/execute-test-cases` ([luồng checklist](#luồng-checklist--từ-rà-nhanh-tới-báo-cáo-release)) |
| 3 | `/review-testcases` | [`prompt_12`](prompts/prompt_12_review_testcases.txt) | 1 lần / bộ TC |
| 4 | `/execute-test-cases` | [`prompt_16`](prompts/prompt_16_execute_test_cases.txt) | Mỗi đợt kiểm thử |
| 5 | `/analyze-test-report` | [`prompt_11`](prompts/prompt_11_analyze_test_report.txt) | Khi nhiều TC FAIL |
| 5 | `/create-bug-report` | [`prompt_10`](prompts/prompt_10_create_bug_report.txt) | Mỗi bug cần báo |
| 5 | `/retest-fixed-bugs` | [`prompt_23`](prompts/prompt_23_retest_fixed_bugs.txt) | **Mỗi lần dev báo đã fix** |
| 6 | `/generate-traceability-matrix` | [`prompt_13`](prompts/prompt_13_generate_traceability_matrix.txt) | Định kỳ / trước release |
| 7 | `/generate-test-summary-report` | [`prompt_24`](prompts/prompt_24_generate_test_summary_report.txt) | **Mỗi mốc release / sprint** |
| ↻ | `/update-requirements-from-ticket` | [`prompt_21`](prompts/prompt_21_update_requirements_from_ticket.txt) | Mỗi ticket sửa yêu cầu |
| ↻ | `/update-testcases-from-impact` | [`prompt_27`](prompts/prompt_27_update_testcases_from_impact.txt) | **Mỗi Impact Report** — ngay sau command trên |
| ↻ | `/update-automation-from-impact` | [`prompt_19`](prompts/prompt_19_update_automation_from_impact.txt) | Ngay sau command trên — **chỉ khi module đã có automation** |
| ⊹ | `/generate-master-test-plan` | [`prompt_25`](prompts/prompt_25_generate_master_test_plan.txt) | 1 lần / đợt — khi cần kế hoạch chính thức, **trước chặng 4** · gọi lại khi phạm vi/lịch đổi |
| ⊹ | `/generate-test-progress-report` | [`prompt_32`](prompts/prompt_32_generate_test_progress_report.txt) | **Mỗi kỳ** theo lịch plan (thường hằng tuần) — trong chặng 4–6 |
| ⊹ | `/generate-user-guide` | [`prompt_28`](prompts/prompt_28_generate_user_guide.txt) | Khi bàn giao — tài liệu cho **người dùng cuối**, không phải cho QA |

**Biến thể của chặng 1–2** (không nằm trên luồng chính): `/analyze-requirement-document` → [`prompt_20`](prompts/prompt_20_analyze_requirement_document.txt) · `/generate-testcases-from-requirements` → [`prompt_22`](prompts/prompt_22_generate_testcases_quick.txt).

---

## Ba lỗi hay gặp nhất

**1. Nhảy thẳng vào chặng 2, bỏ chặng 0–1.**
TC sinh ra không có `REQ ID` → chặng 6 không chạy được → không ai chứng minh được "đã test đủ". Sửa sau thì phải viết lại toàn bộ TC.

**2. Bỏ qua checkpoint, gõ "tiếp tục" cho nhanh.**
Checkpoint tồn tại vì đó là chỗ AI **không thể tự quyết đúng**: ranh giới module, phạm vi test, scenario còn thiếu. Bấm qua là đẩy sai lầm xuống tận chặng 4 mới lộ.

**3. Tin coverage % mà không đọc mục ⬛.**
Xem lại cảnh báo ở chặng 6.

---

## Tài liệu liên quan

| File | Nội dung |
|---|---|
| [`AI_FULL_FLOW_AUTOMATION.md`](AI_FULL_FLOW_AUTOMATION.md) | Flow 8 chặng Automation Testing — nối tiếp từ bộ TC của chặng 2–3 |
| [`CLAUDE.md`](CLAUDE.md) | Quy tắc bắt buộc · cấu trúc `docs/` · danh sách đầy đủ workflows |
| [`README.md`](README.md) | Tổng quan bộ kit · cài đặt |
| [`SETUP_CLAUDE.md`](SETUP_CLAUDE.md) | Cài Claude Code + Playwright MCP |
| [`prompts/README.md`](prompts/README.md) | 36 prompt mẫu copy-paste, chia 7 nhóm tra cứu |
| [`plans/manual/QUICK_START.md`](plans/manual/QUICK_START.md) | Luồng 6 bước AI-RBT bản copy-paste — dùng cho AI agent khác (Codex · Antigravity · Kiro · Cursor) không có slash command của bộ này |
