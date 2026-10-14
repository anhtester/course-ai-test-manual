# Báo Cáo Review Test Cases — `BK · AUTH` · API

## Tổng quan

- **Nguồn:** [TEST_CASES_AUTH_SUMMARY.md](../TEST_CASES_AUTH_SUMMARY.md) → [api/parts/part_01_api_dang_ky_dang_nhap.md](../api/parts/part_01_api_dang_ky_dang_nhap.md) · [api/parts/part_02_api_phien_ho_so.md](../api/parts/part_02_api_phien_ho_so.md) · requirements [api/requirements_auth_api.md](../../../../requirements/_book-api/auth/api/requirements_auth_api.md) + REQ dùng chung ở [REQUIREMENTS_AUTH_SUMMARY.md](../../../../requirements/_book-api/auth/REQUIREMENTS_AUTH_SUMMARY.md)
- **Mode:** REVIEW — chỉ báo cáo, không sửa file TC nào
- **Ngày review:** 24-09-2026 · mốc git bộ TC lúc review: `2763dfd`
- **Số TC review:** 50 (`BK_AUTH_TC_059` → `108`, không có TC `@Deprecated`) · 94 biến thể — đếm lại khớp với index
- **Kết quả:** 🟢 50 tốt | 🟡 0 cần sửa | 🔴 0 nên viết lại
- **Điểm trung bình:** 11,94/12 — 47 TC đạt 12/12, 3 TC bị trừ 1 điểm
- **Loại trừ theo requirements:** BOLA/IDOR (thuộc module `USER`, `AUTH` không có endpoint nhận `id`) · dùng lại token sau đăng xuất và dùng lại refresh token nhiều lần (PO chấp nhận là thiết kế — `AMB-BK-AUTH-06`, `07`, `RISK-BK-AUTH-01`) · Web (ngoài phạm vi hệ thống `BK`)
- **Đối chiếu kết quả chạy:** `docs/executions/` chưa có lần chạy nào của `_book-api`. Chưa có `@NeedsVerify` nào được gỡ nhờ kết quả chạy

> **Kết luận nhanh:** Bộ API viết rất chặt: status, body nguyên văn, header, cờ cookie đều cụ thể; kỳ vọng bám spec; `@KnownBug` không bị hạ kỳ vọng để né bug. Có **3 TC phụ thuộc thứ tự chạy**, mâu thuẫn với câu *"TC độc lập, chạy song song được"* ở đầu part 02. Có **2 khoảng trống độ bền** đáng thêm: body JSON hỏng và hai request đăng ký cùng email gửi đồng thời.

---

## Chi tiết từng TC

Thang điểm: C1 Rõ ràng · C2 Kết quả đo được · C3 Độc lập · C4 Dữ liệu test · C5 Truy vết · C6 Đúng trọng tâm. TC `Auto Type = API` được dùng mã HTTP/header ở phần chính, nên không bị trừ C2.

### TC bị trừ điểm

| TC ID | Điểm | Xếp loại | Vấn đề chính | Đề xuất sửa |
|---|---|---|---|---|
| BK_AUTH_TC_099 | 11/12 | 🟢 | C3: Pre-Condition *"Vừa chạy `TC_098` với `userA`"*, bước 1 dùng `tokenA` của `TC_098`. Chạy riêng hoặc chạy song song thì không có token, `name` cũng chưa đổi. Mâu thuẫn với dòng đầu part 02: *"Mỗi TC tự đăng nhập lại ở bước đầu — không dùng token của TC khác (TC độc lập, chạy song song được)"* | Cho TC tự làm đủ: *"1. Đăng nhập `userA` → `tokenA` · 2. `PATCH /api/profile` `{"name":"Auto Auth API Renamed <T+30>"}` · 3. `GET /api/me` · 4. Đọc `name`"*. Kết quả vẫn chỉ chấm bước 4 (REQ-42), phần PATCH là tiền đề |
| BK_AUTH_TC_103 | 11/12 | 🟢 | C3: *"Vừa chạy `TC_102`"*. Chạy riêng thì mật khẩu chưa đổi, TC FAIL vì thiếu tiền đề chứ không phải vì bug | Tài khoản riêng `userF` (`auto_auth_<T+39>_f@auto.test`): đăng ký → `PATCH /api/profile` đổi mật khẩu (tiền đề) → đăng nhập bằng mật khẩu mới. Thêm độ lệch `39` vào bảng *Dọn dữ liệu (API)* |
| BK_AUTH_TC_104 | 11/12 | 🟢 | C3: *"Vừa chạy `TC_102`"*, dùng chung `userE` với `102` và `103` | Tài khoản riêng `userG` (`<T+40>`), tự đổi mật khẩu ở tiền đề rồi thử mật khẩu cũ. Sau khi sửa, bỏ dòng *"Đợt 4: TC_098 → 099 (tuần tự…) · TC_102 → 104 (tuần tự…)"* ở *Dependencies & Execution Order* |

