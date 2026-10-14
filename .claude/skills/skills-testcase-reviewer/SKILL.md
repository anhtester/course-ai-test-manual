---
name: skills-testcase-reviewer
description: Skill review chất lượng manual test cases có sẵn — phát hiện TC mơ hồ, thiếu assertion, trùng lặp, thiếu negative/boundary case, chấm điểm theo rubric và đề xuất cải thiện cụ thể. Mode AUTOMATION chấm độc lập TC nào làm automation được (Yes/Partial/No) theo bảng tiêu chí, gom điều kiện cần xin dev.
---

# Test Case Reviewer

Purpose: Đánh giá chất lượng bộ manual test cases (do người khác hoặc AI viết) và đề xuất cải thiện cụ thể — KHÔNG viết lại toàn bộ từ đầu.

---

## When to Use

Sử dụng skill này khi:

- User đưa file test cases (Excel/Markdown/CSV) và yêu cầu "review", "đánh giá", "check chất lượng"
- Cần biết **TC nào làm automation được** — bộ TC bất kỳ, kể cả file khách gửi không có cột `Automation` → **Mode AUTOMATION** (mục riêng bên dưới)
- Sau khi sinh TC bằng `skills-rbt-manual-testing` và cần một vòng kiểm tra độc lập
- Onboard bộ TC cũ từ dự án khác

**KHÔNG** sử dụng skill này khi:

- **Requirements vừa đổi theo ticket, cần đồng bộ TC** → dùng `skills-rbt-manual-testing` **Mode DELTA** qua command `/update-testcases-from-impact`

> 🚨 **Phân biệt rõ:** skill này chấm **chất lượng cách viết** theo rubric — một TC mô tả rất tốt về hành vi **đã bị thay đổi** vẫn đạt 12/12 điểm, vì rubric không đối chiếu với REQ mới. Nó **không bắt được TC stale**.
>
> Thứ tự đúng: `/update-testcases-from-impact` đồng bộ nội dung **trước** → skill này chấm chất lượng **sau**.

---

## Review Rubric (6 tiêu chí)

Mỗi test case chấm theo 6 tiêu chí, thang điểm 0-2 (0 = không đạt, 1 = một phần, 2 = đạt):

| # | Tiêu chí | Câu hỏi kiểm tra |
|---|---|---|
| 1 | **Rõ ràng (Clarity)** | Người chưa biết feature đọc có thực hiện được không? Steps có đánh số, mỗi step 1 hành động? |
| 2 | **Expected Result đo được** | Expected có cụ thể, verify được **bằng mắt thường** không? (❌ "hoạt động đúng" / ✅ "hiển thị message X, chuyển sang trang Dashboard"). Steps/Expected ở phần TC chính dùng ngôn ngữ DOM/DevTools (`document.`, `querySelector`, `className`, selector CSS/XPath, mã HTTP, header) → **tối đa 1 điểm** — trừ TC `Auto Type` = `API` và phần nằm dưới `🔧 Ghi chú kỹ thuật (cần DevTools):` của TC có tag `@TechCheck` (Quy Tắc Ngôn Ngữ Kiểm Chứng của `skills-rbt-manual-testing`) |
| 3 | **Độc lập (Independence)** | TC có tự chuẩn bị precondition không, hay phụ thuộc TC khác chạy trước? |
| 4 | **Test data cụ thể** | Data có được chỉ định rõ không? Field unique có ghi chú cần random không? |
| 5 | **Truy vết được (Traceability)** | TC có link về requirement/user story không? |
| 6 | **Đúng trọng tâm (Focus)** | 1 TC verify **1 hành vi**. TC ở độ hạt GỘP **hợp lệ** — Bảng biến thể Kiểu A (cùng trường, cùng thao tác, cùng loại phản hồi) hoặc Bảng kiểm Kiểu B (quan sát tĩnh cùng màn hình) — **không** bị trừ điểm. Chỉ trừ khi vi phạm bảng **CẤM gộp** của `skills-rbt-manual-testing` (khác trường · khác loại phản hồi · gộp TC smoke khác hành vi · gộp TC thiết kế để FAIL · > 6 biến thể · biến thể không có mã riêng) hoặc gộp nhiều hành vi không theo hai kiểu trên |

