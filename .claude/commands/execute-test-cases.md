---
description: Thực thi manual test cases trên browser thật qua Playwright MCP — chấm PASS/FAIL/BLOCKED/SKIPPED, thu evidence, xuất execution report. Dành cho tester manual, KHÔNG sinh code automation.
skills:
  - skills-manual-test-executor
  - skills-bug-reporter
---

> **BẮT BUỘC (MANDATORY SKILL):** Bạn PHẢI nạp và đọc kỹ nội dung của skill **`skills-manual-test-executor`** (tại `.claude/skills/skills-manual-test-executor/SKILL.md`) trước khi bắt đầu tác vụ này.

# Command: Thực Thi Manual Test Cases

Chạy bộ manual test cases trực tiếp trên browser thật, đối chiếu Expected vs Actual, chấm trạng thái và xuất báo cáo kết quả.

## ⚠️ Nguyên tắc

- **Chạy thật, không suy đoán** — mọi PASS/FAIL phải dựa trên quan sát UI qua `snapshot`
- **TC là chuẩn** — thực tế lệch TC thì ghi FAIL, **TUYỆT ĐỐI KHÔNG sửa TC** cho khớp
- **Headed mode, viewport theo `--viewport-size` lúc launch** (bảng ở `.claude/rules/playwright_rules.md` mục 1) — tester phải nhìn được agent đang thao tác, KHÔNG resize phóng vượt cửa sổ
- Tất cả output bằng **Tiếng Việt**

## Input cần thu thập

| Input | Bắt buộc? | Ghi chú |
|---|---|---|
| File TC hoặc checklist | ⭐ Bắt buộc | VD `docs/testcases/customers/web/test_cases_customers_web.md` · `docs/testcases/customers/web/parts/part_01_web_danh_sach.md` · `docs/checklists/customers/web/checklist_smoke_20261009.md`. User đưa file **index** → đọc `## Bản đồ tài liệu`, chỉ lấy file `web/` |
| Phạm vi chạy | ⭐ Bắt buộc | Toàn bộ · theo tag (`@Smoke`) · theo TC ID range · theo nhóm chức năng. **Không có → agent hỏi**, không tự chạy hết |
| URL & tài khoản | ⭐ Bắt buộc | Môi trường đang test + tài khoản đăng nhập |
| Môi trường dùng chung? | ⭐ Bắt buộc | Có → bật auto-skip TC phá huỷ; Không → chạy đầy đủ, ghi rõ trong report |
| Build / Version | Khuyến nghị | Để truy vết kết quả về đúng bản build |

## Các bước thực hiện

### Bước 1: Xác nhận phạm vi
1. Đọc file TC, lọc theo phạm vi user chọn — **loại luôn TC `@Deprecated`** (không chạy, không tính tổng, không tính SKIPPED; ghi số đã loại ở header report)
2. Đếm số TC sẽ chạy, ước tính thời gian
3. Công bố kế hoạch trước khi bắt đầu:
   ```
   Sẽ chạy: 36 TC (Part 1 — Danh sách khách hàng)
   Dự kiến SKIPPED: 2 TC (thao tác phá huỷ)
   Ước tính: ~60 phút
   ```

### Bước 2: Chuẩn bị
1. Tạo `run_id` dạng `run_<timestamp>`
2. Tạo thư mục evidence `docs/executions/<module>/<nền-tảng>/<run_id>/evidence/` — `<nền-tảng>` là nền tảng của file TC đang chạy. Workflow này chạy trên **trình duyệt** nên là `web`; TC `@Android` / `@iOS` / `@API` không chạy ở đây. Checklist Release-readiness (`docs/checklists/_release/<nền-tảng>/`) thì `<module>` là **`_release`**
3. Khởi tạo file report `docs/executions/<module>/<nền-tảng>/<run_id>/execution_report.md` với phần header — **bắt buộc** có ô `Loại nguồn` (`Bộ TC` / `Checklist <loại> · <Mã checklist>`)

### Bước 3: Khởi tạo browser & đăng nhập
1. `browser_navigate(url)`
2. **KHÔNG gọi `browser_resize`** — viewport đã đúng từ `--viewport-size` lúc launch MCP server
3. Chờ trang load xong → `browser_snapshot()`
4. Đăng nhập, verify đã vào được hệ thống
5. **Không đăng nhập được → DỪNG NGAY**, báo user, không chạy tiếp

