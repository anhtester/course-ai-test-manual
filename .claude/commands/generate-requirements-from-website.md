---
description: Sinh tài liệu requirements (REQ ID) cho một module từ website đang chạy (Playwright MCP). App mobile dùng /generate-requirements-from-mobile, API dùng /generate-requirements-from-api.
skills:
  - skills-requirements-analyzer
---

# Workflow: Generate Requirements from Website Module

> **BẮT BUỘC (MANDATORY SKILL):** Bạn PHẢI nạp và đọc kỹ nội dung của skill **`skills-requirements-analyzer`** (tại `.claude/skills/skills-requirements-analyzer/SKILL.md`) để biết định dạng chuẩn của tài liệu Requirements trước khi bắt đầu thực hiện tác vụ này.
>
> Workflow này chạy **nhánh UI Recon** — dùng mục **2 + 2.1 + 2.2** (đánh mã · một prefix trên mọi nền tảng), **3.1** (trích xuất từ UI), **3.1.1** (tầng network), **3.1.2** (phân quyền khi thiếu account), **4** (AMB/RISK), **5** (quy mô/tách file), **5.8** (tầng khám phá), **6** (cấu trúc đầu ra), **7.1 + 7.2** (strict rules).
>
> 📱 Cùng module nhưng là **app mobile** → `/generate-requirements-from-mobile` · mặt **API** → `/generate-requirements-from-api`. Ba command dùng chung skill, chung thư mục module và chung dải REQ — mỗi command ghi vào **tầng nền tảng** của mình (`web/` · `mobile/` · `api/`), REQ dùng chung ≥ 2 nền tảng ghi vào index (mục **2.2**, **5.3**).
> ❌ KHÔNG dùng mục **3.2** (Document Analysis) trừ khi user cung cấp kèm tài liệu — khi đó:
> - Tài liệu phủ **đầy đủ** module → chạy 3.2 trước, 3.1 sau, đối chiếu theo mục **3.3**
> - Tài liệu chỉ phủ **một phần** (phổ biến nhất) → chạy mục **3.3.1** — lập Bản đồ phủ tài liệu rồi recon theo chiến lược riêng từng vùng
>
> ⚠️ **Chưa biết hệ thống có module nào** → chạy `/discover-system` trước, đừng bắt đầu ở đây.

Workflow này giúp bạn phân tích một module hoặc trang web được cung cấp và sinh ra tài liệu Yêu cầu (Requirements) chi tiết, chuẩn xác, **có mã REQ ID truy vết được**, phục vụ cho quá trình kiểm thử hoặc phát triển.

## Các bước thực hiện:

1. **Tiếp nhận thông tin (Information Gathering):**
   - Đọc kỹ hướng dẫn từ kỹ năng (skill) **`skills-requirements-analyzer`** để nắm bắt chuẩn đầu ra.
   - **Đọc tầng khám phá nếu đã có** (mục **5.8** của skill) — tiết kiệm toàn bộ bước dò đường:
     * `docs/requirements/_discovery/system_map.md` → route · loại màn hình · số tab · risk · vùng chưa xác minh của module này
     * `docs/requirements/_discovery/doc_inventory.md` → Bản đồ phủ tài liệu cấp hệ thống
     * `docs/requirements/README.md` → **prefix đã cấp cho module này** — dùng đúng, KHÔNG tự đặt lại
     * Chưa có `_discovery/` → vẫn chạy bình thường, chỉ là không có bản đồ sẵn
   - Lấy thông tin URL của trang web, tên module, hoặc mô tả/hình ảnh mà người dùng cung cấp.
   - Nếu cần thiết, hỏi người dùng về thông tin đăng nhập hoặc các trạng thái đặc biệt cần lưu ý.
   - Nếu hệ thống có nhiều role → hỏi user account của từng role. **Không đủ account thì vẫn phải làm ma trận phân quyền** theo mục **3.1.2**, không bỏ trống.
   - **Hỏi user có tài liệu nào cho module này không** — spec, ticket, file Excel field, mockup. Có thì xác định mức phủ theo mục **3.3.1** trước khi mở browser.

