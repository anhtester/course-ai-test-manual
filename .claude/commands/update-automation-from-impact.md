---
description: Cập nhật automation script đã có theo Delta TC List của /update-testcases-from-impact (chế độ delta) — web (Playwright/Selenium) · mobile (Appium) · API — map TC đã đổi sang script tương ứng, chỉ sửa đúng phần đổi, KHÔNG sinh lại cả module. Hỗ trợ 2 mode — PLAN (chỉ lập kế hoạch) và APPLY (sửa + chạy lại).
skills:
  - skills-coverage-traceability
  - skills-qa-automation-engineer
  - skills-ui-debug-agent
  - skills-smart-locator-agent
  - skills-mobile-debug-agent
---

# Workflow: Cập Nhật Automation Theo Delta TC List

> **BẮT BUỘC (MANDATORY SKILLS):** Nạp và đọc kỹ trước khi bắt đầu:
> - **`skills-coverage-traceability`** (`.claude/skills/skills-coverage-traceability/SKILL.md`) — Mapping Rules để nối TC ID ↔ script
> - **`skills-qa-automation-engineer`** (`.claude/skills/skills-qa-automation-engineer/SKILL.md`) — quy tắc automation chung
>
> **Theo nền tảng có mặt trong delta** — nền tảng nào không có TC trong delta thì không nạp:
>
> | Nền tảng | Skill | Luật | Quy trình recon · chạy test lấy từ |
> |---|---|---|---|
> | **web** | `skills-ui-debug-agent` · `skills-smart-locator-agent` | `playwright_rules.md` / `selenium_rules.md` | `/generate-automation-web` Bước 2 · 6 |
> | **mobile** | `skills-mobile-debug-agent` · `skills-smart-locator-agent` | `appium_rules.md` | `/generate-automation-mobile` Bước 1–3 · 6 |
> | **api** | `skills-requirements-analyzer` **chỉ mục 3.4.4** (luật dữ liệu khi gọi API thật) | — | `/generate-automation-api` Bước 1 · 4 · 5 |
>
> Luật recon, locator, chạy test của từng nền tảng **nằm ở command nền tảng** — workflow này gọi lại đúng bước đó cho phần bị đổi, **không** chép luật về đây.

Mắt xích **cuối** của chuỗi delta 3 tầng: requirements đổi → TC được đồng bộ → **workflow này** chỉ ra script nào phải sửa và sửa đúng chỗ đó.

```
/update-requirements-from-ticket   → docs/requirements/<module>/impact/impact_<TICKET-ID>.md        cái gì đã đổi
        ↓
/update-testcases-from-impact      → docs/testcases/<module>/impact/delta_tc_<TICKET-ID>.md         TC nào đã sửa xong, sửa gì
        ↓
/update-automation-from-impact     → docs/testcases/<module>/impact/automation_plan_<TICKET-ID>.md  ← WORKFLOW NÀY
        ↓
/generate-traceability-matrix      khớp lại RTM
```

> 🚨 **Đầu vào là Delta TC List, không phải Impact Report.** Impact Report nói REQ nào đổi — chưa nói TC đã được sửa xong chưa, sửa thành gì. Chỉ có Impact Report mà **không** có `delta_tc_<TICKET-ID>.md` = TC chưa đồng bộ → **DỪNG**, chạy `/update-testcases-from-impact` mode APPLY trước.
>
> Sửa script khi TC chưa đồng bộ là sửa theo kỳ vọng không ai kiểm: TC vẫn mô tả hành vi cũ, script đổi sang hành vi mới, hai bên lệch nhau — và suite vẫn xanh nên không ai phát hiện.

## Workflow này khác gì `/generate-automation-from-testcases`?

| | Workflow này (delta) | `/generate-automation-from-testcases` (sinh mới) |
|---|---|---|
| **Input** | Delta TC List — những TC vừa đổi | Bộ TC đầy đủ |
| **Với script đã có** | **Sửa đúng phần đổi**, giữ nguyên phần còn lại | Sinh lại từ đầu |
| **Phạm vi chạm** | Chỉ test / Page Object / Screen / API client liên quan TC đổi | Cả module × một nền tảng |
| **Dùng khi** | TC_018 đổi expected result | Module chưa có automation |