> TC mang tag `@Deprecated` (chức năng đã gỡ) **không** chấm rubric, **không** tính vào coverage — liệt kê riêng số lượng ở phần Tổng quan.

### Đọc Expected cùng Pre-Condition — không chấm Expected như một ô đứng riêng

Pre-Condition · Test Data · Expected là **một hợp đồng**: Pre-Condition dựng trạng thái đầu, Expected nói trạng thái sau thao tác. Trước khi ghi bất kỳ nhận xét nào về Expected (tiêu chí 1, 2, 3, 4), đọc lại Pre-Condition và Test Data của **chính TC đó**.

| Tình huống | Chấm |
|---|---|
| Expected nhắc tới đối tượng do Pre-Condition dựng — *"không thấy lại danh sách khách hàng"* khi Pre-Condition ghi *"đã mở trang Customers"* | Đo được → **không** trừ tiêu chí 2, **không** đề xuất chép lại Pre-Condition vào Expected |
| Thông tin reviewer định đòi bổ sung (tài khoản, trang xuất phát, dữ liệu có sẵn, trạng thái đầu) **đã có** ở Pre-Condition / Test Data | **Không** phải thiếu sót — bỏ nhận xét |
| Expected không nhắc lại trạng thái mà Pre-Condition đã bảo đảm (VD không ghi *"chưa có cookie"* khi Pre-Condition là *"cửa sổ ẩn danh mới"*) | **Không** trừ. Expected chấm theo **kết quả của thao tác**, không theo việc lặp lại tiền đề |
| Nhiều cách diễn đạt cho **cùng một** kết quả cuối, do các biến thể đi đường khác nhau (VD *"dừng ở / bị đưa về `/admin/authentication`"* cho biến thể gõ URL và biến thể bấm Back) | **Không** phải "ghép hai kết quả" — kết quả chấm vẫn là một. Không trừ |
| Hai chỗ mô tả **cùng một trạng thái đầu** bằng hai cách (VD Pre-Condition *"cửa sổ ẩn danh mới"*, 🔧 *"xoá cookie rồi mới đăng nhập"*) | **Không** phải mâu thuẫn, không trừ. Chỉ gọi là mâu thuẫn khi hai chỗ dẫn tới **trạng thái khác nhau** — phải nêu được trạng thái khác đó là gì |
| Expected phụ thuộc một điều kiện mà **cả** Pre-Condition lẫn Test Data đều không nêu (VD Expected *"hiện hộp thoại cảnh báo timer"* nhưng không đâu nói có timer đang chạy) | Trừ tiêu chí 2 hoặc 3 — đề xuất bổ sung vào **Pre-Condition**, không nhét vào Expected |

> Nhận xét đòi bổ sung thông tin cho Expected phải ghi được câu *"Pre-Condition và Test Data không nêu …"*. Không ghi được câu đó (vì thông tin đã có) → nhận xét sai, bỏ.

**Xếp loại theo tổng điểm (tối đa 12):**
- 🟢 **10-12:** Tốt — dùng được ngay
- 🟡 **6-9:** Cần sửa — có đề xuất cụ thể
- 🔴 **0-5:** Viết lại — chỉ ra hướng viết lại

---

## Phạm vi loại trừ — lập TRƯỚC khi đối soát coverage

Requirements có thể đã **quyết định không viết TC** cho một phần của module. Bộ TC không có TC cho phần đó là **đúng**, không phải thiếu — báo cáo nhắc lại và góp ý phần đó là **dư thừa**, và đẩy QA đi viết TC mà PO đã bỏ.

Trước khi chấm coverage, lập **Danh sách loại trừ** từ các nguồn sau:

| Nguồn | Dấu hiệu |
|---|---|
| Requirements — mục `Ngoài phạm vi` (index hoặc file nền tảng) | Mọi dòng của mục |
| Requirements — REQ ghi *ngoài phạm vi viết TC / kiểm thử* | VD *"Chưa kiểm chứng và sẽ KHÔNG kiểm chứng — `AMB-…` ⏭️"* |
| Requirements — REQ 🔴 Deprecated | Chức năng đã gỡ |
| Requirements — AMB `⏭️` có quyết định *"bỏ qua, không viết TC"* hoặc *"chuyển sang module X"* | VD kiểm chứng đầu-cuối một popup chuyển sang module khác |
| Requirements — RISK *đã chấp nhận* kèm quyết định không kiểm | |
| Index TC — dòng `⚪ Ngoài phạm vi` ở Bảng Đối Soát Coverage · Assumptions *"Không viết TC …"* | Chép lại quyết định của requirements, hoặc quyết định của người viết TC |

**Luật:**

- Mục trong Danh sách loại trừ **không** xuất hiện ở: Coverage Gaps · cột *Mục thiếu* của đối soát 15 loại field · đề xuất TC mới · đề xuất bổ sung REQ · Kết luận & Khuyến nghị · nhận xét từng TC
- Nhánh 4 vòng mà phần còn thiếu **chỉ** nằm trong danh sách loại trừ → chấm `⏭️` và dẫn mã quyết định (VD `⏭️ AMB-LOGIN-14`), **không** 🟡 / 🔴. Nhánh còn thiếu cả phần khác → chấm theo phần khác, không nhắc phần đã loại
- **Không** chất vấn lại quyết định loại trừ của requirements — đó là quyết định của PO / người có thẩm quyền, sửa bằng `/update-requirements-from-ticket`, không phải việc của review TC. Chỉ nêu lại khi **điều kiện rà lại ghi trong chính quyết định đó đã xảy ra** và chỉ ra được bằng chứng
- Báo cáo ghi **một dòng** ở Tổng quan: `Loại trừ theo requirements: <mã REQ / AMB / khu vực>` — để người đọc biết phạm vi, **không** kèm nhận xét
- User bảo bỏ qua file index TC → vẫn đọc phần loại trừ **của requirements**. Bỏ index không có nghĩa bỏ quyết định phạm vi
- Mục có trong bộ TC nhưng thuộc danh sách loại trừ (TC viết cho REQ đã ra ngoài phạm vi) → **đây** mới là thứ đáng nêu: đề xuất `@Deprecated`

> Luật `⏭️` ở mục *Đối soát 4 vòng* bên dưới (kể cả *"không bao giờ được rút"*) áp cho `⏭️` do **người viết TC** tự quyết ở Bảng 4 vòng của index. `⏭️` dẫn về một quyết định của requirements thuộc Danh sách loại trừ — theo luật của mục này.

---

## Coverage Analysis (mức bộ TC)

Ngoài review từng TC, đánh giá độ phủ của cả bộ — **trừ** các mục trong Danh sách loại trừ ở trên:

| Khía cạnh | Kiểm tra |
|---|---|
| **Đối soát 4 vòng** ⭐ | Xem bên dưới — đây là phần bắt lỗi "bộ TC nông" hiệu quả nhất |
| **Đối soát bảng 15 loại field** ⭐ | Với TỪNG field, so từng mục của dòng loại field trong `skills-rbt-manual-testing` với TC thực có. Thiếu mục nào, liệt kê đích danh mục đó |
| **Trùng lặp** | Các TC verify cùng 1 thứ → đề xuất merge |
| **Ưu tiên** | TC có gán priority (High/Medium/Low) chưa? Có hợp lý với risk không? |
| **Số biến thể (khi độ hạt GỘP)** | Đếm biến thể thật trong Bảng biến thể. Bộ TC gộp mà tổng biến thể ít bất thường = đã rụng case, dù số REQ vẫn phủ đủ |

### Đối soát 4 vòng (BẮT BUỘC — mức bộ TC)

Dùng **Bản Đồ Loại Kiểm Thử — 4 Vòng** trong `skills-rbt-manual-testing`. Duyệt từng nhánh, chấm bộ TC đang review:

