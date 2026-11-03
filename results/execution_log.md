# NHẬT KÝ THỰC HIỆN DỰ ÁN

Mã dự án: BEI-2026

Môi trường: Kali Linux trên VMware.

## STEP-01 — Khảo sát môi trường

Kết quả:

- Hệ điều hành: Kali GNU/Linux Rolling 2026.3.
- Kernel: 7.1.5+kali-amd64.
- Kiến trúc: x86_64.
- CPU được cấp: 4 CPU logic.
- RAM: 7,7 GiB.
- Dung lượng phân vùng gốc: 79 GB.
- Dung lượng còn trống tại thời điểm kiểm tra: 44 GB.
- Python: 3.14.8.
- pip: 26.1.2.
- Node.js: 24.21.0.
- npm: 12.2.0.
- Git: 2.53.0.
- Kiểm tra ping 1.1.1.1: 4 gói gửi, 4 gói nhận, mất 0%.

Các mục cần kiểm tra bổ sung:

- Xác minh Hardhat.
- Xác minh nguyên nhân eth0 có hai địa chỉ IPv4.
- Kiểm tra tương thích các phiên bản công cụ với thư viện dự án.

Trạng thái: Khảo sát cơ bản hoàn thành.

## STEP-02 — Yêu cầu và cấu trúc dự án

Kế hoạch:

- Tạo cấu trúc thư mục.
- Tạo tài liệu report/requirements.md.
- Xây dựng danh sách yêu cầu chức năng và phi chức năng.
- Xây dựng danh sách ca kiểm thử dự kiến.
- Lưu ảnh minh chứng.

Trạng thái ban đầu: Đang thực hiện.

Kết quả thực tế sẽ được cập nhật sau khi kiểm tra từng hạng mục.

## STEP-02 — Yêu cầu và cấu trúc dự án

Kết quả thực tế:

- Đã tạo cấu trúc thư mục dự án.
- Đã tạo report/requirements.md.
- Đã xác định các yêu cầu chức năng FR-01 đến FR-14.
- Đã xác định các yêu cầu phi chức năng NFR-01 đến NFR-06.
- Đã xây dựng danh sách ca kiểm thử TC-001 đến TC-014.
- Đã tạo results/execution_log.md.
- Ảnh minh chứng được lưu trên máy thật; cần quản lý và đối chiếu với danh mục minh chứng của dự án.

Trạng thái: Hoàn thành các hạng mục tài liệu đã kiểm tra.
Còn lại: Chuẩn hóa danh mục minh chứng và kiểm tra các hạng mục chưa có bằng chứng xác nhận.

## STEP-03 — Thiết kế kiến trúc hệ thống

Mục tiêu:

- Xác định kiến trúc tổng thể.
- Mô tả luồng đăng ký và xác minh chứng cứ.
- Mô tả luồng bàn giao và tiếp nhận.
- Xác định mô hình dữ liệu dự kiến.
- Phân biệt dữ liệu on-chain và off-chain.

Sản phẩm:

- report/architecture.md

Trạng thái: Đang thực hiện.

Kết quả thực tế:
Sẽ cập nhật sau khi kiểm tra tài liệu kiến trúc và các hạng mục nghiệm thu.

## STEP-04 — Xây dựng sơ đồ kiến trúc và luồng xử lý

Mục tiêu:

- Biểu diễn kiến trúc tổng thể.
- Mô tả luồng đăng ký chứng cứ.
- Mô tả luồng xác minh tính toàn vẹn.
- Mô tả luồng bàn giao và tiếp nhận.
- Phân biệt dữ liệu on-chain và off-chain.

Sản phẩm:

- report/diagrams.md

Trạng thái: Đang thực hiện.

Kết quả thực tế:
Sẽ cập nhật sau khi kiểm tra tệp sơ đồ và các hạng mục nghiệm thu.

## STEP-05 — Kiểm tra môi trường Blockchain và Hardhat

Mục tiêu:

- Xác minh Node.js và npm.
- Kiểm tra Hardhat đã được cài đặt hay chưa.
- Kiểm tra package.json và cấu hình dự án.
- Kiểm tra cấu hình mạng Kali.
- Xác minh môi trường sẵn sàng cho triển khai blockchain cục bộ.

Trạng thái: Đang thực hiện.

Kết quả thực tế:
Chưa kết luận. Đang tiến hành kiểm tra môi trường.

Kết quả thực tế:

- Node.js v24.21.0, nền tảng linux x64.
- npm 12.2.0.
- Chưa cài đặt Hardhat toàn hệ thống.
- Chưa có package.json và package-lock.json.
- Chưa có cấu hình Hardhat.
- eth0 và eth1 đang ở trạng thái UP.
- eth0 có hai địa chỉ IPv4: 192.168.111.161 và 192.168.111.162.
- Có hai default route cùng gateway 192.168.111.2, khác metric.
- Tuyến hiện được chọn đến 1.1.1.1 sử dụng source 192.168.111.162.
- Phân vùng / còn 44 GB.

Đánh giá:

- Node.js đáp ứng yêu cầu cài đặt Hardhat 3.
- Chưa có môi trường Hardhat trong dự án.
- Cấu hình mạng được ghi nhận để theo dõi, chưa thay đổi.

Trạng thái: Hoàn thành khảo sát môi trường.

## STEP-06 — Khởi tạo môi trường Hardhat 3

Mục tiêu:

- Lựa chọn mẫu Hardhat 3 phù hợp.
- Khởi tạo môi trường phát triển smart contract.
- Cài đặt thư viện cục bộ.
- Xác minh cấu hình Hardhat.
- Kiểm tra khả năng biên dịch và chạy kiểm thử.

Công nghệ dự kiến:

- Hardhat 3.
- Solidity.
- Ethers.js.
- Mocha.
- npm.

Trạng thái: Đang thực hiện.

Kết quả thực tế:
Đã chuẩn bị bản sao lưu trước khi khởi tạo.
Đang kiểm tra danh sách mẫu Hardhat 3.

### Kết quả nghiệm thu STEP-06

- Đã sao lưu report và results trước khi khởi tạo Hardhat.
- Đã chọn template mocha-ethers.
- Hardhat: 3.21.2.
- Ethers.js: 6.17.0.
- Solidity compiler: 0.8.34.
- TypeScript: 6.0.3.
- Mocha: 12.0.3.
- Đã cho phép và rebuild esbuild@0.28.2.
- Đã loại file Counter.t.sol khỏi thư mục biên dịch Hardhat bằng cách di chuyển sang samples/foundry/.
- Biên dịch: thành công 1 Solidity file.
- Kiểm thử: 2 passing, 0 failing.
- Dependency audit: còn 18 vulnerabilities được npm audit báo cáo, cần tiếp tục theo dõi.

Trạng thái: PASS - Môi trường Hardhat 3 đã sẵn sàng.
Ngoại lệ: HHD-08 chưa đóng.


### STEP-07 – Python Evidence Hashing

**Kết quả thực hiện:**

- Python 3.14.8 và pip 26.1.2 hoạt động bình thường.
- Đã tạo dữ liệu chứng cứ mô phỏng `evidence_001.txt`, kích thước 237 bytes.
- Đã xây dựng `python/hash_evidence.py`.
- Đã sử dụng hashlib để tính SHA-256.
- Đã triển khai đọc file theo từng khối 1 MiB.
- Đã triển khai chức năng xác minh hash và xuất kết quả JSON.
- Hash Python khớp với kết quả độc lập từ Linux sha256sum.
- Xác minh hash chính xác: INTEGRITY_OK.
- Xác minh hash không chính xác: INTEGRITY_FAILED.
- File bị thay đổi được phát hiện: INTEGRITY_FAILED.
- File không tồn tại được xử lý bằng thông báo lỗi và exit code 2.
- Ảnh minh chứng các kiểm thử đã được chụp và lưu.

**Hash chứng cứ mẫu:**