> TC **mới hoàn toàn** (`➕ Mới` trong Delta TC List) **không** thuộc workflow này — route sang command nền tảng: `/generate-automation-web` · `/generate-automation-mobile` · `/generate-automation-api` (hoặc bộ định tuyến `/generate-automation-from-testcases`). Trộn hai việc vào một là mất lý do tồn tại của delta mode.

## ⚠️ Nguyên tắc thực thi

- **Tất cả output bằng Tiếng Việt**
- 🚨 **CẤM sinh lại cả file/module.** Chỉ sửa đúng dòng liên quan TC đã đổi. Sinh lại là xoá sạch công sửa tay và các fix đã tích luỹ
- 🚨 **CẤM xoá file script** của TC `🗑️ Deprecated` — theo `automation_rules.md` mục 4, đánh dấu skip + báo user, chờ xác nhận mới gỡ
- 🚨 **CẤM sửa script của TC chưa được sửa.** Dòng `⏸️ @NeedsVerify` trong Delta TC List nghĩa là TC **vẫn** mô tả hành vi cũ vì chưa có bằng chứng màn hình mới — sửa script theo ticket là đi trước TC, đúng thứ cảnh báo ở trên
- 🚨 **CẤM hạ assertion để né bug.** App chưa làm đúng kỳ vọng mới thì test đỏ là **đúng** — giữ đỏ, chuyển `/create-bug-report`
- **KHÔNG bịa mapping TC ↔ script.** Không map được thì ghi vào mục "cần xác nhận", KHÔNG đoán rồi sửa nhầm file
- **KHÔNG đoán locator** — web inspect DOM thật; mobile dump hierarchy thật **riêng từng nền tảng** (không suy locator iOS từ Android)
- **Mỗi nền tảng một lượt** — xong web mới sang mobile, xong mobile mới sang API. Android và iOS là hai lượt chạy riêng
- **Giữ nguyên TC ID** trong label `testId` sau khi sửa — đứt TC ID là vỡ RTM
- ⚠️ Sau khi user duyệt kế hoạch → agent tự sửa + chạy lại, KHÔNG hỏi lại giữa chừng

## 2 Chế độ (Mode)

| Mode | Khi nào sử dụng | Output |
|---|---|---|
| **PLAN** (mặc định) | Cần biết thay đổi này đụng tới script nào, ở nền tảng nào, tốn bao nhiêu | `automation_plan_<TICKET-ID>.md`: bảng ánh xạ + kế hoạch sửa từng script |
| **APPLY** | Muốn agent sửa luôn | Như PLAN + code đã sửa + kết quả chạy lại theo từng nền tảng |

> User nói "sửa luôn", "cập nhật script đi", "apply" → tự động **Mode APPLY**.

## Input cần thu thập