| Vòng | Nhánh phải soi |
|---|---|
| **V1 Smoke** | UI cơ bản · Open form · Display · Input valid · Save · Verify data |
| **V2 Functional** | UI Behavior · Required · Validation · EP · BVA · Business Rule · Decision Table · State Transition · Dependency · Use Case · Save/Edit/Delete · Error Guessing |
| **V3 Technical** | Permission · Security · API · Database · Integration · Logging/Audit |
| **V4 Non-functional** | Compatibility · Responsive · Accessibility · Performance · Regression · E2E |

- Nhánh **không có TC nào** mà điều kiện kích hoạt đã thoả → ghi vào **Coverage Gaps** với loại là tên nhánh, **không** ghi chung chung "thiếu negative case"
- 🚨 **Ba nhánh soi kỹ nhất, cũng là ba chỗ hay mất nhất:**
  - `UI cơ bản` (V1) — bộ TC không kiểm nhãn nguyên văn / thứ tự field / trạng thái mặc định là **thiếu hẳn một lớp**, dù mọi validation đều đủ. Đây là lỗi phổ biến số 1
  - `Validation` (V2) — đọc lướt bảng 15 loại rồi sinh 2–3 TC/field. Password có 7 mục, Email có 9 mục: sinh 3 TC là **chưa đạt**
  - `Permission` (V3) — hệ thống có ≥2 role mà không có TC phân quyền nào
- Nhánh không áp dụng với module → ghi `➖` kèm lý do kỹ thuật, **không** tính là gap
- Nhánh bộ TC đã **cố ý bỏ** (`⏭️` ở Bảng 4 vòng của index, có lý do + ai quyết + điều kiện rà lại) → giữ `⏭️`, **không** tính là gap. Chỉ nêu lại khi điều kiện rà lại đã xảy ra (VD trang giờ đã có field nhập), hoặc khi `⏭️` rơi vào thứ **không bao giờ được rút** (toàn bộ V1 · `Required`/`Validation` khi có field nhập · `Permission` khi ≥ 2 role · `Security` khi chạm dữ liệu người khác) → chấm 🔴
- `⏭️` thiếu người quyết hoặc thiếu điều kiện rà lại, hoặc `➖` thật ra là `⏭️` (có thứ đó nhưng không kiểm) → ghi vào báo cáo như lỗi ghi nhãn

> ⚠️ Rubric 6 tiêu chí chấm **cách viết từng TC**. Một bộ TC chỉ có 12 TC validation, viết rất đẹp, vẫn ra 🟢 toàn bộ — **rubric không nhìn thấy phần thiếu**. Đối soát 4 vòng là chỗ duy nhất bắt được. Bỏ qua mục này thì report của skill sẽ xác nhận sai rằng bộ TC đã ổn.

---

## Review Workflow

1. **Đọc input** — file TC + requirement liên quan (nếu có). Nếu thiếu requirement → vẫn review được 5/6 tiêu chí, ghi chú không đánh giá được traceability
2. **Lập Danh sách loại trừ** — theo mục *Phạm vi loại trừ*, trước mọi bước chấm
3. **Review từng TC** — chấm điểm 6 tiêu chí, ghi vấn đề cụ thể (trích nguyên văn chỗ chưa đạt). Expected đọc **cùng** Pre-Condition và Test Data của chính TC đó
4. **Phân tích coverage** — đối chiếu bộ TC với requirement, liệt kê gap — **bỏ** các mục trong Danh sách loại trừ
5. **Phát hiện trùng lặp** — nhóm TC giống nhau
6. **Report** — xuất báo cáo theo template, kèm đề xuất sửa cụ thể cho từng TC 🔴/🟡

> **Nguyên tắc:** Mọi nhận xét phải kèm **ví dụ sửa cụ thể**, không chê chung chung. VD: thay vì "Expected mơ hồ" → viết "Expected hiện tại: 'hệ thống xử lý đúng' → Đề xuất: 'Toast hiển thị "Lưu thành công", record xuất hiện đầu danh sách với tên vừa nhập'".

---

## Report Template