2. **Khảo sát hệ thống (Recon & Investigation):**
   - Sử dụng các công cụ duyệt web (Browser tools/MCP) để truy cập vào module trang web được yêu cầu (`navigate → wait_for(page_load) → snapshot` — KHÔNG resize, viewport đã đúng từ `--viewport-size` lúc launch).
   - Inspect kỹ lưỡng cấu trúc HTML, DOM, các form nhập liệu, các nút tương tác (buttons, links), và các thông báo lỗi (validation messages — ghi **nguyên văn**).
   - Trigger từng validation để thu thập error messages thực tế.
   - **Bật `browser_network_requests` trong suốt quá trình** (mục **3.1.1**) — bắt buộc khi module không có tài liệu. Thu: schema entity thật · field ẩn trong payload · **validation server-side** · enum trạng thái · endpoint không có UI.
     🚫 Chỉ **quan sát thụ động** request do UI phát sinh — CẤM gọi API trực tiếp để dò hành vi.
   - **Đọc DOM bằng `browser_evaluate`** cho những dữ kiện ảnh không thể hiện được (mục **7.2.1**): số `<option>` thật · `disabled` vs `checked` · `value` của option · phần tử ẩn bằng class.
   - *Lưu ý: Không tự đoán các trường thông tin nếu không nhìn thấy trên giao diện thực tế.*

3. **Phân tích chức năng và tương tác (Analyze UI & Interactions):**
   - Phân tích luồng thao tác (User Flows).
   - Ghi nhận các trường dữ liệu tĩnh và động (Ví dụ: TextBox, Dropdown, Checkbox).
   - Ghi nhận các quy tắc nghiệp vụ hiển thị ở giao diện (Business Rules): trường bắt buộc, định dạng hợp lệ, giới hạn ký tự.
   - Ghi nhận phân quyền theo role (nếu có) và các trạng thái của entity (nếu có status flow).

4. **Biên soạn tài liệu Yêu cầu (Draft Requirements):**
   - ⚠️ **TRƯỚC KHI GÁN MÃ REQ ĐẦU TIÊN — làm đủ 2 bước:**
     1. Đọc danh mục `docs/requirements/README.md` — biết module nào đã có, **prefix nào đã bị chiếm** (module mới phải chọn prefix chưa dùng), mã kế tiếp của từng module.
        **Dự án mới, file chưa tồn tại → TẠO file danh mục trước** theo mục **5.7.1** của skill, đừng bỏ qua rồi ghi thẳng tài liệu module
     2. Mở `docs/requirements/<module>/REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md`. Nếu module đã có tài liệu, **đánh tiếp từ số REQ cuối cùng**, KHÔNG đánh lại từ `01` (mục **2.1** của skill). Áp cả cho `AMB-<MODULE>-XX` và `RISK-<MODULE>-XX`. Tài liệu đã có REQ của **nền tảng khác** (app, API) → rule trùng thì **mở rộng cột `Nền tảng`** của REQ cũ, không cấp mã mới (mục **2.2**)
   - **TRƯỚC KHI GHI FILE:** đếm tổng số REQ đã sinh, đối chiếu **bảng ngưỡng tại mục 5.1** của skill để quyết định cấu trúc đầu ra (1 file / 1 file + Epic-Story / tách nhiều file). Xem các module đã có trong `docs/requirements/` để giữ đúng convention (mục 5.6).
   - Tuân thủ **Output Format (mục 6)** và **Quy Ước Đánh Mã (mục 2)** trong skill `skills-requirements-analyzer`:
     * **Tổng quan (Overview):** Mục đích của module/trang.
     * **Yêu cầu chức năng (Functional Requirements):** Mỗi tính năng/business rule/validation rule **gán mã `REQ-<MODULE>-<SỐ>`** — bảng có cột REQ ID.
     * **Quy tắc trường dữ liệu (Field Specifications):** Bảng chi tiết từng thành phần UI (Tên trường, Loại, Bắt buộc/Không, Ràng buộc, REQ liên quan).
     * **Business Rules & Validation Messages:** Error message ghi nguyên văn từ UI, gắn REQ ID.
     * **Bản đồ phủ tài liệu (mục 6.5.1):** BẮT BUỘC khi user có cung cấp tài liệu — vùng nào 🟩 đầy đủ / 🟨 một phần / ⬜ trắng / ⚠️ nghi lỗi thời. Không có tài liệu thì ghi một dòng nêu rõ.
     * **Ma trận Phân quyền** (nếu có nhiều role) và **Ma trận Trạng thái** (nếu có status flow) — không áp dụng thì ghi rõ "Không áp dụng".
       ⚠️ Thiếu account role → dùng thang 3 mức `✅` / `⚠️✅` / `❔` (mục **6.5**), kèm **dòng tổng** `Đã kiểm chứng / Suy diễn / Chưa rõ` và 1 `AMB-<MODULE>-XX` 🔴 cho mỗi role thiếu account.
     * **Điểm Mơ Hồ & Rủi Ro:** Bảng AMB-<MODULE>-XX (kèm Assumption tạm) + RISK-<MODULE>-XX theo framework trong skill.
     * **Luồng xử lý (Business/User Flows):** Các bước để hoàn thành một chức năng chính.
     * **Yêu cầu phi chức năng (Non-functional Requirements - Nếu có thể quan sát):** Tính tương thích, hiệu năng tĩnh.
     * **Phân rã Epic/Story (mục 6.8):** BẮT BUỘC khi ≥ 25 REQ — bảng Story ↔ REQ, dòng tổng kiểm chứng, hạng mục cấp Epic, thứ tự triển khai.