| Input | Bắt buộc? | Ghi chú |
|---|---|---|
| **Delta TC List** | ⭐ Bắt buộc | `docs/testcases/<module>/impact/delta_tc_<TICKET-ID>.md` — do `/update-testcases-from-impact` mode APPLY ghi ra. User chỉ đưa mã ticket → tìm `docs/testcases/**/impact/delta_tc_<TICKET-ID>.md` (kể cả trong namespace `_<hệ-thống>/`). Ticket chạm nhiều module → **mỗi module một lượt**, mỗi module một file kế hoạch |
| **Danh sách TC đã đổi** | Thay thế — chỉ khi TC được **sửa tay**, không qua workflow | TC ID + đổi cái gì. **Bắt buộc kiểm** Nhật ký thay đổi của file TC có dòng ghi nhận thay đổi đó — không có thì coi như TC chưa sửa, hỏi user. Không có ticket → hậu tố file kế hoạch là `adhoc_<YYYY-MM-DD>` |
| **File test cases hiện hành** | ⭐ Agent tự mở | Index `TEST_CASES_<TÊN_MODULE>_SUMMARY.md` → `## Bản đồ tài liệu` → file nền tảng chứa từng TC trong delta. **Nguồn sự thật của kỳ vọng mới** |
| **Mốc git trước khi sửa** | ⭕ Khuyến nghị | Hash commit của từng file nền tảng — ghi ở đầu Delta TC List. `git diff <hash> -- <file>` ra đúng ô đã đổi, khỏi đoán |
| **Mã nguồn automation** | ⭐ Agent tự tìm | Grep TC ID trên project. Web · mobile · API có thể nằm ở **project khác nhau** — không thấy thì hỏi user đường dẫn, không kết luận "chưa automate" |
| **RTM** | ⭕ Khuyến nghị | File module `docs/traceability/<module>/traceability_matrix_<module>.md` (tra qua `## Bản đồ tài liệu` của file chung `docs/traceability/traceability_matrix.md`) — cột `TC IDs` · `Automation` của ma trận chi tiết; có sẵn thì map nhanh và chắc hơn |
| **Truy cập hệ thống** — chỉ hỏi cho nền tảng có trong delta | ⭐ khi cần recon hoặc chạy test | **web:** URL + tài khoản (`.env`) · **mobile:** file app / package id + device + Appium server chạy bộ test · **api:** base URL + tài khoản lấy token (`.env`), dòng `Gọi API` ở `docs/requirements/README.md` phải ✅ |

> User đưa **Impact Report** thay cho Delta TC List → tìm `delta_tc_` **cùng hậu tố** trong `docs/testcases/<module>/impact/`: có → dùng file đó; không có → **DỪNG** như cảnh báo đầu file.
>
> Delta TC List ghi `Trạng thái: ❌ CHƯA XỬ LÝ XONG` → vẫn chạy được, nhưng **chỉ** xử lý dòng `✏️` / `🗑️`; nói rõ với user phần TC còn treo.

## Các bước thực hiện

### Bước 1: Đọc Delta & tách theo nền tảng

1. Đọc `delta_tc_<TICKET-ID>.md`: bảng thông tin đầu file (ticket · Impact Report nguồn · bản sao lưu từng nền tảng · trạng thái) + bảng **TC đã xử lý**
2. Đã có `automation_plan_<TICKET-ID>.md` từ lần chạy trước → đây là **lần chạy lại**: chỉ nhận dòng Delta **chưa có** trong kế hoạch cũ hoặc **đã đổi hành động** (VD `⏸️` → `✏️` sau khi recon bổ sung). Cập nhật tại chỗ file kế hoạch, không tạo file thứ hai
3. Phân nhóm theo cột **Hành động đã làm**:

   | Hành động trong Delta TC List | Xử lý ở workflow này |
   |---|---|
   | `✏️ Đã sửa` | ✅ Trong phạm vi — sửa script |
   | `🗑️ Deprecated` | ✅ Trong phạm vi — đánh dấu skip script, **không xoá** |
   | `➕ Mới` | ❌ Ngoài phạm vi → command nền tảng sinh script mới |
   | `⏸️ @NeedsVerify — chưa sửa` | ❌ Ngoài phạm vi — TC chưa sửa, **không chạm** script |

4. Với mỗi TC `✏️`: mở **TC hiện hành** và **bản cũ theo mốc git** (`git show <hash>:<file>`), ghi rõ ô nào đổi từ gì sang gì — Precondition / Steps / Test Data / Expected Result / dòng Bảng biến thể / **tag nền tảng** (`@Android` → `@Android @iOS` nghĩa là script phải có thêm locator iOS). Cột *Đổi cái gì (cho automation)* chỉ là gợi ý; lệch với nội dung TC thì **theo TC** và ghi vào mục cần xác nhận
5. Tách theo cột **Nền tảng**. Delta cũ không có cột này → tra TC ID nằm trong file nền tảng nào (mỗi TC nằm ở **đúng một** file nền tảng). Mobile tách tiếp theo tag `@Android` / `@iOS`
6. **Công bố ngay**, VD: *"TICKET-123 · module `project`: 4 TC trong phạm vi — web 2 ✏️ · mobile 1 ✏️ (`@Android @iOS`) · api 1 🗑️. Ngoài phạm vi: 1 ➕ · 1 ⏸️."*

