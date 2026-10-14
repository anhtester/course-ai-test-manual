# 📋 Hướng Dẫn Nhanh: Sử Dụng AI-RBT 6 Bước

## 🔀 Chọn Luồng Sử Dụng

Có **2 luồng** riêng biệt, tuỳ tool AI bạn đang dùng:

### Luồng 1: Claude Code (Slash Command) — Tự động

```
Gõ: /generate-testcases-manual-rbt + dán requirements
→ AI tự chạy 6 bước theo skill, dừng ở checkpoint chờ bạn
→ KHÔNG cần copy-paste prompt templates
```

**Ưu điểm:** Nhanh, tự động, agent nhớ context xuyên suốt. Agent **tự đọc** evidence trong `docs/`, tự kiểm module đã có TC chưa, tự ghi file vào `docs/testcases/` và cập nhật danh mục — luồng copy-paste không làm được các việc này.
**Nhược điểm:** Chỉ chạy được trên Claude Code.

### Luồng 2: Copy-Paste Prompt — Thủ công (Codex / Antigravity / Kiro / Cursor / AI agent bất kỳ)

```
Copy prompt Bước 1 → paste vào chat → AI xử lý
→ Copy prompt Bước 2 → paste → AI xử lý
→ ... lặp lại đến Bước 6
```

**Ưu điểm:** Dùng được với AI bất kỳ. Nội dung 6 prompt **đồng bộ với cùng skill** `skills-rbt-manual-testing` mà Luồng 1 dùng — cùng quy tắc 4 vòng, độ hạt, evidence, Quality Gate 11 tiêu chí.
**Nhược điểm:** Phải copy-paste thủ công 6 lần, tự đính kèm ảnh giao diện, tự lưu kết quả ra file.

---

## Luồng 1: Claude Code — Prompt nhanh

```
/generate-testcases-manual-rbt

Module: [Tên module]
Độ hạt: [GỘP (mặc định) / TÁCH]

[Dán requirements/user stories vào đây, hoặc đường dẫn docs/requirements/<module>/REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md]
```

Khi AI dừng ở checkpoint, chỉ cần trả lời câu hỏi hoặc gõ:
```
Tiếp tục sang Bước [X]
```

---

## Luồng 2: Copy-Paste — Hướng dẫn từng bước

| Bước | Tên | Prompt file | Chờ User? |
|------|-----|-------------|-----------|
| **1** | Context & Role-play | Copy `plans/manual/01_context_and_roleplay/prompt.txt` + điền `[...]` + đính kèm ảnh giao diện | ✅ Chờ xác nhận |
| **2** | Analysis & QnA | Copy `plans/manual/02_analysis_and_qna/prompt.txt` | ✅ **Chờ trả lời Q&A** |
| **3** | Decomposition | Copy `plans/manual/03_decomposition/prompt.txt` | Review nhanh |
| **4** | Traceability | Copy `plans/manual/04_traceability/prompt.txt` | ✅ **Chờ duyệt scenarios + mức rủi ro** |
| **5** | RBT & TC Generation | Copy `plans/manual/05_rbt_and_tc_generation/prompt.txt` | Review kết quả |
| **6** | Template Mapping | Copy `plans/manual/06_template_mapping/prompt.txt` | Lưu file `.md` / copy bảng → Excel |

### Sơ đồ luồng:

```
[Bước 1] Copy prompt + dán tài liệu requirements + ảnh giao diện
    ↓  AI lập Danh mục Evidence, xác nhận hiểu → User xác nhận OK
[Bước 2] Copy prompt phân tích
    ↓  AI đặt câu hỏi → ⏸️ User trả lời từng câu
[Bước 3] Copy prompt phân rã
    ↓  AI sinh Module list → User review nhanh
[Bước 4] Copy prompt traceability
    ↓  AI sinh scenarios theo 4 vòng + chấm mức rủi ro → ⏸️ User duyệt / sửa
[Bước 5] Copy prompt sinh TC
    ↓  AI sinh test cases V1 → V4 → User review
[Bước 6] Copy prompt chuẩn hóa
    ↓  AI chạy Quality Gate 11 tiêu chí, xuất bảng + bảng đối soát → Lưu file / Excel / Jira ✅
```

---

## Mẹo Tối Ưu

1. **Bước 2 là quan trọng nhất** — Đừng vội, trả lời kỹ từng câu hỏi AI đặt ra
2. **Chia module khi nhiều** — Ở Bước 5, nếu có >5 modules, yêu cầu AI sinh từng module
3. **Review trước khi format** — Ở Bước 5, review test cases trước khi sang Bước 6
4. **Dùng cùng conversation** — Chạy tất cả 6 bước trong **cùng 1 conversation** để AI giữ context
5. **Đang dùng Claude Code thì dùng Luồng 1** — cùng bộ quy tắc với Luồng 2, nhưng agent tự đọc evidence và tự ghi file đúng cấu trúc `docs/`. Luồng 2 dành cho AI không có slash command
