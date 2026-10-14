# MEMORY — Bản đồ bộ nhớ của repo `course-ai-test-manual`

> **Thứ tự đọc khi nhận MỌI yêu cầu:** `CLAUDE.md` → **file này** → mở đúng 1–3 file bộ nhớ theo bảng "Đang làm gì → đọc file nào" bên dưới. **Không** đọc hết thư mục cho chắc.
>
> Bộ nhớ là **ngữ cảnh nền, ghi tại thời điểm viết** — file, số liệu, tên mã nhắc trong bộ nhớ phải **kiểm lại trên repo hiện tại** trước khi dựa vào. Bộ nhớ lệch với file thật → file thật thắng, sửa lại bộ nhớ. Số liệu sống (tổng REQ, mã kế tiếp, AMB treo) luôn đọc từ `docs/requirements/README.md`.

---

## 1. Đang làm gì → đọc file nào

| Yêu cầu của user | Đọc |
|---|---|
| Bất kỳ việc gì (luôn đọc) | [user/ho-so-va-giao-tiep.md](user/ho-so-va-giao-tiep.md) · [workflow/lich-su-repo-va-hien-trang.md](workflow/lich-su-repo-va-hien-trang.md) · [workflow/ban-giao-va-bao-cao.md](workflow/ban-giao-va-bao-cao.md) (gửi Slack khi xong) |
| Bất cứ việc gì chạm **crm.anhtester.com** (recon · thực thi · REQ · TC) | [systems/crm-perfex.md](systems/crm-perfex.md) |
| Cần **đăng nhập Admin/PM** để chạy test trên crm (nạp session đã lưu · lấy phiên mới · test Logout) | [systems/crm-session-da-luu.md](systems/crm-session-da-luu.md) · [systems/crm-perfex.md](systems/crm-perfex.md) |
| Bất cứ việc gì chạm **book.anhtester.com** / `_book-api/` / app Android / Appium | [systems/book-anhtester.md](systems/book-anhtester.md) |
| `/discover-system` · `/generate-requirements-from-*` · chụp evidence · Playwright MCP | [evidence/khao-sat-va-evidence.md](evidence/khao-sat-va-evidence.md) |
| Chốt AMB · `/update-requirements-from-ticket` · `/analyze-requirement-document` | [requirements/quy-tac-requirements.md](requirements/quy-tac-requirements.md) |
| Bất cứ việc gì của **module LOGIN** (REQ · TC · ticket `CRM-LOGIN-101`) | [requirements/login-quyet-dinh-da-chot.md](requirements/login-quyet-dinh-da-chot.md) |
| Sinh / sửa manual TC (`/generate-testcases-*`, `/update-testcases-from-impact`) | [testcases/quy-tac-viet-tc.md](testcases/quy-tac-viet-tc.md) |
| `/review-testcases` | [testcases/review-testcases.md](testcases/review-testcases.md) · [testcases/quy-tac-viet-tc.md](testcases/quy-tac-viet-tc.md) |
| `/execute-test-cases` · `/create-bug-report` · `/retest-fixed-bugs` | [testcases/thuc-thi-va-bug.md](testcases/thuc-thi-va-bug.md) · [systems/crm-perfex.md](systems/crm-perfex.md) |
| Master Test Plan · phiếu YAML · xuất HTML/PDF | [test-plan/master-test-plan.md](test-plan/master-test-plan.md) |
| Sửa `.claude/` (skills · commands · rules) · `prompts/` · `plans/` · hỏi "chỗ nào quy định X" | [toolkit/bo-skills-claude.md](toolkit/bo-skills-claude.md) |

---

## 2. Danh mục toàn bộ bộ nhớ

### 👤 `user/` — người dùng & cách giao tiếp
- [Hồ sơ & giao tiếp](user/ho-so-va-giao-tiep.md) — Anh Tester, repo thực hành khoá Manual Testing; Tiếng Việt, ngắn gọn; gom bước cần user làm thành 1 kịch bản; hỏi ít; user tự commit

### 🔁 `workflow/` — quy trình chung & trạng thái repo
- [Lịch sử repo & hiện trạng](workflow/lich-su-repo-va-hien-trang.md) — dòng thời gian 26-08 → 07-10-2026; bộ skills mới (13 cột / 4 vòng) là nguồn sự thật, bộ TC LOGIN còn định dạng cũ 10 cột / 2 vòng; `docs/` customers/projects/_book-api chép từ toolkit; prefix `CUST` vs `CUS`
- [Bàn giao & báo cáo](workflow/ban-giao-va-bao-cao.md) — file kết quả nằm trong repo; cấu trúc báo cáo; **BẮT BUỘC gửi Slack `#project-book`** sau khi chạy test cases xong / có summary report mới (link tương đối, đính ảnh FAIL) — quy tắc gốc ở `CLAUDE.md`

### 🌐 `systems/` — hệ thống đang test
- [Perfex CRM](systems/crm-perfex.md) — dùng chung, prefix `CRM_`; mật khẩu sai chỉ dùng tài khoản PM ≤ 4 lần; timer Admin; `/` redirect cổng khách hàng; khoá tài khoản chưa deploy
- [Session CRM đã lưu](systems/crm-session-da-luu.md) — `.auth/` (gitignore): `admin_1` giữ riêng, không Logout; Logout huỷ phiên phía máy chủ; 2 lần đăng nhập = 2 phiên độc lập; test Logout phải xin phiên riêng
- [Book API](systems/book-anhtester.md) — namespace `_book-api/`, mã `BK`; API + Android Hybrid; phá huỷ được nhưng chỉ dữ liệu tự tạo; Appium chỉ `NATIVE_APP`

