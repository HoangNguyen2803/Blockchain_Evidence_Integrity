TÀI LIỆU YÊU CẦU DỰ ÁN

Tên dự án: Blockchain-Based Digital Evidence Integrity

Tên tiếng Việt: Hệ thống đảm bảo tính toàn vẹn của chứng cứ số dựa trên Blockchain.

Mã dự án: BEI-2026

Phiên bản tài liệu: 0.1

Môi trường triển khai: Kali Linux trên VMware.

Phạm vi: Mô hình thử nghiệm sử dụng blockchain cục bộ.

1. GIỚI THIỆU

Trong điều tra số, chứng cứ điện tử có thể được sao chép, chuyển giao, lưu trữ và phân tích nhiều lần. Trong quá trình đó, nội dung tệp có thể bị thay đổi hoặc việc quản lý lịch sử xử lý có thể thiếu minh bạch.

Dự án đề xuất mô hình kết hợp mã băm mật mã, chữ ký số và Blockchain để hỗ trợ kiểm tra tính toàn vẹn của tệp chứng cứ và truy xuất lịch sử các sự kiện liên quan.

Đây là mô hình phục vụ học tập và nghiên cứu, không thay thế quy trình điều tra số chuyên nghiệp.

2. MỤC TIÊU

- Tính mã băm SHA-256 của tệp chứng cứ.
- Đăng ký mã băm và metadata tối thiểu lên blockchain.
- Phát hiện tệp bị thay đổi so với bản đã đăng ký.
- Tạo và xác minh chữ ký số.
- Ghi nhận các sự kiện bàn giao và tiếp nhận chứng cứ.
- Truy xuất thông tin và lịch sử sự kiện.
- Xây dựng bộ kiểm thử có kết quả thực tế.
- Lưu minh chứng để phục vụ đánh giá và viết báo cáo.

3. PHẠM VI

Hệ thống sử dụng các tệp mẫu không chứa dữ liệu nhạy cảm.

Các thành phần dự kiến gồm:

- Python: xử lý tệp, tính mã băm và xác minh.
- SHA-256: tạo mã băm cho nội dung tệp.
- Chữ ký số: kiểm tra tính hợp lệ của thông điệp đã ký.
- Solidity: xây dựng hợp đồng thông minh quản lý chứng cứ.
- Hardhat Network: môi trường blockchain cục bộ.
- Git: quản lý phiên bản mã nguồn.

Phiên bản công cụ và thư viện cụ thể sẽ được xác nhận trong giai đoạn thiết lập môi trường.

4. YÊU CẦU CHỨC NĂNG

FR-01: Tính mã băm SHA-256 của tệp chứng cứ.

FR-02: Đăng ký ID chứng cứ, mã băm và metadata tối thiểu lên blockchain.

FR-03: Từ chối đăng ký ID chứng cứ đã tồn tại.

FR-04: Xác minh tệp bằng cách so sánh mã băm hiện tại với mã băm đã đăng ký.

FR-05: Phát hiện tệp không tồn tại hoặc không thể đọc.

FR-06: Tạo chữ ký số cho thông điệp đăng ký.

FR-07: Xác minh chữ ký số bằng khóa công khai.

FR-08: Ghi nhận sự kiện bàn giao chứng cứ.

FR-09: Ghi nhận sự kiện tiếp nhận chứng cứ.

FR-10: Truy vấn thông tin chứng cứ theo ID.

FR-11: Truy xuất lịch sử sự kiện của chứng cứ.

FR-12: Kiểm soát trạng thái và trình tự bàn giao, tiếp nhận.

FR-13: Xử lý dữ liệu đầu vào không hợp lệ.

FR-14: Hỗ trợ chạy lại quy trình kiểm thử và đối chiếu kết quả.

5. YÊU CẦU PHI CHỨC NĂNG

NFR-01: Tệp bị sửa đổi phải được phát hiện trong các trường hợp thử nghiệm.

NFR-02: Các sự kiện đã ghi nhận phải có thể truy xuất và đối chiếu.