### Bước 2: Map TC → Script

Áp dụng Mapping Rules của `skills-coverage-traceability`, theo thứ tự tin cậy:

| Cách map | Độ tin cậy | Dấu hiệu |
|---|---|---|
| Label `testId` | ✅ Chắc chắn | TS `allure.label('testId', 'CRM_PRJ_TC_018')` · Java `Allure.label("testId", "CRM_PRJ_TC_018")` · Python `@allure.label("testId", "CRM_PRJ_TC_018")` |
| TC ID trong tên test / annotation | ✅ Chắc chắn | `test('CRM_PRJ_TC_018 - ...')` · `@Test(description = "CRM_PRJ_TC_018 ...")` |
| So khớp mô tả TC ↔ tên test | ⚠️ Suy luận | Cần user xác nhận trước khi sửa |
| Không tìm thấy | ❓ | TC chưa được automate — ghi nhận, KHÔNG sửa gì, gợi ý command nền tảng |

- **Grep TC ID trên toàn bộ mã nguồn automation**, không chỉ project của nền tảng đoán trước
- 🚨 **Script tìm thấy phải thuộc đúng nền tảng của TC.** TC `web` mà `testId` nằm trong project Appium (hoặc ngược lại) → `❓` cần xác nhận, **không sửa** — thường là TC ID gắn nhầm hoặc test bị copy giữa project
- Một TC ID xuất hiện ở **> 1 test** → liệt kê hết. Test tham số hoá theo Bảng biến thể là hợp lệ; hai test độc lập cùng `testId` là trùng lặp, hỏi user giữ cái nào
- Mỗi TC ghi lại: file test + dòng · thứ bị kéo theo — **Page Object** (web) / **Screen** (mobile) / **API client · DTO · schema** (api) · data generator / data provider

### Bước 3: Lập Kế Hoạch Sửa — theo nền tảng

Hành động với script **khác** hành động với TC, và khác nhau giữa các nền tảng:

| Delta của TC (Vòng · Nhánh) | Web — Playwright / Selenium | Mobile — Appium | API |
|---|---|---|---|
| Đổi **expected result / message** | Sửa assertion | Sửa assertion — message nằm ở `text`/`content-desc` (Android) hay `label`/`value` (iOS), kiểm lại đúng thuộc tính | Sửa assertion status · body · message |
| **V1 · UI cơ bản** — thêm/bớt field, đổi nhãn, thứ tự | Thêm/sửa locator (**inspect DOM**) + assertion danh sách thành phần | Thêm/sửa locator **cho từng nền tảng TC gắn tag** + assertion danh sách thành phần | Thường không áp. Field mới trong payload/response → sửa DTO + JSON schema |
| **V1 · Display** — định dạng hiển thị | Sửa assertion định dạng | Như web — locale thiết bị ảnh hưởng định dạng, kiểm capabilities | Định dạng trong JSON (ngày ISO, số thập phân) → sửa schema/assertion |
| **V2 · Required · Validation · BVA** | Sửa data generator / data provider + assertion lỗi | Như web + ẩn bàn phím trước khi đọc message | Sửa payload từng biến thể + status kỳ vọng (`400`/`422`) + schema lỗi |
| **V2 · Use Case** — đổi steps / luồng | Sửa method Page Object | Sửa method Screen (gesture, scroll, đổi context WebView) | Sửa thứ tự / chuỗi gọi endpoint trong client hoặc test |
| **V2 · UI Behavior** — khoá/mở theo điều kiện | Assertion enabled/disabled **cả hai chiều** | Thuộc tính `enabled` cả hai chiều | Không áp — trừ khi server cũng chặn, khi đó là status |
| **V2 · Business Rule · State Transition** | Sửa data setup + assertion | Như web | Sửa chuỗi request chuyển trạng thái + status của transition bị chặn |
| Đổi **precondition** | `beforeEach` / fixture | `@BeforeMethod` / capabilities (quyền, trạng thái app) | Fixture token · dữ liệu seed do suite tạo |
| **V3 · Permission** | Fixture đăng nhập theo role | Như web | Fixture token theo role; BOLA/IDOR **chỉ** qua `userA`/`userB` suite tự tạo |
| **V4 · Responsive · Compatibility** | `projects` / ma trận browser trong config | Danh sách device / phiên bản OS trong `testng.xml` · capabilities | — |
| TC **🗑️ Deprecated** | Skip kèm lý do (Bước 5) | Như web | Như web |