### 🔎 `evidence/` — khảo sát & bằng chứng
- [Khảo sát & evidence](evidence/khao-sat-va-evidence.md) — mở hết ảnh trước khi sinh TC; chụp xong mở lại; chụp mức OS khi cần thanh URL; Playwright MCP khai ở config Desktop (không dùng `.mcp.json`, 12-10-2026) — đo viewport đầu phiên, chụp bằng đường dẫn tuyệt đối

### 📄 `requirements/`
- [Quy tắc requirements & AMB](requirements/quy-tac-requirements.md) — chọn đúng command khi chốt AMB; tự chốt bằng giả định; giải thích vì sao cấp REQ mới; lỗ hổng chỉ ghi "cần Dev xác minh"; cổng khách hàng ngoài phạm vi
- [LOGIN — quyết định đã chốt](requirements/login-quyet-dinh-da-chot.md) — ticket `CRM-LOGIN-101` khoá tài khoản; `REQ-LOGIN-53` đã gỡ; AMB-01→24; quy ước đặt mã ticket / Impact Report

### 📋 `testcases/`
- [Quy tắc viết TC](testcases/quy-tac-viet-tc.md) — GỘP; ngôn ngữ nhìn thấy được; **13 cột + 4 vòng** theo bộ skills mới (user chốt 07-10-2026, 10 cột / 2 vòng đã bỏ); bộ TC LOGIN cũ cần đưa về chuẩn khi chạm tới; sinh lại từ `001` khi user đã xoá bộ cũ
- [Review test cases](testcases/review-testcases.md) — chỉ chấm dòng TC; bỏ qua execution, bug, file index; không đề xuất xử lý tiền đề không thoả
- [Thực thi & bug](testcases/thuc-thi-va-bug.md) — không tự gõ mật khẩu; BLOCKED khi tiền đề không đạt; bug trỏ TC/REQ, chỉ link evidence; user hay xoá executions/bugs để chạy lại

### 🗓️ `test-plan/`
- [Master Test Plan](test-plan/master-test-plan.md) — `release_1.0` Draft 18 ô treo; phiếu YAML tiếng Việt có dấu, sửa tại chỗ; bản mẫu không được link; HTML/PDF mẫu đã mất

### 🛠️ `toolkit/` — bộ `.claude/`
- [Bộ skills Claude](toolkit/bo-skills-claude.md) — repo này nhận bộ skills từ `claude-testing-skills`, bộ mới lấy về là nguồn sự thật; kebab-case + `skills-`; sửa lỗi thì đưa luật tổng quát vào skill; prompt không khai thứ suy ra được; không gợi ý nhóm skill backlog

---

## 3. Nguồn gốc bộ nhớ (gom ngày 07-10-2026)

Gom từ bộ nhớ Claude Code trên máy (`C:\Users\votha\.claude\projects\<project>\memory\`) và lịch sử 21 phiên làm việc của repo này:

| Nguồn | Lấy gì |
|---|---|
| `D--AI-Testing-Manual-Course-course-ai-test-manual` (**repo này**) | Bộ nhớ `review-testcases-scope` + báo cáo cuối của 21 phiên (26-08 → 02-10-2026): discover, requirements LOGIN, chốt AMB, ticket `CRM-LOGIN-101`, sinh/review/thực thi TC, bug, test plan, đổi format 10 cột / 2 vòng (đã bỏ 07-10-2026), Slack |
| `D--AI-Testing-Manual-Course-claude-ai-testing` (tiền thân repo này) | Lưu file bàn giao vào repo |
| `D--ANHTESTER-ClaudeCode-claude-testing-skills` (repo gốc bộ `.claude/`) | CRM dùng chung, evidence, TC gộp, ngôn ngữ TC, AMB giả định, gom bước tester, quy ước toolkit, phiếu YAML, appium-mcp |
| `D--AI-Testing-Automation-Course-course-ai-test-automation` | Báo cáo Tiếng Việt, Slack `#project-crm`, bối cảnh book.anhtester.com |
| `D--ClaudeBuildMemoryProject` | Playwright MCP ghi ảnh lạc project |

**Cố ý KHÔNG mang sang** (thuộc repo khác, không áp cho repo này): chi tiết đồng bộ sang bản Codex (`codex-testing-skills`) và repo public `claude-testing-kit`; framework automation (`playwright-typescript-framework`, `appium-java-framework`, Allure, CI); bộ nhớ các dự án không liên quan (LMS, TPONE, Slope…). Quy tắc ngày `DD-MM-YYYY`, cấu trúc `docs/`, quy tắc bất biến REQ/TC ID đã có trong `CLAUDE.md` nên không chép lại.

🔒 **Không** ghi mật khẩu / token / tài khoản thật vào thư mục này — thư mục được commit. Credentials chỉ sống trong `.env`.

## 4. Cách ghi thêm bộ nhớ

- User chốt quyết định mới / phản hồi cách làm / phát hiện bẫy mới → ghi vào **đúng file chủ đề**, cập nhật dòng `cap-nhat:` trong frontmatter. Không tạo file trùng chủ đề. File vượt ~150 dòng thì tách.
- Mỗi điều nên có **Why** (vì sao) và **How to apply** (áp dụng thế nào); ngày viết `DD-MM-YYYY`.
- Module mới có nhiều quyết định riêng → tạo `requirements/<module>-quyet-dinh-da-chot.md` như LOGIN.
- Thêm file mới → thêm 1 dòng vào mục 2 và (nếu cần) mục 1 của file này.
- Phát hiện bộ nhớ sai → sửa hoặc xoá ngay, ghi ngày sửa.
