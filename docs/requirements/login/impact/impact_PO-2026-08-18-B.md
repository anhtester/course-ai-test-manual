# Impact Report — `PO-2026-08-18-B` · Module `LOGIN`

> **Nguồn thay đổi:** PO trả lời **13 ambiguity còn lại** và cấp **tài khoản đủ 3 vai trò**, trong phiên làm việc 18-08-2026. Không có file ticket — mã `PO-2026-08-18-B` là đợt quyết định thứ **hai** trong ngày (đợt A: [impact_PO-2026-08-18.md](impact_PO-2026-08-18.md)).
>
> Tài liệu module: [../REQUIREMENTS_LOGIN_SUMMARY.md](../REQUIREMENTS_LOGIN_SUMMARY.md) · Danh mục: [../../README.md](../../README.md)

## Quyết định gốc (nguyên văn)

| AMB | Quyết định |
|---|---|
| `AMB-LOGIN-01` | Hệ thống có 3 quyền: Admin, Project Manager, Customer — **kèm tài khoản cả 3** |
| `AMB-LOGIN-03` | bỏ qua |
| `AMB-LOGIN-05` | thiếu validate required field |
| `AMB-LOGIN-06`, `AMB-LOGIN-07` | bỏ qua, không cần ghi test cases |
| `AMB-LOGIN-08` | tạm chấp nhận 419 Page Expired |
| `AMB-LOGIN-09` | không quy định |
| `AMB-LOGIN-10` | này phải giữ lại email mới đúng, hệ thống lỗi |
| `AMB-LOGIN-12` | bỏ qua |
| `AMB-LOGIN-13` | Phiên đăng nhập sống 1 giờ |
| `AMB-LOGIN-16` | dùng được |
| `AMB-LOGIN-17` | tạm chấp nhận 307 |
| `AMB-LOGIN-11` | Checkbox Remember me mang `value="estimate"` không ý nghĩa gì cả |

---

## Tóm tắt

| Nhóm | Số lượng | REQ |
|---|---|---|
| 🟢 Thêm mới | 2 | `REQ-LOGIN-42` (phiên 1 giờ) · `REQ-LOGIN-43` (Customer không vào được `/admin`) |
| 🟡 Sửa | 6 | `REQ-LOGIN-16`, `25`, `28`, `29`, `34`, `35` |
| 🔴 Bỏ | 0 | — |
| ⏸️ Trùng, không tác động | — | `AMB-LOGIN-08`, `09`, `11`, `12`, `17` trùng Giả định tạm → không REQ nào phải sửa |

**Tổng REQ module:** 41 → **43** · **Phạm vi viết TC: 39 REQ** (4 REQ ngoài phạm vi: `27`, `34`, `35`, `40`).

**Ambiguity:** 13 → còn **1** (`AMB-LOGIN-19`). Đã xử lý **18/19**.

---

## 🐞 Hai REQ nay ghi kỳ vọng mà hệ thống CHƯA ĐẠT

Đây là phần quan trọng nhất của đợt này. PO xác nhận hai hành vi hiện tại là **lỗi**, nên REQ được viết lại theo **hành vi đúng**, không theo hiện trạng.

| REQ | Hành vi đúng (theo PO) | Hiện trạng hệ thống | AMB |
|---|---|---|---|
| `REQ-LOGIN-16` | Máy chủ **phải** trả lại email đã nhập sau khi đăng nhập lỗi | `input#email` không có thuộc tính `value` → mất email | `AMB-LOGIN-10` ✅ |
| `REQ-LOGIN-25` | Quên mật khẩu bỏ trống email **phải** báo **trường bắt buộc** | Trả `Email not found` — sai bản chất lỗi | `AMB-LOGIN-05` ✅ |

> ⚠️ **TC viết theo hai REQ này SẼ FAIL trên bản hiện tại. Đó là kết quả ĐÚNG.**
> Tuyệt đối **không** sửa TC cho khớp hiện trạng — phải mở bug. Đây chính là tình huống mà `/create-bug-report` sinh ra để xử lý.
>
> `AMB-LOGIN-10` là trường hợp **kết luận khác Giả định tạm** — giả định cũ là "ghi nhận hiện trạng", nay đảo thành "hiện trạng là lỗi". Module chưa có TC nào nên không TC cũ nào phải sửa.