Lưu tại `docs/testcases/<module>/review/testcase_review_report_<nền-tảng>_<YYYYMMDD>.md` — cạnh bộ TC được chấm.

```markdown
# Báo Cáo Review Test Cases

## Tổng quan
- **Nguồn:** <file path>
- **Số TC review:** N
- **Kết quả:** 🟢 x tốt | 🟡 y cần sửa | 🔴 z nên viết lại
- **Điểm trung bình:** x.x/12
- **Loại trừ theo requirements:** <mã REQ / AMB / khu vực — hoặc "Không có"> (không chấm, không đề xuất)

## Chi tiết từng TC
| TC ID | Điểm | Xếp loại | Vấn đề chính | Đề xuất sửa |
|---|---|---|---|---|
| TC_01 | 11/12 | 🟢 | Thiếu ghi chú data random | Thêm "email = random unique" |
| TC_02 | 7/12 | 🟡 | Expected mơ hồ; gộp 2 hành vi khác loại phản hồi (bị chặn ngay trên form vs máy chủ báo lỗi) | Tách: TC_02 giữ kịch bản bị chặn trên form; kịch bản máy chủ báo lỗi cấp **TC mới nối tiếp dải** (VD TC_087) — KHÔNG đặt `TC_02a/02b`; Expected: "..." |

## Đối soát loại kiểm thử (4 vòng)
| Vòng | Nhánh | Trạng thái | Ghi chú |
|---|---|---|---|
| 1 | UI cơ bản | 🔴 Thiếu | Không có TC nào kiểm nhãn, thứ tự field, trạng thái mặc định |
| 2 | Validation | 🟡 Nông | Password mới có 3/7 mục của bảng 15 loại field |
| 3 | Permission | ✅ | TC_20–TC_26 |
| 4 | Responsive | ⏭️ | Cố ý bỏ — module chỉ dùng nội bộ trên desktop. PO quyết định 10-09-2026; rà lại khi có người dùng trên thiết bị di động |
| 4 | Performance | ➖ | Không có công cụ tải — đội Hạ tầng, đợt sau |

## Coverage Gaps (TC còn thiếu)
| # | Kịch bản thiếu | Vòng / Nhánh | Priority đề xuất |
|---|---|---|---|
| 1 | Màn hình Login hiển thị đủ nhãn `Email Address`, `Password`, nút `Login`, liên kết `Forgot Password?` đúng thứ tự | V1 · UI cơ bản | High |
| 2 | Mật khẩu: chặn dán · nút hiện/ẩn · độ dài tối đa · ký tự khoảng trắng | V2 · Validation | High |
| 3 | Login với account bị khóa | V2 · Business Rule | High |

## TC trùng lặp — đề xuất merge
- TC_05 ≈ TC_12 (cùng verify validation email) → giữ TC_05; TC_12 gắn `@Deprecated` + tiền tố `🗑️ Deprecated (trùng TC_05, <ngày>) —`, **không** xoá dòng. Biến thể riêng của TC_12 (nếu có) chuyển vào Bảng biến thể của TC_05

## Kết luận & Khuyến nghị
- <Tóm tắt 3-5 hành động ưu tiên>
```

---

## Quality Checklist

