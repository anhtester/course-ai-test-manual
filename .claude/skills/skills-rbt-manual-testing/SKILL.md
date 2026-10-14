---
name: skills-rbt-manual-testing
description: Skill sinh và cập nhật manual test cases với 4 modes — QUICK (sinh nhanh từ requirements), FULL RBT (quy trình AI-RBT 6 bước có đánh giá rủi ro), CHECKLIST (checklist rà soát ngắn để tick tay — smoke/regression/release) và DELTA (cập nhật bộ TC đã có theo Impact Report, giữ nguyên TC ID). Mọi mode sinh TC đều đi theo khung 4 vòng Smoke → Functional → Technical → Non-functional để không bỏ sót lớp kiểm thử nào. Master skill cho mọi tác vụ manual test case.
---

# RBT Manual Testing

## Description

Đây là **Master Skill** cho mọi tác vụ sinh và cập nhật manual test cases. Skill cung cấp **4 chế độ hoạt động** (modes) để phù hợp với mọi quy mô yêu cầu:

| Mode | Khi nào dùng | Output | Thời gian |
|------|-------------|--------|-----------|
| **QUICK** | Module đơn giản, cần TC nhanh, requirements rõ ràng | TC chi tiết có steps | 1 lượt (không chờ user) |
| **FULL RBT** | Module phức tạp, cần phân tích rủi ro, hệ thống lớn | TC chi tiết + Risk Level + RTM | 6 bước tuần tự (có checkpoint) |
| **CHECKLIST** | Cần danh sách rà soát ngắn để tick tay — smoke trước release, bàn giao tester, rà nhanh sau hotfix | Checklist 1 dòng/mục, có ô tick | 1 lượt (không chờ user) |
| **DELTA** | **Bộ TC đã có**, requirements vừa đổi theo ticket — chỉ sửa phần bị ảnh hưởng | TC sửa tại chỗ + Nhật ký thay đổi + Delta TC List | 1 lượt (1 checkpoint duyệt) |

> **3 mode đầu SINH TC mới. Mode DELTA SỬA TC đã có.** Dùng QUICK/FULL RBT trên module đã có TC là sinh trùng và đánh lại TC ID — vỡ truy vết sang automation.

**Nguyên tắc cốt lõi:**
- **Human Strategy:** Con người xác định chiến lược, mức độ rủi ro và tiêu chuẩn
- **AI Execution:** AI thực hiện phân tích, viết TCs và rà soát lỗ hổng
- **Human Verification:** Con người kiểm tra lại kết quả trước khi chốt

---

## When to Use

Sử dụng skill này khi:

- Sinh manual test cases từ requirements / user stories
- Phân tích requirements để phát hiện ambiguity
- Phân rã hệ thống thành modules / features
- Xây dựng traceability matrix
- Áp dụng Risk-Based Testing (đánh giá rủi ro cho test cases)
- Chuẩn hóa test cases sang bảng Markdown (Jira/Excel format)
- Sinh test cases nhanh từ requirements đơn giản
- Sinh checklist rà soát ngắn để tick tay (smoke / regression / release-readiness / post-hotfix)
- **Cập nhật bộ TC đã có** khi requirements đổi theo ticket (Mode DELTA)

**KHÔNG** sử dụng skill này khi:

- Cần sinh automation code → dùng `skills-qa-automation-engineer`
- Cần inspect DOM / sinh locator → dùng `skills-ui-debug-agent` / `skills-smart-locator-agent`
- Chỉ cần sinh test data → dùng `skills-test-data-generator`

---

## Mode Routing — Cách chọn mode

Agent tự động chọn mode dựa trên **trigger keywords** và **ngữ cảnh**:

### → Mode QUICK

Kích hoạt khi:
- User dùng command `/generate-testcases-from-requirements`
- User nói: "sinh test cases nhanh", "tạo TC từ requirement này", "viết test cases cho form..."
- Requirements đã rõ ràng, scope nhỏ (1 module / 1 tính năng)
- User không yêu cầu phân tích rủi ro hay quy trình bài bản

### → Mode FULL RBT

Kích hoạt khi:
- User dùng command `/generate-testcases-manual-rbt`
- User nói: "quy trình 6 bước", "phân tích RBT", "sinh test cases đầy đủ", "sinh bộ TC bài bản"
- Scope lớn (nhiều modules, hệ thống phức tạp)
- User yêu cầu Traceability Matrix hoặc đánh giá Risk Level
- Requirements chưa rõ ràng, cần phân tích Ambiguity

### → Mode CHECKLIST

Kích hoạt khi:
- User dùng command `/generate-checklist-test`
- User nói: "sinh checklist test", "checklist smoke", "checklist trước release", "danh sách rà soát", "checklist bàn giao cho tester", "rà nhanh sau hotfix"
- User cần **danh sách tick tay** ngắn gọn, KHÔNG cần steps chi tiết
- User muốn rút gọn bộ TC chi tiết đã có thành checklist chạy nhanh

> Phân biệt: user cần **chạy tay nhanh và tick** → CHECKLIST. User cần **bộ TC lưu trữ, giao cho automation, import Jira/TestRail** → QUICK hoặc FULL RBT.

### → Mode DELTA

Kích hoạt khi:
- User dùng command `/update-testcases-from-impact`
- User đưa **Impact Report** (từ `/update-requirements-from-ticket`) hoặc danh sách REQ đã đổi
- User nói: "cập nhật TC theo ticket", "requirement đổi rồi, sửa TC", "TC nào bị ảnh hưởng", "đồng bộ lại bộ TC"
- Module **đã có** `docs/testcases/<module>/TEST_CASES_<TÊN_MODULE>_SUMMARY.md` và yêu cầu vừa thay đổi

> 🚨 **Dấu hiệu bắt buộc kiểm trước khi chọn QUICK/FULL RBT:** module đã có file TC chưa? Đã có mà vẫn chạy QUICK/FULL RBT kiểu sinh mới là sinh bộ TC thứ hai, TC ID đánh lại từ `001`, và mọi `testId` trong automation trỏ về hư không. Xử lý theo mục **Module đã có bộ TC — chế độ BỔ SUNG** ngay dưới.

### Module đã có bộ TC — chế độ BỔ SUNG (áp QUICK · FULL RBT)

**Bước 0 của mọi lượt QUICK / FULL RBT:** kiểm `docs/testcases/<module>/TEST_CASES_<TÊN_MODULE>_SUMMARY.md` (hoặc tên cũ `test_cases_<module>.md`). Không có → sinh mới bình thường. **Có** → rẽ nhánh:

| Tình huống | Làm gì |
|---|---|
| Requirements của REQ **đã có TC** vừa đổi | ⛔ Không sinh — chuyển **Mode DELTA** (`/update-testcases-from-impact`) |
| Có REQ **chưa có TC** (REQ 🟢 mới, hoặc REQ 🔴 thiếu ở Bảng Đối Soát Coverage) | Chạy **BỔ SUNG**: phạm vi chỉ gồm các REQ đó |
| User muốn **sinh lại cả module** | ⛔ Dừng, hỏi user. Chỉ được làm khi chưa có script / execution report / RTM nào trỏ vào bộ TC — cùng luật với *Đổi độ hạt của bộ TC đã có* |

**Luật của chế độ BỔ SUNG:**

- Phạm vi = REQ chưa có TC. **Không** chạm dòng TC đang có
- TC ID **nối tiếp** dải đang dùng (đọc `Dải TC ID đã dùng` ở index) — không chèn giữa, không đánh lại
- **Giữ độ hạt** của bộ TC đang có (GỘP/TÁCH), không theo tham số mặc định
- Ghi **nối vào** file nền tảng / part hiện có (vượt ngưỡng thì mở part mới), cập nhật index: Bản đồ tài liệu · Bảng Đối Soát Coverage · Bảng 4 vòng (chỉ nhánh bị chạm) · dải TC ID · 1 dòng **Nhật ký thay đổi** kèm **mốc git** của file trước khi ghi
- Quality Gate chạy trên **phần vừa sinh**, riêng tiêu chí 6 (Coverage) chạy trên **cả module**

### → Khi không rõ

Nếu không xác định được mode, agent **hỏi user**:
```
Bạn muốn làm gì với test cases?
1. QUICK — Sinh TC chi tiết nhanh từ requirements (không qua bước phân tích)
2. FULL RBT — Sinh TC theo quy trình 6 bước đầy đủ (phân tích → phân rã → RBT → sinh TC)
3. CHECKLIST — Sinh danh sách rà soát ngắn để tick tay (smoke / release / hotfix)
4. DELTA — Cập nhật bộ TC ĐÃ CÓ theo ticket vừa đổi requirements
```

---

## Quy Tắc Đối Chiếu Evidence (BẮT BUỘC — áp dụng cả 4 modes, chạy TRƯỚC batch đầu tiên)

Tài liệu requirements là **mô tả bằng chữ**; ảnh trong `docs/requirements/<module>/<nền-tảng>/evidence/` là **bằng chứng**. Sinh TC chỉ từ chữ dẫn tới bịa bố cục, nhãn, thứ tự tab, định dạng hiển thị — và không ai phát hiện được vì TC đọc vẫn rất thuyết phục.

**Thứ tự tin cậy khi ba nguồn mâu thuẫn:**

```
DOM thật (đọc trực tiếp) > Ảnh evidence > Tài liệu chữ
```

### 1. Mở toàn bộ evidence trước khi sinh TC

- Liệt kê `docs/requirements/<module>/<nền-tảng>/evidence/` của **nền tảng đang sinh TC** (tài liệu cũ chưa có tầng nền tảng: `docs/requirements/<module>/evidence/`) rồi **mở TỪNG ảnh bằng `Read`**. Không được bỏ ảnh nào vì "tên file nghe không liên quan"
- Ảnh của module liên quan (VD Projects tham chiếu Customers) cũng mở nếu TC chạm tới
- **Chưa mở evidence thì chưa được ghi dòng TC đầu tiên**

### 2. Xung đột giữa tài liệu và ảnh → ảnh thắng

Tài liệu ghi một đằng, ảnh cho thấy một nẻo → **KHÔNG tự chọn bên nào**. Bắt buộc:
1. Viết TC theo **những gì ảnh cho thấy**
2. Ghi một dòng `ASM-XX` nêu rõ xung đột, kèm tên tệp ảnh
3. Báo user ngay ở phần tóm tắt cuối — đây là **tín hiệu requirements đã lỗi thời**, cần recon lại

### 3. Evidence thiếu / cắt cụt → gắn `@NeedsVerify`, KHÔNG suy diễn

Ảnh chụp theo viewport thường **cắt mất phần dưới** của form dài (nút Save, checkbox cuối, rich text editor). Vùng không có ảnh chống lưng:

- TC vẫn được viết, nhưng **bắt buộc gắn tag `@NeedsVerify`** và ghi `⚠️ chưa có evidence` trong cột `Expected Result`
- Liệt kê ở mục **"Vùng chưa có evidence"** trong index, kèm đề xuất recon bổ sung theo chuẩn 7.2.1 của skill `skills-requirements-analyzer`
- **NGHIÊM CẤM** viết Expected Result khẳng định chắc chắn về thứ tự Tab, vị trí phần tử, nhãn nút, định dạng hiển thị khi không nhìn thấy trong ảnh

### 4. Bốn nhóm TC BẮT BUỘC phải có evidence chống lưng

| Nhóm TC | Vì sao không được suy diễn |
|---|---|
| Bố cục & thứ tự (tab order, thứ tự cột, thứ tự field) | Bố cục 2 cột làm thứ tự Tab **khác hẳn** thứ tự đọc từ trên xuống |
| Nhãn nguyên văn (nút, tiêu đề, thông báo, tooltip) | Sai một chữ là TC fail giả |
| Giá trị mặc định (checkbox tick sẵn, option đang chọn, multi-select chọn sẵn) | Đây là chỗ tài liệu hay lỗi thời nhất |
| Định dạng hiển thị (tiền tệ `$1,403.00`, giờ `100:00`, ngày `dd-mm-yyyy`, badge màu, avatar) | Assert sai định dạng là fail hàng loạt |

### 5. Có Playwright MCP → đọc DOM, đừng chỉ nhìn ảnh

Ảnh là **bằng chứng lưu trữ**; DOM là **nguồn chính xác**. Ảnh độ phân giải thường **không phân biệt nổi** `disabled` với `không tick`, không đếm được option nào đang `selected` trong multi-select bị cắt, không đọc được `value` hay `data-*`. Khi có Playwright MCP, sau khi mở ảnh hãy đọc thẳng DOM để chốt các con số:

```js
// Mẫu: chốt option, giá trị mặc định, trạng thái khoá — một lượt
() => {
  const q = s => document.querySelector(s);
  const sel = q('#<select_id>');
  return {
    options: [...sel.options].map(o => ({ v: o.value, text: o.text.trim(), subtext: o.getAttribute('data-subtext') })),
    selectedIndex: sel.selectedIndex,
    selectedValues: [...sel.options].filter(o => o.selected).map(o => o.value),
    checkboxes: [...document.querySelectorAll('<scope> input[type=checkbox]')]
      .map(c => ({ name: c.name, checked: c.checked, disabled: c.disabled })),
    fieldOrder: [...document.querySelectorAll('<form> input:not([type=hidden]), <form> select, <form> textarea')]
      .filter(e => e.offsetParent !== null).map(e => e.id || e.name)
  };
}
```

Những thứ **chỉ DOM mới chốt được**: số `<option>` thật (kể cả option rỗng) · `selectedIndex` · danh sách option đang `selected` · `disabled` vs `checked` · `data-subtext` / `data-*` · thứ tự focus thật của form · phần tử ẩn bằng class nhưng vẫn nằm trong DOM.

### 6. Trạng thái phần tử — đọc kỹ ảnh, đừng chỉ đọc nhãn

Checkbox **xám mờ = disabled**, khác hoàn toàn **không tick**. Phát hiện phần tử disabled trong ảnh nghĩa là có **business rule phụ thuộc** mà requirements có thể đã bỏ sót → sinh TC cho cả hai chiều (bật điều kiện → mở khoá; tắt điều kiện → khoá lại) và mở `AMB-<MODULE>-XX`.

---

## Quy Tắc Ngôn Ngữ Kiểm Chứng (BẮT BUỘC — áp dụng cả 4 modes)

> 🚨 Mục trên vừa nói **DOM là nguồn chính xác** — đúng, nhưng đó là luật cho khâu **khảo sát**. Mục này là luật cho khâu **viết TC**, và hai khâu đó KHÔNG dùng chung ngôn ngữ. Agent đọc DOM để **biết sự thật**; TC viết ra để **người khác kiểm chứng lại sự thật đó**.

Người chạy manual TC là **tester**, không phải người viết automation. Họ chấm PASS/FAIL bằng thứ **nhìn thấy trên màn hình**. Một Expected Result kiểu `body.className` chứa `user-id-2` bắt tester mở DevTools, gõ lệnh, đọc chuỗi — và tệ hơn: nó **không phát biểu được yêu cầu nghiệp vụ nào**. Người dùng đâu quan tâm class của thẻ `body`; họ quan tâm mình có vào được Dashboard không.

### 1. Câu hỏi bắt buộc trước khi viết mỗi dòng Expected Result

> **"Người dùng thật sẽ thấy điều này bằng cách nào?"**

Trả lời được bằng mắt thường → viết đúng cái nhìn thấy. Không trả lời được → thuộc nhóm ẩn, xử lý theo mục 3.

### 2. Bảng chuyển ngữ — DOM ❌ → Quan sát được ✅

| ❌ Ngôn ngữ DOM / DevTools | ✅ Viết trong manual TC |
|---|---|
| `document.title` chứa `Dashboard` · `body.className` chứa `user-id-2` | Vào được trang Dashboard, thanh tiêu đề trình duyệt ghi `Dashboard` |
| `input#email.checkValidity()` = `false` | Trình duyệt hiện cảnh báo ngay cạnh ô Email, biểu mẫu **không** gửi đi (trang không nạp lại, dữ liệu đã nhập còn nguyên) |
| Có `input#email[type=email]`, `input#password[type=password]`, `button[type=submit]` | Thấy đủ ô `Email Address`, ô `Password` (gõ vào hiện dấu chấm che), nút `Login` |
| `document.activeElement.id` = `email` | Con trỏ nhấp nháy sẵn trong ô Email, gõ được ngay không cần bấm chuột |
| `offsetParent` = `null`, hộp `0×0` | Không nhìn thấy trên màn hình |
| Đếm `.g-recaptcha` = `0`, `iframe[src*=recaptcha]` = `0` | Trên trang không có ô "Tôi không phải người máy", không có ảnh đố |
| `POST` trả `303`, header `location: /admin/` | Trang tự chuyển sang Dashboard |
| Thân request chứa 4 tham số `csrf_token_name`, `email`… | *(→ nhóm ẩn, xem mục 3)* |

**Nguyên tắc rút ra:** mã HTTP, header, thuộc tính DOM, selector, tab Network **là phương tiện agent dùng lúc khảo sát để chốt sự thật** — không phải ngôn ngữ để giao việc cho tester.

### 3. Nhóm ẩn — tách xuống `Ghi chú kỹ thuật`, gắn `@TechCheck`

Có những yêu cầu **thật sự không có biểu hiện nhìn thấy được**: cookie `autologin`, mã chống CSRF, header `Strict-Transport-Security`, chuyển hướng HTTP→HTTPS, mã `500` thân rỗng. Bỏ đi là mất vết kiểm bảo mật. Cách xử lý:

1. **Expected Result chính** vẫn viết bằng ngôn ngữ quan sát được — phát biểu **hệ quả nghiệp vụ** của cơ chế ẩn đó
2. Phần cấp kỹ thuật tách xuống một dòng riêng mở đầu bằng **`🔧 Ghi chú kỹ thuật (cần DevTools):`**
3. TC gắn tag **`@TechCheck`** để tester biết cần công cụ, và người lập bộ chạy biết TC này giao cho ai

```markdown
✅ Đúng:
| Expected Result |
| 3. Đăng nhập thành công, vào Dashboard<br>4. Đóng hẳn trình duyệt rồi mở lại `crm.anhtester.com/admin/` → **vẫn đang đăng nhập**, không phải nhập lại<br><br>🔧 Ghi chú kỹ thuật (cần DevTools): tồn tại cookie `autologin` khớp hình thái `a:2:{s:7:"user_id";...;s:3:"key";s:16:"<16 ký tự hex>";}`. 🔒 Chỉ ghi hình thái, KHÔNG chép giá trị thật |

❌ Sai (bắt tester đọc cookie mà không nói để làm gì):
| 6. Tồn tại cookie `autologin` khớp hình thái `a:2:{...}` — phần `key` dài đúng 16 ký tự hex |
```

> **Thước đo:** che dòng `🔧 Ghi chú kỹ thuật` đi, TC **vẫn phải chạy và chấm được**. Không chấm được nghĩa là chưa tìm ra hệ quả nghiệp vụ — quay lại tìm, đừng để phần kỹ thuật gánh cả TC.

### 4. Test Steps cũng theo luật này

Steps viết bằng **thao tác người dùng làm được**, không phải lệnh console.

| ❌ | ✅ |
|---|---|
| `5. Đọc mã trạng thái và header location của POST /admin/authentication` | `5. Quan sát trang sau khi bấm Login` |
| `1. Xác nhận $(".started-timers-top").find("li.timer").length > 0` | `1. Xác nhận trên thanh đầu trang đang hiện ít nhất 1 bộ đếm giờ chạy` |
| `4. Đọc document.querySelector('#email').getAttribute('value')` | `4. Nhìn ô Email sau khi trang nạp lại`<br>+ `🔧 Ghi chú kỹ thuật`: xem HTML máy chủ trả về (View Source), thẻ `input#email` phải mang `value=...` |

### 5. Ngoại lệ hợp lệ — được dùng ngôn ngữ kỹ thuật ở TC chính

| Trường hợp | Vì sao |
|---|---|
| `Auto Type` = `API` | TC gốc đã ở tầng giao thức, người chạy là người gọi API |
| Mode CHECKLIST mục dành riêng cho DevOps / security review | Người tick là kỹ sư, không phải tester nghiệp vụ |
| Tên nguyên văn của **nhãn hiển thị** (`Invalid email or password`, nút `Login`, tiêu đề `Forgot Password`) | Đây là thứ tester **đọc trên màn hình**, không phải DOM — vẫn bắt buộc ghi nguyên văn |
| URL đầy đủ (`https://crm.anhtester.com/admin/`) | Tester đọc được trên thanh địa chỉ |

### 6. Selector CSS/XPath — KHÔNG thuộc về manual TC

Selector là tài sản của tầng automation, sống trong Page Object. Nhét `.dropdown-menu > li.header-logout` vào manual TC gây hai hại: tester không dùng được, và khi UI đổi thì selector sai nằm rải trong tài liệu TC không ai đi sửa.

