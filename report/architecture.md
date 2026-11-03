THIẾT KẾ KIẾN TRÚC HỆ THỐNG

Tên dự án: Blockchain-Based Digital Evidence Integrity

Tên tiếng Việt: Hệ thống đảm bảo tính toàn vẹn của chứng cứ số dựa trên Blockchain

Mã dự án: BEI-2026

Phiên bản tài liệu: 0.1

1. MỤC ĐÍCH

Tài liệu mô tả kiến trúc tổng thể, các thành phần chức năng, luồng xử lý và mô hình dữ liệu của hệ thống đảm bảo tính toàn vẹn chứng cứ số dựa trên Blockchain.

Tài liệu được sử dụng làm cơ sở cho việc triển khai mã nguồn, kiểm thử, ghi nhận kết quả thực nghiệm và xây dựng báo cáo.

2. KIẾN TRÚC TỔNG THỂ

Hệ thống gồm các thành phần:

- Python Application: điều phối các thao tác xử lý chứng cứ.
- SHA-256 Module: tính mã băm SHA-256 của tệp chứng cứ.
- Digital Signature Module: tạo và xác minh chữ ký số.
- Blockchain Client: giao tiếp với blockchain thông qua các giao dịch và truy vấn.
- Hardhat Local Network: cung cấp blockchain cục bộ phục vụ phát triển và kiểm thử.
- EvidenceRegistry: smart contract quản lý thông tin chứng cứ và các sự kiện liên quan.
- Test and Audit Module: hỗ trợ kiểm thử, ghi nhận kết quả và truy xuất lịch sử.

3. LUỒNG ĐĂNG KÝ CHỨNG CỨ

Bước 1: Người dùng lựa chọn tệp chứng cứ mẫu.

Bước 2: Chương trình kiểm tra tệp có tồn tại và đọc được hay không.

Bước 3: Chương trình tính mã SHA-256 của tệp.

Bước 4: Hệ thống xây dựng thông điệp đăng ký theo định dạng đã thống nhất.

Bước 5: Thông điệp được ký bằng khóa riêng phù hợp.

Bước 6: Hệ thống xác minh chữ ký theo thiết kế của mô-đun chữ ký số.

Bước 7: Blockchain Client gửi giao dịch đăng ký chứng cứ.

Bước 8: Smart contract kiểm tra mã định danh và dữ liệu đầu vào.

Bước 9: Hợp đồng lưu bản ghi và phát sự kiện đăng ký.

Bước 10: Hệ thống ghi nhận mã giao dịch, kết quả thực hiện và thông tin phục vụ kiểm thử.

4. LUỒNG XÁC MINH TÍNH TOÀN VẸN

Bước 1: Người dùng cung cấp mã định danh chứng cứ và đường dẫn tệp cần xác minh.

Bước 2: Hệ thống truy vấn mã băm tham chiếu đã đăng ký.

Bước 3: Hệ thống kiểm tra tệp có tồn tại và đọc được hay không.

Bước 4: Chương trình tính lại mã SHA-256 của tệp hiện tại.

Bước 5: Hệ thống so sánh mã băm mới với mã băm tham chiếu.

Bước 6: Hệ thống trả kết quả khớp hoặc không khớp.

Bước 7: Kết quả xác minh được ghi nhận trong nhật ký kiểm thử.

Nếu mã băm khớp, kết quả cho thấy nội dung tệp hiện tại phù hợp với mã băm tham chiếu đã đăng ký, trong phạm vi độ tin cậy của quy trình và hệ thống.

Nếu mã băm không khớp, hệ thống cảnh báo rằng nội dung tệp hiện tại khác với nội dung tương ứng với mã băm tham chiếu.

5. LUỒNG BÀN GIAO VÀ TIẾP NHẬN CHỨNG CỨ

Bước 1: Bên giao khởi tạo sự kiện bàn giao chứng cứ.

Bước 2: Hệ thống ghi nhận thông tin bên giao, bên nhận và mã định danh chứng cứ theo mô hình dữ liệu.

Bước 3: Bên nhận thực hiện xác nhận tiếp nhận theo quy tắc của hệ thống.

Bước 4: Smart contract kiểm tra trạng thái hiện tại và trình tự thao tác.