> Ba TC trên đều là `@KnownBug` (F-16). Hôm nay chúng FAIL dù chạy kiểu nào. Nhưng khi F-16 được sửa, chạy `103` mà không chạy `102` trước sẽ ra FAIL giả, và automation chạy song song (mặc định 5 luồng theo `automation_rules.md`) sẽ vỡ ngay.

### TC đạt 12/12 (47 TC)

| Dải TC ID | Điểm | Xếp loại |
|---|---|---|
| BK_AUTH_TC_059 → 098 · 100 → 102 · 105 → 108 | 12/12 | 🟢 |

Vài điểm tốt đáng giữ làm mẫu cho module khác:

- `TC_062`, `TC_075` (⚪ chờ `AMB-BK-AUTH-03`): kỳ vọng theo spec, nói rõ *"dự kiến FAIL theo hiện trạng (F-19)"*. `075` còn giới hạn *"chạy đúng 1 lần mỗi lượt"* vì chạm tài khoản không do QA sở hữu
- `TC_067` (mass assignment): chấp nhận `201` hoặc `422`, nhưng tiêu chí FAIL ở bước 5 rõ ràng (có khoá `role`/`isAdmin`, `id` bị ghi đè)
- `TC_092`: tìm chuỗi băm bcrypt `$2…` và mật khẩu gốc trong **toàn bộ** body, không chỉ đếm khoá
- `TC_095-d`: token `alg: none`, ghi rõ *"trả `200` → FAIL nghiêm trọng, mở bug ngay"*

---

## Lỗi ghi nhãn / số liệu (không thuộc rubric — sửa trong tài liệu)

| # | Chỗ | Vấn đề | Đề xuất sửa |
|---|---|---|---|
| 1 | Đầu [part 02](../api/parts/part_02_api_phien_ho_so.md) | Câu *"TC độc lập, chạy song song được"* sai với `099`, `103`, `104` (xem bảng trên) và với *Dependencies & Execution Order* ở index (Đợt 4 chạy tuần tự) | Sửa 3 TC theo đề xuất trên. Làm vậy câu này thành đúng, không phải sửa câu |
| 2 | Index · *Rà soát ISO/IEC 25010* dòng `Functional Suitability` | Ghi `TC_001 → TC_058`, chỉ có mobile. Thiếu 50 TC API | `TC_001 → TC_108` (Mobile 001–058 · API 059–108) |
| 3 | Index · *TC treo* | `AMB-BK-AUTH-08` (🟡) nói `name`/`password` rỗng `""` khi đăng ký trả `422` với body `fields.fields` (F-22). Hành vi này vi phạm hình dạng body lỗi của `REQ-BK-AUTH-48`, nhưng **không** có trong bảng *TC treo* | Thêm một dòng: *"Chuỗi rỗng ở `name`/`password` khi đăng ký · 422 · body `fields.fields` vi phạm REQ-48 · `AMB-BK-AUTH-08` 🟡 · PO chốt: lỗi → TC `@KnownBug` mới (không thêm vào `TC_105`, vì `105` đã đủ 6 biến thể)"* |

---

## Đối soát loại kiểm thử (4 vòng) — phần API

Index gộp chung Mobile + API vào một Bảng 4 vòng. Bảng dưới chỉ chấm **vế API**.

