// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

/// @title EvidenceRegistry
/// @notice Registers digital evidence hashes and manages chain of custody.
/// @dev Evidence files remain off-chain. Only identifiers and hashes
///      are stored on-chain.
contract EvidenceRegistry {
    struct EvidenceRecord {
        string evidenceId;
        bytes32 sha256Hash;
        address registeredBy;
        address currentCustodian;
        address pendingCustodian;
        uint256 registeredAt;
        bool exists;
    }

    mapping(bytes32 => EvidenceRecord) private evidenceRecords;

    event EvidenceRegistered(
        string evidenceId,
        bytes32 indexed evidenceKey,
        bytes32 sha256Hash,
        address indexed registeredBy,
        uint256 registeredAt
    );

    event EvidenceVerified(
        string evidenceId,
        bytes32 indexed evidenceKey,
        bytes32 submittedHash,
        bool integrityMatched,
        address indexed verifiedBy,
        uint256 verifiedAt
    );

    event HandoverInitiated(
        string evidenceId,
        address indexed fromCustodian,
        address indexed toCustodian,
        uint256 initiatedAt
    );

    event HandoverAccepted(
        string evidenceId,
        address indexed fromCustodian,
        address indexed toCustodian,
        uint256 acceptedAt
    );

    event HandoverCancelled(
        string evidenceId,
        address indexed fromCustodian,
        address indexed cancelledRecipient,
        uint256 cancelledAt
    );

    error EmptyEvidenceId();
    error EmptyEvidenceHash();
    error EvidenceAlreadyRegistered(string evidenceId);
    error EvidenceNotFound(string evidenceId);
    error InvalidRecipient();
    error SameCustodian();
    error NotCurrentCustodian();
    error NotPendingCustodian();
    error HandoverAlreadyPending();
    error NoPendingHandover();

    function registerEvidence(
        string calldata evidenceId,
        bytes32 sha256Hash
    ) external {
        if (bytes(evidenceId).length == 0) {
            revert EmptyEvidenceId();
        }

        if (sha256Hash == bytes32(0)) {
            revert EmptyEvidenceHash();
        }

        bytes32 evidenceKey = keccak256(bytes(evidenceId));

        if (evidenceRecords[evidenceKey].exists) {
            revert EvidenceAlreadyRegistered(evidenceId);
        }

        evidenceRecords[evidenceKey] = EvidenceRecord({
            evidenceId: evidenceId,
            sha256Hash: sha256Hash,
            registeredBy: msg.sender,
            currentCustodian: msg.sender,
            pendingCustodian: address(0),
            registeredAt: block.timestamp,
            exists: true
        });

        emit EvidenceRegistered(
            evidenceId,
            evidenceKey,
            sha256Hash,
            msg.sender,
            block.timestamp
        );
    }

    function getEvidence(
        string calldata evidenceId
    )
        external
        view
        returns (
            string memory id,
            bytes32 sha256Hash,
            address registeredBy,
            uint256 registeredAt,
            bool exists
        )
    {
        bytes32 evidenceKey = keccak256(bytes(evidenceId));
        EvidenceRecord storage record = evidenceRecords[evidenceKey];

        if (!record.exists) {
            revert EvidenceNotFound(evidenceId);
        }

        return (
            record.evidenceId,
            record.sha256Hash,
            record.registeredBy,
            record.registeredAt,
            record.exists
        );
    }

    function isEvidenceRegistered(
        string calldata evidenceId
    ) external view returns (bool) {
        bytes32 evidenceKey = keccak256(bytes(evidenceId));
        return evidenceRecords[evidenceKey].exists;
    }

    function verifyEvidence(
        string calldata evidenceId,
        bytes32 submittedHash
    ) external returns (bool integrityMatched) {
        bytes32 evidenceKey = keccak256(bytes(evidenceId));
        EvidenceRecord storage record = evidenceRecords[evidenceKey];

        if (!record.exists) {
            revert EvidenceNotFound(evidenceId);
        }

        integrityMatched = (record.sha256Hash == submittedHash);

        emit EvidenceVerified(
            evidenceId,
            evidenceKey,
            submittedHash,
            integrityMatched,
            msg.sender,
            block.timestamp
        );
    }

    function handoverEvidence(
        string calldata evidenceId,
        address recipient
    ) external {
        bytes32 evidenceKey = keccak256(bytes(evidenceId));
        EvidenceRecord storage record = evidenceRecords[evidenceKey];

        if (!record.exists) {
            revert EvidenceNotFound(evidenceId);
        }

        if (msg.sender != record.currentCustodian) {
            revert NotCurrentCustodian();
        }

        if (record.pendingCustodian != address(0)) {
            revert HandoverAlreadyPending();
        }

        if (recipient == address(0)) {
            revert InvalidRecipient();
        }

        if (recipient == record.currentCustodian) {
            revert SameCustodian();
        }

        record.pendingCustodian = recipient;

        emit HandoverInitiated(
            evidenceId,
            msg.sender,
            recipient,
            block.timestamp
        );
    }

    function acceptHandover(
        string calldata evidenceId
    ) external {
        bytes32 evidenceKey = keccak256(bytes(evidenceId));
        EvidenceRecord storage record = evidenceRecords[evidenceKey];

        if (!record.exists) {
            revert EvidenceNotFound(evidenceId);
        }

        if (record.pendingCustodian == address(0)) {
            revert NoPendingHandover();
        }

        if (msg.sender != record.pendingCustodian) {
            revert NotPendingCustodian();
        }

        address previousCustodian = record.currentCustodian;

        record.currentCustodian = msg.sender;
        record.pendingCustodian = address(0);

        emit HandoverAccepted(
            evidenceId,
            previousCustodian,
            msg.sender,
            block.timestamp
        );
    }

    function cancelHandover(
        string calldata evidenceId
    ) external {
        bytes32 evidenceKey = keccak256(bytes(evidenceId));
        EvidenceRecord storage record = evidenceRecords[evidenceKey];

        if (!record.exists) {
            revert EvidenceNotFound(evidenceId);
        }

        if (msg.sender != record.currentCustodian) {
            revert NotCurrentCustodian();
        }

        if (record.pendingCustodian == address(0)) {
            revert NoPendingHandover();
        }

        address cancelledRecipient = record.pendingCustodian;
        record.pendingCustodian = address(0);

        emit HandoverCancelled(
            evidenceId,
            msg.sender,
            cancelledRecipient,
            block.timestamp
        );
    }

    function getCustody(
        string calldata evidenceId
    )
        external
        view
        returns (
            address currentCustodian,
            address pendingCustodian,
            uint256 registeredAt
        )
    {
        bytes32 evidenceKey = keccak256(bytes(evidenceId));
        EvidenceRecord storage record = evidenceRecords[evidenceKey];

        if (!record.exists) {
            revert EvidenceNotFound(evidenceId);
        }

        return (
            record.currentCustodian,
            record.pendingCustodian,
            record.registeredAt
        );
    }
}