---

## 🔑 Nút thắt cấp hệ thống đã được gỡ

`AMB-LOGIN-01` là ambiguity 🔴 chặn **ma trận phân quyền của mọi module** từ đầu dự án. Nay đã có tài khoản đủ 3 vai trò.

**Kết quả kiểm chứng thật ngày 18-08-2026:**

| Vai trò | Điểm đăng nhập | Định danh | Ghi nhận |
|---|---|---|---|
| `Admin` | `/admin/authentication` | `user-id-2` | Menu trái **14** mục |
| `Project Manager` | `/admin/authentication` | `user-id-3` | Menu trái **9** mục — thiếu Subscriptions · Expenses · Estimate Request · Knowledge Base · Reports |
| `Customer` | **`/login`** | — | **Hệ thống đăng nhập tách biệt**; đăng nhập xong dừng ở `/` |

**Ma trận phân quyền `LOGIN`: 28 ô = 26 đã kiểm chứng · 2 không áp dụng · 0 chưa rõ** — ma trận đầu tiên và duy nhất trong dự án đạt 100%.

**Phát hiện đáng chú ý — `REQ-LOGIN-43`:** tài khoản `Customer` **hợp lệ** bị từ chối ở `/admin/authentication` với đúng thông báo `Invalid email or password`. Đã loại trừ khả năng sai mật khẩu (cùng tài khoản đăng nhập được ở `/login`), và kiểm cả trường hợp đang có phiên cổng khách hàng hợp lệ mà mở `/admin/clients` — vẫn bị đá về trang đăng nhập. Thông báo **không lộ** việc email đó có tài khoản ở hệ thống khác.

> 📌 **Đừng mô hình hoá `Customer` như một cấp quyền thấp của `/admin`.** Nó thuộc hệ thống đăng nhập khác; với khu `/admin` nó hành xử **y hệt khách chưa đăng nhập**.

---

## Test case cần xử lý

| TC ID | REQ liên quan | Hành động | Lý do |
|---|---|---|---|
| — | `REQ-LOGIN-42` | ➕ Viết mới, gắn `assumption-based` | Phiên 1 giờ. **TC chạy 1 giờ** — tách khỏi bộ smoke. Chưa rõ tính theo idle hay tổng thời gian (`AMB-LOGIN-19`) |
| — | `REQ-LOGIN-43` | ➕ Viết mới | Customer không vào được `/admin` |
| — | `REQ-LOGIN-16` | ➕ Viết mới + 🐞 **mở bug** | TC sẽ FAIL — hệ thống không giữ lại email |
| — | `REQ-LOGIN-25` | ➕ Viết mới + 🐞 **mở bug** | TC sẽ FAIL — báo sai loại lỗi |
| — | `REQ-LOGIN-28` | ➕ Viết mới theo **hiện trạng** | `AMB-LOGIN-03` ⏭️ — chấp nhận HTTP 500, **không** kỳ vọng trang thân thiện |
| — | `REQ-LOGIN-29` | ➕ Viết mới, **chỉ nhánh desktop** | Nhánh mobile chưa recon — xem cảnh báo bên dưới |
| — | `REQ-LOGIN-34`, `35` | 🚫 **Không viết** | Ra ngoài phạm vi — `AMB-LOGIN-06`, `AMB-LOGIN-07` ⏭️ |
| — | Trường mật khẩu | 🚫 **Không viết TC biên** | `AMB-LOGIN-09` ✅ — không có chính sách mật khẩu nào được quy định |

> ✅ **Không có TC nào phải sửa hay archive** — module `LOGIN` vẫn chưa có test case nào.

---

## Ambiguity

