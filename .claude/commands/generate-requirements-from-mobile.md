---
description: Sinh tài liệu requirements (REQ ID) cho một module từ app mobile chạy thật — Native Android, Native iOS, Flutter, Hybrid — qua Appium MCP. Ghi vào tầng mobile/ của module, chung prefix và dải REQ với web/API cùng nghiệp vụ. KHÔNG sinh test cases.
skills:
  - skills-requirements-analyzer
  - skills-mobile-debug-agent
---

# Workflow: Sinh Requirements từ App Mobile

> **BẮT BUỘC (MANDATORY SKILL):** Nạp và đọc kỹ **`skills-requirements-analyzer`** (`.claude/skills/skills-requirements-analyzer/SKILL.md`). Workflow này chạy **nhánh Mobile Recon**, dùng các mục:
>
> | Mục skill | Dùng để |
> |---|---|
> | **2 + 2.1 + 2.2** | Đánh mã REQ/AMB/RISK · nối tiếp mã · **chung prefix với web/API cùng nghiệp vụ** |
> | **3.1.2** | Phân quyền khi thiếu account — thang 3 mức bằng chứng |
> | **3.3 + 3.3.1** | Khi có kèm tài liệu (spec, mockup Figma, ticket) |
> | **3.5** (toàn bộ) | Nhận diện loại app · thu thập · 8 nhóm yêu cầu riêng mobile · Android ↔ iOS · evidence |
> | **4 + 4.3** | AMB/RISK + Cổng Tự Soát REQ (4.3.5 và 4.3.6 có đoạn riêng cho mobile) |
> | **5** | Quy mô / tách file |
> | **5.8** | Đọc tầng khám phá |
> | **6** | Cấu trúc tài liệu đầu ra |
> | **7.1 + 7.5** | Strict rules chung + riêng nhánh Mobile |
>
> Thao tác phiên Appium, nhận diện loại app, đọc thuộc tính phần tử: skill **`skills-mobile-debug-agent`** (Bước 1–3). Quy tắc nền tảng: `.claude/rules/appium_rules.md`.
>
> ❌ **KHÔNG dùng** mục 3.1 / 3.1.1 (recon web qua DOM + network trình duyệt), 7.2 (luật riêng nhánh web), 3.4 (nhánh API).

Đây là bản mobile của `/generate-requirements-from-website`: **tầng module**, đầu ra là `REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` có mã REQ để tầng test case và `/generate-traceability-matrix` neo vào.

---

## ⚠️ Ranh giới của workflow này

| Workflow này **CÓ** làm | Workflow này **KHÔNG** làm |
|---|---|
| Sinh REQ cho **một** module trên app — một nền tảng mỗi lượt (Android **hoặc** iOS) | ❌ Khám phá cả app, cấp prefix — việc của `/discover-system` (Bước 3-M) |
| Đối chiếu rule đã có ở web lên app, mở rộng cột `Nền tảng` | ❌ Mở prefix hay tài liệu riêng cho "bản app" của một module đã có |
| Khảo sát 8 nhóm yêu cầu riêng mobile (quyền · vòng đời · mất mạng…) | ❌ Suy hành vi iOS từ Android hay ngược lại |
| Nhập thử để lấy độ dài tối đa, trường bắt buộc, message lỗi | ❌ Lưu/Xoá dữ liệu thật trên môi trường dùng chung |
| | ❌ Sinh test cases · sinh code Appium (`/generate-automation-mobile`) |

---

## Các bước thực hiện

### Bước 0: Tiếp nhận đầu vào & định vị module

**0.1 — Thông tin cần có** (hỏi user thứ không suy ra được):