- [ ] Mỗi TC 🔴/🟡 đều có đề xuất sửa cụ thể (không chê chung chung)
- [ ] Mọi nhận xét về Expected đã đối chiếu Pre-Condition + Test Data của chính TC đó — không đòi bổ sung thứ đã có, không gọi "mâu thuẫn" khi hai chỗ cùng dẫn tới một trạng thái
- [ ] Đã lập Danh sách loại trừ từ requirements — không mục nào trong đó xuất hiện ở Coverage Gaps, đối soát 15 loại field, đề xuất TC/REQ mới, Kết luận; nhánh 4 vòng chỉ thiếu phần đã loại chấm `⏭️` kèm mã quyết định
- [ ] Coverage gap liệt kê kịch bản cụ thể, không nói "thiếu negative case" suông
- [ ] **Đã chạy đối soát 4 vòng** — mọi nhánh được chấm ✅/🟡/🔴/➖/⏭️, không ô nào bỏ trống; `⏭️` hợp lệ không bị tính là gap
- [ ] Rubric tiêu chí 6 không trừ điểm TC gộp đúng Kiểu A/B; tiêu chí 2 đã soát ngôn ngữ DOM/HTTP ở phần TC chính
- [ ] Đề xuất tách TC cấp **số mới nối tiếp dải**, đề xuất bỏ TC dùng `@Deprecated` — không có `TC_xxa`, không có "xoá TC"
- [ ] **Đã đối soát bảng 15 loại field cho TỪNG field** — mục thiếu nêu đích danh (VD "Password thiếu: chặn dán, hiện/ẩn, max length")
- [ ] Gap ghi kèm **vòng/nhánh** tương ứng, không ghi loại chung chung
- [ ] Không tự ý sửa file TC — chỉ báo cáo, trừ khi user yêu cầu sửa
- [ ] Nếu user yêu cầu sửa → sửa **tại chỗ** theo mục *Sửa TC (Mode FIX)*, **không** sinh bản sao `_improved` / `_v2` / `_new`
- [ ] Đã đối chiếu execution report của module — ghi chú `⚠️ chưa có evidence` / `@NeedsVerify` đã được giải quyết được đưa vào báo cáo để dọn

---

## Sửa TC (Mode FIX) — TẠI CHỖ, không sinh bản sao

| Việc | Cách làm |
|---|---|
| **Ghi vào đâu** | Chính file TC đang dùng — cùng tên, cùng vị trí. 🚨 **CẤM** sinh `<tên>_improved.md` / `_v2` / `_new` hay thư mục `archive/` |
| **File đang có thay đổi chưa commit** | `git status --short <file>` có dòng → **dừng**, đề nghị user commit trước. Agent không tự commit; sửa đè lên thay đổi chưa commit là mất bản đối chiếu (cùng luật với Mode DELTA) |
| **Giữ bản cũ thế nào** | Ghi **mốc git** (`git log -1 --format=%h -- <file>`) vào Nhật ký thay đổi của index; xem lại bằng `git show <mốc>:<file>` |
| **File chưa được git theo dõi** (Excel/CSV khách gửi) | **Hỏi user** trước khi ghi đè — không có mốc git để lấy lại bản cũ |
| **TC ID** | Giữ nguyên. TC bỏ hẳn → tag `@Deprecated` + tiền tố `🗑️ Deprecated (<lý do>, <ngày>) —` ở `Test Scenario`, không xoá dòng. TC mới (kể cả phần tách ra) → nối tiếp mã kế tiếp của dải, không chèn giữa |
| **Phạm vi** | Chỉ các TC user đã duyệt ở checkpoint — không tiện tay sửa TC khác |
| **Sau khi sửa** | Đồng bộ file index (Assumptions · Coverage · Vùng chưa có evidence · 4 vòng · tổng TC/biến thể · Bộ chạy) + 1 dòng Nhật ký |

> **Vì sao không sinh bản sao:** mọi workflow phía sau đọc file TC theo mẫu tên cố định (`TEST_CASES_<TÊN_MODULE>_SUMMARY.md` → `<nền-tảng>/test_cases_<module>_<nền-tảng>.md`). Bản `_improved` nằm cạnh bản gốc thì các workflow đó **vẫn đọc bản cũ**, và repo có hai bộ TC không ai biết bộ nào có hiệu lực. Việc duyệt trước khi sửa đã có checkpoint + báo cáo review; việc quay lại bản cũ đã có git.

---

## Mode AUTOMATION — TC nào làm automation được

> Chấm theo **[Tiêu chí chấm cột Automation](../skills-rbt-manual-testing/references/automation_criteria.md)** — đúng bảng mà `skills-rbt-manual-testing` dùng lúc sinh TC, nên kết quả review độc lập so thẳng được với cột `Automation` người viết đã điền.
>
> Mode này **không** chấm rubric 6 tiêu chí, **không** đối soát 4 vòng. Nó trả lời đúng một câu: *TC nào automate được ngay, TC nào cần điều kiện gì, TC nào không làm và vì sao*. Cần cả chất lượng lẫn automation → chạy REVIEW trước, AUTOMATION sau.