**Lưu ý riêng từng nền tảng:**

| Nền tảng | Kiểm khi lập kế hoạch |
|---|---|
| **web** | Locator mới/đổi → đánh dấu *cần inspect DOM*. Đổi nhiều locator ngoài phạm vi delta → dấu hiệu UI đổi diện rộng, tách sang `/heal-locators` |
| **mobile** | Locator khác nhau giữa Android/iOS thì **tách trong Screen class**, không thêm `if (isAndroid)` vào test. App Flutter: element mới chưa có `Semantics` → đánh dấu **chặn, việc của dev**, không lập kế hoạch sửa bằng XPath/toạ độ. iOS chỉ chạy được trên macOS — máy hiện tại không phải Mac thì ghi trước là lượt iOS không chạy được |
| **api** | DTO / schema lấy từ **snapshot spec** trong `_discovery/sources/`, không từ response thật. So `sha256` snapshot với spec online: khác → **dừng** theo `/generate-automation-api` Bước 1 |

Mỗi mục ghi: **nền tảng** · `file:line` · đổi gì · cần recon gì (DOM web / hierarchy Android / hierarchy iOS / gọi API thật / không cần).

### Bước 4: Báo Cáo & Xin Duyệt (CHECKPOINT)

1. Ghi `docs/testcases/<module>/impact/automation_plan_<TICKET-ID>.md` — **cùng hậu tố** với Delta TC List:

   ```markdown
   # Kế hoạch cập nhật automation — TICKET-123 · module `project`

   | Mục | Giá trị |
   |---|---|
   | Delta TC List nguồn | [`delta_tc_TICKET-123.md`](delta_tc_TICKET-123.md) |
   | Ngày lập | 17-08-2026 |
   | Mode | PLAN |
   | Nền tảng trong phạm vi | web 2 TC · mobile 1 TC (`@Android @iOS`) · api 1 TC |
   | Trạng thái | ⏸️ CHỜ DUYỆT |

   ## 1. Ánh xạ TC → script
   ### web
   | TC ID | Hành động TC | Script | Kéo theo | Mapping |
   |---|---|---|---|---|
   | CRM_PRJ_TC_018 | ✏️ | `tests/project/create-project.spec.ts:42` | `pages/project-form.page.ts` | ✅ testId |
   ### mobile
   ### api

   ## 2. Kế hoạch sửa
   | Nền tảng | TC ID | `file:line` | Đổi gì | Recon |
   |---|---|---|---|---|

   ## 3. Ngoài phạm vi
   | TC ID | Lý do | Command |
   |---|---|---|
   | CRM_PRJ_TC_077 | ➕ TC mới, chưa có script | `/generate-automation-web` |
   | CRM_PRJ_TC_060 | ⏸️ TC chưa sửa — chờ recon | `/update-testcases-from-impact` sau khi có ảnh mới |

   ## 4. Cần xác nhận
   ## 5. Việc cần dev   ← element thiếu id · Flutter chưa bật semantics
   ```

   > Vì sao ghi vào `docs/` chứ không vào `reports/`: `reports/` bị `.gitignore` và là output của lần chạy test — tên cố định thì ticket sau ghi đè ticket trước. Kế hoạch này là mắt xích truy vết theo ticket; đặt cạnh `impact_plan_` và `delta_tc_` cùng hậu tố thì một mã ticket tra ra đủ ba tầng.