SHA-256:
8c57c5653f1b0f1f25dd86068951742b5e4bfc2b968addfd7e5afab2ac7e72f7

**Trạng thái:** PASS đối với các kiểm thử đã thực hiện.

### STEP-08 — Digital Signature (Ed25519)

**Mục tiêu:** Xây dựng và kiểm thử cơ chế ký số, xác minh chữ ký và kiểm tra tính toàn vẹn của chứng cứ số.

**Công nghệ:**
- Python 3
- Cryptography 49.0.0
- OpenSSL 3.6.5
- Ed25519
- SHA-256
- JSON manifest

**Các công việc đã thực hiện:**
1. Tạo thư mục keys với quyền truy cập 700.
2. Cấu hình .gitignore để loại trừ keys/ và *.pem.
3. Xây dựng python/digital_signature.py.
4. Tạo cặp khóa Ed25519 phục vụ kiểm thử.
5. Kiểm tra quyền truy cập khóa riêng và khóa công khai.
6. Ký metadata của chứng cứ BEI-EV-001.
7. Lưu manifest tại results/evidence_001.signature.json.
8. Xác minh thành công chứng cứ gốc.
9. Kiểm tra chứng cứ đã bị chỉnh sửa.
10. Kiểm tra manifest có chữ ký bị thay đổi.
11. Kiểm tra xác minh bằng khóa công khai khác.

**Kết quả kiểm thử:**

| Mã | Nội dung | Kết quả |
|---|---|---|
| SIG-01 | Kiểm tra môi trường và thư viện | PASS |
| SIG-02 | Kiểm tra OpenSSL | PASS |
| SIG-03 | Tạo thư mục lưu khóa | PASS |
| SIG-04 | Phân quyền thư mục và khóa | PASS |
| SIG-05 | Biên dịch mã Python | PASS |
| SIG-06 | Kiểm tra giao diện CLI | PASS |
| SIG-07 | Tạo cặp khóa Ed25519 | PASS |
| SIG-08 | Kiểm tra định dạng khóa | PASS |
| SIG-09 | Tạo chữ ký | PASS |
| SIG-10 | Xác minh chứng cứ gốc | PASS |
| SIG-11 | Phát hiện chứng cứ bị chỉnh sửa | PASS |
| SIG-12 | Tạo và lưu manifest | PASS |
| SIG-13 | Phát hiện chữ ký bị thay đổi | PASS |
| SIG-14 | Phát hiện khóa công khai không đúng | PASS |

**Kết quả nổi bật:**
- Chứng cứ gốc: SIGNATURE_VALID.
- Chứng cứ bị chỉnh sửa: SIGNATURE_INVALID.
- Chữ ký bị thay đổi: SIGNATURE_INVALID.
- Khóa công khai không đúng: từ chối xác minh do fingerprint không khớp.

**Giới hạn:**
- Cặp khóa hiện tại chỉ phục vụ kiểm thử trong môi trường lab.
- Chưa triển khai hệ thống quản lý danh tính và vòng đời khóa thực tế.
- Chưa có cơ chế cấp chứng thư số hoặc xác thực danh tính người ký.
- Thời gian ký trong manifest chưa phải dấu thời gian tin cậy độc lập.

**Trạng thái: PASS — STEP-08 hoàn thành.**


## STEP-09 – Smart Contract Deployment

Date: 2026-11-03

### Implementation
- Created EvidenceRegistry.sol.
- Implemented evidence registration and hash verification.
- Added 10 smart contract test cases.
- All smart contract tests passed.
- Deployed EvidenceRegistry to Hardhat Local.

### Deployment Information
- Network: Hardhat Local
- Chain ID: 31337
- Solidity: 0.8.34
- Contract Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
- Transaction Hash: 0xdee64b1721b5966645b137f364a4b7c7f95ba04b9d38211853b0b0fa0c31078e
- Block Number: 1
- Gas Used: 776940
- Deployment Status: SUCCESS