| Cần có | Ghi chú |
|---|---|
| Tên module | Đối chiếu danh mục để lấy **prefix đã cấp** |
| Nền tảng lượt này: Android **hoặc** iOS | User đưa cả hai → chạy lần lượt, **mỗi nền tảng một lượt khảo sát riêng** trong cùng phiên |
| File `.apk` / `.aab` / `.ipa` **hoặc** package / bundle id của app đã cài | Package/bundle id bản nội bộ lưu `.env`, không ghi vào `docs/` |
| Thiết bị | Bỏ trống → agent liệt kê bằng `select_device`. **iOS chỉ khảo sát được trên macOS** — máy Windows/Linux chỉ làm được Android, iOS phải qua server Mac/cloud |
| Appium server | **Không cần** — phiên khảo sát chạy nhúng trong Appium MCP. Chỉ hỏi khi user dùng server/cloud riêng (`remoteServerUrl`) |
| Bản build `release` / `debug` / `profile` | Ảnh hưởng tới việc có dùng được flutter driver hay không |
| Tài khoản — càng nhiều role càng tốt | Lưu `.env` |
| Được xoá dữ liệu app / cài lại không | Cần khi khảo sát màn hình lần đầu, xin quyền lần đầu |
| Có proxy (mitmproxy / Charles / HTTP Toolkit) không | Không có → không quan sát được tầng network, ghi rõ ở metadata |

**0.2 — Đọc trạng thái repo** (không mở thiết bị ở bước này):

1. `docs/requirements/README.md` — prefix của module · cột `Nền tảng` · mã kế tiếp. Chưa có file → tạo theo skill 5.7.1
2. `docs/requirements/_discovery/system_map.md` — **sơ đồ điều hướng app** (đường đi tới màn hình, deep link) · **loại app đã nhận diện** · vùng chưa xác minh
3. `docs/requirements/<module>/REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` nếu đã có — **đọc hết REQ web/API trước khi mở app**. Đây là danh sách rule cần **đối chiếu** trên app, không phải khảo sát lại từ đầu
4. Module chưa có trong danh mục → **dừng, đề nghị** `/discover-system` (mode ADD) để cấp prefix. Không tự đặt prefix ở đây

**0.3 — Tài liệu kèm theo** (mockup Figma, spec màn hình, ticket): có → lập Bản đồ phủ tài liệu theo skill **3.3.1** trước khi mở app.

Công bố ngay câu đầu: *"Sinh REQ cho module `<PREFIX>` trên **Android** — thiết bị `<tên>` · bản `<release>` · module đã có N REQ web cần đối chiếu."*

### Bước 1: Mở phiên & nhận diện loại app

```
select_device → appium_session_management(create) → appium_get_page_source → NHẬN DIỆN LOẠI APP
```

| Kết quả nhận diện (skill 3.5.1) | Đi tiếp thế nào |
|---|---|
| **Native** | Khảo sát đầy đủ Bước 2 |
| **Flutter — semantics đã bật** | Khảo sát đầy đủ; locator chỉ dùng `accessibilityId` |
| **Hybrid** | Phần native như trên; phần WebView đổi `appium_context` sang `WEBVIEW_*` rồi đọc như DOM, **bắt buộc** quay về `NATIVE_APP` sau đó |
| **Flutter — semantics CHƯA bật** (một `FlutterView` rỗng) | ⏸️ **Báo user ngay.** Chỉ khảo sát được **mức hình ảnh**: nhờ user dẫn đường, chụp ảnh, ghi luồng + text + message nhìn thấy. Cột `Nguồn` = `Quan sát ảnh — chưa đọc được phần tử`, **không** khai thuộc tính. Mở `AMB` 🔴 kèm 3 câu hỏi cho dev (`skills-mobile-debug-agent` mục Flutter). **CẤM** bấm theo toạ độ |

Ghi ngay dòng metadata `Thiết bị khảo sát` (skill 3.5.1): model · OS + phiên bản · app version (build) · bản build · locale · `automationName` · loại app.

### Bước 2: Khảo sát màn hình của module

