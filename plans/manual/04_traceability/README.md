# Bước 4: Đảm bảo độ bao phủ (Traceability & Gap Analysis)


---

## Mục đích

Kiểm tra chéo (Cross-check) và thiết lập **Ma trận truy vết (Traceability Matrix)** để đảm bảo 100% yêu cầu gốc đều được phủ kịch bản kiểm thử (Test Scenarios).

## Cách sử dụng

1. Gửi file `prompt.txt` sau khi đã review kết quả phân rã ở Bước 3.
2. AI sẽ trả về:
   - **Traceability Matrix:** Bảng map REQ ID ↔ Module ↔ Scenario
   - **Gap Analysis:** Báo cáo thiếu sót (nếu có)
   - **High-Level Scenarios:** Danh sách kịch bản cấp cao, **xếp theo 4 vòng** (Smoke → Functional → Technical → Non-functional)
   - **Mức rủi ro từng module** (Cao / Trung bình / Thấp) kèm căn cứ và **độ sâu** tương ứng (Đầy đủ / Tiêu chuẩn / Tối giản)
   - **Bảng chấm 4 vòng:** mỗi nhánh `✅ sẽ sinh` / `➖ không áp dụng` / `⏭️ cố ý bỏ` / `🔴 thiếu`
3. **Review kỹ** danh sách scenarios:
   - Có scenario nào bị thiếu không?
   - Có scenario nào thừa / trùng lặp không?
   - Mức rủi ro AI chấm có hợp lý không? Sửa trực tiếp nếu không — Bước 5 áp đúng mức bạn duyệt
   - Nhánh `⏭️` đã có **ai quyết** và **điều kiện rà lại** chưa? Nhánh `➖` có đúng là "hệ thống không có thứ đó" không, hay thật ra là `⏭️`?
   - Bổ sung thêm nếu cần → Xác nhận → sang Bước 5.

## ⚠️ Human Checkpoint

**Đây là điểm chốt chặn nhân sự.** Lý do:

- AI có thể bỏ sót các edge case đặc thù của dự án.
- AI **tự chấm** mức rủi ro theo tiêu chí cố định (đụng tiền / phân quyền / dữ liệu cá nhân / thao tác không hồi lại / cổng vào module khác → Cao) — Tester **duyệt hoặc sửa** tại đây, trước khi AI sinh test case chi tiết ở Bước 5. Lưỡng lự thì chọn mức cao hơn.
- Ba nhánh không bao giờ được bỏ: `UI cơ bản` (V1) · `Validation` (V2, khi có field nhập) · `Permission` (V3, khi có ≥2 role).
- Nếu phát hiện thiếu, yêu cầu AI bổ sung: *"Hãy thêm scenarios cho trường hợp [X]"*.
