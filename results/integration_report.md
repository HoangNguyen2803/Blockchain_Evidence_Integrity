# BEI-2026 – Python ↔ Blockchain Integration Report

## 1. Objective
Integrate Python SHA-256 hashing and Ed25519 signature verification with the Solidity EvidenceRegistry smart contract.

## 2. Test Input
- Evidence ID: BEI-EV-001
- Evidence file: evidence_samples/evidence_001.txt
- File size: 237 bytes
- SHA-256: 8c57c5653f1b0f1f25dd86068951742b5e4bfc2b968addfd7e5afab2ac7e72f7
- Signature algorithm: Ed25519
- Manifest: results/evidence_001.signature.json

## 3. Blockchain Environment
- Network: Local Hardhat
- Chain ID: 31337
- Contract: 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
- Evidence registration block: 10
- Transaction:
  0xbedeac62753d91efef76327b04d9c32802f9c1d6dcb8416b93ae6d6f5a2b6aa3
- Registered by: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

## 4. Execution Results
| Test | Expected result | Actual result |
|---|---|---|
| Python SHA-256 | Hash calculated | PASS |
| Ed25519 verification | Signature valid | PASS |
| Blockchain connection | Chain ID 31337 | PASS |
| Evidence registration | Transaction successful | PASS |
| On-chain hash comparison | Hashes match | PASS |
| Custody read-back | Custodian retrieved | PASS |

## 5. Conclusion
The integration successfully connected the Python evidence-processing modules with the local Solidity smart contract.

The workflow calculated the evidence SHA-256 hash, verified the Ed25519-signed manifest, registered the hash on the blockchain, and read back the stored record to confirm that the on-chain hash matched the calculated hash.

This experiment demonstrates technical integrity checking and blockchain-based recording in a local test environment. It does not independently establish the real-world origin, legal authenticity, or admissibility of evidence.
