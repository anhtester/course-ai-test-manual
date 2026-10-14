# Báo Cáo Review Test Cases — `BK · AUTH` · Mobile (Android)

## Tổng quan

- **Nguồn:** [TEST_CASES_AUTH_SUMMARY.md](../TEST_CASES_AUTH_SUMMARY.md) → [mobile/parts/part_01_mobile_dang_nhap.md](../mobile/parts/part_01_mobile_dang_nhap.md) · [mobile/parts/part_02_mobile_dang_ky.md](../mobile/parts/part_02_mobile_dang_ky.md) · requirements [mobile/requirements_auth_mobile.md](../../../../requirements/_book-api/auth/mobile/requirements_auth_mobile.md) + REQ dùng chung ở [REQUIREMENTS_AUTH_SUMMARY.md](../../../../requirements/_book-api/auth/REQUIREMENTS_AUTH_SUMMARY.md)
- **Mode:** REVIEW — chỉ báo cáo, không sửa file TC nào
- **Ngày review:** 24-09-2026 · mốc git bộ TC lúc review: `2763dfd`
- **Số TC review:** 58 (`BK_AUTH_TC_001` → `058`, không có TC `@Deprecated`) · 95 biến thể · 17 mục bảng kiểm — đếm lại khớp với index
- **Kết quả:** 🟢 58 tốt | 🟡 0 cần sửa | 🔴 0 nên viết lại
- **Điểm trung bình:** 11,97/12 — 56 TC đạt 12/12, 2 TC bị trừ 1 điểm
- **Loại trừ theo requirements:** iOS (chưa khảo sát) · màn hình `Profile` · `Settings` của menu avatar (requirements Android mới phủ Sign in · Sign up · Logout) · lỗ hổng phía máy chủ như token còn sống sau đăng xuất (F-17, F-23 — kiểm ở TC API)
- **Đối chiếu kết quả chạy:** `docs/executions/` chưa có lần chạy nào của `_book-api`. Chưa có `@NeedsVerify` nào được gỡ nhờ kết quả chạy

> **Kết luận nhanh:** Bộ mobile viết tốt nhất trong ba bộ: từng bước là thao tác người dùng thật (vuốt, xoay máy, nút Back hệ thống, tắt mạng); phần cần Appium Inspector / `adb` đã tách xuống `🔧`; các TC validation dùng mẹo *"để trống một ô khác"* để không tạo tài khoản rác trên production. Có **2 TC phụ thuộc thứ tự chạy**, **1 ghi chú kỹ thuật dựa vào endpoint đang rò rỉ dữ liệu người dùng**, và **2 dòng `⏭️` chưa có người duyệt**.

---

## Chi tiết từng TC

Thang điểm: C1 Rõ ràng · C2 Kết quả đo được · C3 Độc lập · C4 Dữ liệu test · C5 Truy vết · C6 Đúng trọng tâm.

### TC bị trừ điểm

| TC ID | Điểm | Xếp loại | Vấn đề chính | Đề xuất sửa |
|---|---|---|---|---|
| BK_AUTH_TC_004 | 11/12 | 🟢 | C3: Pre-Condition *"`TK-A` **vừa đăng ký** (trong cùng lượt chạy) và **chưa đăng nhập lần nào**"*. `TK-A` dùng chung cho cả Part 01. Tiền đề này chỉ đúng khi chạy đúng thứ tự của *Bộ chạy đề xuất* (`029` → … → `004`, trước mọi TC khác đăng nhập `TK-A`). Chạy lại riêng `004`, hoặc chạy song song với `013`/`017`/`024`, thì `TK-A` đã từng đăng nhập, và `REQ-03` (tài khoản **vừa** đăng ký đăng nhập được ngay) không còn được kiểm đúng nghĩa | Dùng tài khoản riêng: *"Tài khoản `auto_auth_<T+19>_new@auto.test` vừa tạo bằng `POST /api/register` ngay trước bước 1, chưa đăng nhập lần nào"*. Giữ `TK-A` cho các TC khác. Thêm độ lệch `19` vào bảng *Dọn dữ liệu* |
| BK_AUTH_TC_031 | 11/12 | 🟢 | C3: Pre-Condition *"Vừa chạy xong `TC_030`"*. Chạy riêng thì không có tài khoản `…_full`, TC FAIL vì thiếu tiền đề | Tự dựng tiền đề: *"Tài khoản `auto_auth_<T+1>_full@auto.test` đã đăng ký với đủ trường theo Test Data của `TC_030` — bằng `TC_030` hoặc `POST /api/register`"*. Cùng cách index đang ghi cho `TK-A` |

