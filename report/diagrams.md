# SƠ ĐỒ KIẾN TRÚC VÀ LUỒNG XỬ LÝ

**Tên dự án:** Blockchain-Based Digital Evidence Integrity
**Mã dự án:** BEI-2026
**Phiên bản:** 0.1
**Trạng thái:** Thiết kế ban đầu

---

## 1. Sơ đồ kiến trúc tổng thể

```mermaid
flowchart TD
    U["Người dùng"] --> APP["Ứng dụng Python"]

    APP --> HASH["Mô-đun SHA-256"]
    APP --> SIG["Mô-đun chữ ký số"]
    APP --> CLIENT["Blockchain Client"]

    CLIENT --> RPC["Giao tiếp RPC"]
    RPC --> HH["Hardhat Local Network"]
    HH --> SC["EvidenceRegistry.sol"]

    SC --> DB["Bản ghi chứng cứ on-chain"]
    SC --> EVENT["Sự kiện blockchain"]

    APP --> FILES["Tệp chứng cứ off-chain"]
    APP --> LOG["Nhật ký và kết quả kiểm thử"]

    DB --> CLIENT
    EVENT --> CLIENT
    CLIENT --> APP
```

**Giải thích:**

- Ứng dụng Python điều phối các thao tác xử lý chứng cứ.
- Mô-đun SHA-256 tạo mã băm để nhận diện nội dung tệp.
- Mô-đun chữ ký số hỗ trợ ký và xác minh thông điệp.
- Blockchain Client giao tiếp với mạng blockchain cục bộ.
- Smart contract quản lý bản ghi và phát sự kiện.
- Tệp chứng cứ và nhật ký được lưu ngoài blockchain.

---

## 2. Sơ đồ đăng ký chứng cứ

```mermaid
flowchart TD
    A["Bắt đầu"] --> B["Chọn tệp chứng cứ mẫu"]
    B --> C{"Tệp tồn tại và đọc được?"}

    C -- "Không" --> X["Thông báo lỗi"]
    X --> Z["Kết thúc"]

    C -- "Có" --> D["Tính mã SHA-256"]
    D --> E["Xây dựng thông điệp đăng ký"]
    E --> F["Ký thông điệp"]
    F --> G["Xác minh chữ ký"]
    G --> H{"Chữ ký hợp lệ?"}

    H -- "Không" --> Y["Từ chối đăng ký"]
    Y --> Z

    H -- "Có" --> I["Gửi giao dịch blockchain"]
    I --> J["Smart contract kiểm tra dữ liệu"]
    J --> K{"Dữ liệu hợp lệ?"}

    K -- "Không" --> L["Giao dịch thất bại"]
    K -- "Có" --> M["Lưu bản ghi chứng cứ"]
    M --> N["Phát sự kiện đăng ký"]
    N --> O["Ghi nhận kết quả"]
    L --> O
    O --> Z["Kết thúc"]
```

**Giải thích:**

Hệ thống chỉ gửi giao dịch sau khi thực hiện các bước kiểm tra cần thiết. Smart contract tiếp tục kiểm tra dữ liệu theo những quy tắc được lập trình.

Giao dịch được gửi không đồng nghĩa với việc đăng ký đã thành công. Chương trình phải kiểm tra kết quả thực thi giao dịch và trạng thái bản ghi.

---

## 3. Sơ đồ xác minh tính toàn vẹn

```mermaid
flowchart TD
    A["Bắt đầu"] --> B["Nhập ID chứng cứ và đường dẫn tệp"]
    B --> C["Truy vấn mã băm tham chiếu"]
    C --> D{"Bản ghi chứng cứ tồn tại?"}

    D -- "Không" --> X["Không tìm thấy chứng cứ"]
    D -- "Có" --> E{"Tệp hiện tại đọc được?"}

    E -- "Không" --> Y["Không thể xác minh tệp"]
    E -- "Có" --> F["Tính lại SHA-256"]

    F --> G{"Hai mã băm trùng khớp?"}
    G -- "Có" --> H["Kết quả: HASH_MATCH"]
    G -- "Không" --> I["Kết quả: HASH_MISMATCH"]

    H --> J["Ghi nhận kết quả kiểm thử"]
    I --> J
    X --> J
    Y --> J

    J --> K["Kết thúc"]
```