2. **⏸️ DỪNG LẠI**. Mode PLAN → **KẾT THÚC**. Mode APPLY → hỏi user duyệt, **đặc biệt xác nhận:** nhóm ⚠️ mapping suy luận · nhóm 🗑️ Deprecated · nền tảng nào **chạy được trên máy này** (iOS cần macOS, mobile cần device + Appium server, API cần quyền gọi thật)

### Bước 5: Sửa (Mode APPLY — chỉ sau khi user duyệt)

**Chung cho mọi nền tảng:**

1. Sửa theo kế hoạch, **chỉ chạm đúng phần đã liệt kê**
2. Sau mỗi thay đổi, kiểm lại metadata Allure còn đủ và **`testId` không đổi**
3. TC `🗑️ Deprecated` → skip **có lý do và mã ticket**, test vẫn hiện `SKIPPED` trong report:

   | Stack | Cách skip |
   |---|---|
   | Playwright TS | `test.skip('CRM_PRJ_TC_031 - Copy Project', { annotation: { type: 'deprecated', description: 'Gỡ theo TICKET-123 — chờ user xác nhận xoá' } }, async ({ page }) => { ... })` |
   | TestNG (Selenium · Appium · REST Assured) | Dòng đầu thân test: `throw new SkipException("Gỡ theo TICKET-123 — chờ user xác nhận xoá");` |
   | Pytest | `@pytest.mark.skip(reason="Gỡ theo TICKET-123 — chờ user xác nhận xoá")` |

   > 🚨 **KHÔNG** dùng `@Test(enabled = false)` hay comment cả test — test **biến mất** khỏi report, RTM không còn thấy script để đánh dấu, và không ai nhớ còn một file chờ gỡ.

**Theo nền tảng** — làm lần lượt, xong nền tảng này mới sang nền tảng kế:

| Nền tảng | Recon & sửa |
|---|---|
| **web** | Theo `/generate-automation-web` Bước 2: Playwright MCP **headed**, viewport theo `--viewport-size` lúc launch (**KHÔNG** resize), đưa trang về đúng trạng thái, inspect DOM, verify locator match **đúng 1 element** và đúng element cần thao tác |
| **mobile** | Theo `/generate-automation-mobile` Bước 1–3: mở phiên Appium MCP → **nhận diện lại loại app** (build mới có thể đổi Native ↔ Flutter, semantics bật/tắt) → mỗi tag nền tảng một phiên → verify locator bằng `appium_find_element` **và đếm trong page source** (tool chỉ trả phần tử đầu tiên). Sửa xong **đóng phiên MCP** trước khi chạy test |
| **api** | Theo `/generate-automation-api` + skill `skills-requirements-analyzer` mục **3.4.4**: chỉ gọi API khi dòng `Gọi API` ✅ · **không** ghi/xoá bản ghi không do suite tạo · BOLA/IDOR chỉ qua `userA`/`userB` · DTO theo snapshot spec · attach request/response đã che |

### Bước 6: Chạy Lại & Xác Nhận — từng nền tảng

| Nền tảng | Test trong delta — PASS **2 lần liên tiếp** | Hồi quy — test ngoài delta nhưng dùng chung | Trước khi chạy |
|---|---|---|---|
| **web** | Playwright: `npx playwright test <file> --headed --repeat-each=2 --retries=0` · Selenium: `mvn test -Dtest=<Class>` hai lần | Mọi test gọi Page Object vừa sửa | — |
| **mobile** | `mvn test -Dtest=<Class>` hai lần **cho từng nền tảng** TC gắn tag | Mọi test dùng Screen vừa sửa — **kể cả nền tảng không có trong delta** nếu Screen dùng chung locator/method | Đã đóng phiên Appium MCP · Appium server đang chạy |
| **api** | Lệnh runner của project, hai lần | Mọi test dùng client / DTO / schema vừa sửa | Sau lần chạy cuối: dọn dữ liệu, báo số bản ghi tạo / dọn / còn sót |

> Chạy hồi quy là bước hay bị bỏ nhất — sửa một method Page Object/Screen dùng chung có thể làm gãy test không nằm trong delta.
>
> Test chạy lâu → `run_in_background: true`, nhận thông báo khi xong. **KHÔNG** poll bằng `sleep`.

