# Báo Cáo Review Test Cases — `CUST` · Web

## Tổng quan

- **Nguồn:** [TEST_CASES_CUSTOMERS_SUMMARY.md](../TEST_CASES_CUSTOMERS_SUMMARY.md) → 5 part ở [web/parts/](../web/parts/) · requirements [REQUIREMENTS_CUSTOMERS_SUMMARY.md](../../../requirements/customers/REQUIREMENTS_CUSTOMERS_SUMMARY.md) + [web/requirements_customers_web.md](../../../requirements/customers/web/requirements_customers_web.md)
- **Mode:** REVIEW — chỉ báo cáo, không sửa file TC nào
- **Ngày review:** 24-09-2026 · mốc git bộ TC lúc review: `2763dfd`
- **Số TC review:** 129 (không có TC `@Deprecated`) · 155 biến thể · 74 mục bảng kiểm — đếm lại khớp với index
- **Kết quả:** 🟢 129 tốt | 🟡 0 cần sửa | 🔴 0 nên viết lại
- **Điểm trung bình:** 11,84/12 — 113 TC đạt 12/12, 16 TC bị trừ 1–2 điểm
- **Loại trừ theo requirements:** Tab `Contacts` + `/admin/clients/all_contacts` (`CONT`) · 11 tab chỉ hiển thị dữ liệu của module khác · tab `Files` · quản trị nhóm khách hàng `/admin/clients/groups` · cổng khách hàng · cột CSV `Stripe id` (`AMB-CUST-08`) · hiển thị bản đồ Google Maps (`AMB-CUST-09`)
- **Đối chiếu kết quả chạy:** `docs/executions/customers/` chưa có. Bộ TC này **chưa chạy lần nào**, nên chưa có ghi chú `⚠️` / `@NeedsVerify` nào được gỡ nhờ kết quả chạy

> **Kết luận nhanh:** Cách viết từng TC rất tốt. Không có TC mơ hồ, không có ngôn ngữ DOM/HTTP ở phần chính (mọi chi tiết kỹ thuật đã nằm dưới `🔧`). Không có TC gộp sai kiểu nào, trừ `TC_094`/`TC_095`. Cần xử lý **1 khoảng trống bảo mật** (đường dẫn xoá khi không có quyền), **4 lỗi ghi tag / số liệu** và **1 dòng `⏭️` chưa có người duyệt**.

---

## Chi tiết từng TC

Thang điểm: C1 Rõ ràng · C2 Kết quả đo được · C3 Độc lập · C4 Dữ liệu test · C5 Truy vết · C6 Đúng trọng tâm.

### TC bị trừ điểm