### TC đạt 12/12 (56 TC)

| Dải TC ID | Điểm | Xếp loại |
|---|---|---|
| BK_AUTH_TC_001 → 003 · 005 → 030 · 032 → 058 | 12/12 | 🟢 |

Vài điểm tốt đáng giữ làm mẫu:

- `TC_013`, `TC_014`: chấm cả thứ **không** được xuất hiện (*"không có câu `Invalid password, please try again.`"*). Nhờ vậy phân biệt được thông báo của app với thông báo gốc của API
- `TC_025`: ghi rõ *"TC **không** chấm FAIL vì thiếu thông báo"* (`AMB-BK-AUTH-16`), nhưng vẫn có kỳ vọng cứng (không vào Dashboard, dữ liệu còn nguyên, bật mạng lại thì đăng nhập được)
- `TC_037`, `TC_038`, `TC_046`: cố ý để trống một ô **khác** để form không gửi lên máy chủ. Kiểm được validation mà không tạo tài khoản trên production
- `TC_048`: tách rõ *"khoá"* (không mở danh sách, không hiện bàn phím) khỏi *"trống"*, đúng mục 6 của Quy Tắc Đối Chiếu Evidence

---

## Lỗi ghi nhãn / rủi ro trong tài liệu (không thuộc rubric)

| # | Chỗ | Vấn đề | Đề xuất sửa |
|---|---|---|---|
| 1 | `TC_053` · dòng `🔧` | Đếm số tài khoản bằng `GET /api/user`. Đây chính là endpoint của **F-01 🔴**: công khai, trả email/phone/address của **toàn bộ** người dùng (`AMB-BK-02` 🔴 chưa chốt). Chạy bước này là tải về dữ liệu cá nhân của người khác trên production, và nếu lưu vào evidence hay log thì dữ liệu đó bị commit | Bỏ `GET /api/user`. Bước 5 của TC (đăng ký lại cùng email → `Email already exists.`) đã chứng minh tài khoản tồn tại. Muốn chắc *"đúng 1"* thì dùng `POST /api/login` + `GET /api/me` của chính email đó — chỉ đọc dữ liệu của mình |
| 2 | Index · Bảng 4 vòng · `4 · Compatibility` | `⏭️` ghi *"cần QA lead xác nhận danh sách máy"*. Chưa có ai quyết định | Lấy tên QA lead duyệt, hoặc tạm chấm `🔴` kèm *"chờ duyệt"* |
| 3 | Index · Bảng 4 vòng · `4 · Accessibility` | `⏭️` ghi *"đề xuất bỏ ở lượt này — **cần QA lead / PO xác nhận**"*. Chưa có ai quyết định, trong khi đã biết avatar và nút mắt **không có nhãn** (`RISK-BK-AUTH-07`) | Như #2. Nếu không được duyệt bỏ, tối thiểu thêm 1 TC mức cơ bản: bật TalkBack, chạm lần lượt avatar, ô Email, ô Password, nút mắt, `Login account`, ghi lại TalkBack đọc gì. Chưa cần công cụ riêng |
| 4 | Index · Bảng 4 vòng · `2 · Save / Edit / Delete` | Chấm `➖` với lý do *"My Profile · Setting account **chưa khảo sát**"*. `➖` nghĩa là *không có thứ đó để kiểm*; ở đây thứ đó **có** (menu avatar có `Profile`, `Settings` — `TC_005`), chỉ là requirements chưa phủ | Đổi lý do thành *"Ngoài phạm vi lượt này — requirements Android chưa phủ Profile/Settings (`docs/requirements/_book-api/README.md`: Android 🟨). Rà lại khi `/generate-requirements-from-mobile auth` lượt 2"* |

---

## Đối soát loại kiểm thử (4 vòng) — phần Mobile