- Thông tin selector thu được lúc recon → ghi vào **`docs/requirements/<module>/REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md`** (mục kỹ thuật), workflow automation đọc từ đó
- Manual TC chỉ mô tả **vị trí nhìn thấy**: "mục `Logout` cuối cùng trong menu ảnh đại diện góc trên bên phải"

### 7. Self-Quality Gate — tiêu chí bổ sung

Trước khi xuất, agent rà lại **toàn bộ** cột `Test Steps` và `Expected Result`:

- [ ] Không còn `document.`, `querySelector`, `checkValidity`, `offsetParent`, `className`, `getAttribute`, `$(`, `input#`, `[type=` ở phần TC chính
- [ ] Không còn mã HTTP / tên header ở phần TC chính (trừ `Auto Type` = `API`)
- [ ] Mọi phần kỹ thuật còn lại nằm dưới `🔧 Ghi chú kỹ thuật (cần DevTools):` và TC đó có tag `@TechCheck`
- [ ] Che hết dòng `🔧 Ghi chú kỹ thuật` → mọi TC vẫn chạy và chấm được

---

## Quy Tắc Xuất File & Theo Dõi Tiến Độ (BẮT BUỘC — áp dụng cả 4 modes)

Bộ TC thường dài 70–100+ dòng bảng. In toàn bộ ra chat khiến user phải chờ render lâu và không thấy được tiến độ. Agent **BẮT BUỘC** tuân thủ quy tắc sau.

### 1. Write-first — KHÔNG render bảng TC ra chat

- Agent ghi TC **thẳng vào file** bằng công cụ Write/Edit sau mỗi batch
- **NGHIÊM CẤM** in toàn bộ bảng TC ra chat rồi mới ghi file (user phải chờ 2 lần cho cùng một nội dung)
- Chat **chỉ** hiển thị:
  - Dòng tiến độ ngắn sau mỗi batch: `✅ Batch 2/4 — Validation form (18 TC) → parts/part_01_danh_sach.md`
  - **Bảng Đối Soát Coverage** (tiêu chí 6) ở cuối
  - Tóm tắt: tổng số TC · số file · đường dẫn file · điểm cần user review
- Muốn xem nội dung → user tự mở file. Chỉ trích dẫn tối đa **3–5 dòng TC mẫu** ra chat khi cần minh họa

### 2. Cấu trúc thư mục & ngưỡng tách file

**Test cases tổ chức theo thư mục từng module, bên trong chia tầng nền tảng** (đối xứng với `docs/requirements/` — CLAUDE.md mục 6b):

```
docs/testcases/
├── README.md                                        ← DANH MỤC toàn hệ thống
└── <module>/
    ├── TEST_CASES_<TÊN_MODULE>_SUMMARY.md                       ← INDEX — TÊN FILE BẤT BIẾN · KHÔNG chứa dòng TC
    ├── web/test_cases_<module>_web.md               ← TC chạy trên web
    ├── mobile/test_cases_<module>_mobile.md         ← TC chạy trên app — tag @Android / @iOS
    ├── api/test_cases_<module>_api.md               ← TC gọi API
    ├── <nền-tảng>/parts/part_NN_<nền-tảng>_<slug>.md ← khi file nền tảng vượt ngưỡng
    ├── impact/impact_plan_<TICKET-ID>.md            ← Mode DELTA: kế hoạch sửa theo từng ticket (cấp module)
    ├── impact/delta_tc_<TICKET-ID>.md               ← Mode DELTA: TC đã sửa xong theo nền tảng — input của /update-automation-from-impact
    ├── impact/automation_plan_<TICKET-ID>.md        ← do /update-automation-from-impact ghi — script đã sửa theo ticket
```

**Tầng nền tảng — luật cứng:**

| Quy tắc | Lý do |
|---|---|
| Chỉ 3 thư mục `web/` · `mobile/` · `api/`; Android và iOS chung `mobile/`, phân biệt bằng tag `@Android` / `@iOS` | Thêm thư mục `android/`, `ios/` là tách đôi dải TC của cùng một màn hình |
| **Luôn có tầng nền tảng**, kể cả module chỉ có một nền tảng | Thêm nền tảng thứ hai về sau không phải di chuyển file — di chuyển là gãy link từ execution report và bug |
| Mỗi TC nằm ở **đúng một** file nền tảng — TC là thứ được **chạy**, và mỗi lần chạy thuộc một nền tảng | Không có "TC dùng chung"; REQ dùng chung thì mỗi nền tảng một TC, cùng `REQ ID` |
| **Dải TC ID chung toàn module**, đánh tiếp qua mọi file nền tảng | `CRM_CUST_TC_041` là duy nhất trong module dù nằm ở `web/` hay `mobile/` — RTM và `testId` của automation không phải biết đường dẫn |
| Tên file nền tảng **mang hậu tố nền tảng** (`test_cases_<module>_web.md`, `part_NN_web_<slug>.md`) | `scripts/testcases-viewer` phân biệt tài liệu theo **tên file** — hai file trùng tên thì file nạp sau ghi đè file trước |
| Bộ TC cũ chưa có tầng nền tảng | Không di chuyển cho tới khi Mode DELTA / sinh thêm chạm lại module → chuyển **một lần** vào file nền tảng, TC ID giữ nguyên, ghi **mốc git** của bản cũ vào Nhật ký |

> ⚠️ **Dự án mới — BẮT BUỘC kiểm tra trước khi ghi bộ TC đầu tiên:** `docs/testcases/README.md` chưa tồn tại thì **tạo ngay** với bảng danh mục rỗng, rồi mới ghi TC và bổ sung dòng đầu tiên. Thiếu file này thì không ai biết prefix TC ID nào đã bị chiếm, và độ phủ REQ↔TC không có chỗ theo dõi.
>
> Nội dung file danh mục gồm 6 mục: bảng danh mục module (kèm **prefix TC ID đã chiếm** và cột `Nền tảng` — số TC từng nền tảng, VD `Web 52 · Mobile 24 · API 18`) · độ phủ so với requirements · cấu trúc thư mục chuẩn · kết quả thực thi (`docs/executions/`) · quy trình sử dụng · nhật ký danh mục.

| Quy tắc | Lý do |
|---|---|
| Tên index **luôn** `TEST_CASES_<TÊN_MODULE>_SUMMARY.md` — chữ IN HOA, `<TÊN_MODULE>` = tên thư mục module viết HOA, `-` đổi thành `_` (VD `login` → `LOGIN`, `customers` → `CUSTOMERS`) — **không phải** prefix REQ (`CUST`) | Mọi workflow phía sau (`/execute-test-cases`, `/review-testcases`, `/generate-automation-from-testcases`, `/generate-traceability-matrix`) đọc theo mẫu `docs/testcases/<module>/TEST_CASES_<TÊN_MODULE>_SUMMARY.md`. IN HOA để file tổng **khác hẳn** file nền tảng `test_cases_<module>_<nền-tảng>.md`. Đổi tên là vỡ chuỗi |
| Tài liệu cũ còn index `test_cases_<module>.md` (quy ước trước 21-09-2026) | Đọc **nhận cả hai tên**. Lần đầu sinh/cập nhật chạm lại module → đổi tên **một lần** sang `TEST_CASES_<TÊN_MODULE>_SUMMARY.md`, sửa link trỏ tới, ghi Nhật ký |
| **KHÔNG** nhét số phiên bản vào tên index (`_v2`, `_new`…) | Phiên bản mới **thay thế** index tại chỗ; bản cũ tra bằng **lịch sử git** |
| Part đặt trong `<nền-tảng>/parts/`, đặt tên `part_NN_<nền-tảng>_<slug>.md` | `NN` có số 0 đứng đầu để sắp xếp đúng; slug mô tả nhóm chức năng; hậu tố nền tảng chống trùng tên file |
| Mode DELTA sửa **tại chỗ** file nền tảng/part, ghi **mốc git** của bản trước khi sửa. **KHÔNG** có thư mục `archive/`, **KHÔNG** chép bản cũ ra file nào | Giữ đúng một nguồn sự thật. Bản sao `_v2` / `archive/` là bộ TC thứ hai nằm cạnh bộ đang dùng — grep TC ID ra hai kết quả, viewer nạp nhầm, lệnh dọn dự án bỏ sót. Git đã giữ mọi phiên bản |

**Ngưỡng tách:**

| Điều kiện | Xử lý |
|---|---|
| ≤ 40 TC ở độ hạt TÁCH · ≤ 50 TC ở độ hạt GỘP — **đếm theo từng nền tảng** | 1 file `<nền-tảng>/test_cases_<module>_<nền-tảng>.md`, không cần `parts/` |
| File nền tảng vượt ngưỡng trên | Tách vào `<nền-tảng>/parts/part_01_<nền-tảng>_<slug>.md`, `part_02_...` — mỗi part dưới ngưỡng, **cắt tại ranh giới nhóm chức năng**, không cắt giữa nhóm |
| Nhiều module | Mỗi module một thư mục riêng, KHÔNG gộp chung |
| Mọi trường hợp | File `TEST_CASES_<TÊN_MODULE>_SUMMARY.md` **luôn là index** (xem mục 4) — TC chi tiết nằm hết trong file nền tảng / part |

> Ngưỡng đếm theo **số TC**, không theo dung lượng — người review đọc lần lượt từng TC, nên số TC mới là thứ quyết định một lượt review có kham nổi không.
>
> Tham khảo dung lượng thực tế với kiểu TC của repo này (steps đánh số + expected khớp 1-1): **~1 KB / TC ở độ hạt TÁCH**, **~1,8 KB / TC ở độ hạt GỘP** (dày hơn vì có Bảng biến thể, nhưng bù lại chỉ còn một nửa số TC). Đừng dùng dung lượng làm ngưỡng tách — file 70 KB gồm 41 TC gộp vẫn dễ review hơn file 40 KB gồm 40 TC vụn.

### 3. Chạy theo batch — không dừng hỏi giữa chừng