### Input nào cũng nhận

| Input | Xử lý |
|---|---|
| Bộ TC của repo (`docs/testcases/<module>/…`) | Đọc index → theo `## Bản đồ tài liệu` sang file nền tảng. Có sẵn cột `Automation` → vẫn chấm **độc lập**, xong mới đối chiếu |
| File Excel / CSV / Markdown bất kỳ, không có cột `Automation` | Chấm từ Title · Pre-Condition · Steps · Expected · Test Data — tra cột **Dấu hiệu** ở bảng 3A của tiêu chí |
| TC không có TC ID | Đánh số tạm theo dòng (`#1`, `#2`…), ghi rõ trong báo cáo |
| TC mang tag `@Deprecated` | Không chấm, không đếm — chỉ ghi số lượng ở Tổng quan |

### Quy trình

1. **Chấm độc lập trước, đối chiếu sau** — bỏ qua cột `Automation` có sẵn trong lúc chấm. Đọc cột đó trước là chấm theo người viết, mất tính độc lập
2. Với từng TC: xác định **Expected cốt lõi** → Trục 1 (bảng 3A theo dấu hiệu, không khớp dòng nào thì bảng 3B theo loại kiểm thử) → Trục 2 → Trục 3 → lấy mức thấp nhất
3. Mọi kết luận khác `Yes` **trích nguyên văn** chữ trong TC làm căn cứ — VD *"Nhập mã OTP gửi về số điện thoại"* → SMS/OTP → `Partial`
4. TC viết mơ hồ → `❓ Chưa chấm được`, **không đoán** — đề xuất Mode REVIEW cho các TC đó
5. **Gom điều kiện**: mỗi điều kiện của `Partial` một dòng, đếm số TC nó mở khoá, xếp giảm dần — đây là danh sách QA mang đi xin dev/DevOps. Điều kiện chỉ mở 1–2 TC mà cần dựng hạ tầng mới → đề xuất `No` theo Trục 3
6. Điều kiện **đã có sẵn** trên môi trường (user nói, hoặc bảng năng lực ở `docs/requirements/README.md`) → TC phụ thuộc chấm `Yes`, điều kiện ghi trạng thái ✅. Không biết → ghi `❓ Chưa rõ`, giữ `Partial`
7. Vướng tạm thời (AMB 🔴 chưa chốt, `@NeedsVerify`, màn hình đang làm lại) → `⏸️ Hoãn`, **không** hạ giá trị. TC phơi bug (`@KnownBug`) **không** hoãn
8. File có sẵn cột `Automation` → liệt kê **dòng lệch**, mỗi dòng nói vì sao
9. Đề xuất thứ tự automate trong nhóm `Yes` theo mục 5 của tiêu chí

### Report Template — Mode AUTOMATION

Lưu tại `docs/testcases/<module>/review/automation_review_<nền-tảng>_<YYYYMMDD>.md`. File TC nằm ngoài `docs/` → lưu cạnh file đó.