| TC ID | Điểm | Xếp loại | Vấn đề chính | Đề xuất sửa |
|---|---|---|---|---|
| CRM_CUST_TC_094 | 10/12 | 🟢 | C6: gộp **hai loại phản hồi** vào một TC. Biến thể `a`,`b` (`90`, `-90`) phải *lưu được*; biến thể `c`–`f` phải *bị chặn*. Vi phạm bảng CẤM gộp (khác loại phản hồi). C2: `c`–`f` chỉ *"ghi nhận"*, không có tiêu chí FAIL | Giữ `TC_094` cho `c`–`f`, thêm tiêu chí FAIL: *"`c`–`f` được lưu âm thầm với giá trị khác đã nhập (VD `16,0544` thành `16`) → FAIL"*. Chuyển `a`,`b` sang **TC mới `CRM_CUST_TC_130`** — *"Latitude tại biên hợp lệ ±90 được lưu"*, cùng mẫu với `TC_091` |
| CRM_CUST_TC_095 | 10/12 | 🟢 | Như `TC_094`, áp cho Longitude (`180`, `-180` gộp chung với `180.0001`…`108,2022`) | Giữ `c`–`f` ở `TC_095`. Chuyển `a`,`b` sang **TC mới `CRM_CUST_TC_131`** — *"Longitude tại biên hợp lệ ±180 được lưu"*. Không gộp `130` với `131` vì khác trường |
| CRM_CUST_TC_047 | 10/12 | 🟢 | C2: kết quả đang ghi *"Kỳ vọng theo tinh thần `REQ-CUST-43` … Ghi lại nếu khoảng trắng còn nguyên"*, nên không có cách chấm FAIL. C5: `REQ-CUST-43` nói về Company **toàn** khoảng trắng, không nói về cắt khoảng trắng đầu/cuối. TC đang tự suy ra một quy tắc không có trong REQ | Mở `AMB-CUST-15`: *"Có cắt khoảng trắng đầu/cuối của Company khi lưu không?"*. Trong lúc chờ, đổi Expected bước 3 thành *"Ghi lại nguyên văn. **FAIL** nếu tìm kiếm ở bước 4 bằng tên không có khoảng trắng không ra dòng nào"*. Đó là hệ quả người dùng thấy được, chấm được ngay |
| CRM_CUST_TC_018 | 11/12 | 🟢 | C1: Pre-Condition và Test Steps chỉ ghi *"Như `CRM_CUST_TC_017`"*. Người chạy phải mở TC khác mới biết làm gì | Chép lại 4 bước của `TC_017` (bấm tiêu đề cột 1 lần → đợi `Showing …` đổi → đọc 5 dòng đầu → bấm lần 2 → đọc lại) |
| CRM_CUST_TC_023 | 11/12 | 🟢 | C2: biến thể `b` (tìm không dấu) chỉ *"ghi nhận"*, cả hai kết quả đều không FAIL | Được chấp nhận trong lúc chờ AMB. Đề xuất mở luôn `AMB-CUST-16` (*"Tìm kiếm có bỏ dấu không?"*) để lần chạy đầu có chỗ chốt kết quả |
| CRM_CUST_TC_029 | 11/12 | 🟢 | C1: bước 3 *"Nhập tên bộ lọc (nếu có ô tên)"* và bước 6 *"qua lệnh `Edit` hoặc lối xoá tương đương"*. Người chạy không biết bấm vào đâu | Lần recon tới, chụp hộp thoại sau khi bật `Save Filter` và dropdown khi đã áp bộ lọc (index đã ghi ở *Vùng chưa có evidence*). Sau đó ghi đích danh ô tên và lệnh xoá |
| CRM_CUST_TC_037 | 11/12 | 🟢 | C2: bước 4 *"Có bước xác nhận trước khi xoá (ghi lại nguyên văn nếu có)"*. Có hay không có hộp xác nhận đều không FAIL | Chấp nhận được vì là `@PersonalOnly` và chưa có evidence. Đề xuất: *"Không có bất kỳ xác nhận nào trước khi xoá hàng loạt → ghi `RISK` mới (cùng loại `RISK-CUST-06`)"* |
| CRM_CUST_TC_038 | 11/12 | 🟢 | C2: chỉ có kỳ vọng tối thiểu, phần nhắc/không nhắc là *"ghi lại"* | Giữ nguyên. Kỳ vọng tối thiểu (không đổi nhóm, không xoá bản ghi nào) đã đủ để chấm FAIL |
| CRM_CUST_TC_066 | 11/12 | 🟢 | C2: biến thể `b`,`c` ghi *"Không có quy tắc để chấm"* | Thêm tiêu chí tối thiểu cho `b`,`c`: *"FAIL nếu ô đích bị xoá trắng mà không có cảnh báo"*. Đây chính là lý do TC này tồn tại |
| CRM_CUST_TC_080 | 11/12 | 🟢 | C3: dùng chung `KH-TEST` của `TC_079` (*"Như `CRM_CUST_TC_079` (dùng chung `KH-TEST` đang Inactive)"*) và tìm bằng `auto_cust_tc079`. Chạy riêng `TC_080` thì không có dữ liệu | Pre-Condition tự tạo `KH-TEST` Company `auto_cust_tc080_<thời điểm>`, gạt sang Inactive. Bước 2 và 5 tìm `auto_cust_tc080`. Bỏ câu *"hoặc chuyển sang `CRM_CUST_TC_080` dùng tiếp"* ở `TC_079` |
| CRM_CUST_TC_086 | 11/12 | 🟢 | C2: *"hệ thống chặn / báo khoảng ngày sai, hoặc hiện sao kê rỗng"*. Chấp nhận mọi kết quả trừ trang lỗi | Thêm tiêu chí FAIL: *"Sao kê hiện khoảng ngày bị đảo ngược mà vẫn tính số dư như bình thường, không có cảnh báo"* |
| CRM_CUST_TC_092 | 11/12 | 🟢 | C2: mọi biến thể chỉ *"ghi nhận"* | Thêm: *"FAIL nếu `0`/`65536`/`-1` lưu được mà hiển thị giá trị khác đã nhập"* (hệ thống âm thầm đổi dữ liệu) |
| CRM_CUST_TC_099 | 11/12 | 🟢 | C2: biến thể `a` (ngày quá khứ) chỉ *"ghi nhận"*. `b`,`c` đã có tiêu chí FAIL | Giữ nguyên. Ngày quá khứ không có quy tắc là hợp lý. Kết quả lần chạy đầu nên đưa vào `REQ-CUST-71` |
| CRM_CUST_TC_110 | 11/12 | 🟢 | C2: *"Nếu Phone quay về … → ghi nhận mất cập nhật … không kết luận FAIL"* | Giữ nguyên trong lúc chờ quy tắc. Mở `AMB` ngay sau lần chạy đầu nếu có ghi đè, vì đây là rủi ro mất dữ liệu thật |
| CRM_CUST_TC_113 | 11/12 | 🟢 | C4: biến thể `c` dùng cứng `…/admin/clients/client/14625`, là `{id}` của một khách hàng thật trên môi trường dùng chung. Trái quy tắc *"ID phải random/traceable"* | Dùng `{id}` của `KH-TEST` do chính TC tạo trước khi đăng xuất. Hoặc ghi rõ *"`{id}` bất kỳ — chỉ đọc, không cần tồn tại"* |
| CRM_CUST_TC_129 | 11/12 | 🟢 | C3: dựa vào hoá đơn **của người khác** (*"lấy khách hàng ở dòng đầu bảng hoá đơn khi chạy"*). Bảng hoá đơn trống hoặc hoá đơn đầu bị xoá thì TC bị chặn | Chấp nhận được (TC chỉ đọc, và tạo hoá đơn thuộc module `INV`). Thêm vào Pre-Condition: *"Bảng Invoices không có dòng nào → BLOCKED, không FAIL"* |