Chấm độc lập, đối chiếu với Bảng 4 vòng của index. Chỉ ghi chú những chỗ **khác** với index.

| Vòng | Nhánh | Trạng thái | Ghi chú |
|---|---|---|---|
| 1 | UI cơ bản | ✅ | `001`, `026`: 2 TC · 14 mục bảng kiểm. Nhãn nguyên văn (kể cả `Infomation` sai chính tả), thứ tự, `*`, mắt nhắm, trạng thái khoá |
| 1 | Open form | ✅ | `002` (5 tab), `003`, `027`, `028`. Đóng bằng Back: `018`, `051` |
| 1 | Display | 🟡 Nông | Có Welcome, chữ cái avatar, menu cắt `…`, vòng xoay khi đăng xuất (`006`). **Thiếu trạng thái đang xử lý khi bấm `Login account` / `Register`** (Gap #2) |
| 1 | Input valid · Save · Verify data | ✅ | `029` (tối thiểu), `030` (đủ trường), `031` (đối chiếu sau đăng nhập) |
| 2 | UI Behavior | ✅ | `011`, `012`, `016`, `044`, `045`, `047` |
| 2 | Required | ✅ | 8 TC, từng ô + tất cả, cả 2 màn hình |
| 2 | Validation | ✅ | 9 TC · 32 biến thể. Bảng 15 loại field ở index đúng; các mục `➖` đều có lý do (không có chính sách mật khẩu, không có quy tắc định dạng Phone) |
| 2 | EP · BVA | ✅ | BVA Name `1 · 249 · 250 · 251 · 300` |
| 2 | Business Rule · Decision Table | ✅ | Bảng quyết định Sign in R0–R4, mỗi rule có TC |
| 2 | State Transition | ➖ | Đồng ý: phiên chỉ có 2 trạng thái |
| 2 | Dependency | ✅ | Division → Ward → Address, đổi / xoá nguồn |
| 2 | Use Case | ✅ | `054` |
| 2 | Save / Edit / Delete | ➖ → nhãn sai | Xem lỗi ghi nhãn #4 |
| 2 | Error Guessing | 🟡 Nông | Có bấm 2 lần, rời form sau lỗi, thất bại giữ dữ liệu. **Thiếu mất mạng khi đăng ký** (Gap #1) |
| 3 | Permission | ✅ | Ma trận chưa đăng nhập / đã đăng nhập đủ 4/4 ô. Theo vai trò → treo `AMB-BK-01` 🔴 |
| 3 | Security | ✅ | Phiên sau đăng xuất (`021`), chuỗi tấn công ở 3 ô (`022`, `023`, `055`), lộ email đã đăng ký (`014`) |
| 3 | API · Database · Integration · Logging | ✅ / ➖ | API có bộ TC riêng (xem báo cáo API). Database ➖ theo năng lực QA. Integration, Logging ➖ đúng |
| 4 | Compatibility | ⏭️ chưa duyệt | Lỗi ghi nhãn #2 |
| 4 | Responsive | ✅ | Xoay ngang (`057`), bàn phím không che ô (`058`), chuỗi dài bị cắt `…` (`005`) |
| 4 | Accessibility | ⏭️ chưa duyệt | Lỗi ghi nhãn #3 |
| 4 | Performance · Regression | ➖ | Đúng |
| 4 | E2E | ✅ / ➖ | Trong module `054` ✅. Xuyên module ➖ vì chưa có REQ Android của module khác |

---

## Đối soát bảng 15 loại field

Đồng ý với bảng *Đối soát Validation theo bảng 15 loại field* ở index. Không có mục nào index chấm `✅` mà thiếu TC thật, và các mục `➖`/`⏭️` đều có lý do dẫn về AMB hoặc ASM:

| Field | Loại | Kết quả index | Nhận xét |
|---|---|---|---|
| Email (Sign in) | Email | 8/9, max length ➖ | Đúng |
| Email (Sign up) | Email | 7/9, 2 ➖ | Đúng. *Ký tự đặc biệt trước `@`* chỉ có ở Sign in (`022-b`), index ghi *"cùng bộ kiểm định dạng của app"*. Chấp nhận được, nhưng đó là giả định chưa kiểm |
| Password · Confirmation | Password | 2/7 + 3/3 | Đúng — không có chính sách mật khẩu (`ASM-BK-AUTH-05`) |
| Name | Text | 7/8, khoảng trắng đầu/cuối ➖ | Đúng |
| Phone | Phone | 2 mục áp dụng | Đúng — chờ `AMB-BK-AUTH-15` |
| Division · Ward | Dropdown | 4/4 | Đúng |
| Address | Textarea | 1 ✅, 3 ⏭️ | `⏭️` có điều kiện rà lại (*"khi PO chốt giới hạn"*) nhưng thiếu **người quyết**. Ghi thêm tên người duyệt như lỗi #2, #3 |

---

## Coverage Gaps (TC còn thiếu)

| # | Kịch bản thiếu | Vòng / Nhánh | Priority đề xuất |
|---|---|---|---|
| 1 | **Mất mạng khi đăng ký**: điền đủ Sign up → tắt Wi-Fi + dữ liệu → bấm `Register` → đợi 5 giây → bật mạng → bấm `Register` lần nữa. Kết quả: lần đầu không chuyển màn hình, dữ liệu form còn nguyên; lần hai **hoặc** `Register successfully.` **hoặc** `Email already exists.` (nếu request đầu đã tới máy chủ), ghi lại cái nào xảy ra. FAIL nếu app treo, đóng đột ngột, hoặc mất dữ liệu form. **TC mới `BK_AUTH_TC_113`** (API đề xuất `109`–`112` cùng ngày), cùng mẫu với `TC_025`, tag `@Network`. Đây là tình huống bắt buộc trong `appium_rules.md` §10 | V2 · Error Guessing · V4 (đặc thù mobile) | Medium |
| 2 | **Trạng thái đang xử lý khi gửi form**: mạng chậm (bật giới hạn băng thông của emulator) → bấm `Login account` → quan sát nút có hiện vòng xoay / bị khoá không, bấm thêm lần nữa trong lúc chờ có gửi request thứ hai không. Có thể thêm thành bước ở `TC_019` (đang có `@NeedsVerify`) thay vì TC mới | V1 · Display | Low |

> Không đề xuất TC cho iOS, Profile/Settings, token còn sống sau đăng xuất: đều thuộc Danh sách loại trừ.

---

## TC trùng lặp — đề xuất merge

Không có. Các cặp gần nhau có mục đích khác nhau:

- `TC_007` / `008` / `009` và `TC_032` → `035` / `036`: từng ô riêng + tất cả cùng lúc, đúng yêu cầu nhánh `Required`
- `TC_044` / `TC_045`: hai ô mật khẩu khác nhau — CẤM gộp vì khác trường
- `TC_013` / `TC_015-a` / `TC_016`: cùng thao tác sai mật khẩu, nhưng chấm 3 REQ khác nhau (từ chối · giữ dữ liệu · thông báo tự đóng)
- `TC_029` / `TC_054`: `054` là chuỗi vòng đời, `029` là smoke

---

## Kết luận & Khuyến nghị

1. **Bỏ `GET /api/user` khỏi `🔧` của `TC_053`** (lỗi #1). Việc này nhỏ nhưng nên sửa trước lần chạy đầu, vì nó tải dữ liệu cá nhân của người khác
2. **Gỡ phụ thuộc thứ tự** ở `TC_004` và `TC_031` (tài khoản riêng dựng bằng API). Nên làm trước khi chạy `/generate-automation-mobile`, vì automation chạy song song mặc định
3. **Lấy chữ ký QA lead / PO** cho 3 dòng `⏭️` (Compatibility · Accessibility · Address), và sửa lý do dòng `Save / Edit / Delete`
4. **Thêm `TC_113`** (mất mạng khi đăng ký)
5. **Recon bổ sung** theo bảng *Vùng chưa có evidence* của index để gỡ 25 TC `@NeedsVerify`. Phần lớn chỉ cần 1 ảnh cho mỗi trạng thái

> Muốn áp các đề xuất trên: chạy `/review-testcases docs/testcases/_book-api/auth FIX mobile`, duyệt danh sách TC ở checkpoint.