Đi tới màn hình theo đường đi trong `system_map.md` (hoặc hỏi user). Thu thập theo bảng ánh xạ skill **3.5.2**:

| Việc | Cách làm | Bẫy |
|---|---|---|
| Khung màn hình | App bar · tab · bottom navigation · nút `⋮` | Hành động ẩn trong menu `⋮` hay bị sót |
| Ô nhập & thuộc tính | `appium_get_element_attribute`: `class` · `password` · `hint` · `enabled` · `displayed` · `bounds` | Hierarchy **không** có độ dài tối đa, bắt buộc, loại bàn phím → **nhập thử** (vượt độ dài · để trống rồi gửi · sai định dạng) và ghi kết quả vào AC |
| Thông báo lỗi | Lỗi inline · **Toast** (`//android.widget.Toast`) · Snackbar · dialog | Toast mất sau 2–3,5 giây — đọc và chụp **ngay** sau thao tác |
| Thao tác | Nút · gesture (vuốt xoá, kéo làm mới, nhấn giữ) · **nút Back hệ thống** | Gesture không có nút nào gợi ý — hỏi user hoặc thử |
| Phần tử "dùng được" | `displayed` + `enabled` + `bounds` khác `0×0` + không bị bàn phím che (skill 4.3.5) | Có node trong hierarchy ≠ người dùng bấm được |
| Phân quyền | Đăng nhập lần lượt từng role (skill 3.1.2) | Thiếu account → `❔` + `AMB` 🔴, không suy từ role khác |
| Tầng network | Chỉ khi có proxy — quan sát thụ động | Không có proxy → **không** suy validation server-side. Module có mặt web/API thì REQ server-side lấy từ nhánh đó |

**8 nhóm yêu cầu riêng mobile** (skill **3.5.3**) — xét **từng** nhóm cho màn hình của module:

| Nhóm | Thử bằng | Chỉ thử khi |
|---|---|---|
| Quyền runtime | `appium_mobile_permissions` (Android `update` + `revoke` · iOS Simulator `reset`) · đọc hộp thoại bằng `appium_alert action=get_text` | Màn hình có dùng camera / vị trí / thông báo / tệp |
| Vòng đời app | `appium_app_lifecycle action=background` rồi `activate` | Luôn — nhất là form đang nhập dở |
| Mất mạng | ⚠️ **Không có tool MCP** — Android: `adb shell svc wifi disable` + `svc data disable` · iOS / không có `adb`: nhờ user bật chế độ máy bay. Không làm được → `❔` + AMB | Màn hình có tải/gửi dữ liệu |
| Xoay màn hình | `appium_orientation action=set` | App có hỗ trợ xoay |
| Bàn phím | `appium_mobile_keyboard action=is_shown` + so vị trí phần tử khi bàn phím mở | Màn hình có ô nhập |
| Deep link | `appium_app_lifecycle action=deep_link` — chỉ link **đọc** | Module có deep link trong bản đồ |
| Push notification | Thường không tự tạo được → `❔` + `AMB`. Android: xem thông báo có sẵn bằng `appium_mobile_device_control action=open_notifications` | Module có thông báo |
| Phiên bản tối thiểu / cập nhật bắt buộc | Hỏi user | Cấp app, ghi một lần ở module đầu tiên khảo sát |

Nhóm không áp dụng → ghi **"Không áp dụng — <lý do>"**, không bỏ trống.

⚠️ **Môi trường dùng chung:** app ghi vào backend chung → chỉ mở form, nhập thử để lấy validation, **không** bấm Lưu/Xoá trên dữ liệu thật. Cần tạo bản ghi thì tên traceable `auto_<module>_<timestamp>` và dọn ngay.