5. **Trình bày và Cung cấp (Review & Delivery):**
   - Định dạng tài liệu bằng Markdown rõ ràng.
   - Trình bày toàn bộ nội dung bằng **Tiếng Việt** có dấu rõ ràng, chuyên nghiệp và dễ hiểu.
   - **Lưu đúng layout thư mục** (mục 5.3 của skill) — mọi thứ của lượt khảo sát web nằm ở tầng `web/`:
     ```
     docs/requirements/<module>/REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md            ← INDEX, tên file bất biến: REQ dùng chung · phân quyền · trạng thái · AMB/RISK · Bản đồ tài liệu · Nhật ký
     docs/requirements/<module>/web/requirements_<module>_web.md    ← REQ chỉ áp web · Field Spec · Validation · Trình duyệt khảo sát · Danh mục Evidence
     docs/requirements/<module>/web/evidence/*.png
     docs/requirements/<module>/web/stories/story_NN_<slug>.md      ← chỉ khi file web vượt ngưỡng
     ```
     Module mới cũng tạo đủ index + `web/` dù chỉ có web — thêm app/API về sau không phải di chuyển file. Module cũ chưa có tầng nền tảng → chuyển một lần theo luật ở skill mục 5.3.
   - **BẮT BUỘC cập nhật danh mục** `docs/requirements/README.md`: thêm/sửa dòng của module ở bảng mục 1 (cột `Nền tảng` → `Web ✅` nếu module có nhiều nền tảng · **`Trạng thái recon` → ✅ Đã có tài liệu** khi mọi nền tảng module có đều ✅, `Mức phủ tài liệu`, `REQ đã dùng`, `Mã kế tiếp`, `AMB treo`, `Story`, `Cập nhật`), bảng trạng thái mục 2, và ambiguity 🔴 High ở mục 3.
   - **BẮT BUỘC — tự đối chiếu danh mục sau khi cập nhật** (xem khối "Đối chiếu danh mục" bên dưới). Làm nhiều phiên thì danh mục trôi khỏi thực tế mà **không có cảnh báo nào**; đối chiếu ngay lúc còn nhớ rẻ hơn nhiều so với dò lại sau 10 module.
   - **Nếu đã có `_discovery/system_map.md`:** ghi 1 dòng vào Nhật ký khám phá khi phát hiện lệch so với bản đồ (module lớn hơn/nhỏ hơn dự kiến, có tab con là entity riêng nên phải tách, route đổi). Bản đồ sai mà không sửa thì module sau lại đi nhầm đường.
   - File index **luôn là** `REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` và **BẮT BUỘC** chứa mục `## Bản đồ tài liệu` liệt kê file nền tảng (và file story nếu có) kèm dải REQ (skill mục 5.5).
   - **Checklist trước khi bàn giao:** đối chiếu đủ 6 mục bất biến tại **mục 5.4** của skill (REQ ID giữ nguyên · mỗi REQ thuộc đúng 1 Story · tổng REQ khớp · AMB/RISK đánh số toàn module · không nhân bản hạng mục cắt ngang · link 2 chiều index ↔ story).
   - Nhắc user: tài liệu này (với REQ ID) là input chuẩn cho `/generate-testcases-manual-rbt`, `/generate-testcases-from-requirements` và `/generate-traceability-matrix`.