### Bước 4: Chạy từng TC
Với mỗi TC theo thứ tự:
1. **Kiểm tra Auto-Skip** — TC có tag `@PersonalOnly` (`Automation = No` **không** phải lý do bỏ qua — vẫn chạy bình thường), hoặc steps chứa Mass Delete / Select All / xoá qua URL GET / upload `.exe` / import hàng loạt → `⏭️ SKIPPED` + ghi lý do, sang TC tiếp. **Nhập chuỗi dài vào một field** (TC biên `max+1`) **không** phải lý do skip
2. **Dựng Pre-Condition** — không dựng được → `⚠️ BLOCKED` + ghi nguyên nhân
3. **Thực hiện đúng từng bước** trong Test Steps — không tự thêm/bớt bước
4. **Verify từng Expected** bằng `snapshot` sau mỗi bước có kết quả quan sát được. TC đặc biệt chạy theo bảng **TC đặc biệt** của skill: TC gộp chạy **từng biến thể** (FAIL ghi mã `<TC ID>-<mã>`) · `@TechCheck` chấm phần chính, phần `🔧` kiểm nếu làm được · `@NeedsVerify` lệch thì ghi chú đối chiếu lại TC · mục checklist ghi **mã mục** `<Mã checklist>-<nn>` (VD `CL-smoke_20261009-03`), **không** ghi `#3` trần — đủ 5 luật ở mục *Chạy checklist* của skill
5. **Chấm trạng thái:**
   - Mọi Expected khớp → `✅ PASS`
   - Có Expected không khớp → `❌ FAIL` + **screenshot ngay tại bước fail** + ghi Actual vs Expected
   - Có Expected không verify được → `⚠️ BLOCKED` (KHÔNG phải PASS)
6. **Ghi kết quả vào report ngay** (không dồn tới cuối buổi)
7. **Khôi phục trạng thái sạch** (đóng modal, về trang danh sách) rồi chạy TC tiếp theo

### Bước 5: Báo tiến độ
Sau mỗi 5–10 TC, báo 1 dòng:
```
Đã chạy 12/36 — PASS 10 · FAIL 1 · BLOCKED 0 · SKIPPED 1
```

### Bước 6: Teardown
1. Xoá toàn bộ dữ liệu đã tạo trong buổi chạy
2. Đối chiếu số liệu hệ thống trước/sau để xác nhận môi trường trả về nguyên trạng
3. Bản nào không xoá được → ghi rõ vào report để người khác xử lý

### Bước 7: Xuất report
Xuất `execution_report.md` theo template trong skill, gồm 6 mục: Tổng kết · Kết quả từng TC · Chi tiết FAIL · TC BLOCKED · Dữ liệu đã tạo & dọn dẹp · Đề xuất bước tiếp theo.

Nguồn là **checklist** → cập nhật lại cột `Trạng thái` · `Execution ID` và dòng `Trạng thái lấy từ:` của file checklist cho mọi mục đã chạy (luật 5, mục *Chạy checklist* của skill). Không đụng cột khác.

## Điều kiện DỪNG giữa chừng

Agent chạy tiếp qua TC fail (fail-forward), **chỉ dừng** khi:

| Điều kiện | Vì sao |
|---|---|
| 3 TC liên tiếp FAIL cùng nguyên nhân hạ tầng | Đăng nhập hỏng / server 500 / mất mạng — chạy tiếp tạo báo cáo rác |
| Không đăng nhập được từ đầu | Toàn bộ suite không chạy được |
| Phát hiện đã ảnh hưởng dữ liệu người khác | Ưu tiên dừng và khắc phục |

## Quy tắc quan trọng

- **Pass rate không tính SKIPPED vào mẫu số** — báo cả 2 con số: tổng số TC và số TC thực chạy
- Screenshot **chỉ** khi FAIL hoặc milestone quan trọng — không chụp mọi bước
- Mọi dữ liệu tạo ra phải traceable (`Auto_<Module>_<timestamp>`) và có kế hoạch xoá
- KHÔNG `browser_navigate` lại nếu đã ở đúng trang — tránh reload làm mất trạng thái đang test

## Bước tiếp theo sau khi có report

| Tình huống | Làm gì |
|---|---|
| Có TC FAIL | `/create-bug-report` — sinh bug report chuẩn từ evidence đã thu. Mục checklist FAIL: bug đặt theo **module của mục** (cột `Module` với checklist release) |
| Nhiều TC FAIL cần gom nhóm root cause | `/analyze-test-report` |
| Cần đẩy kết quả lên Xray | `/import-test-results-xray` |
| TC FAIL do TC viết sai (không phải lỗi hệ thống), kể cả TC `@NeedsVerify` lệch Expected | `/review-testcases` mode FIX — **không sửa TC trong lúc chạy** |
