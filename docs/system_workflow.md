# BEI-2026 – System Workflow

## 1. Overview

BEI-2026 is a Blockchain-Based Digital Evidence Integrity system designed to support digital evidence integrity verification, digital signature validation, and Chain of Custody tracking.

## 2. Main Workflow

1. Evidence Selection: The user selects a digital evidence file.
2. Hash Generation: Python reads the file and generates its SHA-256 hash.
3. Digital Signature: Ed25519 is used to sign and verify data where applicable.
4. Evidence Registration: The system submits evidence metadata and its hash to the EvidenceRegistry smart contract.
5. Blockchain Recording: The transaction is recorded on the local Blockchain network.
6. Integrity Verification: The system recalculates the evidence hash and compares it with the registered hash.
7. Chain of Custody: Evidence handover and acceptance events are recorded and retrieved.

## 3. Data Storage Model

- Off-chain: Original evidence files.
- On-chain: Evidence hashes and required metadata, together with Blockchain transaction records.

## 4. Expected Outcome

The system supports the detection of changes to registered evidence and provides traceable records of evidence registration and handover.

## 5. Limitations

- The current implementation uses a local Hardhat Blockchain network.
- Blockchain records do not independently prove the original authenticity or legal admissibility of evidence.
- Identity verification and cryptographic key lifecycle management require further development.

# System Workflow

![System Workflow](../img/system_workflow.png)

## 1. Overview

This document describes the overall workflow of the Blockchain-Based Digital Evidence Integrity system.

The workflow covers the main stages from evidence submission to integrity verification and Chain of Custody management.

## 2. Main Workflow

1. **Evidence Submission:** The investigator selects a digital evidence file.
2. **Evidence Processing:** The system processes the file and generates its SHA-256 hash.
3. **Digital Signature:** The system can create or verify an Ed25519 digital signature.
4. **Evidence Registration:** Evidence information is submitted for registration.
5. **Blockchain Recording:** The smart contract records the evidence information on the blockchain.
6. **Integrity Verification:** The system recalculates the evidence hash and compares it with the registered hash.
7. **Chain of Custody:** Evidence handover activities are recorded and can be reviewed.

## 3. Expected Outcome

The system provides mechanisms to:

- Detect changes in digital evidence.
- Verify digital signatures.
- Register evidence hashes on the blockchain.
- Record evidence handover activities.
- Support traceability of evidence-related operations.

## 4. Limitations

The current implementation is a local demonstration environment. It does not independently establish the original authenticity, legal admissibility, or real-world identity of evidence handlers.