---

## Đối chiếu danh mục (BẮT BUỘC — chạy ở Bước 5, sau khi đã cập nhật `README.md`)

> **Vì sao cần:** danh mục là **bản phái sinh** do agent ghi tay qua nhiều phiên; thư mục `docs/requirements/` mới là **sự thật**. Một phiên quên cập nhật là danh mục lệch vĩnh viễn — mà cơ chế chống trùng prefix và nối tiếp mã REQ (skill mục 2.1) lại đọc **từ danh mục**. Lệch âm thầm ở đây sẽ nổ ở module thứ 5, thứ 10, dưới dạng trùng mã REQ.

**Cách làm — chỉ đọc, không mở lại browser:**

1. Glob `docs/requirements/*/REQUIREMENTS_*_SUMMARY.md` → danh sách module **có thật trên đĩa**
2. Đọc bảng danh mục mục 1 của `docs/requirements/README.md` → danh sách module **đã khai báo**
3. So hai danh sách theo 4 điểm dưới, chỉ mở file module khi cần lấy số

| Điểm kiểm | Cách phát hiện | Xử lý |
|---|---|---|
| **Module có tài liệu nhưng thiếu ở danh mục** | Có thư mục + file index, không có dòng trong bảng | Thêm dòng — lấy prefix, `REQ đã dùng`, `Mã kế tiếp` **từ chính tài liệu module**, không đoán |
| **Dòng danh mục trỏ tới module không tồn tại** | Có dòng, không có thư mục | **KHÔNG xoá dòng.** Đổi `Trạng thái recon` về ⬜ và ghi lý do ở Nhật ký danh mục — prefix đã cấp là vĩnh viễn (skill mục 5.8) |
| **`Mã kế tiếp` lệch với REQ cuối trong tài liệu** | Mở file module, lấy số REQ lớn nhất, so với cột `Mã kế tiếp` | Sửa danh mục theo tài liệu module. **Tài liệu module thắng** — nó là nơi mã REQ thực sự tồn tại |
| **Prefix trùng giữa 2 module** | Hai dòng cùng prefix | ⛔ **DỪNG, báo user ngay** — đây là lỗi phải người quyết định. Đổi prefix nghĩa là đổi mọi REQ ID của một module và mọi TC map về nó. **Agent KHÔNG tự đổi** |

4. Có sửa gì → ghi **1 dòng vào Nhật ký danh mục** (mục 6 của `README.md`): ngày · phát hiện gì · sửa gì
5. Không lệch → không ghi gì thêm, chỉ báo trong phần bàn giao: `Danh mục khớp với thư mục thực tế`

**Nguyên tắc phân xử khi lệch:** thư mục + tài liệu module là **nguồn sự thật**, danh mục là bản phái sinh → **sửa danh mục theo tài liệu**, không bao giờ ngược lại. Ngoại lệ duy nhất là **prefix** — prefix đã cấp thì bất biến, lệch prefix phải hỏi user.