- Chia theo **VÒNG** của [Bản Đồ Loại Kiểm Thử — 4 Vòng](#bản-đồ-loại-kiểm-thử--4-vòng-bắt-buộc--khung-sinh-tc-cho-quick--full-rbt--delta): `V1 Smoke` → `V2 Functional` → `V3 Technical` → `V4 Non-functional`. Mỗi batch 15–25 TC
- Vòng 2 thường đông TC → chia con **bên trong vòng** theo nhóm chức năng (validation form / data table / CRUD / status flow). KHÔNG trộn TC của hai vòng khác nhau vào một batch
- Agent **chạy thẳng hết mọi batch trong 1 lượt**, KHÔNG dừng hỏi "có tiếp tục không" sau mỗi batch
- Trước khi sinh, agent công bố kế hoạch batch để user biết tổng khối lượng:
  ```
  Kế hoạch: 5 batch · ~46 TC · 1 file · độ hạt GỘP (mặc định)
  V1 Smoke        (≈9 TC)   — UI cơ bản, mở form, hiển thị, nhập hợp lệ, lưu, đối chiếu
  V2a Validation  (≈14 TC)  — required + 15 loại field
  V2b CRUD & luồng(≈11 TC)  — sửa, xoá, phụ thuộc, đoán lỗi
  V3 Technical    (≈8 TC)   — phân quyền, bảo mật cơ bản  [@TechCheck]
  V4 Non-func     (≈4 TC)   — responsive, bàn phím
  ```
  Dòng kế hoạch **BẮT BUỘC** nêu độ hạt đang dùng — user đọc một dòng là biết sẽ nhận ~46 TC hay ~85 TC và chặn lại được ngay nếu không hợp ý.
- Ngoại lệ được phép dừng: phát hiện requirement mâu thuẫn nghiêm trọng làm sai hàng loạt TC phía sau

### 4. File index (luôn có)

File `docs/testcases/<module>/TEST_CASES_<TÊN_MODULE>_SUMMARY.md` **là index** — giữ nguyên tên, không đổi thành `*_index.md`, **không** chứa dòng TC:

```markdown
# Test Cases — <Module> (tổng <N> TC · <K> nền tảng)

| Thông tin | Nội dung |
|---|---|
| Nguồn requirement | [REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md](../../requirements/<module>/REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md) |
| Dải TC ID đã dùng | `CRM_CUST_TC_001` → `CRM_CUST_TC_094` — chung mọi nền tảng |

## Bản đồ tài liệu
| Nền tảng | File | Nhóm chức năng | Số TC | TC ID | REQ bao phủ |
|---|---|---|---|---|---|
| Web | [web/test_cases_customers_web.md](web/test_cases_customers_web.md) | Danh sách · tạo/sửa · validation | 52 | 001–052 | REQ-CUST-01 → 26 |
| Mobile | [mobile/test_cases_customers_mobile.md](mobile/test_cases_customers_mobile.md) | Danh sách · tạo nhanh · quyền camera | 24 | 053–076 | REQ-CUST-01 → 08 · 27 → 33 |
| API | [api/parts/part_01_api_customers.md](api/parts/part_01_api_customers.md) | `/api/customers` | 18 | 077–094 | REQ-CUST-01 · 34 → 45 |

## Bảng Đối Soát Coverage (toàn module)
<gộp coverage của mọi file nền tảng — có cột theo nền tảng: REQ khai áp N nền tảng thì phải có ≥ 1 TC ở **mỗi** nền tảng đó>
```

- Mỗi file nền tảng / part **BẮT BUỘC** có link ngược về index, link tới file requirements của **cùng nền tảng** (`../../../requirements/<module>/<nền-tảng>/requirements_<module>_<nền-tảng>.md`) và link tới part liền kề
- Bảng Đối Soát Coverage **chỉ nằm ở index**, không nhân bản vào từng file nền tảng
- REQ dùng chung ≥ 2 nền tảng mà thiếu TC ở một nền tảng đã khai → coverage của nền tảng đó là ❌, **không** được tính là "đã phủ" nhờ TC của nền tảng khác
- **Cập nhật `docs/testcases/README.md`** (danh mục) sau khi sinh xong: số TC, số part, REQ bao phủ, ngày cập nhật

### 5. task.md — theo dõi tiến độ

Khi tổng TC dự kiến **>30** hoặc có **≥2 module**, agent **BẮT BUỘC** tạo `task.md` (nhất quán với các command automation trong repo) và cập nhật sau mỗi batch:

```markdown
# Task: Sinh TC module Customers
- [x] Batch 1 — Validation form (24 TC) → part1
- [x] Batch 2 — Data table & filter (18 TC) → part1
- [ ] Batch 3 — CRUD & phân quyền (đang chạy)
- [ ] Batch 4 — Non-functional
- [ ] Quality Gate + Bảng Đối Soát Coverage
```

> Nếu môi trường có sẵn task list của Claude Code → dùng luôn task list thay cho `task.md` để user thấy tiến độ trực tiếp trên UI.

---

## Độ Hạt Test Case — GỘP / TÁCH (BẮT BUỘC chốt TRƯỚC batch đầu tiên, áp dụng QUICK · FULL RBT · DELTA)

Cùng một module, cùng một mức bao phủ, số TC có thể chênh nhau **gấp đôi** chỉ vì độ hạt. Một module đăng nhập viết ở độ hạt vụn ra 80+ TC, viết ở độ hạt gộp ra ~40 TC — **độ phủ REQ y hệt nhau**. Đây là **lựa chọn trình bày**, không phải lựa chọn chất lượng, và phải được chốt trước khi ghi dòng TC đầu tiên.

> Mode CHECKLIST không có tuỳ chọn này — bản thân nó đã là dạng gộp tối đa.

### Hai độ hạt

| | **GỘP** (consolidated) — ⭐ mặc định | **TÁCH** (granular) |
|---|---|---|
| Nguyên tắc | Các biến thể cùng nhóm nằm chung 1 TC, liệt kê trong **Bảng biến thể** | 1 biến thể = 1 TC |
| Số TC điển hình (module cỡ login) | 35–45 | 75–90 |
| Đọc & review | Nhanh — nhìn 1 TC thấy cả nhóm rủi ro | Chậm — phải lướt hàng chục dòng gần giống nhau |
| Chạy tay | Nhanh — mở form 1 lần, chạy hết biến thể | Chậm — lặp lại setup cho từng TC |
| Báo cáo khi FAIL | Phải ghi rõ **biến thể nào** fail | Tự động chỉ đúng TC fail |
| Sang automation | Map thành **test data-driven** (`@DataProvider` · `test.each` · `parametrize`) | Map thành **1 test method / TC** |
| Đếm pass-rate | Thô hơn — 1 biến thể đỏ là cả TC đỏ | Chi tiết từng biến thể |

**Chọn TÁCH khi có ít nhất một trong các điều kiện sau** — ngoài ra luôn dùng GỘP:

- Khách hàng / quy trình yêu cầu **mỗi TC là một dòng** trong Jira, TestRail, Xray (tính công theo số TC, hoặc gán người thực hiện theo từng TC)
- Cần **pass-rate theo từng biến thể** để báo cáo chất lượng
- Module thuộc diện **kiểm định / audit** cần vết thực thi rời cho từng case
- User yêu cầu rõ

### Hai kiểu gộp được phép

**Kiểu A — Gộp biến thể dữ liệu** (dùng cho validation, đây là kiểu chiếm phần lớn số TC cắt được):

Điều kiện: các case **cùng chuỗi thao tác** và **cùng loại phản hồi**, chỉ khác **giá trị đầu vào** (và có thể khác precondition, miễn ghi rõ trong bảng).

```markdown
| TC ID | ... | Test Steps | Bảng biến thể | Priority | ... |
| CRM_LOGIN_TC_012 | ... | 1. Mở /admin/authentication<br>2. Nhập Email theo biến thể<br>3. Nhập Password `Abc12345`<br>4. Bấm `Login`<br>5. Quan sát ô Email và trạng thái trang | **Mọi biến thể cho cùng kết quả:** trình duyệt hiện cảnh báo ngay cạnh ô Email · trang **không** nạp lại, vẫn ở trang đăng nhập · dữ liệu đã nhập ở cả hai ô còn nguyên<br><br>`a` Thiếu `@` → `abc`<br>`b` Thiếu tên miền → `abc@`<br>`c` Thiếu phần trước `@` → `@example.com`<br>`d` Nhiều `@` → `a@b@example.com`<br>`e` Chuỗi tiêm SQL → `admin@example.com' OR '1'='1` | High | ... |
```

**Kiểu B — Gộp kiểm tra tĩnh cùng màn hình** (dùng cho TC cấu trúc / hiển thị):

Điều kiện: cùng precondition, **mọi mục đều là quan sát không làm thay đổi trạng thái** (nhìn màn hình). Mỗi mục là một dòng trong **Bảng kiểm**, có đánh số và ghi REQ tương ứng.

```markdown
| CRM_LOGIN_TC_002 | REQ-LOGIN-02, REQ-LOGIN-03 | ... | 1. Mở /admin/authentication, KHÔNG nhập gì<br>2. Đối chiếu từng mục trong Bảng kiểm | **Bảng kiểm — mọi mục phải đạt:**<br>`1` (REQ-02) Thấy đủ ô `Email Address`, ô `Password`, ô tích `Remember me`, nút `Login`, liên kết `Forgot Password?`<br>`2` (REQ-02) Gõ vào ô Password thì hiện dấu chấm che, không hiện chữ<br>`3` (REQ-03) Con trỏ nhấp nháy sẵn trong ô Email — gõ được ngay, không cần bấm chuột | ... |
```

> Kiểu B **KHÔNG** áp dụng cho hành vi (bấm, gửi, điều hướng) — chỉ cho quan sát tĩnh. Một mục làm đổi trạng thái là phải tách thành TC riêng.

### CẤM gộp — bất kể độ hạt nào đang dùng

| Trường hợp | Vì sao |
|---|---|
| **Khác trường nhập liệu** (Email với Password, Ngày với Số tiền) | FAIL không chỉ ra được trường nào hỏng — mất luôn giá trị chẩn đoán. *Ngoại lệ duy nhất:* TC mục đích là **độ bền** (hệ thống không sập với dữ liệu bất thường), không phải validate trường — khi đó dấu hiệu FAIL là HTTP 500 và bảng biến thể chỉ ngay ra input gây lỗi |
| **Khác LOẠI phản hồi** (một biến thể bị trình duyệt chặn, một biến thể tới máy chủ rồi báo lỗi; một cái lỗi, một cái thành công) | Hai cơ chế khác nhau, gộp lại thì expected result không còn phát biểu được thành một câu |
| Gộp TC `@Smoke` / `Critical` với TC thuộc **nhóm hành vi khác** | Bộ smoke cần vết thực thi rời cho từng luồng sống còn — đây là thứ chạy đầu tiên khi có sự cố. *Được phép:* gộp các **biến thể của cùng một hành vi** (VD cùng phép chặn URL, khác URL) — khi đó bảng biến thể phải ghi rõ biến thể nào thuộc bộ smoke |
| **TC được thiết kế để FAIL** (bám REQ ghi kỳ vọng đúng trong khi hệ thống đang lỗi) | Mỗi TC loại này gắn với **một** bug riêng; gộp là mất ánh xạ TC ↔ bug |
| **Khác REQ ID mà mỗi REQ chỉ có đúng TC đó** | Gộp xong REQ vẫn "có TC" nhưng không còn TC nào **chỉ** kiểm nó → Bảng Đối Soát Coverage mất ý nghĩa. Được gộp khi REQ liên quan còn TC khác chống lưng, và Bảng kiểm ghi rõ REQ ở từng dòng |
| **Khác nhóm chức năng / khác màn hình** | Gộp xuyên nhóm làm hỏng ranh giới tách `parts/` và ranh giới giao việc |

### Ràng buộc bắt buộc khi dùng GỘP

- **Mỗi biến thể có mã riêng** (`a`, `b`, `c`…) — báo cáo FAIL phải ghi được `CRM_LOGIN_TC_012-c`, nếu không thì gộp là mất truy vết
- **Cột `REQ ID` liệt kê đủ mọi REQ** mà TC chạm tới, phân cách `,`
- **Trần 6 biến thể / TC.** Vượt thì tách theo nhóm rủi ro — 12 dòng biến thể trong một ô bảng là không ai đọc nổi
- **Bảng Đối Soát Coverage vẫn tính theo REQ**, không tính theo TC — mọi REQ trong phạm vi vẫn phải có ≥1 TC
- Số TC giảm **không được** kéo theo giảm số **case** kiểm. Gộp là đổi cách trình bày; biến thể bị bỏ đi là **giảm độ phủ** — vi phạm Quality Gate
- **Đếm và công bố số biến thể.** Bảng Đối soát loại kiểm thử ghi `<số TC> TC · <số biến thể>` ở mọi dòng ✅, và dòng tóm tắt cuối chat ghi tổng `<N> TC · <M> biến thể`. Không có con số này thì gộp trở thành cái cớ để rụng case mà không ai phát hiện — Bảng Đối Soát Coverage đếm theo REQ nên **không bắt được**

### Đổi độ hạt của bộ TC đã có

Đổi độ hạt là **đánh lại toàn bộ TC ID**. Vì vậy:

| Tình huống | Cách làm |
|---|---|
| Bộ TC vừa sinh, **chưa** có automation / execution report / RTM nào trỏ vào | Sinh lại ở độ hạt mới, TC ID đánh lại từ `001`, ghi **mốc git** của bản cũ. Ghi lý do vào Nhật ký thay đổi |
| Đã có script `allure.label('testId', ...)`, execution report hoặc RTM trỏ vào | 🚫 **KHÔNG đổi độ hạt.** Đổi là cắt cả ba mối nối cùng lúc và không có cách phát hiện tự động. Muốn gọn hơn thì sinh **checklist** (Mode CHECKLIST) để chạy tay, giữ nguyên bộ TC làm nguồn cho automation |

> 📌 Vì vậy **chốt độ hạt ở lượt sinh đầu tiên** là rẻ nhất. Agent phải nêu rõ độ hạt đang dùng ngay ở dòng kế hoạch batch đầu ra chat.

---

# Mode 1: QUICK — Sinh Test Cases Nhanh

## Mục đích

Sinh test cases **nhanh, đủ chất lượng** từ requirements/user stories đã rõ ràng, phù hợp cho module đơn giản hoặc khi cần kết quả ngay.

## Quy trình (1 lượt duy nhất)

**Agent phải:**

0. **Kiểm module đã có bộ TC chưa** — có thì rẽ nhánh theo mục [Module đã có bộ TC — chế độ BỔ SUNG](#module-đã-có-bộ-tc--chế-độ-bổ-sung-áp-quick--full-rbt)
1. **Đọc và hiểu requirements** được cung cấp
   - Nếu requirements đã có mã REQ ID (từ `skills-requirements-analyzer`) → dùng nguyên mã đó
   - Nếu chưa có mã → agent tự gán `REQ-<MODULE>-<SỐ>` cho từng yêu cầu/rule trước khi sinh TC
2. **Mở toàn bộ evidence** theo [Quy Tắc Đối Chiếu Evidence](#quy-tắc-đối-chiếu-evidence-bắt-buộc--áp-dụng-cả-4-modes-chạy-trước-batch-đầu-tiên) — liệt kê `docs/requirements/<module>/<nền-tảng>/evidence/` và `Read` từng ảnh. **Chưa làm xong bước này thì chưa được ghi dòng TC đầu tiên.** Ghi lại ảnh nào cắt cụt / vùng nào không có ảnh để dùng ở bước 10
3. **Ghi nhận Assumptions (BẮT BUỘC khi requirement mơ hồ):**
   - QUICK mode không dừng hỏi Q&A → mọi điểm không rõ agent phải **ghi rõ giả định** đã dùng
   - Xuất mục "Assumptions" ngay đầu output: `ASM-XX | Điểm chưa rõ | Giả định đã áp dụng | TC bị ảnh hưởng`
   - KHÔNG được đoán ngầm mà không ghi lại
4. **Xác định các luồng chính:**
   - Happy Path (luồng chính)
   - Negative Path (dữ liệu sai, thiếu)
   - Boundary Cases (giá trị biên)
4b. **Lập kế hoạch theo 4 vòng (BẮT BUỘC — làm TRƯỚC khi ghi dòng TC đầu tiên):**
   - Duyệt [Bản Đồ Loại Kiểm Thử — 4 Vòng](#bản-đồ-loại-kiểm-thử--4-vòng-bắt-buộc--khung-sinh-tc-cho-quick--full-rbt--delta), chấm sơ bộ từng nhánh `✅ sẽ sinh` / `➖ không áp dụng (lý do)`
   - Sinh **tuần tự V1 → V2 → V3 → V4**, KHÔNG nhảy cóc. Vòng 1 luôn mở đầu bằng nhánh `UI cơ bản`
   - Công bố kế hoạch batch theo vòng ra chat trước khi sinh
5. **Áp dụng kỹ thuật thiết kế test case** theo Quy Tắc Bắt Buộc Áp Dụng Kỹ Thuật (xem section riêng):
   - **Equivalence Partitioning (EP):** Chia input thành nhóm tương đương
   - **Boundary Value Analysis (BVA):** Test giá trị tại ranh giới
   - **Decision Table:** Liệt kê tổ hợp điều kiện (nếu có nhiều rules)
   - **State Transition:** Test chuyển đổi trạng thái (nếu có workflow)
6. **Validation chuyên biệt từng trường (Field-Level Validation):**
   - Liệt kê **tất cả input fields** trên form/UI
   - Sinh validation test cases **riêng cho TỪNG trường** dựa theo Bảng Checklist 15 loại field
   - **KHÔNG** gộp validation của **các trường khác nhau** vào 1 test case (xem CẤM gộp ở mục Độ Hạt)
   - Ở độ hạt **GỘP** (mặc định): các biến thể **cùng một trường** cho cùng loại phản hồi thì nằm chung 1 TC dưới dạng Bảng biến thể (Kiểu A). Ở độ hạt **TÁCH**: mỗi biến thể một TC
7. **Bao phủ Component-Level Checklist:** Data Table/List, CRUD Lifecycle, Permission/Role, Modal/Dialog, Notification (xem bảng riêng bên dưới)
8. **Bao phủ các Scenarios Chuyên sâu & Non-Functional:**
   - Race Condition & Double Submit
   - Session & Network Resilience
   - Localization & UTF-8 / Emoji
   - Keyboard Accessibility (A11y)
   - HTTP Status Codes (cho API TCs)
9. **Xuất ra bảng Markdown** chuẩn có đầy đủ metadata cho Automation, sẵn sàng sync vào Google Sheets hoặc Jira/TestRail. Cột `Automation` chấm theo [Tiêu chí chấm cột Automation](references/automation_criteria.md), ghi mục `## Đối soát cột Automation` vào index.
10. **Chạy Self-Quality Gate (11 Tiêu chí, 0–10):** Rà soát lại 100% test cases + đối soát coverage (6) + đối soát evidence (7) + **rà ngôn ngữ kiểm chứng** (8) + **rà đặc tính chất lượng ISO/IEC 25010** (9) + **đối soát loại kiểm thử 4 vòng** (10) trước khi xuất kết quả.

## Bảng Output Standard (chuẩn hóa đầy đủ Metadata)

```markdown
| TC ID | REQ ID | Module | Risk Level | Test Scenario | Pre-Condition | Test Steps | Test Data | Expected Result | Priority | Automation | Auto Type | Tags |
```

> **Giải thích Metadata:**
> - **REQ ID:** Mã requirement mà TC này cover (`REQ-LOGIN-01`) — BẮT BUỘC, 1 TC có thể cover nhiều REQ (phân cách `,`). Đây là mắt xích truy vết để đối soát "đủ case" và chạy `/generate-traceability-matrix`
> - **Risk Level:** `High` / `Medium` / `Low` — mức rủi ro của vùng chức năng TC này chạm tới, tương ứng mức `Cao` / `Trung bình` / `Thấp` của mục **Độ sâu theo rủi ro** (ô bảng ghi tiếng Anh vì viewer sort theo giá trị này). **KHÔNG được bỏ cột này**: `scripts/testcases-viewer` có cột Risk và cho sort theo nó, thiếu cột thì toàn bộ cột Risk hiện `—` và sort mất tác dụng
> - **Automation:** `Yes` / `No` / `Partial` — chấm theo [Tiêu chí chấm cột Automation](references/automation_criteria.md) (**BẮT BUỘC đọc trước batch đầu tiên**): 3 trục kỹ thuật · sẵn sàng · đáng làm, lấy mức thấp nhất. **KHÔNG** gắn `Yes` mặc định — TC chạm OTP, email, CAPTCHA, biểu đồ, SSO… phải tra bảng. Ô chỉ ghi **đúng một từ**; điều kiện của `Partial`, lý do của `No` ghi vào mục `## Đối soát cột Automation` của index — viewer lọc cột này theo giá trị chính xác
> - **Auto Type:** `UI` / `API` / `Unit` / `N/A` (Loại automation phù hợp)
> - **Tags:** `@Smoke`, `@Regression`, `@CriticalPath`, `@Security`, `@Boundary` · tag có nghĩa với workflow khác: `@TechCheck` (cần DevTools — Quy Tắc Ngôn Ngữ Kiểm Chứng) · `@NeedsVerify` (chưa có evidence chống lưng) · `@PersonalOnly` · `@Deprecated` (hai tag dưới)
> - **`@Deprecated`** — TC của chức năng đã gỡ. Bảng TC **không có cột trạng thái** (viewer không đọc cột lạ), nên trạng thái ghi bằng **hai dấu hiệu cùng lúc**: tag `@Deprecated` ở cột `Tags` **và** tiền tố `🗑️ Deprecated (<TICKET-ID>, <DD-MM-YYYY>) —` ở đầu ô `Test Scenario` / `Test Title`. Giữ nguyên dòng và TC ID. TC `@Deprecated`: **bị loại khỏi phạm vi** của `/execute-test-cases` (không tính vào tổng, không tính SKIPPED) · **không tính** vào Bảng Đối Soát Coverage, Bảng 4 vòng, Đối soát cột Automation, RTM · không chấm rubric khi review
> - **`@PersonalOnly`** — QA **tự chạy và tự theo dõi** ngoài workflow (TC chạy quá lâu, cần thao tác tay đặc biệt…) → `/execute-test-cases` **bỏ qua**. Đây là tag **duy nhất** làm `/execute-test-cases` bỏ qua TC. Cột `Automation` (`Yes`/`Partial`/`No`) chỉ nói TC có làm automation hay không — TC `Automation = No` **vẫn** được `/execute-test-cases` chạy
> - **Tag nền tảng** — BẮT BUỘC khi module có ≥ 2 nền tảng (requirements có cột `Nền tảng`, skill `skills-requirements-analyzer` mục 2.2): mỗi TC gắn `@Web` · `@Android` · `@iOS` · `@API` theo nền tảng nó chạy. REQ `Nền tảng` = `Tất cả` mà các bước thao tác khác nhau giữa nền tảng → **mỗi nền tảng một TC**, cùng `REQ ID`, mỗi TC nằm ở file nền tảng của nó. Dùng **tag**, **không** thêm cột `Nền tảng` — viewer map cột theo tên, cột lạ bị bỏ qua. TC nằm ở file của **đúng** nền tảng nó chạy (`web/` · `mobile/` · `api/` — mục 2 của Quy Tắc Xuất File); chung prefix nên **chung dải TC ID** toàn module — ❌ không mở dải TC ID riêng cho mobile/API
>
> ⚠️ **Tên cột là hợp đồng đọc, không phải nhãn trình bày.** `scripts/testcases-viewer` map cột theo **tên**, nên thứ tự cột đổi được nhưng tên thì không: `TC ID`, `REQ ID`, `Module`, `Priority`, `Automation`, `Tags` phải khớp **chính xác** (thêm chữ như `TC ID liên quan` là mất cột), còn `Risk`, `Scenario`/`Test Title`, `Pre-Condition`, `Test Steps`, `Test Data`, `Expected`, `Auto Type` khớp theo chuỗi con. **KHÔNG dịch tên cột sang Tiếng Việt** — nội dung ô viết Tiếng Việt, tên cột giữ nguyên.
>
> **Ở độ hạt GỘP:** cột `Test Data` (Kiểu A) hoặc `Expected Result` (Kiểu B) chứa **Bảng biến thể / Bảng kiểm** — mỗi dòng một mã (`a`, `b`, `c`…), phân cách bằng `<br>`. Số cột của bảng **không đổi**, chỉ nội dung ô dày hơn. Xem mẫu ở mục Độ Hạt Test Case.

## Quy Tắc Trình Bày Test Steps (BẮT BUỘC — áp dụng QUICK, FULL RBT & DELTA)

> Mode CHECKLIST KHÔNG dùng steps đánh số — xem Quy Tắc Viết Mục Checklist ở Mode 3.

- **Mỗi bước 1 hành động, đánh số thứ tự rõ ràng** `1. 2. 3.` — trong cell Markdown dùng `<br>` xuống dòng
- **Expected Result đánh số khớp 1-1** với step tương ứng (step nào có kết quả quan sát được thì có expected cùng số)
- KHÔNG viết steps thành đoạn văn liền, KHÔNG gộp nhiều hành động vào 1 số

```markdown
✅ Đúng:
| Test Steps | Expected Result |
| 1. Mở trang /login<br>2. Nhập email: test_login_01@auto.test<br>3. Nhập password: Test@123<br>4. Click nút "Đăng nhập" | 1. Trang login hiển thị đủ 2 field + nút<br>4. Chuyển đến /dashboard, hiển thị "Xin chào" |

❌ Sai:
| Mở trang login rồi nhập email và password hợp lệ sau đó bấm đăng nhập | Đăng nhập thành công |
```

## Quy tắc Test Data (áp dụng cho cả 4 modes)

```
❌ Sai: "Nhập mã số hợp lệ"
✅ Đúng: "Nhập mã: KH-2026-0012"

❌ Sai: "Nhập email hợp lệ"
✅ Đúng: "Nhập email: test_khachhang_01@domain.com"

❌ Sai: "Nhập giá trị vượt giới hạn"
✅ Đúng: "Nhập 256 ký tự vào trường Name (max: 255)"
```

## Bản Đồ Loại Kiểm Thử — 4 Vòng (BẮT BUỘC — khung sinh TC cho QUICK · FULL RBT · DELTA)

> Hai bảng checklist ngay bên dưới (Field-Level 15 loại · Component-Level) trả lời *"trường này / thành phần này phải test gì"*. Bảng này trả lời câu **khác hẳn**: ***"bộ TC đã đi qua đủ các LOẠI kiểm thử chưa, và theo thứ tự nào"*** — chống bỏ sót nguyên một lớp test. Lớp hay bị mất nhất: **giao diện ở Vòng 1**, vì phần validation vẫn đủ nên nhìn qua tưởng bộ TC đã kín.
>
> **Phân biệt với bảng ISO/IEC 25010 ở cuối skill:** 4 vòng là **khung tác nghiệp lúc sinh** — chia batch, đặt thứ tự, chấm thiếu-đủ theo nhánh. ISO 25010 là **khung rà soát lúc xuất** — đặc tính nào ngoài phạm vi, ai chịu trách nhiệm, nuôi mục 2.2 của Master Test Plan. Chạy **cả hai**, không cái nào thay được cái nào.

### Thứ tự bắt buộc

```
VÒNG 1 – SMOKE            → màn hình dựng được, luồng sống còn không vỡ
VÒNG 2 – FUNCTIONAL       → phần thân của mọi bộ TC (~60–70% số TC)
VÒNG 3 – TECHNICAL        → phần lớn cần DevTools/DB → tag @TechCheck
VÒNG 4 – NON-FUNCTIONAL   → phần lớn chấm ➖ ở app nghiệp vụ thường
```

Sinh **tuần tự V1 → V4**, không nhảy cóc. Lý do không phải hình thức: Vòng 1 fail thì **mọi TC Vòng 2 đều BLOCKED** — biết trong 10 phút đầu để dừng, thay vì chạy hết 40 TC rồi mới phát hiện form không mở được.

---

### VÒNG 1 — SMOKE

| Nhánh | Kích hoạt khi | TC phải có | Trỏ về |
|---|---|---|---|
| **UI cơ bản** | **Luôn luôn** | Màn hình hiển thị **đủ** thành phần theo evidence: nhãn nguyên văn, thứ tự field, nút, liên kết, tiêu đề. Trạng thái mặc định từng ô (rỗng / tick sẵn / option đang chọn / con trỏ đang ở đâu) | Gộp **Kiểu B** · 4 nhóm evidence bắt buộc |
| **Open form** | Có form / modal / trang con | Mở được bằng **mọi lối vào** (nút, menu, URL trực tiếp) · đóng được bằng X / Cancel / ESC / click ra ngoài | Component-Level → Modal/Dialog |
| **Display** | Có dữ liệu hiển thị | Định dạng hiển thị đúng (tiền tệ, ngày, giờ, badge, avatar) · trạng thái rỗng · trạng thái đang tải | 4 nhóm evidence bắt buộc |
| **Input valid data** | Có form nhập | Bộ dữ liệu hợp lệ **tối thiểu** (chỉ field bắt buộc) và bộ **đầy đủ** (mọi field) | Quy tắc Test Data |
| **Save** | Có hành động lưu | Lưu thành công → thông báo đúng → điều hướng đúng | Component-Level → CRUD |
| **Verify data** | Có lưu | Dữ liệu vừa lưu hiện đúng ở **danh sách** *và* ở **màn hình chi tiết** | Component-Level → CRUD |

> 🚨 **Nhánh `UI cơ bản` là chỗ bị bỏ sót nhiều nhất.** Bộ TC không có TC nào kiểm nhãn / thứ tự / trạng thái mặc định của màn hình là **thiếu hẳn một lớp**, dù phần validation đầy đủ đến đâu. Nhánh này **KHÔNG BAO GIỜ** được chấm `➖`.

---

### VÒNG 2 — FUNCTIONAL

| Nhánh | Kích hoạt khi | TC phải có | Trỏ về |
|---|---|---|---|
| **UI Behavior** | Có tương tác làm đổi giao diện | Field bật/tắt theo lựa chọn khác · nút khoá đến khi đủ điều kiện · bộ đếm ký tự · gợi ý autocomplete · nút hiện/ẩn mật khẩu | Quy Tắc Đối Chiếu Evidence mục 6 (disabled ≠ không tick) |
| **Required** | Có field bắt buộc | Bỏ trống **TỪNG** field bắt buộc → thông báo trỏ đúng field đó · bỏ trống tất cả | Bảng Field-Level |
| **Validation** | Mọi field có ràng buộc | Đối soát **đủ từng mục** của loại field tương ứng trong bảng 15 loại — mục bỏ qua phải ghi lý do | Bảng Field-Level |
| **Equivalence Partitioning** | Field có miền giá trị phân nhóm được | Mỗi partition ≥1 TC | Quy Tắc Bắt Buộc Áp Dụng Kỹ Thuật |
| **Boundary Value Analysis** | Field có min/max | `min-1` · `min` · `max` · `max+1` | nt |
| **Business Rule** | Có quy tắc nghiệp vụ | Mỗi rule ≥1 TC tuân thủ + ≥1 TC vi phạm (verify bị chặn) | nt |
| **Decision Table** | ≥3 điều kiện kết hợp → 1 output | Mỗi rule (cột) = 1 TC | nt |
| **State Transition** | Entity có ≥3 trạng thái | Mọi transition hợp lệ + mọi transition **bị chặn** | nt · Component-Level → Status Flow |
| **Dependency** | Field / màn hình phụ thuộc nhau | Đổi A → B đổi theo · xoá A đang được B tham chiếu · A rỗng thì B khoá | Component-Level → CRUD (khoá ngoại) |
| **Use Case / Scenario** | Có luồng nghiệp vụ nhiều bước | Chuỗi end-to-end **trong phạm vi module** (tạo → sửa → đổi trạng thái → tìm lại) | — |
| **Save / Edit / Delete** | Có CRUD | Toàn bộ CRUD Lifecycle, gồm huỷ giữa chừng và xoá bản ghi đang được liên kết | Component-Level → CRUD |
| **Error Guessing** | **Luôn luôn** | Bấm Lưu hai lần liên tiếp · dán dữ liệu lạ · bấm Back sau khi lưu · nạp lại trang giữa chừng · mở 2 tab cùng sửa | Scenarios Chuyên Sâu |

> `Positive` / `Negative` **KHÔNG phải nhánh riêng** — chúng là thuộc tính của mọi nhánh bên trên. Chấm ở mức bộ TC (Gate #4), **không** tạo batch riêng, **không** tạo dòng riêng trong bảng đối soát.

---

### VÒNG 3 — TECHNICAL

> ⚠️ Đa số nhánh vòng này **không kiểm được bằng mắt** → nội dung phải nằm dưới `🔧 Ghi chú kỹ thuật (cần DevTools):` và TC mang tag `@TechCheck` theo **Quy Tắc Ngôn Ngữ Kiểm Chứng**. Viết mã HTTP / câu SQL / tên bảng vào phần TC chính là **vi phạm Gate #8**.

> 🔑 **Bốn nhánh `API` · `Database` · `Integration` · `Logging/Audit` là thuộc tính CẤP DỰ ÁN, không phải cấp module.** QA có quyền gọi API hay không thì mọi module đều giống nhau — hỏi lại ở từng module là bắt user trả lời cùng một câu hàng chục lần.
>
> **Thứ tự bắt buộc:**
> 1. **Đọc `docs/requirements/README.md`** → bảng thuộc tính ở đầu file, dòng **`Năng lực kiểm thử của QA`**. Có sẵn thì **dùng luôn, KHÔNG hỏi lại** — chép nguyên lý do và người chịu trách nhiệm vào bảng đối soát 4 vòng
> 2. Chưa có dòng đó (dự án cũ, hoặc `/discover-system` chạy trước khi có luật này) → hỏi user **đúng một lần**, rồi **ghi ngay vào `docs/requirements/README.md`** trước khi sinh dòng TC đầu tiên
> 3. Trả lời của user **có thể kiểm chứng được** thì kiểm luôn thay vì tin lời: mở đúng trang nhật ký hoạt động của hệ thống, thử gọi một API đọc. Ghi **kết quả đo** kèm ngày vào README — nó chính xác hơn câu trả lời từ trí nhớ
>
> Mẫu dòng ghi vào bảng thuộc tính của `docs/requirements/README.md`:
>
> ```markdown
> | **Năng lực kiểm thử của QA** | Chốt <ngày> — dùng cho nhánh Vòng 3 của **mọi** bộ TC:<br>• Gọi API: ❌/✅ + ai chịu nếu ❌<br>• Truy vấn CSDL: ❌/✅ + ai chịu<br>• Kiểm tầng tích hợp: ❌/✅ + ai chịu<br>• Xem nhật ký hoạt động: ❌/✅ + đường dẫn đã thử + kết quả đo<br>• DevTools trình duyệt: ❌/✅ |
> ```
>
> Dòng này đổi khi **quyền của QA đổi** (được cấp tài khoản mới, mở quyền DB), không đổi theo module. Đổi thì cập nhật README và ghi vào Nhật ký danh mục — các bộ TC đã sinh có nhánh `➖` vì lý do cũ cần rà lại.

| Nhánh | Kích hoạt khi | TC phải có | Mặc định nếu không áp dụng |
|---|---|---|---|
| **Permission** | Có ≥2 role | Ma trận Phân quyền: mỗi role × mỗi hành động · truy cập URL trực tiếp khi không đủ quyền · phần tử ẩn/khoá đúng theo role | 🚫 **Không được `➖`** khi hệ thống có ≥2 role |
| **Security** | Luôn (mức cơ bản) | Truy cập khi chưa đăng nhập · dữ liệu người này có lộ sang người kia không · XSS/SQLi ở field text · phiên sau khi đăng xuất · nút Back sau đăng xuất | `➖` chỉ khi có đội security riêng — **bắt buộc ghi tên đội** |
| **API** | QA được phép gọi API | Mã trạng thái theo từng thao tác · gọi thẳng API bỏ qua UI · gọi thiếu/sai token | `➖` ghi *"QA không có quyền gọi API"* |
| **Database** | QA được phép truy vấn DB | Dữ liệu lưu đúng bảng/đúng kiểu · xoá mềm hay xoá cứng · dữ liệu rác còn lại sau khi huỷ giữa chừng | `➖` ghi *"không có quyền truy cập DB — đội Dev xác minh"* |
| **Integration** | Có tích hợp bên thứ ba | Bên thứ ba trả lỗi / quá hạn chờ / không phản hồi → app xử lý ra sao | `➖` ghi rõ hệ thống nào không kiểm |
| **Logging / Audit** | Có yêu cầu nhật ký thao tác | Thao tác quan trọng có ghi nhật ký (ai · lúc nào · đổi gì) · nhật ký không lộ dữ liệu nhạy cảm | `➖` ghi *"requirements không có yêu cầu audit"* |

---

### VÒNG 4 — NON-FUNCTIONAL & REGRESSION

> Ở app nghiệp vụ thông thường, **phần lớn vòng này chấm `➖` là kết quả ĐÚNG** — không phải thiếu sót. Nhưng `➖` phải **ghi ai chịu trách nhiệm**; ô `➖` ở đây chính là nguồn cho mục **2.2 Ngoài phạm vi** của `/generate-master-test-plan`. Đó là khác biệt giữa *"QA quên test"* và *"đã xem xét và thống nhất không test"*.

| Nhánh | Kích hoạt khi | TC phải có | Ghi chú |
|---|---|---|---|
| **Compatibility** | Có cam kết đa trình duyệt | Danh sách trình duyệt/phiên bản **đã chốt** × luồng chính | Ghi rõ trình duyệt nào **không** kiểm |
| **Responsive / UI Stability** | App có bản web đáp ứng | Các breakpoint **đã chốt** (VD 1920 · 1366 · 768 · 375) · không tràn ngang · không đè chữ · phóng to 125% | Phải chốt danh sách breakpoint — cấm ghi *"mọi kích thước màn hình"* |
| **Accessibility** | Luôn (mức cơ bản) | Tab theo thứ tự hợp lý · Enter/Space kích hoạt · viền focus nhìn thấy được · ảnh có văn bản thay thế | WCAG đầy đủ cần công cụ riêng → phần đó `➖` |
| **Performance** | Có ngưỡng thời gian đã cam kết | Chỉ mức quan sát thô: trang tải quá lâu · danh sách lớn bị treo | Đo tải thật → `➖`, ghi đội hiệu năng |
| **Regression** | Module đã từng có bug được đóng | Mỗi bug đã đóng = 1 TC chống tái phát, **trỏ về mã bug** | Nguồn: `docs/bugs/<module>/` |
| **E2E** | Luồng đi qua ≥2 module | Kịch bản xuyên module, dữ liệu chảy từ module này sang module kia | Luồng phức tạp → chuyển sang `/generate-cross-module-test-plan` |

---

### Độ sâu theo rủi ro — không phải chức năng nào cũng chạy đủ 4 vòng

Bảng 4 vòng ở trên chống **bỏ sót**. Mục này chống **thừa** — bơm 50 TC cho một trang "Giới thiệu" tĩnh cũng tai hại ngang bỏ quên lớp giao diện của màn thanh toán: nó ngốn công viết, công chạy, công bảo trì, và làm loãng bộ TC thật.

Cơ chế phân xử **không phải là cái mới** — đó chính là `Risk Level` vốn đã có ở cột bảng TC và ở Bước 5 của Mode FULL RBT. Mục này nối nó vào khung 4 vòng.

#### Chấm mức rủi ro — agent tự chấm, KHÔNG hỏi user

| Mức | Điều kiện | Cách chấm |
|---|---|---|
| **Cao** | Chỉ cần **MỘT** dấu hiệu: đụng tiền hoặc số liệu tài chính · đụng xác thực/phân quyền · đụng dữ liệu cá nhân khách hàng · có thao tác **không hồi lại được** (xoá cứng, gửi mail ra ngoài, chốt sổ) · là **cổng vào** module khác (hỏng thì chặn cả đợt kiểm thử) | Đủ 1 dấu hiệu là Cao, không cần cân nhắc thêm |
| **Thấp** | Phải đủ **CẢ BỐN**: chỉ hiển thị, không ghi dữ liệu · không có field nhập (hoặc chỉ có ô tìm kiếm) · hỏng thì không ai mất dữ liệu và không chặn việc gì · sửa lại được trong vài phút, không cần triển khai lại | Thiếu một điều kiện là **không** được chấm Thấp |
| **Trung bình** | Phần còn lại | Mặc định khi lưỡng lự |

> 🚨 **Lưỡng lự thì chấm mức CAO HƠN.** Chấm nhầm Cao chỉ tốn công viết thừa vài TC; chấm nhầm Thấp là bỏ lọt lỗi ra production. Hai sai lầm này **không cùng giá**.
>
> Agent **tự chấm và ghi căn cứ** — không thêm câu hỏi cho user. User phủ quyết ở **checkpoint Bước 4** (FULL RBT) hoặc ở dòng kế hoạch batch (QUICK); đó là lúc nhìn một bảng là chặn được, rẻ hơn nhiều so với chặn sau khi đã sinh xong.

#### Ba mức độ sâu

| | **Đầy đủ** (rủi ro Cao) | **Tiêu chuẩn** (Trung bình) | **Tối giản** (Thấp) |
|---|---|---|---|
| **V1 Smoke** | Đủ 6 nhánh | Đủ 6 nhánh | **Đủ 6 nhánh — KHÔNG rút** |
| **V2 Functional** | Đủ mọi nhánh có điều kiện kích hoạt | Đủ mọi nhánh có điều kiện kích hoạt | Chỉ `Required` · `Validation` của field **có ràng buộc thật**; phần còn lại `⏭️` |
| **V3 Technical** | Đủ 6 nhánh | `Permission` + `Security`; còn lại theo Năng lực kiểm thử của QA | `Permission` (nếu ≥2 role); còn lại `⏭️` |
| **V4 Non-functional** | Đủ 6 nhánh | `Responsive` + `Accessibility`; còn lại `⏭️` | Toàn bộ `⏭️` |
| **Số TC điển hình** (độ hạt GỘP, module cỡ Login) | 40–60 | 20–30 | 8–12 |

#### Bốn thứ KHÔNG BAO GIỜ rút, bất kể rủi ro thấp đến đâu

| Không rút | Vì sao |
|---|---|
| **Toàn bộ V1** | Bỏ V1 thì không biết chức năng **có chạy được không**. Sáu TC là cái giá rẻ nhất để biết điều đó |
| `V2 · Required` + `V2 · Validation` khi **có field nhập** | Có ô nhập là có người nhập sai. Trang "chỉ hiển thị" mà có ô nhập thì nó không còn là "chỉ hiển thị" — chấm lại mức rủi ro |
| `V3 · Permission` khi hệ thống có **≥2 vai trò** | Lỗi phân quyền không tỷ lệ với độ quan trọng của chức năng: một trang xem báo cáo tưởng vô hại vẫn có thể lộ dữ liệu cả công ty |
| `V3 · Security` khi chức năng chạm **dữ liệu của người dùng khác** | Cùng lý do trên |

#### Trạng thái thứ tư: `⏭️` — phân biệt với `➖`

Bảng đối soát 4 vòng có **bốn** trạng thái, không phải ba:

| Ký hiệu | Nghĩa | Bắt buộc ghi kèm |
|---|---|---|
| `✅` | Có TC | TC ID (kèm số biến thể nếu GỘP) |
| `➖` | **Không áp dụng** — không có thứ đó để kiểm (module không có CRUD, không có dropdown, không có tích hợp) | Lý do kỹ thuật |
| `⏭️` | **Cố ý bỏ** — có thứ đó, kiểm được, nhưng **quyết định không kiểm** vì rủi ro thấp | **Lý do + ai quyết định + điều kiện rà lại** |
| `🔴` | Thiếu — phải bổ sung trước khi xuất | — |

> 🚨 **`➖` và `⏭️` KHÔNG được dùng lẫn.** `➖` là **sự thật kỹ thuật** ("hệ thống không có cái đó"). `⏭️` là **một quyết định có người chịu trách nhiệm** ("có, nhưng chúng tôi chấp nhận rủi ro không kiểm"). Khi có sự cố production, hai câu đó dẫn tới hai cuộc họp hoàn toàn khác nhau. Ghi `➖` cho thứ thật ra là `⏭️` là **giấu quyết định** — nguy hiểm hơn cả bỏ trống ô.

Mẫu dòng `⏭️` đạt yêu cầu:

```markdown
| 4 | Compatibility | ⏭️ Cố ý bỏ | Trang tĩnh, rủi ro Thấp — chỉ kiểm Chrome. **Quyết định: QA lead, 11-09-2026.** Rà lại khi trang có thêm field nhập hoặc khi hệ thống cam kết hỗ trợ trình duyệt mới |
```

```markdown
❌ Không đạt: | 4 | Compatibility | ⏭️ | Không cần thiết |
```

#### Ghi mức độ sâu vào tài liệu TC

Ngay dưới tiêu đề bộ TC, thêm một dòng để người đọc biết bộ này **cố tình** dừng ở đâu:

```markdown
| **Mức rủi ro · độ sâu** | `Thấp` → **Tối giản** — V1 đủ 6 nhánh, V2 chỉ nhánh có ràng buộc, V3/V4 phần lớn `⏭️`.<br>Căn cứ chấm Thấp: chỉ hiển thị · không ghi dữ liệu · không có field nhập · hỏng không chặn việc gì.<br>**Nâng lên Tiêu chuẩn khi:** thêm bất kỳ field nhập nào, hoặc chức năng bắt đầu ghi dữ liệu |
```

> Dòng **"Nâng lên khi…"** là phần quan trọng nhất — nó biến quyết định rút gọn hôm nay thành thứ **tự hết hạn** khi chức năng lớn lên, thay vì một lựa chọn bị quên vĩnh viễn.

---

### Cách dùng — 5 quy tắc

1. **Chia batch theo VÒNG**, không chia tự do theo nhóm chức năng. Vòng 2 đông TC thì chia con **bên trong vòng đó** theo nhóm chức năng.
2. **Chấm từng nhánh, không bỏ trống ô nào** — **bốn** trạng thái: `✅ Có TC` (dẫn TC ID) · `➖ Không áp dụng` (không có thứ đó để kiểm — ghi lý do kỹ thuật) · `⏭️ Cố ý bỏ` (có nhưng rủi ro thấp — ghi **lý do + ai quyết định + điều kiện rà lại**) · `🔴 Thiếu` (phải bổ sung **trước khi xuất**). Xem mục **Độ sâu theo rủi ro** ở trên để biết khi nào được dùng `⏭️`.
3. 🚫 **KHÔNG sinh TC để lấp ô, cũng KHÔNG chạy đủ 4 vòng cho chức năng rủi ro Thấp.** Nhánh không có gì để kiểm thì `➖`; nhánh có mà không đáng đầu tư thì `⏭️`. TC sinh ra chỉ cho bảng đẹp là TC rác — cùng một luật với bảng ISO 25010.
4. **Ba nhánh KHÔNG BAO GIỜ được `➖`:** `UI cơ bản` (V1) · `Validation` (V2, khi có field nhập) · `Permission` (V3, khi có ≥2 role). Chấm `➖` ở ba chỗ này là dấu hiệu agent đang né việc.
5. **Độ hạt GỘP thì cột dẫn chứng ghi cả số biến thể** — `TC_001–TC_003 (3 TC · 11 biến thể)`. Gộp làm số TC giảm, nhưng **số biến thể không được giảm**; không ghi số biến thể thì không ai phát hiện được việc rụng case.

### Bảng xuất kèm output (đặt cuối tài liệu TC, **trước** bảng ISO 25010)

```markdown
## Đối soát loại kiểm thử (4 vòng)

| Vòng | Nhánh | Trạng thái | TC ID / Lý do |
|---|---|---|---|
| 1 | UI cơ bản | ✅ | TC_001–TC_003 (3 TC · 11 biến thể) |
| 1 | Open form · Display | ✅ | TC_004–TC_006 |
| 1 | Input valid · Save · Verify | ✅ | TC_007–TC_009 |
| 2 | Required | ✅ | TC_010–TC_012 |
| 2 | Validation | ✅ | TC_013–TC_028 (16 TC · 61 biến thể · đủ 7/7 mục bảng Password) |
| 2 | Error Guessing | 🔴 Thiếu | Chưa có TC bấm Lưu hai lần liên tiếp → **bổ sung trước khi xuất** |
| 3 | Permission | ✅ | TC_040–TC_047 (3 role × 3 hành động) |
| 3 | Database | ➖ | QA không có quyền truy cập DB — đội Dev xác minh |
| 4 | Responsive | ✅ | TC_050–TC_052 (1920 · 1366 · 768) |
| 4 | Performance | ➖ | Không có công cụ tải — đội Hạ tầng, đợt sau |
| 4 | Regression | ➖ | Module mới, chưa có bug nào được đóng |
```

---

## Bảng Field-Level Validation Checklist (15 Field Types)

Khi form/UI có các input fields, agent **BẮT BUỘC** phải liệt kê từng trường và sinh validation TCs riêng theo loại:

| Loại Field | Validation cần test |
|---|---|
| **Text (Name, Address...)** | Required/Optional · Min/Max length · Whitespace-only · Ký tự đặc biệt (`<>&"'`) · XSS injection (`<script>alert(1)</script>`) · SQL injection (`' OR 1=1--`) · Unicode/Emoji · Leading/trailing spaces |
| **Email** | Format hợp lệ (`user@domain.com`) · Thiếu `@` · Thiếu domain · Domain không hợp lệ · Nhiều `@` · Ký tự đặc biệt trước `@` · Max length · Case sensitivity · Email đã tồn tại (nếu unique) |
| **Phone** | Chỉ số · Prefix hợp lệ (ví dụ: `+84`, `0`) · Min/Max length · Chữ cái xen lẫn · Dấu `-`, `.`, khoảng trắng · Mã vùng không hợp lệ |
| **Date / DateTime** | Format đúng (dd/MM/yyyy, ISO...) · Ngày không tồn tại (`31/02`, `30/02`) · Năm nhuận (`29/02/2024`) · Quá khứ / tương lai · Min/max date · Timezone |
| **Number / Currency** | Min/Max value · Số âm · Số 0 · Số thập phân · Ký tự không phải số · Overflow · Leading zeros · Định dạng currency |
| **Dropdown / Select** | Giá trị mặc định · Tất cả options hợp lệ · Option disabled · Thay đổi selection · Required validation |
| **Checkbox / Radio** | Trạng thái mặc định · Check/Uncheck · Required validation · Nhóm radio (chỉ chọn 1) |
| **File Upload** | File type hợp lệ/không hợp lệ · Max size · File rỗng (0 KB) · Tên file ký tự đặc biệt · Multiple files · Kéo thả vs nút chọn |
| **Password** | Min/Max length · Yêu cầu ký tự đặc biệt · Yêu cầu chữ hoa/thường · Yêu cầu số · Copy-paste bị chặn? · Hiện/ẩn password · Confirm password khớp/không khớp |
| **Textarea** | Max length · Line breaks · HTML tags · Resize (nếu UI cho phép) · Character counter (nếu có) |
| **OTP / MFA Code** | Auto-focus ô tiếp theo · Paste chuỗi OTP · Hết hạn timeout · Vượt số lần nhập sai (retry limit/lockout) · Re-send OTP rate limit |
| **Date Range / Time Picker** | Ngày kết thúc < Ngày bắt đầu · Khung giờ trùng lặp (time conflict) · Giới hạn khoảng ngày (VD: max 30 ngày) · Quá khứ/Tương lai restriction |
| **Rich Text Editor (WYSIWYG)** | Sanitize HTML tags nguy hiểm (`<script>`, `<iframe>`) · Paste văn bản kèm format/ảnh · Character counter tính theo text thô vs HTML markup |
| **Multi-Select / Tag Input** | Giới hạn số lượng tag · Tag trùng lặp · Xóa tag bằng Backspace/nút X · Tag có ký tự đặc biệt |
| **Range Slider / Stepper** | Giới hạn min/max · Bước nhảy (step increment violation) · Nhập tay trực tiếp so với kéo slider |

## Bảng Component-Level Checklist (Ngoài form input — BẮT BUỘC rà soát)

Form input chỉ là một phần của app. Khi module có các thành phần sau, agent **BẮT BUỘC** sinh TCs theo checklist tương ứng:

| Component | Checklist cần test |
|---|---|
| **Giao diện tĩnh của màn hình** | Đủ thành phần theo evidence (nhãn nguyên văn, thứ tự field, nút, liên kết, tiêu đề) · trạng thái mặc định từng ô (rỗng / tick sẵn / option đang chọn) · con trỏ đang ở ô nào khi vừa mở · định dạng hiển thị (tiền tệ, ngày, giờ, badge) · trạng thái rỗng · trạng thái đang tải · văn bản gợi ý trong ô (placeholder) · tooltip |
| **Data Table / List** | Sort từng cột (asc/desc) · Filter đơn + kết hợp nhiều filter · Search (khớp một phần, không dấu/có dấu, không có kết quả) · Pagination (trang đầu/cuối, đổi page size, nhảy trang) · Empty state (chưa có data) · Danh sách lớn (100+ bản ghi) · Bulk action (chọn tất cả, chọn một phần, thao tác hàng loạt) · Refresh giữ/mất filter đang áp |
| **CRUD Lifecycle** | Create → hiển thị đúng trong list · View detail khớp data đã tạo · Edit → lưu → verify data cập nhật (cả trong list và detail) · Delete → confirm dialog (Cancel giữ nguyên / OK xóa) · Xóa bản ghi đang được liên kết (foreign key) · Tạo trùng unique field · Edit đồng thời 2 người (concurrent) |
| **Permission / Role** | Đối chiếu **Ma trận Phân quyền** trong requirements: mỗi role × mỗi hành động = 1 TC · Truy cập URL trực tiếp khi không có quyền (bypass UI) · Element ẩn/disable đúng theo role · API trả 403 khi gọi trái quyền |
| **Modal / Dialog** | Mở/đóng bằng nút X, nút Cancel, phím ESC, click ra ngoài · Data trong modal reset hay giữ khi mở lại · Submit trong modal lỗi → modal không đóng, hiện lỗi · Nhiều modal chồng nhau (nếu có) |
| **Notification / Toast** | Nội dung đúng theo từng hành động · Tự đóng sau timeout / đóng tay · Nhiều notification liên tiếp · Toast lỗi khác toast thành công (màu/icon) |
| **Trạng thái (Status Flow)** | Đối chiếu **Ma trận Trạng thái** trong requirements: mỗi transition hợp lệ = 1 TC · Mỗi transition KHÔNG hợp lệ = 1 TC (verify bị chặn) · Hành động cho phép/khóa theo từng trạng thái |

> Component nào không có trong module → ghi chú "Không áp dụng" trong phần tổng kết coverage, KHÔNG lặng lẽ bỏ qua.

---

## Quy Tắc Bắt Buộc Áp Dụng Kỹ Thuật Thiết Kế (Khi nào PHẢI dùng)

Agent không được chỉ "nhắc tên" kỹ thuật — phải áp dụng theo điều kiện kích hoạt:

| Kỹ thuật | Điều kiện BẮT BUỘC áp dụng | Cách làm |
|---|---|---|
| **EP + BVA** | Mọi field có ràng buộc min/max/format | Mỗi partition ≥1 TC; biên test tại `min-1, min, max, max+1` |
| **Decision Table** | Có **≥3 điều kiện kết hợp** ảnh hưởng đến 1 output (VD: loại KH × hạn mức × trạng thái → được duyệt?) | Lập bảng đầy đủ tổ hợp → mỗi rule (cột) = 1 TC. Nếu >20 tổ hợp → dùng pairwise và ghi chú lý do rút gọn |
| **State Transition** | Entity có **≥3 trạng thái** hoặc có status flow (Draft → Pending → Approved...) | Vẽ bảng transition → TC cho mọi transition hợp lệ + TC verify mọi transition không hợp lệ bị chặn |

**Ví dụ Decision Table (3 điều kiện → 1 output):**

```markdown
| Rule | Loại KH = VIP | Đơn > 10 triệu | Có mã giảm giá | → Giảm giá |
|---|---|---|---|---|
| R1 | Yes | Yes | Yes | 20% |
| R2 | Yes | Yes | No  | 15% |
| R3 | Yes | No  | -   | 10% |
| R4 | No  | Yes | Yes | 10% |
| R5 | No  | No  | No  | 0%  |
→ Mỗi rule R1-R5 = 1 TC với test data cụ thể
```

**Ví dụ State Transition (đơn hàng):**

```markdown
| Từ \ Đến | Pending | Confirmed | Shipped | Cancelled |
|---|---|---|---|---|
| Draft     | ✅ TC_x | ❌ TC_y (verify chặn) | ❌ | ✅ |
| Pending   | -       | ✅ | ❌ | ✅ |
| Confirmed | ❌      | -  | ✅ | ❌ (verify chặn) |
→ Mỗi ô ✅ và ❌ đều là 1 TC
```

---

## Rà Soát Đặc Tính Chất Lượng — ISO/IEC 25010:2023 (chống bỏ sót loại test)

> **Mục đích:** trả lời câu hỏi *"bộ TC này có bỏ sót loại kiểm thử nào không"* bằng một khung có tên gọi chung, thay vì cảm tính. Chạy **một lượt ở cuối**, sau khi đã sinh xong TC — **không** dùng làm khung sinh TC.

ISO/IEC 25010:2023 (Product quality model) có **9 đặc tính**. So với bản 2011 quen thuộc: `Usability` → **Interaction Capability**, `Portability` → **Flexibility**, và thêm mới **Safety**.

| # | Đặc tính | Đặc tính con chính | QA chức năng làm được gì bằng manual TC | Nếu ngoài phạm vi |
|---|---|---|---|---|
| 1 | **Functional Suitability**<br>Phù hợp chức năng | Completeness · Correctness · Appropriateness | ⭐ **Phần chính của mọi bộ TC** — đã phủ qua Positive/Negative/Boundary | Không bao giờ ngoài phạm vi |
| 2 | **Performance Efficiency**<br>Hiệu quả hiệu năng | Time behaviour · Resource utilization · Capacity | Chỉ quan sát được mức thô: trang tải quá lâu, danh sách 1000 dòng bị treo | Đội hiệu năng / công cụ tải — ghi vào mục 2.2 Master Test Plan |
| 3 | **Compatibility**<br>Tương thích | Co-existence · Interoperability | Đa trình duyệt · đa độ phân giải · import/export đúng định dạng · tích hợp bên thứ ba | Ghi rõ trình duyệt/thiết bị nào **không** kiểm |
| 4 | **Interaction Capability**<br>Khả năng tương tác (bản 2011: Usability) | Learnability · Operability · **User error protection** · Inclusivity · User assistance | ⭐ Làm được nhiều: thông báo lỗi có dễ hiểu không · chặn thao tác sai · điều hướng bàn phím · nhãn/tooltip · trạng thái rỗng | A11y chuyên sâu (WCAG đầy đủ) cần công cụ riêng |
| 5 | **Reliability**<br>Tin cậy | Faultlessness · Availability · Fault tolerance · **Recoverability** | Mất mạng giữa chừng · session hết hạn · submit lại sau lỗi · dữ liệu có mất không sau khi khôi phục | Đo uptime/MTBF thuộc vận hành |
| 6 | **Security**<br>An toàn thông tin | Confidentiality · Integrity · Authenticity · **Accountability** · Resistance | Phân quyền theo role · truy cập URL trực tiếp khi chưa đăng nhập · dữ liệu người này có lộ sang người kia không · nhật ký thao tác | Pentest, quét lỗ hổng — **luôn** ghi rõ ai làm |
| 7 | **Maintainability**<br>Bảo trì | Modularity · Reusability · Analysability · Modifiability · Testability | 🚫 **Không kiểm được bằng manual TC** — đây là đặc tính của mã nguồn | Code review / static analysis — không thuộc QA chức năng |
| 8 | **Flexibility**<br>Linh hoạt (bản 2011: Portability) | Adaptability · **Scalability** · Installability · Replaceability | Responsive trên nhiều kích thước màn hình · cài đặt/nâng cấp · đổi ngôn ngữ, múi giờ, đơn vị tiền | Scalability hạ tầng thuộc đội vận hành |
| 9 | **Safety**<br>An toàn (mới ở bản 2023) | Operational constraint · Fail safe · **Hazard warning** | Chỉ áp dụng cho hệ thống mà lỗi gây thiệt hại thật (y tế, tài chính, thiết bị): có cảnh báo trước thao tác không hồi lại được không · có xác nhận trước khi xoá/chuyển tiền không | ➖ Không áp dụng với đa số app nghiệp vụ thông thường |

### Cách dùng — 3 quy tắc

1. **Chấm từng đặc tính, không bỏ trống ô nào:** `✅ Có TC` (dẫn TC ID) · `➖ Ngoài phạm vi` (**phải ghi ai chịu trách nhiệm**) · `🔴 Thiếu` (phải bổ sung trước khi xuất).
2. 🚫 **KHÔNG sinh TC cho đủ 9 ô.** Đặc tính không áp dụng với module này thì chấm `➖` kèm lý do — TC sinh ra chỉ để lấp bảng là TC rác, và nó làm loãng bộ TC thật.
3. **Ô `➖` là dữ liệu đầu vào cho `/generate-master-test-plan` mục 2.2 (Ngoài phạm vi).** Đây là giá trị lớn nhất của bảng này: biến "QA quên test" thành "đã xem xét và thống nhất không test" — hai chuyện hoàn toàn khác nhau khi có sự cố production.

### Bảng xuất kèm output (đặt cuối tài liệu TC)

```markdown
## Rà soát đặc tính chất lượng (ISO/IEC 25010:2023)

| Đặc tính | Trạng thái | TC ID / Lý do |
|---|---|---|
| Functional Suitability | ✅ Có TC | TC_001–TC_048 |
| Performance Efficiency | ➖ Ngoài phạm vi | Không có công cụ tải — đội Hạ tầng, đợt sau |
| Compatibility | ✅ Có TC | TC_049–TC_052 (Chrome, Edge, 1366×768) |
| Interaction Capability | ✅ Có TC | TC_053–TC_060 (thông báo lỗi, điều hướng bàn phím, trạng thái rỗng) |
| Reliability | 🔴 Thiếu | Chưa có TC session hết hạn giữa chừng khi điền form → **bổ sung trước khi xuất** |
| Security | ✅ Có TC | TC_061–TC_070 (phân quyền 3 role, truy cập URL trực tiếp) |
| Maintainability | ➖ Không áp dụng | Đặc tính của mã nguồn, không kiểm bằng manual TC |
| Flexibility | ✅ Có TC | TC_071–TC_074 (responsive 1366/1920, đổi ngôn ngữ) |
| Safety | ➖ Không áp dụng | App nghiệp vụ, lỗi không gây thiệt hại vật lý |
```

> ⚠️ Ghi **tên đặc tính** theo chuẩn, **KHÔNG ghi số điều khoản**. Và **không** tuyên bố *"tuân thủ ISO/IEC 25010"* — câu đúng là *"rà soát theo mô hình chất lượng ISO/IEC 25010:2023"*.

---

## Scenarios Chuyên Sâu & Non-Functional Checklist (Áp dụng nâng cao)

> Đây là phần **chi tiết hoá** của bảng đặc tính bên trên — 5 nhóm dưới đây map lần lượt vào Functional Suitability (1), Reliability (5), Interaction Capability (4) và Flexibility (8).

Agent phải tích hợp thêm các tình huống kiểm thử nâng cao khi phân tích module:

1. **Race Condition & Double Submit:**
   - Double click liên tiếp nút Save/Submit (ngăn tạo 2 bản ghi trùng)
   - Concurrent editing: 2 tabs/users cùng sửa 1 bản ghi đồng thời
2. **Session & Network Resilience:**
   - Session timeout / Token hết hạn giữa chừng khi đang điền form
   - Network interruption (mất mạng khi submit payload, slow 3G timeout, retry logic)
3. **Localization & UTF-8 / Emoji:**
   - Nhập tiếng Việt đầy đủ dấu (`Tiếng Việt có dấu phức tạp ỨỜÁ...`)
   - Nhập emoji (`😀🎉🚀`) và ký tự đa ngôn ngữ (RTL, tiếng Trung, Nhật, Ả Rập)
4. **Keyboard Accessibility (A11y):**
   - Điều hướng bằng phím `Tab` theo thứ tự hợp lý, kích hoạt bằng `Enter`/`Space`
   - Hiển thị viền focus state rõ ràng
5. **HTTP Status Codes (Cho API Test Cases):**
   - Assert đầy đủ các status codes tiêu chuẩn: `200/201 Success`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`, `422 Unprocessable Entity`, `429 Rate Limit`, `500/503 Server Error`.

---

## 🛡️ AI Self-Quality Gate (Quy trình Tự Kiểm Định Chất Lượng)

Trước khi xuất kết quả cuối cùng cho user, Agent **BẮT BUỘC** tự rà soát qua 11 tiêu chí (0–10):
- [ ] **0. Độ hạt nhất quán:** Đã chốt GỘP hay TÁCH **trước** batch đầu và nêu ra chat. Toàn bộ bộ TC theo **một** độ hạt, không nửa gộp nửa tách. Nếu GỘP: mọi biến thể có mã riêng (`a`, `b`…), không TC nào quá 6 biến thể, không TC nào vi phạm bảng CẤM gộp.
- [ ] **1. Unique TC ID:** Đảm bảo không trùng mã TC ID và đúng quy tắc dự án (`PROJECT_MODULE_TC_001`).
- [ ] **2. 1-to-1 Step-Expected Matching:** Các bước `Test Steps` đánh số rõ ràng (1,2,3 — mỗi bước 1 hành động) và khớp 1-1 với `Expected Result` đánh số tương ứng.
- [ ] **3. Concrete Test Data:** 100% test data chứa giá trị cụ thể, không còn từ ngữ mơ hồ ("hợp lệ", "dữ liệu đúng").
- [ ] **4. Field Validation Coverage (đối soát theo BẢNG, không đếm theo số):** với **TỪNG** input field, mở đúng dòng loại field trong **Bảng Field-Level Validation Checklist (15 loại)** và đối soát **đủ từng mục** của dòng đó. Mục nào không áp dụng phải **ghi lý do một dòng**, không được im lặng bỏ qua.
  > 🚨 `≥1 Positive + 2 Negative` là **sàn tối thiểu, KHÔNG phải mức đạt**. Trường Password có 7 mục trong bảng — sinh 3 TC rồi dừng là **trượt tiêu chí này**, dù về số lượng vẫn qua sàn. Đây chính là chỗ bộ TC bị nông mà vẫn xanh hết bảng.
  > Xuất kèm cột đối soát trong **Bảng Đối soát loại kiểm thử** dòng `V2 · Validation`: `đủ N/N mục bảng <loại field>`.
- [ ] **5. Automation Metadata Ready:** 100% test cases được gắn đầy đủ `Automation`, `Auto Type`, và `@Tag`. Cột `Automation` chấm theo [Tiêu chí chấm cột Automation](references/automation_criteria.md), **không** gắn `Yes` hàng loạt: TC chạm một tính năng ở bảng 3A mà vẫn `Yes` thì cách làm phải nằm trong bảng đó. Index có mục `## Đối soát cột Automation` — mọi TC `Partial` có điều kiện, mọi TC `No` có lý do, điều kiện đã gom thành danh sách cần chuẩn bị, TC vướng tạm thời ghi `⏸️ Hoãn` chứ không hạ cột.
  > Với **DELTA**: chỉ chấm lại TC đã sửa / thêm, cập nhật đúng các dòng đó trong mục đối soát.
- [ ] **6. Requirement Coverage (đối soát "đủ case"):** 100% REQ ID có **≥1 TC** trỏ về; REQ mức High Risk có đủ Positive + Negative + Boundary. Xuất **Bảng Đối Soát Coverage** kèm output:

```markdown
| REQ ID | Mô tả ngắn | Số TC | TC IDs | Đủ Positive/Negative/Boundary? |
|---|---|---|---|---|
| REQ-LOGIN-01 | Đăng nhập email | 5 | TC_001..TC_005 | ✅ |
| REQ-LOGIN-02 | Khóa sau 5 lần sai | 0 | — | 🔴 THIẾU — phải bổ sung trước khi xuất |
| REQ-LOGIN-27 · 40 | Gửi mail đặt lại · tự đăng nhập bằng cookie | 0 | — | ⚪ Ngoài phạm vi — `AMB-LOGIN-04` · `AMB-LOGIN-15` ⏭️, quyết định PO 18-08-2026 |
```
> Nếu có REQ nào 0 TC → agent PHẢI quay lại sinh bổ sung, KHÔNG được xuất kết quả có dòng 🔴.
>
> **Ngoại lệ — requirements đã loại khỏi phạm vi viết TC:** REQ ghi *ngoài phạm vi viết TC / kiểm thử*, REQ 🔴 Deprecated, phần thuộc mục `Ngoài phạm vi` của requirements, hoặc AMB `⏭️` quyết định *"bỏ qua, không viết TC"* / *"chuyển sang module X"* → **không** sinh TC (kể cả TC "cho đủ bảng" hay biến thể lén phủ phần đó), **không** tính 🔴. Ghi dòng `⚪ Ngoài phạm vi` kèm **mã quyết định** ở Bảng Đối Soát Coverage, và dòng *Phạm vi REQ* ở đầu index liệt kê các mã bị loại. Nhánh 4 vòng chỉ vắng vì phần đã loại → `⏭️` dẫn mã quyết định. Đây là nguồn mà `/review-testcases` đọc để **không** báo lại các phần đó thành gap.

  **6b. Phép thử chiều ngược — TC gánh nhiều REQ (BẮT BUỘC chạy, áp cả QUICK · FULL RBT · DELTA · `/generate-testcases-api`):**
  Bảng trên chỉ trả lời *"REQ nào chưa có TC"* — nó **không** bắt được TC gánh quá nhiều REQ. Với **mỗi TC có ≥ 2 REQ ID**, đếm số TC **của cùng nền tảng** trỏ về từng REQ đó:

  | Kết quả đếm trong một TC | Xử lý |
  |---|---|
  | Mọi REQ đều có TC khác chống lưng | ✅ Được giữ |
  | Đúng **1** REQ chỉ có mỗi TC này, các REQ còn lại có TC khác | ✅ Được giữ — FAIL của TC vẫn quy được về REQ đó. Ghi chú ở cột Ghi chú của Bảng Đối Soát Coverage |
  | **≥ 2** REQ chỉ có mỗi TC này | 🔴 **Vi phạm** bảng CẤM gộp (dòng *"Khác REQ ID mà mỗi REQ chỉ có đúng TC đó"*) → **tách**: TC gốc giữ 1 REQ, mỗi REQ còn lại một TC mới **cấp số nối tiếp dải** (không chèn giữa, không đánh lại) |

  > ⚠️ **Hay vi phạm nhất ở TC API**: một request chứng minh được nhiều REQ cùng lúc (VD `POST /api/login` không gửi token → `200` vừa là *"đăng nhập thành công"* vừa là *"đăng nhập không cần token"*). Gộp nghe hợp lý, nhưng khi FAIL không biết REQ nào hỏng, và RTM báo mỗi REQ "đã phủ" dù không TC nào **chỉ** kiểm nó. Mỗi REQ phải có một TC mà **Expected cốt lõi** của nó là đúng REQ đó.
  >
  > **Số TC ít hơn số REQ không phải là lỗi** (1 TC gộp nhiều biến thể, 1 REQ có nhiều TC) — nhưng khi thấy tỉ lệ này, **bắt buộc** chạy phép thử 6b trước khi trả lời user.

  Mẫu kiểm tự động (chạy trên file nền tảng / `parts/` của **từng** nền tảng):

  ```python
  import glob, re, collections
  R = []
  for f in glob.glob('docs/testcases/<module>/<nền-tảng>/**/*.md', recursive=True):
      for line in open(f, encoding='utf-8'):
          if line.startswith('| <HỆ_THỐNG>_<MODULE>_TC_'):
              c = line.split(' | ')
              R.append((c[0][2:], re.findall(r'REQ-[\w-]+?-(\d+)', c[1])))
  cnt = collections.Counter(q for _, reqs in R for q in reqs)
  print([tc for tc, reqs in R if sum(cnt[q] == 1 for q in reqs) >= 2] or 'không vi phạm')
  ```

- [ ] **7. Evidence-verified:** đã mở **100%** ảnh trong `docs/requirements/<module>/<nền-tảng>/evidence/`; mọi TC thuộc 4 nhóm bắt buộc (bố cục/thứ tự · nhãn nguyên văn · giá trị mặc định · định dạng hiển thị) đều truy được về một tấm ảnh cụ thể **hoặc một lần đọc DOM cụ thể**. TC không truy được → gắn `@NeedsVerify` và liệt kê ở mục "Vùng chưa có evidence". Xuất kèm **Bảng Đối Soát Evidence**:

```markdown
| Ảnh evidence | Màn hình / trạng thái | TC dựa vào | Đầy đủ? |
|---|---|---|---|
| project_new_form_default_fullpage.png | Form tạo — mặc định | TC_041→050 | ✅ full-page |
| project_new_form_1920x1080.png | Form tạo — mặc định | TC_092→095 | 🔴 CẮT CỤT tại "Description" — thiếu editor, checkbox email, nút Save |
| (không có) | Form tạo — dropdown Customer đang mở | TC_060→063 | 🔴 THIẾU — TC gắn @NeedsVerify |
```
> Có dòng 🔴 → **vẫn xuất được** bộ TC, nhưng phải nêu rõ ở tóm tắt cuối và đề xuất recon bổ sung. KHÔNG được im lặng bỏ qua.

- [ ] **8. Ngôn ngữ kiểm chứng (theo [Quy Tắc Ngôn Ngữ Kiểm Chứng](#quy-tắc-ngôn-ngữ-kiểm-chứng-bắt-buộc--áp-dụng-cả-4-modes)):** grep toàn file, phần TC chính **không còn** `document.`, `querySelector`, `checkValidity`, `offsetParent`, `className`, `getAttribute`, `$(`, `input#`, `[type=`, mã HTTP, tên header, selector CSS/XPath (trừ TC có `Auto Type` = `API`). Mọi nội dung cấp kỹ thuật còn lại nằm dưới `🔧 Ghi chú kỹ thuật (cần DevTools):` và TC đó mang tag `@TechCheck`. **Phép thử cuối:** che hết dòng `🔧 Ghi chú kỹ thuật` → mọi TC vẫn chạy và chấm PASS/FAIL được.

- [ ] **9. Rà soát đặc tính chất lượng (ISO/IEC 25010:2023)** — áp dụng **QUICK · FULL RBT · DELTA**, KHÔNG áp dụng CHECKLIST: đã chấm đủ **9/9 đặc tính**, không ô nào trống. Ô `➖` có ghi **ai chịu trách nhiệm** (không chỉ ghi "ngoài phạm vi" trơn). Ô 🔴 phải bổ sung TC **trước khi xuất**. Bảng rà soát đặt ở cuối tài liệu TC.
  > Với **DELTA**: chỉ chấm lại đặc tính bị ticket chạm tới, giữ nguyên phần còn lại của bảng — không rà lại cả module.

- [ ] **10. Đối soát loại kiểm thử 4 vòng** (theo [Bản Đồ Loại Kiểm Thử — 4 Vòng](#bản-đồ-loại-kiểm-thử--4-vòng-bắt-buộc--khung-sinh-tc-cho-quick--full-rbt--delta)) — áp dụng **QUICK · FULL RBT · DELTA**, KHÔNG áp dụng CHECKLIST:
  - Đã chấm **mọi nhánh** của cả 4 vòng, không ô nào trống. Xuất **Bảng Đối soát loại kiểm thử** đặt cuối tài liệu TC, **trước** bảng ISO 25010
  - Ô `➖` ghi **lý do kỹ thuật**; ô `⏭️` ghi **lý do + ai quyết định + điều kiện rà lại**; ô 🔴 phải bổ sung TC **trước khi xuất**
  - **`➖` và `⏭️` không được dùng lẫn** — `➖` là sự thật kỹ thuật (hệ thống không có cái đó), `⏭️` là quyết định chấp nhận rủi ro. Ghi `➖` cho thứ thật ra là `⏭️` là **giấu quyết định**
  - Mức rủi ro đã chấm và **độ sâu tương ứng** (Đầy đủ / Tiêu chuẩn / Tối giản) phải ghi ở đầu tài liệu TC, kèm dòng **"Nâng lên khi…"**
  - **Ba nhánh không bao giờ được `➖`:** `UI cơ bản` (V1) · `Validation` (V2, khi có field nhập) · `Permission` (V3, khi có ≥2 role)
  - Độ hạt **GỘP** → cột dẫn chứng ghi **cả số TC và số biến thể**: `TC_001–TC_003 (3 TC · 11 biến thể)`. Thiếu số biến thể = không kiểm chứng được gộp có làm rụng case hay không
  > Với **DELTA**: chỉ chấm lại nhánh bị ticket chạm tới, giữ nguyên phần còn lại của bảng.

---

# Mode 2: FULL RBT — Quy Trình AI-RBT 6 Bước

## Mục đích

Quy trình bài bản, tuần tự cho module phức tạp. Bao gồm phân tích Ambiguity, phân rã hệ thống, Traceability Matrix, đánh giá Risk Level, và sinh test cases chi tiết **theo 4 vòng kiểm thử** (Smoke → Functional → Technical → Non-functional).

> ⚠️ **QUAN TRỌNG:** Quy trình này **BẮT BUỘC chạy tuần tự** từng bước. KHÔNG được gộp nhiều bước chạy 1 lần. Mỗi bước phải hoàn thành và được user xác nhận trước khi sang bước tiếp.

> [!NOTE]
> **2 luồng sử dụng riêng biệt:**
> - **Luồng Claude Code (command):** Agent thực hiện theo hướng dẫn tổng quát bên dưới. Agent KHÔNG cần đọc file prompt.txt.
> - **Luồng Copy-Paste (Claude Chat):** QA team copy nội dung prompt chi tiết từ `plans/manual/01-06/prompt.txt` vào chat AI, từng bước một.

### Bước 1: Context & Role-play (Khởi tạo ngữ cảnh)

**Mục đích:** Thiết lập vai trò Senior QA Engineer và nạp bối cảnh dự án.

**Agent phải:**
1. Yêu cầu user cung cấp:
   - Tên dự án / tính năng
   - Mô tả hệ thống hiện tại
   - Mục tiêu kiểm thử MVP
   - Tài liệu yêu cầu (Requirements, User Stories, Figma link, PDF...)
2. **Kiểm module đã có bộ TC chưa** — có thì rẽ nhánh theo mục [Module đã có bộ TC — chế độ BỔ SUNG](#module-đã-có-bộ-tc--chế-độ-bổ-sung-áp-quick--full-rbt) và nêu rõ ở phần xác nhận bối cảnh
3. Đọc kỹ tài liệu và xác nhận đã hiểu bối cảnh
4. Tóm tắt scope kiểm thử
5. **Chờ user xác nhận** trước khi sang Bước 2

> ⚠️ **Bước 1 chưa xong nếu chưa mở evidence.** Trước khi tóm tắt scope, agent phải liệt kê `docs/requirements/<module>/<nền-tảng>/evidence/` và `Read` từng ảnh theo [Quy Tắc Đối Chiếu Evidence](#quy-tắc-đối-chiếu-evidence-bắt-buộc--áp-dụng-cả-4-modes-chạy-trước-batch-đầu-tiên). Kết quả đưa vào Output dưới dạng **Danh mục Evidence** (ảnh nào đủ / cắt cụt / thiếu).

**Output:** Xác nhận hiểu bối cảnh + tóm tắt scope kiểm thử + **Danh mục Evidence đã mở**.

---

### Bước 2: Analysis & QnA (Phân tích yêu cầu)

**Mục đích:** Phân tích tài liệu để phát hiện điểm mờ, thiếu sót, mâu thuẫn.

**Agent phải:**
1. Xác định các luồng:
   - Happy Path (luồng chính)
   - Alternate Paths (luồng rẽ nhánh)
   - Exception Paths (luồng ngoại lệ)
2. Phát hiện Ambiguities:
   - Yêu cầu thiếu sót (không quy định độ dài textbox, timeout, hành vi mất kết nối...)
   - Yêu cầu mâu thuẫn
   - Yêu cầu chưa rõ ràng
   - **Xung đột giữa tài liệu và evidence** — tài liệu mô tả một đằng, ảnh cho thấy một nẻo. Đây là dấu hiệu requirements đã lỗi thời, **bắt buộc đưa vào Q&A**, không tự chọn bên nào
3. Đặt câu hỏi Q&A có đánh số thứ tự (Q1, Q2...) cho user/PO/BA giải đáp, mỗi câu kèm ngữ cảnh và assumption nếu không được trả lời
4. **DỪNG LẠI — Chờ user trả lời** các câu hỏi trước khi tiếp tục

**Output:** Danh sách luồng + Ambiguities + Câu hỏi Q&A.

> [!IMPORTANT]
> **Đây là điểm nghẽn quan trọng nhất.** Nếu agent bỏ qua bước này và tự đoán logic, test cases sẽ sai nghiêm trọng. Agent PHẢI dừng lại và đợi user phản hồi.

---

### Bước 3: Decomposition (Phân rã hệ thống)

**Mục đích:** Chia tính năng phức tạp thành các Module / Sub-module nhỏ, dễ quản lý.

**Agent phải:**
1. Phân rã theo 1 trong 2 cách:
   - **Theo UI:** Header, Data Table, Form popup, Sidebar...
   - **Theo luồng:** Flow tạo mới, Flow chỉnh sửa, Flow xóa...
2. Mô tả ngắn gọn chức năng từng Module
3. Chỉ ra Dependencies giữa các Module

**Output:** Danh sách Modules/Sub-modules + Dependencies.

---

### Bước 4: Traceability (Đảm bảo độ bao phủ)

**Mục đích:** Thiết lập ma trận truy vết để đảm bảo 100% requirements được phủ test scenarios.

**Agent phải:**
1. Map mỗi Module/Rule với mã Yêu cầu (REQ-01, REQ-02...)
2. Cross-check xem có yêu cầu nào bị thiếu trong danh sách phân rã (Gap Analysis)
3. Liệt kê High-Level Test Scenarios cho từng Module, **xếp theo 4 vòng** (xem [Bản Đồ Loại Kiểm Thử — 4 Vòng](#bản-đồ-loại-kiểm-thử--4-vòng-bắt-buộc--khung-sinh-tc-cho-quick--full-rbt--delta)):
   - **V1 Smoke:** giao diện cơ bản · mở form · hiển thị · nhập hợp lệ · lưu · đối chiếu dữ liệu
   - **V2 Functional:** hành vi giao diện · bắt buộc · validation · EP · BVA · quy tắc nghiệp vụ · bảng quyết định · chuyển trạng thái · phụ thuộc · kịch bản nghiệp vụ · CRUD · đoán lỗi
   - **V3 Technical:** phân quyền · bảo mật · API · CSDL · tích hợp · nhật ký
   - **V4 Non-functional:** tương thích · đáp ứng · bàn phím/trợ năng · hiệu năng · hồi quy · xuyên module
   > Chấm sơ bộ mỗi nhánh `✅ sẽ sinh` / `➖ không áp dụng (lý do kỹ thuật)` / `⏭️ cố ý bỏ (lý do + ai quyết + điều kiện rà lại)` **ngay ở bước này** — đây là lúc user review rẻ nhất, trước khi sinh TC chi tiết.
4. **Chấm mức rủi ro từng Module** theo bảng tiêu chí mục [Độ sâu theo rủi ro](#độ-sâu-theo-rủi-ro--không-phải-chức-năng-nào-cũng-chạy-đủ-4-vòng) — agent tự chấm, ghi căn cứ, KHÔNG hỏi user — rồi nêu **độ sâu tương ứng** (Đầy đủ / Tiêu chuẩn / Tối giản) kèm số TC ước tính. Chấm ở bước này để user phủ quyết ngay tại checkpoint, không phải sau khi đã sinh xong
5. **Chờ user review** danh sách scenarios, bảng 4 vòng và mức rủi ro trước khi sinh test case chi tiết

**Output:** Traceability Matrix + High-Level Test Scenarios + mức rủi ro · độ sâu từng Module.

---

### Bước 5: RBT & TC Generation (Sinh Test Case chi tiết)

**Mục đích:** Sinh test cases chi tiết theo chiến lược Risk-Based Testing.

**Agent phải:**
1. Áp **mức rủi ro đã được user duyệt ở Bước 4** (user sửa mức nào thì theo mức user sửa) — mức rủi ro quyết định độ sâu:
   - **Cao** → độ sâu **Đầy đủ**: đủ mọi nhánh của cả 4 vòng (40–60 TC)
   - **Trung bình** → độ sâu **Tiêu chuẩn**: V1 + V2 đủ, V3 giới hạn ở `Permission`/`Security`, V4 giới hạn ở `Responsive`/`Accessibility` (20–30 TC)
   - **Thấp** → độ sâu **Tối giản**: V1 đủ 6 nhánh (**không rút**), V2 chỉ nhánh có ràng buộc thật, V3/V4 phần lớn `⏭️` (8–12 TC)
   > ⚠️ Lưỡng lự thì chấm **mức cao hơn**. Bốn thứ không bao giờ rút: toàn bộ V1 · `Required`+`Validation` khi có field nhập · `Permission` khi ≥2 vai trò · `Security` khi chạm dữ liệu người dùng khác.
2. Sinh test case với đầy đủ fields:
   - Module / Sub-module
   - **REQ ID** (mã requirement mà TC cover — lấy từ Traceability Matrix ở Bước 4)
   - Test Case Title
   - Pre-conditions
   - Test Steps (**đánh số 1,2,3 — mỗi bước 1 hành động**, theo Quy Tắc Trình Bày Test Steps)
   - Expected Results (đánh số khớp 1-1 với steps)
   - Test Data (**phải cụ thể**, không dùng placeholder chung chung)
   - Priority
3. **Sinh tuần tự theo 4 vòng** — V1 Smoke → V2 Functional → V3 Technical → V4 Non-functional. Mỗi batch **nằm trọn trong một vòng**, không trộn vòng.
   Vòng 1 luôn mở đầu bằng nhánh `UI cơ bản` (nhãn nguyên văn · thứ tự field · trạng thái mặc định) — đây là lớp bị bỏ sót nhiều nhất.
   Bao phủ đa dạng trong từng vòng:
   - Happy Path
   - Negative Path (giá trị biên, vượt ký tự)
   - Edge Cases (timeout, mất kết nối...)
4. **Áp dụng kỹ thuật theo Quy Tắc Bắt Buộc:** EP+BVA cho field có ràng buộc; **Decision Table** khi ≥3 điều kiện kết hợp; **State Transition** khi có status flow (xem section Quy Tắc Bắt Buộc Áp Dụng Kỹ Thuật)
5. **Validation chuyên biệt từng trường (Field-Level Validation):**
   - Liệt kê **tất cả input fields** trên form/UI đang test
   - Sinh validation TCs **riêng cho TỪNG trường** theo đặc tính riêng (15 loại input field types)
   - **KHÔNG** gộp validation của **các trường khác nhau** vào 1 TC — biến thể **cùng một trường** thì gộp theo độ hạt đã chốt (xem mục Độ Hạt Test Case)
6. **Bao phủ Component-Level Checklist:** Data Table/List, CRUD Lifecycle, Permission/Role (đối chiếu Ma trận Phân quyền), Modal/Dialog, Notification, Status Flow (đối chiếu Ma trận Trạng thái)
7. **Tích hợp Scenarios Chuyên Sâu & Non-Functional:** Race Condition/Double Submit, Session/Network Resilience, Localization/UTF-8/Emoji, Keyboard Accessibility (A11y), HTTP Status Codes.
8. Nếu scenarios quá nhiều → chia batch theo **Module → Vòng**, sinh lần lượt từng Module nhưng **chạy thẳng hết** theo Quy Tắc Xuất File mục 3 — KHÔNG dừng hỏi giữa các batch. Checkpoint của FULL RBT chỉ nằm ở Bước 2 và Bước 4

**Output:** Danh sách Test Cases chi tiết có Risk Level.

---

### Bước 6: Template Mapping (Chuẩn hóa Format & Metadata)

**Mục đích:** Đóng gói test cases thành bảng Markdown chuẩn đầy đủ metadata cho Automation, sẵn sàng copy sang Excel/Jira hoặc sync vào Google Sheets.

**Agent phải:**
1. Chuẩn hóa toàn bộ test cases vào bảng Markdown:

```markdown
| TC ID | REQ ID | Module | Risk Level | Test Title | Pre-Condition | Test Steps | Expected Result | Priority | Test Data | Automation | Auto Type | Tags |
```

2. Quy tắc bảng:
   - TC ID theo format thống nhất (ví dụ: `CRM_CUST_TC_001`)
   - **REQ ID bắt buộc mỗi dòng** — TC không trỏ về REQ nào là TC mồ côi, phải xem lại
   - Test Steps đánh số `1. 2. 3.` (mỗi bước 1 hành động), Expected Result đánh số khớp 1-1, dùng `<br>` xuống dòng trong cell
   - Gắn đầy đủ metadata `Automation` (`Yes`/`No`/`Partial` — chấm theo [Tiêu chí chấm cột Automation](references/automation_criteria.md)), `Auto Type` (`UI`/`API`/`Unit`/`N/A`), và `@Tags` (`@Smoke`, `@Regression`, `@CriticalPath`...)
   - **TUYỆT ĐỐI không được bỏ sót** bất kỳ test case nào đã sinh ở Bước 5
3. **Chạy Self-Quality Gate (11 Tiêu chí, 0–10):** Kiểm định lại — bao gồm **Bảng Đối Soát Coverage** (tiêu chí 6: mọi REQ có ≥1 TC), **Bảng Đối Soát Evidence** (tiêu chí 7), **rà ngôn ngữ kiểm chứng** (tiêu chí 8), **Bảng rà soát đặc tính chất lượng ISO/IEC 25010:2023** (tiêu chí 9: đủ 9/9 đặc tính, ô `➖` ghi rõ ai chịu) và **Bảng Đối soát loại kiểm thử 4 vòng** (tiêu chí 10: mọi nhánh được chấm, 3 nhánh cấm `➖`, độ hạt GỘP ghi kèm số biến thể) — trước khi xuất Artifact (`TEST_CASES_<TÊN_MODULE>_SUMMARY.md`).

**Output:** Bảng Test Cases Markdown hoàn chỉnh kèm Metadata Automation.

---

# Mode 3: CHECKLIST — Sinh Danh Sách Rà Soát Tick Tay

## Mục đích

Sinh **checklist ngắn gọn để tick tay** khi cần chạy nhanh — smoke trước release, bàn giao cho tester thủ công, rà soát sau hotfix. Mỗi mục là **1 dòng kiểm tra được trong vài phút**, KHÔNG phải test case có steps chi tiết.

> **Ranh giới với QUICK/FULL RBT:** Checklist trả lời "đã rà hết chưa?", test case trả lời "rà bằng cách nào?". Nếu user cần steps chi tiết, test data đầy đủ, import Jira/TestRail hay giao cho automation → dùng QUICK hoặc FULL RBT, KHÔNG dùng mode này.

## 2 Nguồn Input

Agent xác định nguồn trước khi sinh:

| Nguồn | Khi nào | Cách làm |
|---|---|---|
| **REQ-based** | Chưa có bộ TC, chỉ có requirements / UI | Rút mục checklist trực tiếp từ requirements + 3 bảng checklist chuẩn của skill |
| **TC-based** | Đã có file `TEST_CASES_<TÊN_MODULE>_SUMMARY.md` | **Rút gọn** từ bộ TC sẵn có — gom nhóm TC cùng chủ đề thành 1 mục, giữ cột `TC ID liên quan` để truy ngược |

> TC-based được ưu tiên khi bộ TC đã tồn tại — tránh sinh lại nội dung lệch với bộ TC gốc.

## 4 Loại Checklist & Quy Mô Khuyến Nghị

Agent **BẮT BUỘC** hỏi hoặc suy ra loại checklist, vì nó quyết định độ sâu và số mục:

| Loại | Mục đích | Số mục | Thời gian chạy tay |
|---|---|---|---|
| **Smoke** | Xác nhận build chạy được, luồng sống còn không vỡ | 10–20 | ≤ 15 phút |
| **Post-hotfix** | Rà vùng ảnh hưởng của bản vá + vùng lân cận | 5–15 | ≤ 10 phút |
| **Regression (module)** | Rà toàn bộ 1 module trước khi bàn giao | 20–40 | ≤ 45 phút |
| **Release-readiness** | Rà toàn hệ thống trước khi lên production | 30–60 | ≤ 60 phút |

> Vượt ngưỡng số mục → agent PHẢI tách theo module hoặc hạ scope, KHÔNG xuất checklist dài lê thê (mất tác dụng "rà nhanh").

### Lấy mục từ vòng nào

Checklist **không** chấm bảng đối soát 4 vòng (Gate #10 không áp dụng cho mode này), nhưng vẫn **lấy mục theo vòng** để biết dừng ở đâu:

| Loại checklist | Lấy mục từ | Bỏ qua |
|---|---|---|
| **Smoke** | **Chỉ V1** — UI cơ bản · mở form · hiển thị · nhập hợp lệ · lưu · đối chiếu dữ liệu | Toàn bộ V2–V4 |
| **Post-hotfix** | V1 của vùng vá + nhánh V2 mà bản vá chạm tới | V3 · V4 |
| **Regression (module)** | V1 + V2 đầy đủ + nhánh V3 `Permission` | V4 (trừ `Regression` nếu module có bug cũ) |
| **Release-readiness** | V1 + nhánh sống còn của V2 + `Permission`/`Security` (V3) + `E2E` (V4) | Phần còn lại của V3 · V4 |

> Checklist Smoke mà có mục validation biên hay bảng quyết định là **sai loại** — đó là V2, thuộc bộ TC chi tiết. Smoke chỉ trả lời *"build này có dùng được không"*.

## Quy trình (1 lượt duy nhất)

**Agent phải:**

0. **Mở evidence** theo [Quy Tắc Đối Chiếu Evidence](#quy-tắc-đối-chiếu-evidence-bắt-buộc--áp-dụng-cả-4-modes-chạy-trước-batch-đầu-tiên) — checklist nêu **nhãn nút và dấu hiệu quan sát được trên UI**, sai một chữ là người chạy tick nhầm. Nguồn TC-based thì evidence đã được đối chiếu ở bước sinh TC, chỉ cần mở lại ảnh của màn hình có trong checklist
1. **Xác định loại checklist** (Smoke / Post-hotfix / Regression / Release-readiness) và **nguồn input** (REQ-based hay TC-based)
2. **Xác định scope:** module nào, luồng nào, role nào. Với Post-hotfix → xác định rõ **vùng ảnh hưởng** của thay đổi + vùng lân cận có rủi ro
3. **Rút mục từ 3 bảng checklist chuẩn của skill** — chỉ lấy mục **thực sự áp dụng** cho module:
   - **Field-Level Validation (15 loại field):** với checklist chỉ lấy **1–2 mục đại diện rủi ro cao nhất** cho mỗi field quan trọng (KHÔNG liệt kê hết mọi validation — đó là việc của QUICK/FULL)
   - **Component-Level:** Data Table/List, CRUD Lifecycle, Permission/Role, Modal/Dialog, Notification, Status Flow
   - **Non-Functional:** Race condition/Double submit, Session/Network, Localization/UTF-8, A11y bàn phím
4. **Ưu tiên theo rủi ro:** luồng liên quan tiền, phân quyền, mất dữ liệu → luôn nằm trong checklist dù loại nào
5. **Viết mỗi mục theo Quy Tắc Viết Mục Checklist** (bên dưới)
6. **Gắn metadata:** `Priority` (P1/P2/P3), `REQ ID` (nếu có), `TC ID liên quan` (nếu TC-based)
6b. **Gắn trạng thái từ execution đã có** — quét `docs/executions/<module>/<nền-tảng>/run_*/execution_report.md`, điền cột `Trạng thái` + `Execution ID` theo [Cột Trạng thái & Execution ID](#cột-trạng-thái--execution-id) bên dưới. Chưa có kết quả → `☐` / `—`
7. **Nhóm mục theo Module → Nhóm chức năng**, đánh số liên tục để dễ đối chiếu khi báo cáo
8. **Ghi `Mã checklist`** ở header — xem [Mã checklist & mã mục](#mã-checklist--mã-mục) bên dưới
9. **Chạy Checklist Quality Gate (5 tiêu chí)** trước khi xuất

## Bảng Output Standard

```markdown
## [Tên Module] — Checklist <Loại> (<số mục> mục · ~<thời gian> phút)

**Mã checklist:** `CL-smoke_20261009`
**Trạng thái lấy từ:** 1/2 mục đã có kết quả — lần chạy bộ TC `run_1787215085` (chưa có lần chạy nào của chính checklist này)

### Nhóm: <Tên nhóm chức năng>

| # | Trạng thái | Hạng mục kiểm tra | Kết quả kỳ vọng | Priority | REQ ID | TC ID liên quan | Execution ID |
|---|---|---|---|---|---|---|---|
| 1 | ✅ PASS | Đăng nhập bằng tài khoản admin hợp lệ | Vào /dashboard, hiển thị tên user góc phải | P1 | REQ-LOGIN-01 | CRM_LOGIN_TC_001 | [run_1787215085](../../../executions/login/web/run_1787215085/execution_report.md)<br><sub>20-08-2026</sub> |
| 2 | ☐ | Đăng nhập sai mật khẩu 5 lần liên tiếp | Tài khoản bị khóa, hiện thông báo khóa | P1 | REQ-LOGIN-02 | CRM_LOGIN_TC_012 | — |
```

**Kết thúc checklist BẮT BUỘC kèm bảng ký nhận:**

```markdown
| Môi trường | Build / Version | Người thực hiện | Ngày | Kết quả (Pass/Fail/Blocked) |
|---|---|---|---|---|
|  |  |  |  |  |
```

> Cột `TC ID liên quan` ghi `—` khi checklist là REQ-based.
>
> **Checklist Release-readiness** cắt ngang nhiều module → thêm cột **`Module`** (tên thư mục module, VD `customers`) ngay sau `Hạng mục kiểm tra`. Lần chạy, bug và RTM phía sau dựa vào cột này để quy mỗi mục về đúng module — thiếu cột là bug sinh ra không biết đặt vào `docs/bugs/<module>/`.

### Cột Trạng thái & Execution ID

Checklist sinh ra **không** để trống mù: mục nào đã có kết quả chạy thì gắn luôn, người đọc biết ngay mục nào còn phải chạy.

| Trường hợp | `Trạng thái` | `Execution ID` |
|---|---|---|
| Chưa có kết quả | `☐` — người chạy tay tự đánh dấu | `—` |
| Có kết quả | Đúng nhãn của execution report: `✅ PASS` · `❌ FAIL` · `⚠️ BLOCKED` · `⏭️ SKIPPED` | `[<run_id>](<link tương đối tới execution_report.md>)<br><sub><ngày chạy DD-MM-YYYY></sub>` — ngày lấy ở ô `Bắt đầu → Kết thúc` của report, chữ nhỏ dưới ID |

**Nguồn kết quả — xét theo thứ tự, gặp nguồn nào có thì dừng:**

| # | Nguồn | Áp dụng | Cách lấy |
|---|---|---|---|
| 1 | Lần chạy **chính checklist này** — report có `Loại nguồn` = `Checklist <loại> · <Mã checklist>` | Mọi checklist | Khớp theo **mã mục** `<Mã checklist>-<nn>`, lấy lần chạy mới nhất |
| 2 | Lần chạy **bộ TC** cùng module + nền tảng — report có `Loại nguồn` = `Bộ TC` (report cũ không có ô này coi là `Bộ TC`) | Chỉ TC-based | Theo từng `TC ID liên quan` — xem luật gộp bên dưới |

Checklist **khác** (khác `Mã checklist`) **không** là nguồn — phạm vi mục khác nhau, mượn kết quả là sai nghĩa. Checklist REQ-based chỉ có nguồn 1.

**Luật gộp khi lấy từ bộ TC (nguồn 2):**

- Mỗi TC lấy **lần chạy mới nhất có kết quả khác `SKIPPED`** — lần sau bổ sung cho lần trước bị skip. Chỉ từng có `SKIPPED` → `⏭️ SKIPPED`
- Mục gắn nhiều TC → lấy mức **xấu nhất**: `FAIL` > `BLOCKED` > `SKIPPED` > `PASS`. `✅ PASS` **chỉ** khi **mọi** TC liên quan đều PASS
- Có TC liên quan **chưa từng chạy** mà các TC còn lại đều PASS → để `☐` — chưa đủ bằng chứng để nói mục đạt. Có TC đã FAIL/BLOCKED thì vẫn hiện mức đó
- `Execution ID` = lần chạy chứa kết quả **quyết định** trạng thái (mức xấu nhất; bằng nhau → lần mới nhất). Chỉ ghi **một** ID mỗi mục
- Link tương đối từ file checklist: `../../../executions/<module>/<nền-tảng>/<run_id>/execution_report.md` (checklist `_release/` cùng độ sâu)

**Header ghi dòng `Trạng thái lấy từ:`** — `<số mục có kết quả>/<tổng> mục đã có kết quả` + nguồn nào, các `run_id` nào. Không có gì → `Chưa có lần chạy nào`.

- 🚫 Agent **không** tự chấm trạng thái khi chưa chạy — mọi ô khác `☐` phải truy được về đúng một execution report
- Trạng thái mượn từ bộ TC chỉ là **bản sao để đọc** — báo cáo tổng hợp, RTM vẫn đọc kết quả từ execution report, không đọc cột này, nên không đếm hai lần
- Chạy checklist xong, `/execute-test-cases` cập nhật lại **đúng hai cột này** + dòng `Trạng thái lấy từ:` (nguồn 1 thay nguồn 2) — không đụng cột khác, không đụng bảng ký nhận

### Mã checklist & mã mục

Cột `#` chỉ là số thứ tự **trong một file** — mục `#3` của checklist smoke và mục `#3` của checklist regression là hai việc khác nhau. Khi kết quả đi sang execution report, bug, RTM và báo cáo tổng hợp, mỗi mục phải có mã **không trùng giữa các checklist**:

| | Quy tắc | Ví dụ |
|---|---|---|
| **Mã checklist** | `CL-` + phần tên file **sau** `checklist_`, bỏ `.md` — giữ nguyên chữ thường và dấu | `checklist_smoke_20261009.md` → `CL-smoke_20261009` · `checklist_post-hotfix_CRM-812.md` → `CL-post-hotfix_CRM-812` · `checklist_release_release_2.0.md` → `CL-release_release_2.0` |
| **Mã mục** | `<Mã checklist>-<số mục 2 chữ số>` | mục 3 → `CL-smoke_20261009-03` |

- Mã mục **không** ghi vào bảng checklist (bảng giữ cột `#` cho người tick tay) — `/execute-test-cases` tự ghép khi ghi report
- Mã mục **không phải** TC ID và **không** thay TC ID: mục có `TC ID liên quan` thì mọi mắt xích phía sau vẫn truy về TC đó
- Không dùng `#` trong mã — `#` vỡ link Markdown và tên file bug

## Quy Tắc Viết Mục Checklist (BẮT BUỘC)

- **Mỗi mục 1 dòng, ≤ 20 từ**, bắt đầu bằng **động từ** (Đăng nhập, Tạo, Sửa, Xóa, Lọc, Xuất...)
- **Verify được trong ≤ 2 phút** bởi người chưa đọc requirements
- **Có kết quả kỳ vọng quan sát được** — không viết "hoạt động đúng", phải nêu dấu hiệu cụ thể trên UI
- **Test data cụ thể ở mục phụ thuộc data** (áp dụng nguyên Quy tắc Test Data của skill)
- **KHÔNG viết steps đánh số** — nếu một mục cần >3 thao tác mới verify được thì nó là test case, phải tách hoặc chuyển sang mode QUICK

```markdown
❌ Sai: "Kiểm tra chức năng khách hàng hoạt động tốt"
✅ Đúng: "Tạo KH mới với đủ field bắt buộc → xuất hiện đầu danh sách, đúng tên vừa nhập"

❌ Sai: "Test phân quyền"
✅ Đúng: "Đăng nhập role Sale, mở URL /admin/settings trực tiếp → bị chặn, về trang 403"

❌ Sai: "Kiểm tra validate email"
✅ Đúng: "Nhập email thiếu @ (`test.domain.com`) → hiện lỗi 'Email không hợp lệ', không submit"
```

## 🛡️ Checklist Quality Gate (5 Tiêu Chí)

Trước khi xuất, agent **BẮT BUỘC** tự rà:

- [ ] **1. Verify được:** 100% mục có kết quả kỳ vọng quan sát được, không còn từ "hoạt động đúng / bình thường / OK"
- [ ] **2. Critical path đủ:** Mọi luồng sống còn của module (đăng nhập, tạo/sửa/xóa bản ghi chính, phân quyền, thanh toán nếu có) đều có ≥1 mục P1
- [ ] **3. Component đủ:** Mỗi component có mặt trong module (Table/List, CRUD, Permission, Modal, Notification, Status Flow) có ≥1 mục — component không có trong module thì ghi "Không áp dụng", KHÔNG lặng lẽ bỏ qua
- [ ] **4. Đúng quy mô:** Số mục nằm trong ngưỡng của loại checklist. Vượt ngưỡng → tách theo module hoặc hạ scope, ghi rõ phần đã cắt
- [ ] **5. Truy vết được:** Header có `Mã checklist` khớp tên file · mục có REQ thì điền `REQ ID` · TC-based thì điền `TC ID liên quan` · Release-readiness có cột `Module` ở **mọi** mục · ô `Trạng thái` khác `☐` đều có `Execution ID` mở được đúng report

---

# Mode 4: DELTA — Cập Nhật Bộ TC Đã Có

## Mục đích

Đồng bộ bộ TC **đã tồn tại** với requirements vừa đổi theo ticket. Chỉ chạm phần bị ảnh hưởng, giữ nguyên mọi thứ còn lại.

Command: `/update-testcases-from-impact` — quy trình 7 bước chi tiết nằm trong command đó (Quality Gate chạy ở bước cuối, sau khi đã ghi Nhật ký và Delta TC List). Mục này là **bộ quy tắc bất biến** mà mọi lần chạy DELTA phải tuân thủ.

## Nguyên tắc gốc: TC ID là khoá, không phải nhãn

TC ID xuất hiện ở **ba nơi ngoài file TC**: `allure.label('testId', ...)` trong script automation · cột TC ID của RTM · execution report của các lần chạy trước. Đổi hoặc đánh lại TC ID là cắt cả ba mối nối cùng lúc, và không có cách nào phát hiện tự động — chỉ thấy coverage tự nhiên tụt mà không rõ vì sao.

Vì vậy Mode DELTA đặt việc **bảo toàn TC ID** lên trên mọi mục tiêu khác, kể cả trên sự gọn gàng của tài liệu.

## 5 Quy tắc bắt buộc

| # | Quy tắc | Vì sao |
|---|---|---|
| 1 | **Sửa tại chỗ** trong file nền tảng `<nền-tảng>/test_cases_<module>_<nền-tảng>.md` / `<nền-tảng>/parts/part_NN_*.md` — tên file không đổi | Mọi workflow sau (`/execute-test-cases`, `/update-automation-from-impact`, `/generate-traceability-matrix`) đọc theo mẫu đường dẫn cố định |
| 2 | **Ghi mốc git trước khi sửa** — hash commit gần nhất của file (`git log -1 --format=%h -- <file>`). File đang có thay đổi chưa commit (`git status --short <file>` có dòng) → **dừng**, đề nghị user commit trước; agent không tự commit | Sửa tại chỗ không có bản đối chiếu thì không ai kiểm được agent đã đổi gì. Có mốc thì xem lại bản cũ bằng `git show <hash>:<file>`, so bằng `git diff <hash> -- <file>` |
| 3 | **Giữ nguyên TC ID.** TC mới cấp số tiếp dải hiện có, KHÔNG chèn vào giữa | Xem nguyên tắc gốc ở trên |
| 4 | **KHÔNG xoá dòng TC.** Chức năng gỡ → gắn tag `@Deprecated` ở cột `Tags` **và** tiền tố `🗑️ Deprecated (TICKET-XXX, <DD-MM-YYYY>) —` ở đầu ô `Test Scenario` (quy ước ở phần giải thích cột Tags) | Đối xứng quy tắc "KHÔNG xoá dòng REQ". Xoá dòng là mất dấu vết TC từng tồn tại, và script tương ứng thành orphan |
| 5 | **Đọc REQ đã đổi, không suy từ tên TC** | Tên TC không chứa kỳ vọng. Sửa theo suy đoán tạo ra TC nghe hợp lý nhưng sai kỳ vọng mới — loại lỗi khó phát hiện nhất |

## Bảng ánh xạ: REQ đổi gì → TC sửa gì

| Delta của REQ | Vòng · Nhánh | Hành động với TC |
|---|---|---|
| Đổi **nhãn nguyên văn** (nút, tiêu đề, nhãn field, thông báo) | **V1 · UI cơ bản** | Sửa nhãn trong bảng kiểm màn hình **và** mọi Expected Result trích nhãn đó |
| **Thêm / bớt field** trên form | **V1 · UI cơ bản** (+ V2 kèm theo) | Thêm/bớt **dòng bảng kiểm** thành phần màn hình, kiểm lại thứ tự field — **rồi mới** tới TC Required/Validation ở V2 |
| Đổi **giá trị mặc định** (checkbox tick sẵn, option đang chọn) | **V1 · UI cơ bản** | Sửa dòng tương ứng trong bảng kiểm |
| Đổi **định dạng hiển thị** (tiền, ngày, badge) | **V1 · Display** | Sửa Expected Result ghi đúng định dạng mới |
| Đổi **hành vi giao diện** (nút khoá đến khi đủ điều kiện, field bật/tắt) | **V2 · UI Behavior** | Sửa TC hành vi, kiểm **cả hai chiều** bật/tắt điều kiện |
| Đổi expected result / message | V2 · theo nhánh của TC | Sửa cột Expected Result, ghi message **nguyên văn** từ UI |
| Field tuỳ chọn → **bắt buộc** | **V2 · Required** | Sửa TC happy path + **thêm TC negative** để trống field |
| Đổi luật validation (độ dài, định dạng, dải) | **V2 · Validation + BVA** | Sửa lại **cả 3 mốc** boundary: dưới / đúng / trên ngưỡng |
| Đổi steps / luồng | **V2 · Use Case** | Sửa Steps + kiểm Precondition còn đúng không |
| Đổi quy tắc nghiệp vụ / trạng thái | **V2 · Business Rule · State Transition** | Sửa bảng quyết định / bảng transition, cả ô hợp lệ lẫn ô bị chặn |
| Đổi phân quyền | **V3 · Permission** | Sửa TC phân quyền + kiểm ma trận role |
| Đổi breakpoint / trình duyệt cam kết | **V4 · Responsive · Compatibility** | Sửa danh sách kích thước/trình duyệt trong TC |
| REQ 🔴 bị gỡ | Nhánh của TC đó | TC → tag `@Deprecated` + tiền tố `🗑️ Deprecated (TICKET-XXX, <ngày>) —` ở `Test Scenario`, giữ dòng |
| REQ 🟢 mới | — | ❌ Ngoài phạm vi DELTA → QUICK / FULL RBT |

> 🚨 **Bốn dòng V1 đầu bảng bắt buộc mở evidence trước khi sửa** — đúng **4 nhóm TC không được suy diễn** của [Quy Tắc Đối Chiếu Evidence](#quy-tắc-đối-chiếu-evidence-bắt-buộc--áp-dụng-cả-4-modes-chạy-trước-batch-đầu-tiên). Chưa có ảnh mới của màn hình sau khi đổi thì **không sửa**, gắn `@NeedsVerify` và báo user recon bổ sung.
>
> 🚨 **Độ hạt GỘP:** thêm field = thêm **một dòng vào Bảng kiểm** của TC `UI cơ bản` (Kiểu B), KHÔNG tạo TC mới, KHÔNG tách dòng đó ra. Trần 6 biến thể/TC vẫn áp dụng.

## Tác động lan toả — 5 câu phải tự hỏi

Đây là phần Mode DELTA dễ làm hụt nhất, vì Impact Report chỉ liệt kê TC **map trực tiếp** với REQ đã đổi:

1. **Ticket có đụng thứ nhìn thấy được trên màn hình không** (thêm/bớt field, đổi nhãn, đổi vị trí, đổi giá trị mặc định)? → TC `UI cơ bản` ở **Vòng 1** phải cập nhật, **không chỉ** TC validation ở Vòng 2. Sửa xong V2 mà quên V1 là kiểu hụt phổ biến nhất của DELTA
2. Field đổi thành bắt buộc → **TC nào khác dùng field đó ở bước phụ** mà giờ sẽ fail?
3. TC vừa Deprecated → **TC nào lấy nó làm precondition**?
4. Thêm field mới → **bảng 15 loại field** của loại đó đã đối soát đủ từng mục chưa, hay mới sinh 2–3 TC cho xong?
5. Thêm TC mới có làm file **vượt ngưỡng 40 TC** → phải tách `parts/`?

## Quality Gate DELTA (8 tiêu chí)

- [ ] **1.** Mọi TC ID giữ nguyên — không TC nào bị đổi số hay đánh lại từ `001`
- [ ] **2.** Tên file index không đổi — không có file `_improved` / `_v2` / thư mục `archive/` nào
- [ ] **3.** Không dòng TC nào bị xoá — TC gỡ đều mang **cả** tag `@Deprecated` **và** tiền tố `🗑️ Deprecated (<mã ticket>, <ngày>) —` ở `Test Scenario`
- [ ] **4.** Bảng Đối Soát Coverage khớp lại — mọi REQ 🟡 (đã sửa) và REQ chưa đổi còn active có ≥1 TC **không** `@Deprecated`. REQ 🔴 không còn TC active là **đúng**, ghi lý do. REQ 🟢 (mới) **không** chấm ở gate này — liệt kê ở *Ngoài phạm vi* kèm command sinh bổ sung
- [ ] **5.** **Bảng Đối soát loại kiểm thử (4 vòng)** cập nhật **đúng những nhánh ticket chạm tới**, giữ nguyên phần còn lại — KHÔNG rà lại cả module. Ticket đụng thành phần màn hình mà nhánh `V1 · UI cơ bản` không đổi gì = **dấu hiệu đã bỏ sót**
- [ ] **6.** Số TC ở index (Bản đồ tài liệu) khớp tổng số TC của các file nền tảng / `parts/`, tách rõ số TC `@Deprecated`
- [ ] **7.** `docs/testcases/README.md` (danh mục) đã cập nhật: số TC, REQ bao phủ, ngày cập nhật
- [ ] **8.** Có **Nhật ký thay đổi** ở cuối file TC + **Delta TC List ghi ra file** `impact/delta_tc_<TICKET-ID>.md` (cùng hậu tố với Impact Report) — có cột **Nền tảng** và **Vòng · Nhánh**, có đủ dòng `⏸️ @NeedsVerify` của TC chưa sửa được, ghi đúng **mốc git** của từng file nền tảng trước khi sửa

---

## Anti-Patterns (NGHIÊM CẤM — áp dụng cho cả 4 modes)

- ❌ Gộp nhiều bước chạy 1 lần trong FULL RBT (PHẢI tuần tự)
- ❌ Tự đoán business logic khi chưa hỏi user (Bước 2 - FULL RBT)
- ❌ Bỏ qua bước phân tích Ambiguity (FULL RBT)
- ❌ Sinh test data chung chung / placeholder
- ❌ Rút gọn hoặc bỏ sót test case khi mapping sang bảng
- ❌ Sinh tất cả test cases 1 lần cho hệ thống lớn (phải chia module)
- ❌ Chỉ có Happy Path, thiếu Negative/Boundary cases (QUICK)
- ❌ Test Steps mơ hồ, không ghi rõ dữ liệu nhập
- ❌ Gộp validation của **các trường khác nhau** vào 1 test case → FAIL không chỉ ra được trường nào hỏng
- ❌ Dùng chung 1 bộ validation cho tất cả fields (Email ≠ Phone ≠ Date ≠ Text)
- ❌ **Ghi dòng TC đầu tiên khi chưa chốt độ hạt GỘP/TÁCH** và chưa nêu ra chat
- ❌ Gộp mà **cắt bớt biến thể** — gộp là đổi cách trình bày, bỏ case là giảm độ phủ
- ❌ Gộp mà biến thể **không có mã riêng** (`a`, `b`, `c`…) → báo cáo FAIL không truy được về case nào
- ❌ Gộp TC `@Smoke` / `Critical`, hoặc gộp TC được thiết kế để FAIL (mỗi cái gắn 1 bug riêng)
- ❌ Gộp các biến thể **khác loại phản hồi** (trình duyệt chặn với máy chủ báo lỗi; lỗi với thành công)
- ❌ Nhồi **quá 6 biến thể** vào một TC → ô bảng không ai đọc nổi, phải tách theo nhóm rủi ro
- ❌ **Đổi độ hạt của bộ TC đã có script / execution report / RTM trỏ vào** — cắt cả ba mối nối cùng lúc. Cần gọn thì sinh checklist, giữ nguyên bộ TC
- ❌ Bỏ qua security validation (XSS, SQL injection) cho text/textarea fields
- ❌ Không liệt kê danh sách fields trước khi sinh validation TCs
- ❌ Xuất TC không có cột `REQ ID` hoặc có REQ 0 TC mà không bổ sung (vi phạm tiêu chí 6 Quality Gate)
- ❌ Test Steps viết đoạn văn liền không đánh số, hoặc gộp nhiều hành động vào 1 số
- ❌ Chỉ test form input mà bỏ qua Table/List, CRUD lifecycle, Permission, Status flow (Component-Level Checklist)
- ❌ Có ≥3 điều kiện kết hợp nhưng không lập Decision Table; có status flow nhưng không lập bảng State Transition
- ❌ QUICK mode đoán ngầm khi requirement mơ hồ mà không ghi vào mục Assumptions
- ❌ CHECKLIST mode viết mục thành test case có steps đánh số (nhầm mode — cần steps thì dùng QUICK/FULL)
- ❌ CHECKLIST mode viết mục mơ hồ kiểu "Kiểm tra chức năng hoạt động đúng" (không verify được)
- ❌ CHECKLIST mode liệt kê hết 15 loại validation cho mọi field → checklist phình to, mất tác dụng rà nhanh
- ❌ Checklist Smoke vượt 20 mục hoặc Release-readiness vượt 60 mục mà không tách module
- ❌ Xuất checklist thiếu cột `Trạng thái` / `Execution ID` hoặc thiếu bảng ký nhận (môi trường/build/người chạy)
- ❌ Ô `Trạng thái` khác `☐` mà không có `Execution ID` trỏ tới report thật — trạng thái bịa
- ❌ Sinh checklist mới trong khi đã có bộ TC chi tiết mà không rút gọn từ bộ TC đó (gây lệch nội dung)
- ❌ In toàn bộ bảng TC ra chat rồi mới ghi file (vi phạm Write-first — user chờ render 2 lần)
- ❌ Dồn >40 TC vào 1 file mà không tách part, hoặc gộp nhiều module vào 1 file
- ❌ Tách part cắt ngang giữa một nhóm chức năng (phải cắt tại ranh giới nhóm)
- ❌ Có ≥2 part nhưng không sinh file index → không đối soát được coverage toàn module
- ❌ Dừng hỏi "có tiếp tục không" sau mỗi batch (đã chốt: chạy thẳng, chỉ báo tiến độ)
- ❌ Sinh >30 TC mà không tạo `task.md` / task list → user không theo dõi được tiến độ
- ❌ **Ghi dòng TC đầu tiên khi chưa mở hết ảnh trong `evidence/`** — lỗi gốc gây bịa bố cục/nhãn/mặc định
- ❌ Viết Expected Result khẳng định chắc chắn về thứ tự Tab, vị trí phần tử, nhãn nút, định dạng hiển thị khi **không nhìn thấy trong ảnh** mà không gắn `@NeedsVerify`
- ❌ Thấy tài liệu và ảnh mâu thuẫn nhưng **tự chọn một bên rồi im lặng** — phải viết theo ảnh, ghi `ASM-XX` và báo user
- ❌ Đọc checkbox **xám mờ (disabled)** thành "không tick" — bỏ sót nguyên một business rule phụ thuộc
- ❌ Xuất bộ TC mà không kèm **Bảng Đối Soát Evidence** (tiêu chí 7 Quality Gate)
- ❌ Sinh TC cho đủ 9 ô của bảng đặc tính chất lượng — đặc tính không áp dụng thì chấm `➖` kèm lý do, TC lấp bảng là TC rác
- ❌ Chấm `➖ Ngoài phạm vi` trơn, không ghi **ai chịu trách nhiệm** — mất luôn giá trị của bảng khi đưa sang Master Test Plan mục 2.2
- ❌ **Chạy QUICK/FULL RBT trên module đã có file TC** — sinh bộ thứ hai, TC ID đánh lại từ `001`, vỡ truy vết sang automation. Đã có TC thì dùng Mode DELTA
- ❌ DELTA sinh lại cả file/module TC thay vì sửa đúng dòng bị ảnh hưởng
- ❌ DELTA đổi TC ID, đánh lại số, hoặc chèn số mới vào giữa dải đang dùng
- ❌ DELTA xoá dòng TC của chức năng bị gỡ (phải gắn tag `@Deprecated` + tiền tố `🗑️ Deprecated (<mã ticket>, <ngày>) —` ở `Test Scenario`)
- ❌ Đánh dấu Deprecated **chỉ bằng chữ** mà không gắn tag `@Deprecated` — `/execute-test-cases`, RTM và Bảng Đối Soát Coverage lọc theo tag, thiếu tag thì TC của chức năng đã gỡ vẫn bị đem ra chạy và vẫn được đếm là đang phủ REQ
- ❌ DELTA sinh file `_improved` / `_v2` / `_new` hoặc thư mục `archive/` — index có tên bất biến, bản cũ nằm trong git
- ❌ DELTA sửa tại chỗ mà **không ghi mốc git**, hoặc sửa đè lên thay đổi chưa commit
- ❌ DELTA sửa TC theo suy đoán từ tên TC, không đọc nội dung REQ sau khi đổi
- ❌ DELTA tự viết TC cho REQ mới (🟢) — ngoài phạm vi, phải route sang QUICK / FULL RBT
- ❌ DELTA bỏ qua tác động lan toả (TC dùng field ở bước phụ · TC lấy TC vừa Deprecated làm precondition)
- ❌ DELTA xong mà không ghi **Nhật ký thay đổi** và không ghi **Delta TC List** — tầng automation mất input
- ❌ **Delta TC List chỉ nằm trong chat** — tầng automation thường chạy ở phiên khác, đóng phiên là mất. Phải ghi file `impact/delta_tc_<TICKET-ID>.md`
- ❌ **Delta TC List thiếu cột Nền tảng** — dải TC ID chung toàn module nên nhìn mã không biết TC thuộc web, app hay API; automation không biết sửa ở project nào, chạy lại trên Android hay iOS
- ❌ **Bỏ TC `@NeedsVerify` khỏi Delta TC List** — automation tưởng TC không bị ảnh hưởng. Ghi dòng `⏸️ chưa sửa` để automation biết mà không chạm
- ❌ **Ghi Delta TC List ở Mode PLAN** — kế hoạch chưa duyệt có thể bị gạch bớt; automation chỉ được đọc thứ đã thật sự sửa
- ❌ **Bộ TC không có nhánh `UI cơ bản`** — không TC nào kiểm nhãn nguyên văn, thứ tự field, trạng thái mặc định của màn hình. Validation đầy đủ đến đâu cũng vẫn là thiếu hẳn một lớp
- ❌ **Nhảy cóc vòng** — sinh validation (V2) trước khi có TC mở form và lưu được (V1). V1 fail thì mọi TC V2 đều BLOCKED, chạy hết mới biết là quá muộn
- ❌ **Trộn TC của hai vòng vào một batch** — mất ranh giới chia việc và không chấm được bảng đối soát
- ❌ **Đọc lướt bảng 15 loại field rồi sinh 2–3 TC cho xong** — Password có 7 mục, Email có 9 mục; sinh 3 TC là trượt Gate #4 dù vẫn qua sàn `1 positive + 2 negative`
- ❌ **Chấm `➖` cho `UI cơ bản` / `Validation` / `Permission`** — ba nhánh này không bao giờ ngoài phạm vi khi điều kiện kích hoạt đã thoả
- ❌ **Ghi `➖` trơn không lý do, không tên người/đội chịu trách nhiệm** — biến "đã thống nhất không test" thành "QA quên test", đúng thứ bảng này sinh ra để chống
- ❌ **Hỏi lại user về quyền API / CSDL / nhật ký ở từng module** — đó là thuộc tính cấp dự án, đọc dòng `Năng lực kiểm thử của QA` ở `docs/requirements/README.md`; chưa có thì hỏi **một lần** rồi ghi vào đó ngay
- ❌ **Chạy đủ 4 vòng cho chức năng rủi ro Thấp** — bơm 50 TC cho một trang tĩnh chỉ hiển thị là lãng phí công viết, công chạy, công bảo trì, và làm loãng bộ TC thật. Chấm mức rủi ro trước, chọn độ sâu tương ứng
- ❌ **Rút gọn bằng cách bỏ Vòng 1** — V1 là thứ duy nhất trả lời "chức năng này có chạy được không". Rủi ro Thấp vẫn phải đủ 6 nhánh V1
- ❌ **Chấm `Thấp` cho chức năng có field nhập** — có ô nhập là có người nhập sai. Thiếu một trong bốn điều kiện là không được chấm Thấp
- ❌ **Dùng `➖` thay cho `⏭️`** — `➖` nghĩa là hệ thống không có thứ đó, `⏭️` nghĩa là có nhưng cố ý không kiểm. Ghi nhầm là **giấu một quyết định chấp nhận rủi ro**
- ❌ **Ghi `⏭️` mà không có điều kiện rà lại** — quyết định rút gọn phải **tự hết hạn** khi chức năng lớn lên, nếu không nó thành lỗ hổng bị quên vĩnh viễn
- ❌ **Sinh TC chỉ để lấp ô bảng 4 vòng** — TC rác làm loãng bộ TC thật, vi phạm đúng luật đã áp cho bảng ISO 25010
- ❌ **Gộp mà không công bố số biến thể** — Bảng Đối Soát Coverage đếm theo REQ nên không bắt được việc rụng biến thể
- ❌ **DELTA sửa xong Vòng 2 rồi dừng** — ticket thêm field mà chỉ sửa TC validation, quên cập nhật bảng kiểm thành phần màn hình ở `V1 · UI cơ bản`. Bộ TC thành ra mô tả một màn hình không còn tồn tại
- ❌ **DELTA rà lại toàn bộ bảng 4 vòng của cả module** — chỉ chấm lại nhánh ticket chạm tới; rà cả module là làm việc của `/generate-testcases-manual-rbt` và dễ kéo theo sửa ngoài phạm vi đã duyệt

---

## Output Format

### Mode QUICK

| Output | Mô tả |
|--------|--------|
| Mục Assumptions | Các giả định đã áp dụng khi requirement mơ hồ (ASM-XX) — gồm cả xung đột tài liệu ↔ evidence |
| Bảng TC Markdown | Test Cases đầy đủ (có cột REQ ID), sẵn sàng copy sang Excel/Jira |
| Bảng Đối Soát Coverage | Mỗi REQ ID × số TC × đủ Positive/Negative/Boundary (tiêu chí 6) |
| **Bảng Đối Soát Evidence** | Mỗi ảnh × màn hình/trạng thái × TC dựa vào × đầy đủ hay cắt cụt (tiêu chí 7) |
| **Vùng chưa có evidence** | Danh sách màn hình/trạng thái không có ảnh chống lưng + TC bị gắn `@NeedsVerify` |
| **Bảng Đối soát loại kiểm thử (4 vòng)** | Mọi nhánh của V1–V4 × ✅/➖/⏭️/🔴 × TC ID (kèm số biến thể nếu GỘP) hoặc lý do (➖) · lý do + ai quyết + điều kiện rà lại (⏭️) (tiêu chí 10) |
| **Bảng rà soát đặc tính chất lượng** | 9 đặc tính ISO/IEC 25010:2023 × ✅/➖/🔴 × TC ID hoặc lý do (tiêu chí 9) |
| **Đối soát cột Automation** | Đếm Yes/Partial/No/⏸️ Hoãn theo nền tảng + điều kiện cần chuẩn bị + TC Partial/No/Hoãn kèm lý do (tiêu chí 5) |

### Mode FULL RBT

| Bước | Output |
|------|--------|
| 1 | Xác nhận bối cảnh + **Danh mục Evidence đã mở** |
| 2 | Luồng + Ambiguities + Câu hỏi Q&A (gồm xung đột tài liệu ↔ evidence) |
| 3 | Module Decomposition + Dependencies |
| 4 | Traceability Matrix + High-Level Scenarios **xếp theo 4 vòng** (mỗi nhánh chấm sơ bộ ✅/➖/⏭️) + **mức rủi ro · độ sâu** từng Module |
| 5 | Test Cases chi tiết (REQ ID + Risk Level + Test Data), sinh **tuần tự V1 → V4** |
| 6 | Bảng Markdown chuẩn (Jira/Excel ready) + Bảng Đối Soát Coverage + **Bảng Đối Soát Evidence** + **Bảng Đối soát loại kiểm thử (4 vòng)** + **Bảng rà soát đặc tính chất lượng (ISO/IEC 25010:2023)** + **Đối soát cột Automation** |

### Mode CHECKLIST

| Output | Mô tả |
|--------|--------|
| Header checklist | Loại checklist + module + số mục + thời gian chạy ước tính + **Mã checklist** + dòng **Trạng thái lấy từ** |
| Bảng Checklist | Nhóm theo Module → Nhóm chức năng, có cột `Trạng thái` (`☐` hoặc kết quả đã chạy), Priority, REQ ID, TC ID liên quan, `Execution ID` — Release-readiness thêm cột `Module` |
| Ghi chú "Không áp dụng" | Component có trong bảng chuẩn nhưng module không có → nêu rõ, không bỏ im lặng |
| Bảng ký nhận | Môi trường · Build/Version · Người thực hiện · Ngày · Kết quả |

> **Nơi ghi file — nhánh `docs/checklists/`, có tầng nền tảng như `testcases/`:**
>
> | Loại | Đường dẫn |
> |---|---|
> | Smoke · Regression (module) | `docs/checklists/<module>/<nền-tảng>/checklist_<loại>_<YYYYMMDD>.md` |
> | Post-hotfix | `docs/checklists/<module>/<nền-tảng>/checklist_post-hotfix_<TICKET-ID>.md` — gắn với bản vá, hai hotfix cùng ngày không đè nhau |
> | Release-readiness (cắt ngang nhiều module) | `docs/checklists/_release/<nền-tảng>/checklist_release_<mốc>.md` — `<mốc>` cùng slug với `docs/test-plans/test_plan_<mốc>.md`. Đợt release có nhiều nền tảng → **mỗi nền tảng một file**, vì mỗi lần chạy thuộc đúng một nền tảng |
>
> `_release/` đóng vai **module giả** cho mọi nhánh phía sau (`executions/_release/<nền-tảng>/`) — dấu `_` đầu = không phải module, workflow quét module bỏ qua. `<loại>` viết thường: `smoke` · `regression` · `post-hotfix` · `release`. Checklist là **ảnh chụp tại một thời điểm**, không sửa tại chỗ như bộ TC: lần rà mới sinh file mới theo ngày/ticket/mốc. Cùng ngày chạy lại đúng loại đó → ghi đè file của ngày đó (chưa ai tick). Nguồn TC-based **bỏ qua TC `@Deprecated`**.
>
> 📄 **Checklist là tài liệu đọc/in trực tiếp, KHÔNG nạp vào `scripts/testcases-viewer`.** Viewer đó chỉ đọc bảng test case chi tiết (`test_cases_*.md`); checklist cố tình không có `Test Steps` / `Test Data` / `Risk Level` nên nạp vào chỉ ra bảng rỗng. Vì vậy header checklist **được phép** đặt Tiếng Việt cho người tick tay (`Hạng mục kiểm tra`, `Kết quả kỳ vọng`, `TC ID liên quan`) — nó không chịu hợp đồng đọc của viewer như bảng TC.

### Mode DELTA

| Output | Mô tả |
|--------|--------|
| `impact/impact_plan_<TICKET-ID>.md` | Bảng ánh xạ REQ → TC (✅ chắc chắn / ⚠️ suy luận / ❓ chưa có TC) + kế hoạch sửa từng TC + tác động lan toả |
| File nền tảng đã sửa (+ index cập nhật) | Sửa **tại chỗ**, tên file không đổi, TC ID giữ nguyên |
| Mốc git trước khi sửa | Hash commit của từng file nền tảng — ghi ở Nhật ký và `delta_tc_` để đối chiếu |
| **Bảng Đối soát loại kiểm thử (4 vòng)** | Cập nhật **chỉ nhánh ticket chạm tới** ở cuối index — phần còn lại giữ nguyên |
| **Đối soát cột Automation** | Chấm lại cột `Automation` của TC đã sửa / thêm, cập nhật đúng các dòng đó trong mục đối soát của index |
| Nhật ký thay đổi | Bảng ở cuối file TC: ngày · ticket · TC bị ảnh hưởng · **vòng · nhánh** · thay đổi · mốc git |
| **`impact/delta_tc_<TICKET-ID>.md`** | Delta TC List — **chỉ ghi ở APPLY**, cột **Nền tảng** + **Vòng · Nhánh** + hành động `✏️` / `➕` / `🗑️` / `⏸️`, ghi mốc git từng nền tảng. Input **bắt buộc** của `/update-automation-from-impact`; chat chỉ hiện tóm tắt + đường dẫn. Mẫu đầy đủ ở command `/update-testcases-from-impact` Bước 6 |
| Danh sách ngoài phạm vi | REQ 🟢 chưa có TC + command tiếp theo |

Tất cả output phải bằng **Tiếng Việt**, format **Markdown**, và tuân thủ **Quy Tắc Xuất File & Theo Dõi Tiến Độ**: ghi thẳng vào file (`docs/testcases/` hoặc `docs/checklists/`), chat chỉ hiện tiến độ + Bảng Đối Soát Coverage + tóm tắt đường dẫn file.
