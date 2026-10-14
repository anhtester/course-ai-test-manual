# AI-DRIVEN CROSS-MODULE TESTING FRAMEWORK

**Mục tiêu:**
Phân tích và kiểm thử các tính năng phức tạp đi qua **nhiều modules nối tiếp nhau**, trong đó output phụ thuộc vào **bộ kết hợp điều kiện đa chiều** (Combinatorial Testing).

## 📌 Bài Toán Giải Quyết

Khi một tính năng **KHÔNG nằm gọn trong 1 module** mà phải đi qua chuỗi modules, với mỗi module có nhiều lựa chọn — và bộ kết hợp các lựa chọn quyết định output cuối cùng (template, công thức, business rules khác nhau).

**Ví dụ thực tế:**

| Tính năng | Các chiều kết hợp (dimensions) |
|-----------|------|
| Biên bản thanh toán đối tác | Loại đối tác × Loại thanh toán × Thuế × Công nợ × Nguồn tài sản |
| Hợp đồng bảo hiểm | Loại BH × Đối tượng × Gói × Kỳ hạn × Phương thức TT |
| Đơn hàng xuất khẩu | Thị trường × Loại hàng × Vận chuyển × Thanh toán × Chứng từ |
| Quy trình phê duyệt | Loại yêu cầu × Phòng ban × Cấp × Số tiền → Flow phê duyệt khác nhau |

**Nếu mỗi chiều có 3-5 giá trị →** Tổ hợp Full Cartesian dễ dàng lên **hàng trăm bộ kết hợp**.

---

## 🚀 Quy Trình 2 Giai Đoạn

### Giai đoạn 1: Phân Tích & Sinh Ma Trận (`/generate-cross-module-test-plan`)

Workflow hỗ trợ **2 modes**:

| Mode | Khi nào dùng | Input chính |
|------|-------------|-------------|
| **DOCUMENT** (mặc định) | Có tài liệu/spec mô tả modules + business rules | File `.md`, `.doc`, Jira ticket, hoặc text mô tả |
| **BROWSER** | Muốn AI inspect DOM thực tế trên app | URL ứng dụng + credentials (nếu cần) |

**Các bước thực hiện:**

| Bước | Tên | Mô tả | Chờ User? |
|------|-----|-------|-----------|
| **0** | Kiểm tra tiền đề | Có business rules không? Thiếu → **cảnh báo NGAY** | ⚠️ Chỉ khi thiếu |
| **1** | Module Recon | DOCUMENT: extract modules từ tài liệu<br>BROWSER: mở browser khám phá từng module | ❌ |
| **2** | Data Flow & Dimension Extraction | Module A output gì → input module B; liệt kê dimensions + values + constraints | ❌ Tự động tiếp |
| **3** | Combinatorial Matrix | Sinh ma trận + **verify output coverage** | ❌ |
| **4** | Đóng gói Output | Xuất artifact + (optional) sinh data với `--with-data` | ✅ **Checkpoint DUY NHẤT** |

**Output chính:** Bảng ma trận kết hợp — sẵn sàng import Excel/Jira.

> ⚠️ **Về cột Expected Output:** Chỉ được điền khi user cung cấp business rules/công thức. Nếu không có → **để trống**, AI KHÔNG tự đoán template hay công thức.
>
> 💡 **Không có business rules thì workflow này giá trị thấp hơn hẳn** — bạn nhận được bảng chỉ có cột input, và vẫn phải ngồi điền expected bằng tay (phần tốn thời gian nhất). Bước 0 sẽ cảnh báo và đề xuất 3 hướng xử lý trước khi chạy.

### Giai đoạn 2: Sinh Test Data (`/generate-combinatorial-test-data`)

| Mode | Khi nào dùng | Output |
|------|-------------|--------|
| **GENERATE** (mặc định) | Sinh data offline (JSON/CSV/Code) | File test data có cấu trúc |
| **PIPELINE** (lựa chọn cuối) | **Bắt buộc** phải đi qua UI mới tạo được data | Data thật + IDs + screenshots |

> ⚠️ **PIPELINE là cách đắt nhất và kém ổn định nhất.** Nếu hệ thống có API / DB test / import
> Excel → seed bằng cách đó nhanh và ổn định hơn nhiều lần. Workflow sẽ hỏi bạn 3 lựa chọn này
> trước khi drive browser. Trên môi trường **dùng chung**, PIPELINE còn để lại hàng chục record
> rác — workflow bắt buộc xác nhận trước và liệt kê ID để dọn sau.

---

## 3 Chiến Lược Ma Trận

