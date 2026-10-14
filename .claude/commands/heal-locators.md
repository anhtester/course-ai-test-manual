---
description: Đối chiếu locator trong Page Object với DOM thực tế trên browser, phát hiện locator đã gãy hoặc sắp gãy, sửa và verify. Hỗ trợ 2 mode — SCAN (chỉ báo cáo) và HEAL (sửa + verify).
skills:
  - skills-locator-healer-agent
  - skills-ui-debug-agent
  - skills-smart-locator-agent
---

# Workflow: Rà & Sửa Locator

> **BẮT BUỘC (MANDATORY SKILLS):** Nạp và đọc kỹ trước khi bắt đầu:
> - **`skills-locator-healer-agent`** (`.claude/skills/skills-locator-healer-agent/SKILL.md`) — quy trình healing
> - **`skills-ui-debug-agent`** (`.claude/skills/skills-ui-debug-agent/SKILL.md`) — inspect DOM
> - **`skills-smart-locator-agent`** (`.claude/skills/skills-smart-locator-agent/SKILL.md`) — sinh locator thay thế ổn định

Dùng khi **UI vừa đổi** (deploy frontend mới, redesign module) làm locator gãy hàng loạt — đây **không phải flaky**, và có thể chưa cần chạy test mới biết.

## Workflow này khác gì các workflow lân cận?

| | Workflow này | `analyze-flaky-tests` | `generate-locator` |
|---|---|---|---|
| **Trigger** | UI đổi, locator gãy đồng loạt | Test lúc pass lúc fail | Cần locator cho element mới |
| **Input** | Page Object có sẵn + URL | Test file + error log | Element trên DOM |
| **Phạm vi** | Cả file/module Page Object | 1-vài test | 1 element |
| **Cần error log?** | ❌ Không — rà chủ động được | ✅ Có | ❌ Không |

## ⚠️ Nguyên tắc thực thi

- **Tất cả output bằng Tiếng Việt**
- **TUYỆT ĐỐI KHÔNG ĐOÁN locator** — mọi locator mới phải verify trên DOM thực tế
- **Thứ tự bắt buộc:** `navigate` → `wait_for(page_load)` → `snapshot` → đối chiếu (KHÔNG resize — viewport đã đúng từ `--viewport-size` lúc launch)
- **Headed mode** trong toàn bộ workflow này
- Locator mới phải match **đúng 1 element** và **đúng element cần thao tác** — match 1 element sai còn tệ hơn không match
- Tuân thủ thứ tự ưu tiên trong `.claude/rules/locator_strategy.md` — không thay locator gãy bằng XPath vị trí

## 2 Chế độ (Mode)

| Mode | Khi nào sử dụng | Output |
|---|---|---|
| **SCAN** (mặc định) | Muốn biết locator nào đã gãy / sắp gãy | Báo cáo đối chiếu + locator đề xuất |
| **HEAL** | Muốn agent sửa thẳng vào Page Object | Như SCAN + code đã sửa + kết quả verify |

> User nói "sửa luôn", "heal đi", "cập nhật locator" → tự động **Mode HEAL**.

## Input cần thu thập

| Input | Bắt buộc? | Ghi chú |
|---|---|---|
| **Page Object cần rà** | ⭐ Bắt buộc | File cụ thể, thư mục module, hoặc "toàn bộ" |
| **URL trang tương ứng** | ⭐ Bắt buộc | Agent suy từ tên Page class + `.env`; không suy được thì hỏi |
| **Cách đạt trạng thái cần rà** | ⭕ Khi trang cần đăng nhập / có tiền đề | VD: "login admin rồi vào Khách hàng → Thêm mới" |
| **Error log** | Tùy chọn | Có thì khoanh vùng nhanh hơn, không có vẫn rà được |

> Trang cần đăng nhập mà chưa có tài khoản test → hỏi user **một lần**, lưu `.env`, KHÔNG ghi vào tài liệu.

## Các bước thực hiện

### Bước 1: Trích Locator Từ Code

1. Đọc Page Object trong phạm vi, liệt kê **toàn bộ** locator kèm `file:line`
2. Với mỗi locator ghi nhận: tên biến, kiểu locator, element mục tiêu theo tên biến
3. **Chấm điểm rủi ro sơ bộ ngay từ code** — chưa cần mở browser:

| Dấu hiệu | Mức |
|---|---|
| Dynamic class (`css-1a2b3c`, `sc-xxx`, `MuiXxx-root`) | 🔴 Sẽ gãy |
| XPath vị trí (`//div[3]/button[2]`), `nth-child` | 🔴 Sẽ gãy |
| CSS bám cấu trúc nhiều tầng | 🟡 Dễ gãy |
| `getByRole` / `getByLabel` / `data-testid` / `id` ổn định | 🟢 Bền |

### Bước 2: Mở Browser & Đưa Về Đúng Trạng Thái

1. `browser_navigate(url)` → chờ page load
2. Thực hiện các bước tiền đề (đăng nhập, mở modal, chọn tab…) để DOM chứa element cần rà
3. `browser_snapshot()` lấy DOM thực tế

> Page Object cho element chỉ xuất hiện sau thao tác (modal, dropdown, tab) → **phải** mở đúng trạng thái đó rồi mới snapshot. Bỏ qua bước này sẽ báo nhầm "element không tồn tại".

### Bước 3: Đối Chiếu Từng Locator

Với mỗi locator, xác định trạng thái:

| Trạng thái | Nghĩa là |
|---|---|
| ✅ **OK** | Match đúng 1 element, đúng element cần thao tác |
| ⚠️ **Mong manh** | Vẫn match nhưng bám thuộc tính dễ đổi → nên nâng cấp |
| 🔴 **Gãy** | Match 0 element |
| 🔴 **Mơ hồ** | Match >1 element (strict mode violation) |
| 🔴 **Sai element** | Match 1 element nhưng **không phải** element cần — nguy hiểm nhất, test vẫn chạy mà thao tác nhầm chỗ |
| ❓ **Chưa kiểm được** | Không đưa được về trạng thái chứa element — ghi rõ lý do, KHÔNG đoán |

### Bước 4: Sinh Locator Thay Thế

Cho mọi mục 🔴/⚠️, dùng `skills-smart-locator-agent` sinh locator mới theo đúng thứ tự ưu tiên của framework, rồi **verify ngay trên DOM**: match đúng 1 element, đúng element mục tiêu, còn đúng sau khi reload trang.

### Bước 5: Báo Cáo (CHECKPOINT)

1. Xuất `reports/locator_scan_report.md` — bảng đối chiếu đầy đủ
2. **⏸️ DỪNG LẠI**. Mode SCAN → **KẾT THÚC**. Mode HEAL → hỏi user duyệt danh sách sửa

### Bước 6: Sửa & Verify (Mode HEAL — chỉ sau khi user duyệt)

1. Thay locator trong **Page class** (không sửa vào test file)
2. Giữ nguyên tên biến — đổi tên là kéo theo sửa toàn bộ test dùng nó
3. Chạy các test có dùng Page Object vừa sửa:
   - Xanh → xong
   - Còn đỏ vì locator → quay lại Bước 3 với element đó (**tối đa 3 vòng**)
   - Đỏ vì lý do khác (bug app, data) → ghi nhận, KHÔNG sửa ở workflow này → chuyển `/run-and-fix-tests`
4. Test phải PASS **2 lần liên tiếp**

## Output

### Mode SCAN
- `reports/locator_scan_report.md`:
  ```markdown
  | File:line | Biến | Locator hiện tại | Trạng thái | Locator đề xuất | Lý do |
  |---|---|---|---|---|---|
  | LoginPage.ts:12 | loginButton | `.css-1a2b3c` | 🔴 Gãy | `getByRole('button', { name: 'Đăng nhập' })` | Class động đổi mỗi build |
  | LoginPage.ts:15 | emailInput | `#email` | ✅ OK | — | — |
  ```
  Kèm: tổng kết theo mức (🟢/⚠️/🔴), danh sách ❓ chưa kiểm được + lý do

### Mode HEAL
- Tất cả output Mode SCAN, cộng thêm:
  - Page Object đã sửa (`file:line`, code cũ → mới)
  - Kết quả chạy test verify
  - Trạng thái: ✅ ĐÃ SỬA XONG / ⚠️ CÒN LOCATOR CHƯA KIỂM ĐƯỢC / ❌ CÒN GÃY