Còn đỏ:

| Nguyên nhân | Hành động |
|---|---|
| Sửa thiếu / sai kỳ vọng mới | Quay lại Bước 3 — **tối đa 3 vòng** |
| App **chưa** implement thay đổi (mọi nền tảng) | DỪNG — đây là bug/chưa xong việc, không phải lỗi test. Giữ đỏ, báo user, gợi ý `/create-bug-report` |
| **web** — locator gãy diện rộng ngoài delta | → `/heal-locators` |
| **mobile** — element mới không có `content-desc` / Flutter chưa bật semantics | DỪNG phần đó, ghi vào *Việc cần dev* — không thay bằng XPath/toạ độ |
| **mobile** — nền tảng không chạy được trên máy này (iOS ngoài macOS, thiếu device) | Ghi `⚠️ chưa chạy` cho nền tảng đó — **không** tính là PASS |
| **api** — spec online khác snapshot | DỪNG → `/generate-requirements-from-api` (delta) → `/update-testcases-from-impact` → quay lại đây |
| **api** — hành vi thật lệch TC | Giữ assertion theo TC, đánh dấu *đang phơi bug* |
| Môi trường — app/URL không vào được, device mất kết nối, *Connection refused* tới Appium server | DỪNG, báo user — không sửa code để né |

### Bước 7: Báo Cáo Cuối

Cập nhật tại chỗ `automation_plan_<TICKET-ID>.md`:

- **File đã sửa, tách theo nền tảng** — `file:line`, code cũ → mới
- **Kết quả chạy, tách theo nền tảng** (mobile tách tiếp Android / iOS): test trong delta + test hồi quy
- **Việc còn lại:** TC `➕` cần automate (kèm command nền tảng) · TC `⏸️` chờ TC được sửa · TC `🗑️` chờ xác nhận xoá · mapping `❓` · việc cần dev · nền tảng `⚠️ chưa chạy`
- **Trạng thái:** ✅ ĐÃ ĐỒNG BỘ / ⚠️ CÒN VIỆC NGOÀI PHẠM VI / ❌ CHƯA XỬ LÝ XONG
- Nhắc chạy `/generate-traceability-matrix` để RTM khớp lại

Chat chỉ hiện tóm tắt theo nền tảng + đường dẫn file kế hoạch.

## Output

### Mode PLAN
- `docs/testcases/<module>/impact/automation_plan_<TICKET-ID>.md`: bảng ánh xạ TC → script tách theo nền tảng, kế hoạch sửa từng file, ngoài phạm vi, cần xác nhận, việc cần dev

### Mode APPLY
- Tất cả output Mode PLAN, cộng thêm:
  - Code đã sửa (`file:line`, code cũ → mới) theo nền tảng
  - Kết quả chạy lại (delta + hồi quy) theo nền tảng
  - Trạng thái: ✅ ĐÃ ĐỒNG BỘ / ⚠️ CÒN VIỆC NGOÀI PHẠM VI / ❌ CHƯA XỬ LÝ XONG

## Command liên quan

| Tình huống | Command |
|---|---|
| Trước đó — cập nhật requirements từ ticket | `/update-requirements-from-ticket` |
| Trước đó — **đồng bộ TC, ghi Delta TC List** (nguồn kỳ vọng mới) | `/update-testcases-from-impact` ⭐ |
| Trước đó — chưa có nguồn map TC ↔ script | `/generate-traceability-matrix` |
| TC mới hoàn toàn, chưa có script | `/generate-automation-web` · `/generate-automation-mobile` · `/generate-automation-api` (hoặc `/generate-automation-from-testcases`) |
| Sau khi sửa — locator web gãy diện rộng | `/heal-locators` |
| Sau khi sửa — muốn chạy cả suite kiểm hồi quy | `/run-and-fix-tests` |
| App chưa implement đúng thay đổi | `/create-bug-report` |
| Spec API đổi sau khi sinh TC | `/generate-requirements-from-api` |