### TC đạt 12/12 (113 TC)

| Dải TC ID | Điểm | Xếp loại |
|---|---|---|
| CRM_CUST_TC_001 → 017 · 019 → 022 · 024 → 028 · 030 → 036 · 039 → 046 · 048 → 065 · 067 → 079 · 081 → 085 · 087 → 091 · 093 · 096 → 098 · 100 → 109 · 111 · 112 · 114 → 128 | 12/12 | 🟢 |

> Không trừ điểm các TC chỉ *"ghi nhận"* khi đã có **kỳ vọng tối thiểu kèm tiêu chí FAIL rõ** (VD `TC_046`, `TC_078`, `TC_105`, `TC_109`). Đó là cách viết đúng cho vùng chưa có quy tắc.

---

## Lỗi ghi nhãn / số liệu (không thuộc rubric — sửa trong tài liệu)

| # | Chỗ | Vấn đề | Đề xuất sửa |
|---|---|---|---|
| 1 | Index · dòng **Quy mô** + Nhật ký 19-09-2026 | Ghi **51 TC `@NeedsVerify`**, *"theo số đếm thật trong 5 part"*. Đếm thật cột `Tags` ra **49**. Danh mục [`docs/testcases/README.md`](../../README.md) ghi 49 | Sau khi sửa mục 2 bên dưới, cập nhật đúng số đếm được (dự kiến **53**) ở cả index lẫn danh mục |
| 2 | `TC_050`, `TC_051`, `TC_052`, `TC_056` | Có biến thể 255 ký tự chưa kiểm chứng (`ASM-12` liệt kê đủ bốn: `050-e`, `051-f`, `052-e`, `056-e`), nhưng **không** mang tag `@NeedsVerify`. `051`, `052`, `056` còn thiếu dòng `⚠️` | Thêm `@NeedsVerify` cho cả bốn TC. Thêm `⚠️ mốc 255 chưa kiểm chứng (AMB-CUST-05)` vào kết quả của biến thể tương ứng ở `051`, `052`, `056` |
| 3 | `TC_028` | Mang tag `@DecisionTable`, trong khi Bảng 4 vòng ghi `Decision Table` là `➖` | Bỏ tag `@DecisionTable` (TC này là EP hai cột AND/OR, đúng như dòng `➖` giải thích) |
| 4 | `TC_028`, `TC_060` | Mang `@NeedsVerify` nhưng kết quả không có dòng `⚠️` nào. Người chạy không biết bước nào chưa có evidence | `TC_028` bước 4: thêm `⚠️ kết quả lọc sau Apply chưa có evidence`. `TC_060` bước 3: thêm `⚠️` trước *"ghi nguyên văn"* |
| 5 | Bảng 4 vòng · dòng `Validation — mục cố ý bỏ` | Ghi *"Quyết định: QA (agent đề xuất), 19-09-2026 — **chờ QA lead duyệt**"*. `⏭️` phải có **người chịu trách nhiệm đã quyết**; đề xuất chưa duyệt thì chưa phải quyết định | Lấy tên QA lead duyệt ba mục (dung lượng CSV, năm nhuận Reminder, chặn dán mật khẩu Vault). Chưa duyệt thì tạm chấm `🔴` và ghi *"chờ duyệt"* |
| 6 | Header 5 part + index | Viewport chuẩn ghi `1600×750`. Quy ước dự án (`CLAUDE.md`) là `1600×770` | Đổi thành `1600×770` khi sửa file lần tới. Không ảnh hưởng kết quả TC |