Bước 5: Hợp đồng ghi nhận sự kiện bàn giao hoặc tiếp nhận.

Bước 6: Hệ thống cho phép truy xuất lịch sử sự kiện phục vụ kiểm tra chuỗi quản lý chứng cứ.

Mô hình thử nghiệm không tự xác minh danh tính ngoài đời thực của người tham gia. Địa chỉ blockchain chỉ xác định tài khoản được sử dụng trong môi trường thử nghiệm, trừ khi có cơ chế xác thực danh tính bổ sung.

6. MÔ HÌNH DỮ LIỆU

Bản ghi chứng cứ dự kiến có các trường:

- evidenceId: mã định danh chứng cứ.
- fileHash: mã SHA-256 của tệp chứng cứ.
- registeredAt: thời điểm đăng ký.
- registrar: địa chỉ tài khoản đăng ký.
- exists: thông tin cho biết bản ghi đã tồn tại.
- status: trạng thái xử lý chứng cứ, nếu được triển khai.

Sự kiện quản lý chứng cứ có thể bao gồm:

- EvidenceRegistered: chứng cứ được đăng ký.
- EvidenceTransferred: chứng cứ được bàn giao.
- EvidenceReceived: chứng cứ được tiếp nhận.

Tên trường, kiểu dữ liệu và quy tắc chuyển trạng thái sẽ được đối chiếu với smart contract thực tế. Không coi các trường dự kiến là những trường đã được triển khai cho đến khi mã nguồn và kiểm thử xác nhận.

7. PHÂN TÁCH ON-CHAIN VÀ OFF-CHAIN

Dữ liệu lưu ngoài blockchain:

- Tệp chứng cứ mẫu.
- Mã nguồn và cấu hình phát triển.
- Kết quả kiểm thử.
- Nhật ký thực thi.
- Báo cáo, slide và ảnh minh chứng.
- Khóa riêng phục vụ thử nghiệm, nếu có, được quản lý riêng và không đưa vào Git.

Dữ liệu dự kiến lưu trên blockchain:

- Mã định danh chứng cứ.
- Mã băm SHA-256.
- Metadata tối thiểu cần thiết.
- Các sự kiện đăng ký, bàn giao và tiếp nhận.

Không lưu khóa riêng hoặc nội dung chứng cứ nhạy cảm trên blockchain. Trước khi đưa metadata lên blockchain, cần cân nhắc khả năng dữ liệu có thể bị truy cập công khai và khó xóa bỏ.

8. NGUYÊN TẮC BẢO MẬT

- Chỉ sử dụng dữ liệu mẫu không nhạy cảm.
- Không đưa khóa riêng, mật khẩu hoặc thông tin bí mật vào mã nguồn công khai.
- Kiểm tra dữ liệu đầu vào trước khi xử lý.
- Kiểm tra mã băm trước và sau các thao tác liên quan đến chứng cứ.
- Kiểm thử trường hợp dữ liệu sai, tệp bị sửa đổi và thao tác không hợp lệ.
- Không xem mã băm là bằng chứng độc lập về tính xác thực ban đầu của tệp.
- Không mặc định chữ ký số chứng minh danh tính thật nếu chưa có cơ chế xác thực khóa và danh tính.
- Không xem blockchain là cơ chế tự động bảo đảm dữ liệu đầu vào đúng sự thật.

9. GIỚI HẠN CỦA MÔ HÌNH

Hệ thống được xây dựng nhằm minh họa việc kết hợp mã băm, chữ ký số, smart contract và blockchain trong quản lý tính toàn vẹn chứng cứ số.

Mô hình thử nghiệm không thay thế hệ thống quản lý chứng cứ chuyên nghiệp và không tự động bảo đảm giá trị pháp lý của chứng cứ.

Khả năng kiểm soát truy cập, quản lý danh tính, lưu trữ lâu dài và tính bảo mật của khóa phụ thuộc vào thiết kế và cách triển khai thực tế.

10. TRẠNG THÁI TÀI LIỆU

Phiên bản: 0.1.

Trạng thái: Thiết kế ban đầu.

Tài liệu cần được đối chiếu và cập nhật khi hoàn thiện smart contract, chương trình Python và kết quả thực nghiệm.
