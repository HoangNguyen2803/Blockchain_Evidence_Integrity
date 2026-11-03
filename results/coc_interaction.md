# Chain of Custody – Blockchain Interaction Results

Date: 2026-11-03

## 1. Evidence Registration

- Evidence ID: BEI-EV-COC-001
- Contract Address: 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
- SHA-256:
  8c57c5653f1b0f1f25dd86068951742b5e4bfc2b968addfd7e5afab2ac7e72f7
- Initial Custodian:
  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
- Registration Transaction:
  0x5dc6072ddcfec988b3b6ee641076541b34ae4f2454c39cb46a7665d53f86605c
- Registration Block: 6
- Result: PASS

## 2. Handover Initiation

- From:
  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
- To:
  0x70997970C51812dc3A010C7d01b50e0d17dc79C8
- Transaction:
  0xd8424d6b9e2cccd651adf773711f6217bb8ef282912bb7dc2889a57481c55eb7
- Block: 7
- Result: PASS

## 3. Handover Acceptance

- Recipient:
  0x70997970C51812dc3A010C7d01b50e0d17dc79C8
- Transaction:
  0x28553005c18a5c52cb7807cef0399d0cb1c65a0ff9e419a0d377aceb08f40285
- Block: 8
- Result: PASS

## 4. Final Custody Verification

- Current Custodian:
  0x70997970C51812dc3A010C7d01b50e0d17dc79C8
- Pending Custodian:
  0x0000000000000000000000000000000000000000
- Custodian Update: PASS

## 5. Evidence Integrity Verification

- Stored SHA-256:
  0x8c57c5653f1b0f1f25dd86068951742b5e4bfc2b968addfd7e5afab2ac7e72f7
- Submitted SHA-256:
  0x8c57c5653f1b0f1f25dd86068951742b5e4bfc2b968addfd7e5afab2ac7e72f7
- Integrity Matched: true
- Result: PASS

## 6. Overall Result

- Evidence registration: PASS
- Handover initiation: PASS
- Recipient acceptance: PASS
- Custodian update: PASS
- Evidence integrity after handover: PASS

Chain of Custody interaction completed successfully
on the local Hardhat blockchain.

Note:
The contract stores the current and pending custodian.
Historical handover information is recorded through blockchain
events and can be queried from transaction logs.