**Evidence** (skill **3.5.5**): xoá thông báo / bật Không làm phiền **trước** khi chụp → `appium_screenshot` (tool tự lưu và **trả về đường dẫn** — không nhận tham số path) → **copy** file đó thành `docs/requirements/<module>/mobile/evidence/<android|ios>_<màn_hình>_<trạng_thái>[_partN].png`. Màn hình dài thì cuộn và chụp nhiều phần. **`Read` lại từng ảnh** xác nhận đúng trạng thái, nhất là ảnh toast. **Không** lưu page source vào `docs/`.

### Bước 3: Soạn REQ

Theo **mục 6** của skill, khác nhánh web ở:

- **Metadata:** `Thiết bị khảo sát` + `Tầng network` thay cho `Trình duyệt khảo sát`. Module đã có web → **giữ cả hai** dòng, thêm dòng `Nền tảng`
- **Field Spec:** cột `Loại UI` ghi class native (`EditText`, `XCUIElementTypeSecureTextField`…); ràng buộc nào có được nhờ **nhập thử** thì ghi rõ trong AC
- **Mục mới — Yêu cầu riêng của mobile:** 8 nhóm Bước 2, mỗi nhóm có REQ hoặc ghi "Không áp dụng — <lý do>"
- **Chuỗi do hệ điều hành sinh** (hộp thoại quyền, date picker hệ thống, bàn phím) — ghi tham khảo kèm OS + phiên bản + hãng máy, **cấm** dùng làm assertion (skill 4.3.6)

**Nối với REQ đã có (skill 2.2):**

| Tình huống | Xử lý |
|---|---|
| Rule đã có ở web/API, kiểm trên app **khớp** | **Không** cấp mã mới — REQ cũ đang ở `web/` (hoặc `api/`) thì **chuyển dòng lên index**, cột `Nền tảng` thêm `Android`; đã ở index thì chỉ sửa cột. Nhật ký `🟢 Thêm` · *"Mở rộng nền tảng: + Android"* · `TC cần xử lý` = `viết mới cho Android` |
| Rule có nhưng app chạy **khác** (message khác, độ dài khác, không chặn) | REQ riêng ở `mobile/`, `Nền tảng` = `Android` + `AMB-<MODULE>-XX` *"cố ý hay lỗi?"* — mặc định nghi là lỗi |
| Rule chỉ có trên app | REQ mới nối tiếp mã, ghi ở `mobile/`, `Nền tảng` = `Android` |
| Module cũ chưa có tầng nền tảng (tài liệu một file) | Chuyển một lần theo skill mục 5.3: REQ chỉ áp web sang `web/requirements_<module>_web.md`, evidence sang `web/evidence/`, mã giữ nguyên, ghi Nhật ký — rồi mới ghi phần mobile |
| Lượt này là iOS, module đã có REQ `Android` | Kiểm từng REQ trên iOS: khớp → `Android · iOS` (vẫn ở `mobile/`); khác → REQ riêng. **Không** tự ghi `iOS` khi chưa kiểm |

### Bước 4: Cổng Tự Soát REQ (skill 4.3) — và 4 điểm riêng của mobile

Chạy đủ 9 câu của skill 4.3, **cộng**:

- [ ] Mọi phần tử khai "dùng được" đã đọc `displayed` + `enabled` + `bounds`, ghi thiết bị + hướng màn hình vào AC
- [ ] Không AC nào assert chuỗi do hệ điều hành sinh
- [ ] Mọi ràng buộc không có trong hierarchy (độ dài, bắt buộc) đều đến từ **nhập thử**, không suy từ nhãn hay `hint`
- [ ] Không REQ nào ghi nền tảng chưa khảo sát trong lượt này hoặc lượt trước

### Bước 5: Ghi file & cập nhật danh mục