| Vòng | Nhánh | Trạng thái | Ghi chú |
|---|---|---|---|
| 1 | Smoke (UI cơ bản · Open form · Display) | ➖ | API không có giao diện. Tương đương ở API là bộ `@Smoke`: `059` · `106` · `069` · `071` · `082` · `086` · `091`, phủ đủ 6/6 endpoint trừ `PATCH /api/profile` (đang hỏng F-16) |
| 1 | Input valid · Save · Verify data | ✅ | `059` → `106` → `093` (3 biến thể: đủ trường · tối thiểu · Unicode) |
| 2 | Required | ✅ | `061`, `062`, `063`, `075`, `076`, `084` — thiếu từng field bắt buộc của 3 endpoint |
| 2 | Validation | 🟡 Nông | Email đăng ký: 7/9 mục (xem bảng 15 loại field). **Thiếu body JSON hỏng / sai kiểu gốc** (Gap #1) |
| 2 | Equivalence Partitioning | ✅ | 3 content-type (`060`, `070`) · lớp email sai (`064`, `077`) · lớp token sai (`085`, `089`, `095`) |
| 2 | Boundary Value Analysis | ➖ / ⏳ | Không có REQ độ dài nào ở phía API (`AMB-BK-AUTH-14` treo). `068-d`, `081-d` kiểm độ bền 10.000 ký tự. Đúng |
| 2 | Business Rule | ✅ | Email duy nhất (`065`), không phân biệt hoa thường (`066`, `072`), thu hồi refresh token sau đăng xuất (`090`) |
| 2 | Decision Table · State Transition | ➖ | Không có quy tắc ≥ 3 điều kiện ở mặt API. Phiên (đăng nhập → làm mới → đăng xuất) đã phủ bằng `082` → `090` |
| 2 | Dependency | ✅ | Token ↔ tài khoản (`071`, `083`, `097`), cookie ↔ body (`079`) |
| 2 | Use Case | ✅ | `106` (đăng ký → đăng nhập ngay), `083` (đăng nhập → làm mới → dùng token mới) |
| 2 | Save / Edit / Delete | ✅ (bị chặn) | `098` → `104` viết đủ nhánh sửa hồ sơ + đổi mật khẩu, đều `@KnownBug` F-16 |
| 2 | Error Guessing | 🟡 Nông | Có dữ liệu bất thường ở từng field (`068`, `081`). **Thiếu** hai kịch bản cổ điển của API: body hỏng (Gap #1) và đăng ký đồng thời cùng email (Gap #2) |
| 3 | Permission | ✅ / ⏳ | Ma trận *không token × Bearer hợp lệ* đủ cho 6 endpoint. Theo vai trò → TC treo `AMB-BK-01` 🔴. Đúng |
| 3 | Security | ✅ | 21 TC `@Security`: injection, mass assignment, token giả / `alg: none` / sai scheme, chỉ nhận token qua header, cờ cookie, không lộ khoá nhạy cảm. Chống dò mật khẩu → TC treo `AMB-BK-08`. Đúng |
| 3 | API | ✅ | 50 TC · 94 biến thể · 6/6 endpoint · mã `200/201/400/401/404/422` + kiểm âm `500` |
| 3 | Database | ➖ | QA không có quyền truy vấn CSDL (chốt 20-09-2026) |
| 3 | Integration · Logging/Audit | ➖ | Không có tích hợp bên ngoài · requirements không có yêu cầu nhật ký |
| 4 | Performance | ➖ | Không có ngưỡng cam kết. `068-d`, `081-d` có ngưỡng thô *"không treo quá 10 giây"* |
| 4 | Compatibility | ✅ | 3 content-type |
| 4 | Regression | ➖ | Chưa có bug nào được đóng |

---

## Đối soát bảng 15 loại field

| Field (endpoint) | Loại | Mục đã có | Mục thiếu |
|---|---|---|---|
| `email` (register) | Email | Hợp lệ `059` · thiếu `@` `064-a` · thiếu domain `064-b` · thiếu phần trước `@` `064-c` · nhiều `@` `064-d` · khoảng trắng `064-e` · hoa thường `066` · đã tồn tại `065` | **Domain không hợp lệ** (`auto@auth`, `auto@-auth.test`): mặt Mobile có ở `010-f`, nhưng đó là bộ kiểm của **app**, không chứng minh được máy chủ chặn. Max length ➖ (spec không khai `maxLength`) |
| `email` (login) | Email | Thiếu `@` · thiếu domain · thiếu phần trước `@` · nhiều `@` (`077`) · hoa thường (`072`) · chưa tồn tại / đã xoá (`074`) | Domain không hợp lệ (như trên) |
| `name` (register) | Text | Bắt buộc · sai kiểu (`061`) · XSS · SQLi · NoSQL · 10.000 ký tự (`068`) · Unicode/emoji (`093-c`) | Chuỗi rỗng / toàn khoảng trắng → treo `AMB-BK-AUTH-08` (lỗi ghi nhãn #3) |
| `password` | Password | Bắt buộc (`063`, `076`) · SQLi · object NoSQL · 10.000 ký tự (`081`) · phân biệt hoa thường · thừa khoảng trắng (`073`) | Độ dài / độ phức tạp ➖ (không có chính sách, `AMB-BK-AUTH-08`). Chuỗi rỗng → như trên |
| Cookie `refetchToken` | Token | Thiếu · rác · nhầm access token · bị sửa · rỗng · sau đăng xuất | Hết hạn → treo `AMB-BK-AUTH-10` (không rút ngắn được trên production). Đúng |
| Header `Authorization` | Token | Thiếu · rác · chữ ký sửa · payload sửa · `alg: none` · thiếu `Bearer` · `Basic` · chỉ qua cookie · tài khoản đã xoá | — |

---

## Coverage Gaps (TC còn thiếu)

| # | Kịch bản thiếu | Vòng / Nhánh | Priority đề xuất |
|---|---|---|---|
| 1 | **Body hỏng ở `POST /api/register`**: `{"name":"x","email":` (JSON thiếu ngoặc) · `[]` (mảng thay object) · `null` · body rỗng có `Content-Type: application/json`. Kết quả: `400` hoặc `422`, **tuyệt đối không** `500`, body lỗi không chứa stack trace hay đường dẫn tệp. Viết thành **TC mới `BK_AUTH_TC_109`** (4 biến thể, cùng loại phản hồi *"bị từ chối"*). Làm tương tự cho `login` → `BK_AUTH_TC_110`, vì là endpoint khác | V2 · Error Guessing · V3 · Security | Medium |
| 2 | **Đăng ký đồng thời cùng email**: gửi 2 `POST /api/register` với cùng email **song song** (cùng lúc, không chờ nhau). Kết quả: đúng **1** response `201`, cái còn lại `422` `Email already exists.`; đăng nhập bằng email đó trả đúng 1 tài khoản. **TC mới `BK_AUTH_TC_111`**, tag `@RaceCondition`. Mặt Mobile đã có `TC_053` (bấm gửi 2 lần), nhưng cách đó phụ thuộc tốc độ bấm; ở API mới tạo được hai request thật sự đồng thời | V2 · Error Guessing (Business Rule email duy nhất) | Medium |
| 3 | **Email domain không hợp lệ ở máy chủ**: `auto@auth` (không có TLD) · `auto@-auth.test`. Kỳ vọng `422` `should be email`, ⚠️ chưa gọi thật. Không thêm vào `064` (đã đủ 6 biến thể) → **TC mới `BK_AUTH_TC_112`** (register). Login dùng chung bộ kiểm định dạng (`REQ-19`) nên thêm 1 biến thể `e` vào `077` là đủ | V2 · Validation | Low |

> Không đề xuất TC cho BOLA, dùng lại token sau đăng xuất, dùng lại refresh token: đều thuộc Danh sách loại trừ. `403` · `406/413/415` · `429` · token hết hạn đã nằm đúng chỗ ở bảng *TC treo*.

---

## TC trùng lặp — đề xuất merge

Không có. Các cặp gần nhau có mục đích khác nhau:

- `TC_069` / `TC_106` / `TC_107`: tách ngày 20-09-2026 để mỗi REQ có TC riêng chống lưng (`REQ-11` · `03` · `12`)
- `TC_082` / `TC_108`: tương tự (`REQ-24` · `26`)
- `TC_094` / `TC_096`: cùng `401`, nhưng `096` chứng minh riêng việc **không** nhận token qua cookie (`REQ-39`)
- `TC_105` với `061`/`063`/`076`/`077`/`084`/`101`: `105` chấm **hình dạng chung** của body lỗi (`REQ-48`), không chấm nội dung từng lỗi

---

## Kết luận & Khuyến nghị

1. **Gỡ phụ thuộc thứ tự** ở `TC_099`, `TC_103`, `TC_104` (mỗi TC tự dựng tiền đề bằng tài khoản riêng). Nên làm **trước** khi chạy `/generate-automation-api`, vì automation chạy song song mặc định
2. **Thêm `TC_109`–`112`** (body hỏng ở register và login · đăng ký đồng thời · domain email không hợp lệ). `109`, `110` là loại lỗi hay làm lộ stack trace trên production. Mã mới lấy nối tiếp dải chung của module; báo cáo mobile cùng ngày đề xuất tiếp từ `113`
3. **Sửa 2 chỗ ghi nhãn ở index**: ISO 25010 thiếu dải API, bảng *TC treo* thiếu `AMB-BK-AUTH-08`
4. **Chạy thật lần đầu** để gỡ 18 TC `@NeedsVerify`: phần lớn chỉ là biến thể *"chưa gọi thật"*, gọi một lượt là chốt được. Lượt sinh TC ngày 20-09-2026 ghi rõ *"không gọi thật API"*
5. Theo dõi `AMB-BK-AUTH-03` (2 TC ⚪) và F-16 (5 TC `@KnownBug` của `PATCH /api/profile`). Khi F-16 được sửa, viết thêm các TC đang treo: mass assignment qua profile, đổi email sang email người khác, thiếu `password_old`

> Muốn áp các đề xuất trên: chạy `/review-testcases docs/testcases/_book-api/auth FIX api`, duyệt danh sách TC ở checkpoint.