```markdown
# Đánh Giá Khả Năng Automation — <module / tên file>

## Tổng quan
- **Nguồn:** <file path> · **Số TC:** N
- **Tiêu chí:** `.claude/skills/skills-rbt-manual-testing/references/automation_criteria.md`
- **Kết quả:** ✅ Yes x · 🟡 Partial y · ⛔ No z · ⏸️ Hoãn h · ❓ Chưa chấm được k
- **Automate được ngay:** x/N · **khi đủ điều kiện:** (x+y)/N

## Điều kiện cần chuẩn bị (xếp theo số TC mở khoá)
| # | Điều kiện | Ai cấp | Trạng thái | Số TC | TC phụ thuộc |
|---|---|---|---|---|---|
| 1 | OTP cố định trên môi trường test | Dev backend | ❓ Chưa rõ | 7 | TC_012, TC_013, … |
| 2 | Hộp thư test đọc được qua API | DevOps | ✅ Đã có | 3 | TC_031, TC_032, TC_040 |

## Chi tiết từng TC
| TC ID | Tên TC | Kết quả | Trục chặn | Căn cứ trích từ TC | Điều kiện · phần kiểm tay · lý do |
|---|---|---|---|---|---|
| TC_001 | Đăng nhập thành công | Yes | — | — | — |
| TC_012 | Đăng ký bằng số điện thoại | Partial | 1 · SMS/OTP | *"Nhập mã OTP gửi về số điện thoại"* | Điều kiện #1 |
| TC_044 | Form cân đối ở 1366px | No | 2 · Expected cần mắt người | *"Bố cục cân đối, không lệch"* | Chỉ kiểm tay |
| TC_050 | Xuất báo cáo theo quý | Yes · ⏸️ Hoãn | — | — | Chờ chốt AMB-RPT-02 |
| TC_061 | Kiểm tra chức năng hoạt động đúng | ❓ | — | *"Hệ thống xử lý đúng"* | TC mơ hồ — sửa bằng Mode REVIEW trước |

## Lệch so với cột Automation hiện có
| TC ID | Cột hiện tại | Chấm lại | Vì sao |
|---|---|---|---|
| TC_031 | Yes | Partial | Bước 4 *"Mở email và bấm link xác nhận"* — cần hộp thư test |

## Thứ tự automate đề xuất (nhóm Yes)
1. <TC @Smoke / @CriticalPath>
2. <TC nhiều biến thể ở Validation · BVA>

## Kết luận & Khuyến nghị
- <3–5 hành động: xin điều kiện nào trước, TC nào automate trước, TC nào phải sửa cách viết>
```

> 🚨 Các bảng trong báo cáo có cột `TC ID` nhưng **không** đặt tên cột chứa `Expected` / `Scenario` / `Test Steps` / `Test Title` — `scripts/testcases-viewer` sẽ nhận nhầm bảng thành dòng TC.

### Ghi ngược vào bộ TC — chỉ khi user duyệt

Theo đúng luật của mục *Sửa TC (Mode FIX)*: sửa **tại chỗ**, ghi mốc git trước khi sửa, file chưa được git theo dõi thì hỏi trước khi ghi đè. Riêng mode này:

- **Chỉ** sửa ô `Automation` (đúng một từ `Yes`/`Partial`/`No`) của các TC đã duyệt — **không** đụng Steps, Expected. TC mơ hồ để Mode FIX
- File chưa có cột `Automation` → thêm cột tên đúng `Automation` (viewer map cột theo tên)
- Ghi / cập nhật mục `## Đối soát cột Automation` ở index theo mẫu mục 7.1 của tiêu chí
- 1 dòng Nhật ký thay đổi: nguồn `/review-testcases` Mode AUTOMATION + link báo cáo · số TC đổi giá trị · mốc git

### Quality Checklist — Mode AUTOMATION

- [ ] Chấm độc lập **trước khi** đọc cột `Automation` có sẵn
- [ ] Mọi TC có kết luận hoặc `❓ Chưa chấm được` — không TC nào bỏ trống
- [ ] Mọi `Partial` có điều kiện hoặc phần kiểm tay; mọi `No` có trục chặn và lý do
- [ ] Mọi kết luận khác `Yes` có căn cứ **trích nguyên văn** từ TC
- [ ] Điều kiện đã gom, đếm số TC mở khoá, xếp giảm dần, có trạng thái ✅ / ⏳ / ❓
- [ ] Vướng tạm thời ghi `⏸️ Hoãn`, không hạ giá trị; TC phơi bug không bị hoãn
- [ ] Không sửa file TC khi user chưa duyệt

---

## Rules References

- `.claude/skills/skills-rbt-manual-testing/SKILL.md` — Chuẩn viết TC (để đối chiếu khi review)
- `.claude/skills/skills-rbt-manual-testing/references/automation_criteria.md` — Tiêu chí chấm cột Automation (Mode AUTOMATION)
- `.claude/skills/skills-coverage-traceability/SKILL.md` — Truy vết TC ↔ requirements sâu hơn