1. **Đếm REQ của file mobile** → bảng ngưỡng skill 5.1. Vượt ngưỡng thì chia tiếp thành `mobile/stories/` theo **Story nghiệp vụ**; **không** tách Android và iOS thành hai thư mục
2. **Ghi** `docs/requirements/<module>/mobile/requirements_<module>_mobile.md` (REQ chỉ áp app · Field Spec · Validation · Yêu cầu riêng mobile · `Thiết bị khảo sát` · Danh mục Evidence) và cập nhật **index** `REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md` (REQ chuyển lên dùng chung · dòng `Nền tảng` · `## Bản đồ tài liệu` thêm dòng Mobile · AMB/RISK · Nhật ký). Module chưa có index → tạo index trước (skill 5.3)
3. **Danh mục** `docs/requirements/README.md`: cột `Nền tảng` cập nhật nền tảng vừa khảo sát (`Android ✅`) · `REQ đã dùng` · `Mã kế tiếp` · `AMB treo` · `Cập nhật`. `Trạng thái recon` tổng chỉ ✅ khi **mọi** nền tảng module có đều ✅
4. **Đối chiếu danh mục** với thư mục thực tế — đúng khối "Đối chiếu danh mục" của `/generate-requirements-from-website`
5. **`system_map.md`:** 1 dòng Nhật ký khám phá nếu lệch so với bản đồ (đường đi đổi, màn hình mới, loại app khác nhận diện ban đầu)
6. **Đóng phiên** `appium_session_management` (delete); dọn bản ghi test nếu có tạo

### Checklist bàn giao

- [ ] Loại app đã nhận diện và ghi ở metadata; Flutter chưa bật semantics thì đã báo việc cho dev
- [ ] Prefix lấy từ danh mục; REQ app nối tiếp **dải mã chung** của module, nằm ở `mobile/` hoặc index — không ở chỗ nào khác
- [ ] Rule trùng web đã **mở rộng nền tảng** (REQ chuyển lên index), không sinh REQ song song
- [ ] Index có dòng Mobile trong `## Bản đồ tài liệu`; ảnh nằm ở `mobile/evidence/`
- [ ] Đủ 8 nhóm yêu cầu riêng mobile — có REQ hoặc có lý do không áp dụng
- [ ] Mỗi REQ `Nguồn` = kiểm chứng thực tế truy được về ảnh hoặc số liệu thuộc tính trong AC
- [ ] Mọi ảnh đã `Read` lại; đã xoá thông báo trước khi chụp; không page source trong `docs/`
- [ ] Không credentials, package id nội bộ, dữ liệu cá nhân trong `docs/`
- [ ] Danh mục, `system_map.md`, Nhật ký thay đổi của module khớp nhau

**Báo cáo cho user:** nền tảng + thiết bị đã khảo sát · số REQ mới · số REQ web được mở rộng sang app · số REQ khác biệt giữa nền tảng (kèm AMB) · nhóm mobile nào không khảo sát được và vì sao · **lệnh kế tiếp**:

```
/generate-requirements-from-mobile <module>   ← nền tảng còn lại (nếu có)
/generate-testcases-manual-rbt <module>       ← sinh TC, gắn tag @Android / @iOS
```

---

## Mối quan hệ với workflows khác

```
/discover-system (Bước 3-M) ──→ /generate-requirements-from-mobile ──→ /generate-testcases-manual-rbt ──→ /generate-automation-mobile
   system_map.md (cây app)         REQUIREMENTS_<TÊN_MODULE>_SUMMARY.md                TEST_CASES_<TÊN_MODULE>_SUMMARY.md               testId = TC ID
```

| Tình huống | Workflow |
|---|---|
| Chưa biết app có những màn hình/module nào | `/discover-system` — Bước 3-M |
| Cùng module, mặt web | `/generate-requirements-from-website` |
| Cùng module, mặt API | `/generate-requirements-from-api` |
| Ticket sửa hành vi trên app | `/update-requirements-from-ticket` |
| Sinh TC | `/generate-testcases-manual-rbt` · `/generate-testcases-from-requirements` |
| Sinh script Appium từ TC | `/generate-automation-mobile` (mode TC) — hoặc qua `/generate-automation-from-testcases` |