| Mã | Chuyển trạng thái | Ghi chú |
|---|---|---|
| `AMB-LOGIN-01` | ❓ → ✅ | 3 vai trò + **được cấp tài khoản đủ 3** |
| `AMB-LOGIN-18` | ❓ → ✅ | Tách ra từ `AMB-LOGIN-01` rồi đóng ngay trong ngày nhờ có tài khoản |
| `AMB-LOGIN-05` | ❓ → ✅ | Thiếu validate — là lỗi. Trùng Giả định tạm |
| `AMB-LOGIN-08` | ❓ → ✅ | Chấp nhận `419 Page Expired!`; **không** assert mã HTTP |
| `AMB-LOGIN-09` | ❓ → ✅ | Không có chính sách mật khẩu → không viết TC biên |
| `AMB-LOGIN-10` | ❓ → ✅ | ⚠️ **Khác Giả định tạm** — hiện trạng là lỗi |
| `AMB-LOGIN-11` | ❓ → ✅ | `value="estimate"` vô nghĩa. Trùng Giả định tạm |
| `AMB-LOGIN-13` | ❓ → ✅ | Phiên sống 1 giờ → `REQ-LOGIN-42` |
| `AMB-LOGIN-16` | ❓ → ✅ | Lối đăng xuất mobile dùng được |
| `AMB-LOGIN-17` | ❓ → ✅ | Chấp nhận `307` |
| `AMB-LOGIN-03`, `06`, `07`, `12` | ❓ → ⏭️ | Bỏ qua |
| `AMB-LOGIN-19` | (mới) ❓ 🟡 | Phiên 1 giờ tính theo **không hoạt động** hay **tổng thời gian**? |

## Rủi ro

| Mã | Chuyển trạng thái | Ghi chú |
|---|---|---|
| `RISK-LOGIN-01` | Bổ sung | Thêm dữ kiện: **không có chính sách mật khẩu** (`AMB-LOGIN-09`) — cộng với không khoá tài khoản, không CAPTCHA, không giới hạn tần suất |
| `RISK-LOGIN-02` | → ⚠️ **Đã chấp nhận** | `AMB-LOGIN-07` ⏭️ — cookie không `HttpOnly` sẽ không được kiểm thử |
| `RISK-LOGIN-05` | → ⚠️ **Chấp nhận hoàn toàn** | `AMB-LOGIN-03` ⏭️ — HTTP 500 với mã khoá sai nay là hành vi được chấp nhận |

---

## Cảnh báo & việc còn lại

- 🐞 **Mở 2 bug report** cho `REQ-LOGIN-16` và `REQ-LOGIN-25` — chạy `/create-bug-report`. Không làm thì TC đỏ sẽ bị hiểu nhầm là TC sai.
- 🚧 **Nhánh mobile của `REQ-LOGIN-29` chưa có số liệu DOM nào.** PO xác nhận lối đăng xuất mobile "dùng được", nhưng chưa có lượt recon nào ở viewport mobile. Muốn viết TC mobile thì phải recon trước — **không** viết TC dựa trên lời xác nhận suông.
- 🔑 **`CUST` và `PRJ` cần chạy lại phần ma trận phân quyền.** Hai module này recon xong **trước khi** có tài khoản `Project Manager`, nên còn **24** và **28** ô `❔`. Nay đã gỡ được nút thắt, nên cập nhật lại (`AMB-CUST-01` của `CUST`, `AMB-PRJ-01` của `PRJ`).
- ⚠️ **Khu Setup vẫn chưa vào được.** Tài khoản `Project Manager` **cũng** bị `access_denied` — vấn đề master data (Taxes · Payment Modes · Departments…) chưa được gỡ, cần account quyền cao hơn.
- ⏱️ **`REQ-LOGIN-42` chạy 1 giờ** — không xếp vào bộ smoke, và cần chốt `AMB-LOGIN-19` để biết TC phải để yên hay phải thao tác liên tục.

---

## Bước kế tiếp

Module `LOGIN` **chưa có test case nào** → **không** chạy `/update-testcases-from-impact`. Chạy thẳng:

```
/generate-testcases-manual-rbt docs/requirements/login/REQUIREMENTS_LOGIN_SUMMARY.md
```

Bỏ qua `REQ-LOGIN-27`, `34`, `35`, `40` (ngoài phạm vi). Gắn `assumption-based` cho TC của `REQ-LOGIN-30` và `REQ-LOGIN-42`.
