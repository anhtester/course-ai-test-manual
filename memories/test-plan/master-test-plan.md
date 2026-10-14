---
name: master-test-plan
description: Master Test Plan release_1.0 của repo, phiếu YAML tiếng Việt có dấu, bản mẫu và cách xuất HTML/PDF
type: project
nguon: lịch sử phiên 18-09-2026 · bộ nhớ claude-testing-skills (config-keys-vietnamese, no-example-references-in-toolkit, date-format)
cap-nhat: 07-10-2026
---

# Master Test Plan

## Plan đang có
- `docs/test-plans/test_plan_release_1.0.md` + bản lưu phiếu `test_plan_release_1.0.input.yaml` + `.pdf` — lập 18-09-2026, trạng thái 🟨 Draft, **18 ô chờ thông tin** (QA Lead 9 · PO 1 · Dev 2 · QA Lead + Dev Lead 5…).
- Phạm vi: `LOGIN`, `CUS`, `PRJ` × Web (plan ghi prefix `CUS` theo yêu cầu 14-09-2026; danh mục hiện dùng `CUST` — xem [[lich-su-repo-va-hien-trang]]). CI ghi GitHub Actions.
- Agent đã cảnh báo: hạn 02-10-2026 khó kịp; ước lượng 19 người-ngày ≪ năng lực 132 → thiếu hạng mục (khảo sát CUS/PRJ, automation) — ghi thành rủi ro R2, không tự sửa số.
- Anh Tester kiêm QA Lead + automation + người phê duyệt; chưa có tên PO.

## Phiếu cấu hình `plans/master-test-plan/test_plan.config.yaml`
- **YAML**, tên ô **tiếng Việt có dấu**, chú thích `#` ghi giá trị hợp lệ; để trống = chưa chốt (❓), `không` = đã quyết định không. Ngày `DD-MM-YYYY`.
- Đọc phiếu: chuẩn hoá Unicode **NFC**. Ghi phiếu: **sửa tại chỗ** phần sau dấu `:`, **không** `yaml.dump` (mất chú thích).

## Bản mẫu
- `plans/master-test-plan/test_plan_release_example.md` (ShopMini hư cấu) · `test_plan_crm_example.md/.yaml` (Perfex thật). Bản mẫu chỉ tự mô tả trong banner của chính nó — **không** chèn link tới bản mẫu vào skill/command/prompt/phiếu rỗng.
- 18-09-2026 đã xuất `test_plan_release_example.html` + `.pdf` (A4, 25 trang; font Be Vietnam Pro + JetBrains Mono; tông xanh petrol; bìa, mục lục, chân trang "Trang X / Y"; bản web có Artifact riêng tư). **Hiện 2 file đó không còn** trong `plans/master-test-plan/` (kiểm 07-10-2026 — có thể bị xoá khi chép đè). Script chuyển đổi nằm ở scratchpad phiên cũ, chưa đưa vào `scripts/`; cần lại thì viết lại theo thông số trên và hỏi user có đưa vào `scripts/` không.

Liên quan: [[ban-giao-va-bao-cao]] · [[bo-skills-claude]]