### Verification
- Contract bytecode: PASS
- Transaction receipt: PASS
- Transaction status: PASS
- Block number: PASS
- Contract address: PASS

### Result
STEP-09 deployment and verification completed successfully.


## STEP-09.7 – Blockchain Interaction

Date: 2026-11-03

### Evidence Registration
- Evidence ID: BEI-EV-001
- Initial registration status: false
- Registration status: SUCCESS
- Registration block: 2
- On-chain record: EXISTS

### Hash Verification
- Original file hash:
  8c57c5653f1b0f1f25dd86068951742b5e4bfc2b968addfd7e5afab2ac7e72f7

- Modified file hash:
  e4296764754f1ee874c43c4d6586b0ec73fb1c0c925cb15abb7e202394bb65ef

### Verification Results
- Original evidence: integrityMatched = true
- Modified evidence: integrityMatched = false
- EvidenceVerified event: emitted for both verification transactions

### Registration Transaction
- Transaction Hash:
  0xc2623241f01653c1deda4284da9f3dd9e531e7344810779febaf6d7735a4eeea

### Result
- Original evidence integrity verification: PASS
- Modified evidence detection: PASS
- Blockchain interaction: PASS

STEP-09.7 completed successfully.


## STEP-10 – Chain of Custody

Date: 2026-11-03

### STEP-10.1 – Contract Design

- Extended EvidenceRecord with currentCustodian and pendingCustodian.
- Added handoverEvidence() for initiating evidence transfer.
- Added acceptHandover() for recipient confirmation.
- Added cancelHandover() for cancelling pending transfers.
- Added getCustody() for retrieving current custody information.
- Added events: HandoverInitiated, HandoverAccepted, HandoverCancelled.
- Solidity version: 0.8.34.
- Compilation: PASS.

### STEP-10.2 – Automated Testing

- SC-T01 to SC-T10: 10/10 PASS.
- COC-T01 to COC-T10: 10/10 PASS.
- Counter tests: 2/2 PASS.
- Total: 22/22 PASS.

### Chain of Custody Test Results

- Initiate handover: PASS.
- Accept handover: PASS.
- Reject unauthorized acceptance: PASS.
- Reject handover by non-custodian: PASS.
- Reject zero-address recipient: PASS.
- Reject self-handover: PASS.
- Reject duplicate pending handover: PASS.
- Cancel pending handover: PASS.
- Reject acceptance without pending handover: PASS.
- Reject cancellation by non-custodian: PASS.

### Result

STEP-10 contract extension and automated testing completed successfully.

Note: The updated contract has passed automated tests but has not yet been deployed to the local blockchain. Deployment and on-chain interaction will be documented separately.


## STEP-10.3 – Chain of Custody Contract Deployment

Date: 2026-11-03

- Contract: EvidenceRegistry (Chain of Custody version).
- Contract Address: `0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9`
- Transaction Hash: `0xb175abe3c7be80baa572f1d58961ea1e996d66661e429aee2c42928180506854`
- Deployment Block: 5.
- Gas Used: 1415407.
- Chain ID: 31337.
- Contract bytecode verification: PASS.
- Deployment JSON: `results/deployment_coc.json`.
- Verification report: `results/deployment_coc_verification.md`.

Result: PASS.

## STEP-10.4 – Chain of Custody Interaction

Date: 2026-11-03

- Evidence ID: BEI-EV-COC-001.
- Evidence registration: PASS (Block 6).
- Handover initiation: PASS (Block 7).
- Handover acceptance: PASS (Block 8).
- Current custodian updated to recipient: PASS.
- Pending custodian reset to zero address: PASS.
- Evidence SHA-256 integrity after handover: PASS.

### Transaction Records

- Registration: `0x5dc6072ddcfec988b3b6ee641076541b34ae4f2454c39cb46a7665d53f86605c`
- Handover initiated: `0xd8424d6b9e2cccd651adf773711f6217bb8ef282912bb7dc2889a57481c55eb7`
- Handover accepted: `0x28553005c18a5c52cb7807cef0399d0cb1c65a0ff9e419a0d377aceb08f40285`