| Chiến lược | Mô tả | Khi nào dùng | Ví dụ |
|-----------|-------|-------------|-------|
| **Output-Class Coverage** (Mặc định ⭐) | Mỗi template/công thức đầu ra ≥1 bộ, + bộ biên & rủi ro cao | **Đã có business rules** — mặc định cho bài toán cross-module | 216 bộ → ~12 bộ |
| **Pairwise** | Cover 100% cặp giữa 2 dimensions bất kỳ | Bổ sung cho dimensions **không** quyết định output; hoặc fallback khi chưa có business rules | 216 bộ → ~15 bộ |
| **Full Cartesian** | Test TẤT CẢ tổ hợp hợp lệ | Hệ thống critical (tài chính, y tế), tổng ≤ 50 bộ | 216 bộ → 216 bộ |

### ⭐ RULE BẤT BIẾN — áp dụng cho mọi chiến lược

> **Mỗi giá trị Expected Output khác nhau PHẢI xuất hiện ít nhất 1 lần trong ma trận.**

**Tại sao không lấy Pairwise làm mặc định?**

Pairwise sinh ra để bắt lỗi *tương tác ngoài ý muốn* — giả định các yếu tố **độc lập về mặt spec**.
Nhưng bài toán cross-module thì ngược lại: **tổ hợp CHÍNH LÀ spec** (tổ hợp quyết định template/công thức).

→ Nếu template là hàm của `partner_type × currency × tax_type` (bộ 3 chiều), một bộ pairwise phủ
100% *cặp* vẫn **có thể bỏ sót nguyên một template** — vì phủ cặp ≠ phủ output.

Vì vậy mặc định là **Output-Class Coverage**, và pairwise chỉ dùng để *bổ sung* cho các chiều
không ảnh hưởng output.

---

## 🔗 Luồng End-to-End Hoàn Chỉnh

```
┌─────────────────────────────────────────────────────────────────┐
│                    CROSS-MODULE TESTING FLOW                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📋 Bước 0: Phân tích Requirements từng Module (tùy chọn)      │
│      Có tài liệu:  /analyze-requirement-document                │
│      Có URL app:   /generate-requirements-from-website (N lần)  │
│                          ↓                                       │
│  📊 Bước 1: Phân Tích Cross-Module & Sinh Ma Trận              │
│      Workflow: /generate-cross-module-test-plan                 │
│      Mode: DOCUMENT (mặc định) hoặc BROWSER                     │
│      Output: Data Flow Map + Ma trận kết hợp                    │
│                          ↓                                       │
│  🗃️ Bước 2: Sinh Test Data Cho Ma Trận                         │
│      Workflow: /generate-combinatorial-test-data                │
│      Mode: GENERATE (offline) hoặc PIPELINE (chạy thật)         │
│      Output: Bộ test data (offline hoặc trên hệ thống)         │
│                          ↓                                       │
│  📝 Bước 3: Sinh Test Cases Chi Tiết                            │
│      Workflow: /generate-testcases-manual-rbt (FULL RBT)        │
│      Input: Ma trận + Requirements                              │
│      Output: Test cases đầy đủ                                  │
│                          ↓                                       │
│  🤖 Bước 4: Sinh Automation Scripts                             │
│      Workflow: /generate-automation-from-testcases              │
│      Output: Scripts PASS stable                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Cấu trúc thư mục

```
plans/cross-module/
├── README.md              ← Giới thiệu + Tổng quan (bạn đang đọc file này)
└── QUICK_START.md         ← Hướng dẫn sử dụng nhanh (prompt mẫu + luồng chạy)
```

**Workflows tham chiếu (slash commands):**

```
.claude/commands/
├── generate-cross-module-test-plan.md       ← Phân tích cross-module + sinh Ma trận
└── generate-combinatorial-test-data.md      ← Sinh test data cho ma trận
```

**Skills sử dụng:**

```
.claude/skills/
├── skills-qa-automation-engineer/SKILL.md   ← Routing workflow + automation rules
├── skills-requirements-analyzer/SKILL.md    ← Phân tích requirements (DOCUMENT mode)
├── skills-test-data-generator/SKILL.md      ← Multi-Step Pipeline + Combinatorial Data
└── skills-ui-debug-agent/SKILL.md           ← Inspect DOM (BROWSER mode / PIPELINE)
```

> Cross-module **không có skill riêng** — tái sử dụng 4 skills trên để tránh phình context.

---

## 📋 Hướng dẫn nhanh

Xem file `QUICK_START.md` trong thư mục này để bắt đầu nhanh.
