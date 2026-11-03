# BEI-2026 – Security and Negative Test Report

## 1. Objective
Evaluate the behavior of the BEI-2026 system under normal and invalid evidence conditions.

## 2. Test Results

| Test ID | Test case | Expected behavior | Result |
|---|---|---|---|
| ST-01 | Full TypeScript and Hardhat test suite | All 22 tests pass | PASS |
| ST-02 | Modified evidence file | Integrity verification rejected | PASS |
| ST-03 | Tampered digital signature | Signature verification rejected | PASS |
| ST-04 | Duplicate evidence registration | Duplicate registration rejected without transaction | PASS |
| ST-05 | Chain of Custody event-history inspection | Three expected events remain recorded | PASS |

## 3. Important Observations

### Modified evidence
The modified file produced:
- metadata_matches: false
- signature_valid: true
- integrity_verified: false
- verification_status: SIGNATURE_INVALID

### Tampered signature
The tampered manifest produced:
- metadata_matches: true
- signature_valid: false
- integrity_verified: false
- verification_status: SIGNATURE_INVALID

### Duplicate registration
The integration script detected that BEI-EV-001 was already registered and stopped before sending a new blockchain transaction.

### Chain of Custody
The history query for BEI-EV-COC-001 returned:
- EvidenceRegistered: Block 6
- HandoverInitiated: Block 7
- HandoverAccepted: Block 8

Note: This history query inspected BEI-EV-COC-001, not BEI-EV-001.

## 4. Conclusion
The tested negative scenarios behaved as expected. The system detected modified evidence, rejected an invalid digital signature, and prevented duplicate evidence registration.

These tests demonstrate the implemented controls in a local development environment. They do not constitute a complete security audit or prove legal authenticity of digital evidence.
