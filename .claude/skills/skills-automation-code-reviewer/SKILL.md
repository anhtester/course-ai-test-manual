---
name: skills-automation-code-reviewer
description: Skill review chất lượng automation script đã viết — soi hard sleep, locator inline, thiếu Allure metadata/screenshot, test data hardcoded, test phụ thuộc thứ tự. Chấm điểm theo rubric 6 nhóm bám Definition of Done và đề xuất sửa cụ thể.
---

# Automation Code Reviewer

Purpose: Chấm chất lượng **code automation đã tồn tại** theo đúng Definition of Done của repo — KHÔNG viết lại framework, KHÔNG sinh test mới.

> Đây là bản đối xứng của `skills-testcase-reviewer`: cái kia review manual TC, cái này review script.

---

## When to Use

Sử dụng skill này khi:

- Chuẩn bị bàn giao / merge một bộ script vừa sinh ra
- Onboard suite automation từ dự án khác hoặc từ người khác viết
- Nghi ngờ suite "pass giả" — xanh nhưng assertion yếu, report rỗng step
- Sau nhiều vòng auto-heal, muốn kiểm code còn sạch không
- Định kỳ rà suite trước release

**KHÔNG dùng khi:** test đang FAIL (→ `/run-and-fix-tests`), test chập chờn (→ `/analyze-flaky-tests`), locator gãy hàng loạt (→ `/heal-locators`). Skill này soi **chất lượng code**, không sửa lỗi chạy.

---

## Review Rubric (6 nhóm)

Chấm **theo file test / page object**, mỗi nhóm 0-2 điểm (0 = vi phạm nặng, 1 = một phần, 2 = đạt). Tối đa 12.

| # | Nhóm | Câu hỏi kiểm tra |
|---|---|---|
| 1 | **Sạch (Cleanup)** | Còn `console.log` / `System.out.println` / `print()`? Còn code comment-out? Còn import thừa, locator khai báo nhưng không dùng? |
| 2 | **POM & cấu trúc** | Locator có nằm trong Page class (không inline trong test)? Assertion có nằm ngoài Page class? Naming đúng convention (`XxxPage` / `XxxTest` / `xxx.spec.ts`)? File đặt đúng thư mục? |
| 3 | **Wait strategy** | Còn `waitForTimeout` / `Thread.sleep` / `time.sleep` / fixed delay? Có dùng smart wait (`expect()`, `WebDriverWait`)? Có `waitForSelector` thừa khi `expect()` đã đủ? |
| 4 | **Test data** | Field unique có random + traceable (prefix + timestamp)? Còn data hardcoded (`test@email.com`, `user123`)? Có cleanup sau test khi chạy trên môi trường dùng chung? |
| 5 | **Report (Allure)** | Đủ 5 mục metadata (title Tiếng Việt, Description, Severity, Tags, TC ID)? Test body có step `Arrange:` / `Act:` / `Assert:`? Có screenshot cuối **mọi** test kể cả PASS? Có attachment `stdout`/`stderr` không? |
| 6 | **Assertion & độc lập** | Mỗi test có ≥1 assertion cuối, kèm message mô tả? Test có tự chuẩn bị precondition, không phụ thuộc thứ tự chạy? Setup/teardown đầy đủ? |

**Xếp loại theo tổng điểm:**
- 🟢 **10-12:** Đạt — bàn giao được
- 🟡 **6-9:** Cần sửa — có đề xuất cụ thể
- 🔴 **0-5:** Chưa đạt — chặn bàn giao

### Vi phạm chặn bàn giao (blocking)

Bất kể tổng điểm, các lỗi sau **luôn** đánh 🔴 và phải sửa trước khi deliver:

| Vi phạm | Vì sao chặn |
|---|---|
| Hard sleep bất kỳ đâu | Anti-pattern đã cấm tuyệt đối — nguồn flaky số 1 |
| Test không có assertion nào | Test luôn xanh, không kiểm tra gì — nguy hiểm hơn không có test |
| Locator dùng dynamic class (`css-1a2b3c`, `sc-xxx`, `MuiXxx-root`) hoặc XPath vị trí (`//div[3]/button[2]`) | Gãy ở build kế tiếp |
| Thiếu screenshot cuối test | Không chứng minh được test chạy thật trên UI |
| Credentials thật nằm trong code / file config commit được | Rủi ro lộ dữ liệu |

---

## Quét Nhanh — Pattern Tìm Vi Phạm

Chạy trước khi đọc kỹ, để khoanh vùng. Kết quả grep là **manh mối**, vẫn phải mở file đọc ngữ cảnh mới kết luận.

| Vi phạm | Pattern tìm |
|---|---|
| Hard sleep | `waitForTimeout\|Thread\.sleep\|time\.sleep\|setTimeout\(` |
| Debug log | `console\.log\|System\.out\.print\|print\(` |
| Locator inline trong test | trong thư mục test: `page\.locator\(\|By\.\|getByRole\(` |
| Dynamic class / XPath vị trí | `css-[0-9a-z]{6}\|sc-[A-Za-z]\|\]\[[0-9]\+\]\|div\[[0-9]\+\]` |
| Data hardcoded | `@test\.com\|@email\.com\|admin123\|password123` |
| Thiếu metadata Allure | file test **không** chứa `severity\|allure\.label\|@Severity` |
| Thiếu screenshot teardown | file test/fixture **không** chứa `screenshot\|Attachment\|attach` |
| Credentials trong code | `password\s*=\s*["']\|api[_-]?key\s*=\s*["']\|token\s*=\s*["']` |