**Giải thích:**

- `HASH_MATCH`: mã băm hiện tại trùng với mã băm tham chiếu.
- `HASH_MISMATCH`: mã băm hiện tại khác với mã băm tham chiếu.
- Không tìm thấy bản ghi hoặc không đọc được tệp là các tình huống riêng, không được đánh đồng với kết quả mã băm không khớp.

Mã băm trùng khớp cho thấy nội dung tệp phù hợp với giá trị tham chiếu đã đăng ký; điều đó không tự chứng minh nguồn gốc hoặc tính xác thực ban đầu của chứng cứ.

---

## 4. Sơ đồ bàn giao và tiếp nhận chứng cứ

```mermaid
flowchart TD
    A["Bắt đầu bàn giao"] --> B["Xác định chứng cứ"]
    B --> C["Kiểm tra trạng thái chứng cứ"]
    C --> D{"Thao tác được phép?"}

    D -- "Không" --> X["Từ chối thao tác"]
    D -- "Có" --> E["Ghi nhận bên giao và bên nhận"]

    E --> F["Tạo sự kiện bàn giao"]
    F --> G["Bên nhận xác nhận tiếp nhận"]
    G --> H{"Xác nhận hợp lệ?"}

    H -- "Không" --> Y["Chưa hoàn tất tiếp nhận"]
    H -- "Có" --> I["Ghi nhận sự kiện tiếp nhận"]

    I --> J["Truy xuất lịch sử quản lý chứng cứ"]
    X --> K["Ghi nhận kết quả"]
    Y --> K
    J --> K
    K --> L["Kết thúc"]
```

**Giải thích:**

Chuỗi quản lý chứng cứ (Chain of Custody) ghi lại các sự kiện bàn giao và tiếp nhận theo trình tự. Mô hình thử nghiệm ghi nhận tài khoản blockchain và sự kiện liên quan; nó không tự xác minh danh tính thật của người giao hoặc người nhận.

---

## 5. Phân tách dữ liệu on-chain và off-chain

| Dữ liệu | Vị trí lưu trữ dự kiến | Mục đích |
|---|---|---|
| Tệp chứng cứ mẫu | Off-chain | Lưu nội dung cần kiểm tra |
| Mã SHA-256 | On-chain và kết quả cục bộ | Đối chiếu tính toàn vẹn |
| Mã định danh chứng cứ | On-chain | Truy xuất bản ghi |
| Thông tin đăng ký tối thiểu | On-chain | Theo dõi bản ghi |
| Sự kiện bàn giao, tiếp nhận | On-chain | Kiểm tra lịch sử |
| Khóa riêng | Lưu riêng ngoài blockchain | Ký thông điệp |
| Nhật ký thực thi | Off-chain | Theo dõi quá trình triển khai |
| Kết quả kiểm thử | Off-chain | Đánh giá các ca kiểm thử |
| Báo cáo và ảnh minh chứng | Off-chain | Hoàn thiện hồ sơ dự án |

---

## 6. Ghi chú triển khai

1. Các sơ đồ thể hiện thiết kế dự kiến, chưa phải bằng chứng rằng tất cả chức năng đã được triển khai.
2. Tên hàm, cấu trúc dữ liệu và sự kiện phải được cập nhật theo mã nguồn thực tế.
3. Không lưu khóa riêng hoặc dữ liệu chứng cứ nhạy cảm trên blockchain.
4. Chỉ sử dụng dữ liệu mẫu không nhạy cảm trong quá trình phát triển và kiểm thử.
5. Chỉ đánh dấu một chức năng hoàn thành sau khi đã có mã nguồn và kết quả kiểm thử tương ứng.

---

## 7. Trạng thái

Phiên bản: 0.1.

Trạng thái: Đang thiết kế.

Kết quả nghiệm thu sẽ được cập nhật sau khi kiểm tra tài liệu và đối chiếu với quá trình triển khai.