NFR-03: Không lưu khóa riêng hoặc nội dung chứng cứ nhạy cảm trên blockchain.

NFR-04: Mã nguồn phải được tổ chức thành các thành phần rõ ràng.

NFR-05: Kết quả kiểm thử phải có bằng chứng thực tế.

NFR-06: Quy trình triển khai và kiểm thử phải có hướng dẫn để thực hiện lại.

6. NGUYÊN TẮC THIẾT KẾ

6.1. Lưu trữ chứng cứ

Tệp chứng cứ được lưu ngoài blockchain. Blockchain chỉ lưu mã băm và metadata tối thiểu cần thiết.

6.2. Tính toàn vẹn

SHA-256 được dùng để tính mã băm của tệp. Khi nội dung thay đổi, mã băm thường sẽ thay đổi và hệ thống có thể phát hiện sự không khớp.

6.3. Chữ ký số

Chữ ký số được sử dụng để kiểm tra tính hợp lệ của thông điệp đã ký. Việc xác minh danh tính thật của người ký cần cơ chế quản lý danh tính và khóa phù hợp.

6.4. Lịch sử sự kiện

Blockchain được sử dụng để ghi nhận các sự kiện liên quan đến chứng cứ. Hệ thống không được giả định rằng blockchain tự bảo đảm mọi thông tin đầu vào đều đúng sự thật.

6.5. Bảo vệ khóa

Khóa riêng không được đưa lên blockchain, đưa vào kho mã nguồn hoặc công bố trong báo cáo.

7. KẾ HOẠCH KIỂM THỬ

TC-001: Đăng ký chứng cứ mới.

TC-002: Đăng ký ID đã tồn tại.

TC-003: Xác minh tệp nguyên vẹn.

TC-004: Xác minh tệp đã bị thay đổi.

TC-005: Xác minh đường dẫn không tồn tại.

TC-006: Xác minh chữ ký hợp lệ.

TC-007: Xác minh thất bại khi thông điệp bị thay đổi.

TC-008: Xác minh thất bại với chữ ký không hợp lệ.

TC-009: Bàn giao và tiếp nhận đúng trình tự.

TC-010: Từ chối thao tác sai trạng thái.

TC-011: Truy vấn ID không tồn tại.

TC-012: Truy xuất lịch sử sự kiện.

TC-013: Xử lý đầu vào sai định dạng.

TC-014: Chạy lại toàn bộ quy trình.

8. TIÊU CHÍ NGHIỆM THU

- Đăng ký được chứng cứ mới.
- Từ chối ID trùng lặp.
- Xác minh đúng tệp nguyên vẹn và tệp bị thay đổi.
- Xử lý được trường hợp tệp không tồn tại.
- Xác minh đúng chữ ký hợp lệ và không hợp lệ.
- Ghi nhận và truy xuất được các sự kiện bàn giao, tiếp nhận.
- Kiểm tra được lịch sử sự kiện.
- Có bộ kiểm thử với kết quả thực tế.
- Có ảnh chụp màn hình hoặc nhật ký minh chứng.
- Có tài liệu hướng dẫn triển khai và thực hiện lại.

9. GIỚI HẠN

Mã băm không tự chứng minh tính xác thực ban đầu của chứng cứ. Nó chỉ cho phép đối chiếu nội dung hiện tại với mã băm tham chiếu.

Chữ ký số không tự chứng minh danh tính thật của người ký nếu không có cơ chế xác minh danh tính và quản lý khóa đáng tin cậy.

Blockchain không thể tự bảo đảm rằng dữ liệu được nhập ban đầu là đúng sự thật.

Mô hình thử nghiệm không mặc nhiên bảo đảm giá trị pháp lý của chứng cứ.

10. TRẠNG THÁI TÀI LIỆU

Phiên bản: 0.1.

Trạng thái: Bản yêu cầu ban đầu.

Các thay đổi về kiến trúc, cấu trúc dữ liệu, thuật toán chữ ký số, phiên bản công cụ và kết quả kiểm thử sẽ được cập nhật trong các giai đoạn tiếp theo.