---

## Đối soát loại kiểm thử (4 vòng)

Chấm độc lập, đối chiếu với Bảng 4 vòng của index. Chỉ ghi chú những chỗ **khác** với index.

| Vòng | Nhánh | Trạng thái | Ghi chú |
|---|---|---|---|
| 1 | UI cơ bản | ✅ | 7 TC · 41 mục bảng kiểm: nhãn nguyên văn, thứ tự cột/trường, trạng thái mặc định, con trỏ |
| 1 | Open form | ✅ | `001`, `008`, `014`, `015`: mọi lối vào |
| 1 | Display | 🟡 Nông | Có định dạng ngày giờ, tiền, trạng thái rỗng (`022`, `084`). **Thiếu trạng thái đang tải** của bảng (dòng `Processing…` khi nạp phía máy chủ). Xem Gap #4 |
| 1 | Input valid · Save · Verify data | ✅ | `009`, `010`, `011`, `012`: bộ tối thiểu và bộ đủ 22 trường, đối chiếu ở hồ sơ lẫn danh sách |
| 2 | UI Behavior | ✅ | 7 TC |
| 2 | Required | ✅ | 7 TC · 10 biến thể, đủ 4 biểu mẫu |
| 2 | Validation | ✅ | 21 TC · 69 biến thể. Đối soát 15 loại field ở mục dưới. Dòng `⏭️` đi kèm còn thiếu người duyệt (lỗi ghi nhãn #5) |
| 2 | Equivalence Partitioning | ✅ | 8 TC · 35 biến thể |
| 2 | Boundary Value Analysis | ✅ | 7 TC · 27 biến thể. Sau khi tách `094`/`095` thì thêm `130`, `131` |
| 2 | Business Rule | ✅ | 8 TC, mỗi quy tắc có cả vế tuân thủ lẫn vế bị chặn |
| 2 | Decision Table | ➖ | Đồng ý với index: không có quy tắc nào ≥ 3 điều kiện |
| 2 | State Transition | ✅ | Có bảng chuyển trạng thái ở Nhóm O, đủ ô hợp lệ và ô bị chặn |
| 2 | Dependency | ✅ | 8 TC |
| 2 | Use Case / Scenario | ✅ | `112` |
| 2 | Save / Edit / Delete | ✅ | Có huỷ giữa chừng (`068`, `076`), xoá khi có liên kết (`081`), sửa đồng thời (`110`) |
| 2 | Error Guessing | ✅ | 9 TC. Thiếu một kịch bản nhỏ: nạp lại trang khi **đang áp bộ lọc** (Gap #3) |
| 3 | Permission | ✅ | 9 TC, ma trận 3 vai trò × 8 nhóm hành động + chưa đăng nhập |
| 3 | Security | 🟡 Nông | XSS/SQLi, CSRF, `javascript:` đã có. **Thiếu**: gọi đường dẫn xoá `GET /admin/clients/delete/{id}` khi **chưa đăng nhập** hoặc bằng **phiên cổng khách hàng**. `TC_123` đã chứng minh đường dẫn này xoá ngay mà không hỏi, nên phải chứng minh nó không chạy được khi không có quyền (Gap #1) |
| 3 | API · Database · Integration | ➖ | Đồng ý: theo *Năng lực kiểm thử của QA* (chốt 11-09-2026). Integration còn thuộc loại trừ `AMB-CUST-08`/`09` |
| 3 | Logging / Audit | ➖ | Đồng ý: tài khoản Admin demo bị từ chối vào `Activity Log`. Rà lại khi được cấp Super Admin |
| 4 | Compatibility | ✅ | `127`: Chrome · Edge · Firefox |
| 4 | Responsive | ✅ | `125`: 4 kích thước đã chốt |
| 4 | Accessibility | ✅ | `005`, `126` |
| 4 | Performance | ✅ mức thô | `128` |
| 4 | Regression | ➖ | Đúng: `docs/bugs/` chưa có bug nào của `customers` được đóng |
| 4 | E2E | ✅ | `079`–`081` (`@AssumptionBased`) |

---

## Đối soát bảng 15 loại field

| Field | Loại | Mục đã có | Mục thiếu |
|---|---|---|---|
| Company | Text | 8/8: bắt buộc · min/max · toàn khoảng trắng · ký tự đặc biệt · XSS · SQLi · Unicode/emoji · khoảng trắng đầu/cuối | — (`047` cần sửa cách chấm, xem ở trên) |
| VAT Number · Website · Zip Code | Text tuỳ chọn, không kiểm định dạng | Ký tự đặc biệt · HTML · max 255 · số 0 đứng đầu (Zip) | — (bắt buộc / toàn khoảng trắng không áp dụng với trường tuỳ chọn) |
| Phone | Phone | Chỉ số · tiền tố `+84` · dấu `-` `.` khoảng trắng · chữ lẫn số · max | — (mã vùng ➖, `AMB-CUST-06`: không kiểm định dạng) |
| Address · Note | Textarea | Xuống dòng · max · thẻ HTML · emoji | — (resize, bộ đếm ký tự ➖: không có trên giao diện) |
| City · State · 8 ô Billing/Shipping | Text | Độ bền 5 biến thể (`056`) | — (ngoại lệ hợp lệ của bảng CẤM gộp) |
| Currency · Default Language · Country | Dropdown | Mặc định · danh sách lựa chọn · đổi · bỏ chọn · khoá theo giao dịch (`129`) | — |
| Groups | Multi-Select | Tìm · chọn tất cả · bỏ tất cả · bỏ từng mục · lưu · gỡ | — |
| Vault Port | Number | 0 · 1 · 65535 · 65536 · âm · thập phân · chữ | — |
| Vault Password | Password | Che ký tự | Chặn dán: `⏭️`, chờ duyệt (lỗi ghi nhãn #5) |
| Reminder Date | Date | Quá khứ · ngày không tồn tại · chữ | Năm nhuận: `⏭️`, chờ duyệt (lỗi ghi nhãn #5) |
| Statement Period | Date Range | Kết thúc < bắt đầu (`086`) | — |
| CSV | File Upload | Sai loại · rỗng 0 KB · chỉ tiêu đề · thiếu cột bắt buộc · trùng email | Dung lượng tối đa: `⏭️`, chờ duyệt (lỗi ghi nhãn #5) |
| Latitude · Longitude | Number | Biên ±90/±180 · ngoài miền · chữ · dấu phẩy | — (cần tách TC, xem `094`/`095`) |
| `Mass Delete` · `Show primary contact` · `Send also an email` · `Save Filter` | Checkbox | Mặc định · tích/bỏ · lưu trạng thái | — |
| Mức hiển thị Vault | Radio | Mặc định · 3 lựa chọn · chỉ chọn 1 | — |

---

## Coverage Gaps (TC còn thiếu)

| # | Kịch bản thiếu | Vòng / Nhánh | Priority đề xuất |
|---|---|---|---|
| 1 | Mở `https://crm.anhtester.com/admin/clients/delete/{id}` của `KH-TEST` khi **(a)** chưa đăng nhập và **(b)** chỉ có phiên cổng khách hàng. Kết quả: bị đưa về trang đăng nhập, `KH-TEST` **vẫn còn** khi Admin tìm lại. Nên thêm thành biến thể `e` của `TC_113` và `c` của `TC_114` (cùng thao tác, cùng loại phản hồi *"bị chặn"*), **không** cần TC mới | V3 · Security | High |
| 2 | Latitude / Longitude tại biên **hợp lệ** tách khỏi TC ngoài miền: `CRM_CUST_TC_130` (Latitude `90`, `-90`) · `CRM_CUST_TC_131` (Longitude `180`, `-180`) | V2 · BVA | Low |
| 3 | Áp bộ lọc City → bấm `F5` → ghi lại bộ lọc **còn hay mất**, bảng có khớp với bộ lọc đang hiện không. FAIL nếu biểu tượng bộ lọc báo đang áp mà bảng hiện đủ bản ghi | V2 · Error Guessing (Data Table: *Refresh giữ/mất filter*) | Low |
| 4 | Chọn `All` hoặc chuyển trang → quan sát chỉ báo đang tải của bảng hiện ra rồi tắt. Có thể thêm thành mục bảng kiểm ở `TC_019-e` | V1 · Display (trạng thái đang tải) | Low |
| 5 | Hộp thoại `Create Filter`, `Vault Entry`, `Bulk Actions`: đóng bằng **bấm ra ngoài**, và mở lại sau khi đã nhập dở thì dữ liệu **giữ hay xoá**. Thêm biến thể `d` (bấm ra ngoài) vào `TC_034`, thêm bước mở lại vào `TC_026`, `TC_088` | V1 · Open form (Component-Level → Modal) | Low |

---

## TC trùng lặp — đề xuất merge

Không có. Các cặp gần nhau có mục đích khác nhau:

- `TC_009` / `TC_011` / `TC_112`: `009` chấm hồ sơ sau khi lưu, `011` chấm danh sách + Summary, `112` là chuỗi vòng đời
- `TC_077` / `TC_119`: cùng thao tác xoá nhưng khác vai trò (Admin / PM)
- `TC_059` / `TC_121`, `TC_072` / `TC_121`: `121` là phiên bản phân quyền cho PM

---

## Rủi ro dữ liệu dùng chung (ghi chú cho lần chạy đầu)

Các TC sau dựa vào **dữ liệu chuẩn của người khác** trên `crm.anhtester.com`. Nếu dữ liệu đó đổi, TC sẽ FAIL giả:

| TC | Phụ thuộc | Khi lệch thì làm gì |
|---|---|---|
| `035`, `036`, `058`, `106` | Nhóm `Platinum`, `Information Technology` (`AMB-CUST-07`: mỗi tên trùng hàng chục lần) | Chọn mục đầu tiên khớp tên, ghi lại. Nhóm không còn → BLOCKED |
| `072`, `096`, `121` | *"đúng 3 nhân sự"* `Project Manager` · `Admin Anh Tester` · `Admin Example` | Đổi thành *"có ít nhất 3 nhân sự kể trên"*, để có thêm nhân sự mới cũng không FAIL |
| `129` | Hoá đơn của khách hàng khác | Xem đề xuất ở bảng TC |

---

## Kết luận & Khuyến nghị

1. **Thêm biến thể xoá-khi-không-có-quyền** vào `TC_113` và `TC_114` (Gap #1, High). Đây là khoảng trống duy nhất đáng kể. Đường dẫn xoá dùng `GET`, không hỏi xác nhận, không có mã CSRF (`TC_123`), nên nếu kiểm quyền cũng lỏng thì đây là lỗi nghiêm trọng
2. **Sửa 4 lỗi tag/số liệu** (#1–#4): thêm `@NeedsVerify` cho `050`/`051`/`052`/`056`, bỏ `@DecisionTable` ở `028`, thêm dòng `⚠️` ở `028`/`060`, cập nhật số `@NeedsVerify` ở index và danh mục cho khớp nhau
3. **Lấy chữ ký QA lead** cho dòng `⏭️ Validation — mục cố ý bỏ` (#5)
4. **Tách `TC_094`/`TC_095`** thành biên hợp lệ + ngoài miền (`TC_130`, `TC_131`), và sửa cách chấm của `TC_047` (mở `AMB-CUST-15`)
5. **Chạy bộ TC lần đầu** (`/execute-test-cases`, bỏ qua `@PersonalOnly`) để gỡ bớt 49 TC `@NeedsVerify`. Đó là phần lớn nhất còn chưa chắc chắn của bộ này, và review không thay được việc chạy thật

> Muốn áp các đề xuất trên: chạy `/review-testcases docs/testcases/customers FIX web`, duyệt danh sách TC ở checkpoint.