Result: PASS.

Detailed record: `results/coc_interaction.md`.

## STEP-10.5 – Chain of Custody Event History

Date: 2026-11-03

- EvidenceRegistered event retrieved: PASS.
- HandoverInitiated event retrieved: PASS.
- HandoverAccepted event retrieved: PASS.
- Total matching events: 3.
- Event ordering by block number: PASS.
- Transaction hashes and custodian addresses: PASS.
- JSON history output: `results/coc_event_history.json`.

Result: PASS.

## STEP-10 – Overall Result

Chain of Custody contract extension, deployment, interaction, and event-history retrieval completed successfully on the local Hardhat blockchain.

Note: Historical custody is reconstructed from blockchain events. The contract's `getCustody()` function returns current and pending custodians, not the complete historical record.



## STEP-10.3 – Chain of Custody Contract Deployment

Date: 2026-11-03

- Contract: EvidenceRegistry (Chain of Custody version).
- Contract Address: `0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9`
- Transaction Hash: `0xb175abe3c7be80baa572f1d58961ea1e996d66661e429aee2c42928180506854`
- Deployment Block: 5.
- Gas Used: 1415407.
- Chain ID: 31337.
- Contract bytecode verification: PASS.
- Deployment JSON: `results/deployment_coc.json`.
- Verification report: `results/deployment_coc_verification.md`.

Result: PASS.

## STEP-10.4 – Chain of Custody Interaction

Date: 2026-11-03

- Evidence ID: BEI-EV-COC-001.
- Evidence registration: PASS (Block 6).
- Handover initiation: PASS (Block 7).
- Handover acceptance: PASS (Block 8).
- Current custodian updated to recipient: PASS.
- Pending custodian reset to zero address: PASS.
- Evidence SHA-256 integrity after handover: PASS.

### Transaction Records

- Registration: `0x5dc6072ddcfec988b3b6ee641076541b34ae4f2454c39cb46a7665d53f86605c`
- Handover initiated: `0xd8424d6b9e2cccd651adf773711f6217bb8ef282912bb7dc2889a57481c55eb7`
- Handover accepted: `0x28553005c18a5c52cb7807cef0399d0cb1c65a0ff9e419a0d377aceb08f40285`

Result: PASS.

Detailed record: `results/coc_interaction.md`.

## STEP-10.5 – Chain of Custody Event History

Date: 2026-11-03

- EvidenceRegistered event retrieved: PASS.
- HandoverInitiated event retrieved: PASS.
- HandoverAccepted event retrieved: PASS.
- Total matching events: 3.
- Event ordering by block number: PASS.
- Transaction hashes and custodian addresses: PASS.
- JSON history output: `results/coc_event_history.json`.

Result: PASS.

## STEP-10 – Overall Result

Chain of Custody contract extension, deployment, interaction, and event-history retrieval completed successfully on the local Hardhat blockchain.

Note: Historical custody is reconstructed from blockchain events. The contract's `getCustody()` function returns current and pending custodians, not the complete historical record.

## STEP-11 – Python ↔ Blockchain Integration
- STEP-11.1: Inspected Python CLI commands – PASS.
- STEP-11.2: Inspected evidence samples, keys, ABI and deployment information – PASS.
- STEP-11.3: Confirmed contract address and signed manifest – PASS.
- STEP-11.4: Recalculated SHA-256 and verified Ed25519 signature – PASS.
- STEP-11.5: Created scripts/integrate_evidence.ts; TypeScript compilation – PASS.
- STEP-11.6: End-to-end integration – PASS.
- Evidence ID: BEI-EV-001.
- Blockchain chain ID: 31337.
- Registration block: 10.
- Transaction: 0xbedeac62753d91efef76327b04d9c32802f9c1d6dcb8416b93ae6d6f5a2b6aa3
- On-chain SHA-256 matched Python SHA-256.
- Detailed report: results/integration_report.md.
- Overall STEP-11 result: PASS.
