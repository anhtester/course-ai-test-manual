---
name: bo-skills-claude
description: Bộ .claude/ (skills · commands · rules · prompts) — nguồn gốc, quy ước đặt tên, cách sửa skill, những thứ user đã từ chối
type: project
nguon: bộ nhớ claude-testing-skills (naming-convention, fix-skill-generally, prompts-no-derivable-context, no-example-references, skills-backlog, public-repo-is-subset, codex-port-repo) · lịch sử phiên repo này
cap-nhat: 07-10-2026
---

# Bộ toolkit `.claude/`

## Nguồn gốc — repo này là BẢN CHÉP
- Bộ gốc (private, đầy đủ): `D:\ANHTESTER\ClaudeCode\claude-testing-skills`. Repo này nhận bản chép `.claude/`, `CLAUDE.md`, `plans/`, `prompts/`, `scripts/` (và một phần `docs/`) từ đó.
- Ngoài ra còn: bản public rút gọn `claude-testing-kit` (giấu bớt command/skill cho học viên) và bản port Codex `D:\ANHTESTER\Codex\codex-testing-skills`. Đồng bộ các repo đó **không** phải việc của repo này.
- User **định kỳ lấy bộ skills mới** từ repo gốc về đây (lần gần nhất 07-10-2026). Bộ vừa lấy về là **nguồn sự thật** — chỉnh sửa cục bộ trước đó (VD 10 cột / 2 vòng ngày 02-10) coi như đã bỏ, không khôi phục.
- Khi user yêu cầu sửa skill ngay trong repo này → làm, rồi **nhắc một câu** rằng lần lấy bộ skills mới sau sẽ ghi đè, muốn giữ thì đưa sang repo gốc `claude-testing-skills`.

## Quy ước đặt tên
- Skills `.claude/skills/skills-<tên-kebab>/` — tiền tố `skills-`. Commands `.claude/commands/<tên-kebab>.md` (đổi từ snake_case ngày 04-09-2026).
- **Không đổi theo:** `prompts/prompt_NN_*.txt`, thư mục `plans/automation/01_context_and_roleplay/` — vẫn snake_case. Grep/replace tên lệnh phải neo ranh giới từ để không phá tên file prompt.

## Khi phát hiện lỗi do skill thiếu luật
Làm **2 việc**: sửa tài liệu dự án **và** đưa luật **tổng quát** vào skill/command (không nhắc tên hệ thống, module, giá trị cụ thể). Ghi một dòng Nhật ký nói luật đã vào skill nào.
**Why:** `.claude/` đi theo mọi dự án; `docs/` bị xoá khi chuyển dự án.

## Prompt template (`prompts/`, `plans/`)
Chỉ giữ thứ agent **không suy ra được**: URL · tài khoản · môi trường · Mode · phạm vi · trọng tâm. Bỏ `Dự án/Stack/Framework/Language…` (ngoại lệ `prompt_03_create_framework_*`, `prompt_04_generate_script_*`). User: *"AI dư sức hiểu các thông tin dạng như vậy"*.

## Không trỏ tới bản mẫu đã điền
Không file dùng lại nào (`AI_FULL_FLOW_*.md`, commands, skills, prompts, `QUICK_START.md`, `README.md`, phiếu rỗng) được link tới bản mẫu (`*_example.*`). Rà: `grep -rn "example\|mẫu đã điền\|bản mẫu" --include=*.md --include=*.txt --include=*.yaml . | grep -v ^./docs/`.

## Không gợi ý lại
Nhóm skill mở rộng (visual regression, a11y, db validator, performance, security-input, i18n, CI pipeline, env healthcheck, test-impact, exploratory) — user đã quyết **chưa cần** (02-08-2026). Chỉ làm khi user tự hỏi.

## Hỏi "chỗ nào quy định X"
Trả lời theo 3 lớp có `file:dòng`: `CLAUDE.md` (quy tắc gốc) → skill chính (`skills-rbt-manual-testing` cho TC) → command/prompt lặp lại. Dòng số thay đổi sau mỗi lần chép đè — grep lại, đừng nhớ số dòng.

Liên quan: [[lich-su-repo-va-hien-trang]] · [[quy-tac-viet-tc]]