> Nhóm 5 và 6 thường phải đọc file mới chấm được — grep chỉ bắt được sự vắng mặt, không đánh giá được chất lượng tên step hay sức mạnh assertion.

---

## Đánh Giá Sức Mạnh Assertion

Đây là phần grep không làm thay được. Với mỗi test, hỏi: *test này có thể pass trong khi tính năng hỏng không?*

| ❌ Assertion yếu | ✅ Assertion đủ mạnh |
|---|---|
| `expect(page).toHaveURL(/./)` | `expect(page).toHaveURL(/\/dashboard/)` |
| `expect(el).toBeVisible()` cho element có sẵn từ trước hành động | Verify **thay đổi** do hành động gây ra: record mới xuất hiện, toast đúng nội dung |
| `assertTrue(list.size() > 0)` | `assertEquals(list.get(0).getName(), tenVuaTao, "Bản ghi vừa tạo phải đứng đầu danh sách")` |
| Assert không message | Assert kèm message mô tả kỳ vọng nghiệp vụ |
| Chỉ assert ở cuối flow dài 10 bước | Có assert xen kẽ ở các mốc quan trọng |

Ghi nhận riêng những test **chỉ có assertion tồn tại element** — đó là dấu hiệu pass giả điển hình.

---

## Review Workflow

1. **Xác định phạm vi** — thư mục/file cần review, framework, stack
2. **Quét nhanh** — chạy bộ pattern ở trên, lập danh sách vị trí nghi ngờ
3. **Đọc file** — với mỗi file: chấm 6 nhóm, trích **nguyên văn** dòng vi phạm kèm `file:line`
4. **Soi assertion** — đánh giá sức mạnh assertion từng test theo bảng trên
5. **Kiểm mức suite** — cấu hình output có gom vào `reports/` không, `.gitignore` có `reports/` không, có test trùng lặp không
6. **Report** — xuất báo cáo theo template, mỗi vi phạm kèm code sửa cụ thể

> **Nguyên tắc:** Mọi nhận xét phải kèm **code cũ → code mới**, không chê chung chung. Trích đúng `file:line` để user click mở được.

---

## Report Template

```markdown
# Báo Cáo Review Automation Code

## Tổng quan
- **Phạm vi:** <thư mục / danh sách file>
- **Stack:** Playwright + TypeScript / Selenium + Java / ...
- **Số file review:** N (x test file, y page object)
- **Kết quả:** 🟢 a đạt | 🟡 b cần sửa | 🔴 c chưa đạt
- **Điểm trung bình:** x.x/12
- **Vi phạm chặn bàn giao:** n

## Vi phạm chặn bàn giao (sửa trước khi deliver)
| # | File:line | Vi phạm | Code hiện tại | Code đề xuất |
|---|---|---|---|---|
| 1 | tests/login.spec.ts:45 | Hard sleep | `await page.waitForTimeout(3000)` | `await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()` |

## Chấm điểm từng file
| File | Sạch | POM | Wait | Data | Report | Assert | Tổng | Xếp loại |
|---|---|---|---|---|---|---|---|---|
| tests/login.spec.ts | 2 | 1 | 0 | 2 | 1 | 2 | 8/12 | 🟡 |

## Chi tiết vấn đề
### tests/login.spec.ts — 8/12 🟡
- **Wait (0/2)** — `line 45`: hard sleep 3s. → thay bằng web-first assertion (xem bảng trên)
- **POM (1/2)** — `line 22`: locator viết inline `page.locator('#user')` → chuyển vào `LoginPage.usernameInput`
- **Report (1/2)** — thiếu `allure.label('testId', 'CRM_LOGIN_TC_001')`

## Assertion yếu (nguy cơ pass giả)
| Test | Assertion hiện tại | Vì sao yếu | Đề xuất |
|---|---|---|---|

## Mức suite
- [ ] Output gom trong `reports/` — <đạt / lệch ở đâu>
- [ ] `.gitignore` có `reports/`
- [ ] Không có test trùng lặp
- [ ] Không có credentials trong code

## Kết luận & Thứ tự xử lý
1. <Vi phạm chặn bàn giao — bắt buộc trước>
2. <Nhóm 🔴>
3. <Nhóm 🟡>
```

---

## Quality Checklist

- [ ] Mỗi vi phạm có `file:line` chính xác + trích nguyên văn code
- [ ] Mỗi vi phạm 🔴/🟡 có code sửa cụ thể, không chê chung chung
- [ ] Vi phạm chặn bàn giao tách riêng, không trộn vào danh sách chung
- [ ] Có đánh giá sức mạnh assertion, không chỉ đếm số assertion
- [ ] KHÔNG tự sửa code ở Mode REVIEW
- [ ] Báo cáo bằng Tiếng Việt

---

## Rules References

- `CLAUDE.md` > "Cleanup & Delivery" — Definition of Done, nguồn gốc của rubric này
- `.claude/rules/automation_rules.md` — POM, naming, test data, test independence
- `.claude/rules/reporting_rules.md` — Metadata, step Arrange/Act/Assert, screenshot, cấm stdout, thư mục `reports/`
- `.claude/rules/locator_strategy.md` — Locator nào bị cấm
- `.claude/skills/skills-testcase-reviewer/SKILL.md` — Bản đối xứng cho manual TC
