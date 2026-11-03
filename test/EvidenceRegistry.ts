
import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("EvidenceRegistry", function () {
  async function deployRegistry() {
    const [owner, other] = await ethers.getSigners();
    const registry = await ethers.deployContract("EvidenceRegistry");

    return { registry, owner, other };
  }

  const evidenceId = "BEI-EV-001";

  const validHash = ethers.sha256(
    ethers.toUtf8Bytes("BEI-2026 simulated evidence")
  );

  const modifiedHash = ethers.sha256(
    ethers.toUtf8Bytes("BEI-2026 modified evidence")
  );

  it("SC-T01: Should register evidence successfully", async function () {
    const { registry, owner } = await deployRegistry();

    await expect(
      registry.registerEvidence(evidenceId, validHash)
    ).to.emit(registry, "EvidenceRegistered");

    expect(await registry.isEvidenceRegistered(evidenceId)).to.equal(true);

    const record = await registry.getEvidence(evidenceId);

    expect(record.id).to.equal(evidenceId);
    expect(record.sha256Hash).to.equal(validHash);
    expect(record.registeredBy).to.equal(owner.address);
    expect(record.exists).to.equal(true);
  });

  it("SC-T02: Should reject an empty evidence ID", async function () {
    const { registry } = await deployRegistry();

    await expect(
      registry.registerEvidence("", validHash)
    ).to.be.revertedWithCustomError(registry, "EmptyEvidenceId");
  });

  it("SC-T03: Should reject an empty SHA-256 hash", async function () {
    const { registry } = await deployRegistry();

    await expect(
      registry.registerEvidence(evidenceId, ethers.ZeroHash)
    ).to.be.revertedWithCustomError(registry, "EmptyEvidenceHash");
  });

  it("SC-T04: Should reject duplicate evidence registration", async function () {
    const { registry } = await deployRegistry();

    await registry.registerEvidence(evidenceId, validHash);

    await expect(
      registry.registerEvidence(evidenceId, modifiedHash)
    ).to.be.revertedWithCustomError(
      registry,
      "EvidenceAlreadyRegistered"
    );
  });

  it("SC-T05: Should return false for an unregistered evidence ID", async function () {
    const { registry } = await deployRegistry();

    expect(
      await registry.isEvidenceRegistered("BEI-EV-UNKNOWN")
    ).to.equal(false);
  });

  it("SC-T06: Should reject retrieving unregistered evidence", async function () {
    const { registry } = await deployRegistry();

    await expect(
      registry.getEvidence("BEI-EV-UNKNOWN")
    ).to.be.revertedWithCustomError(registry, "EvidenceNotFound");
  });

it("SC-T07: Should verify matching SHA-256 hash", async function () {
  const { registry, owner } = await deployRegistry();

  await registry.registerEvidence(evidenceId, validHash);

  const tx = await registry.verifyEvidence(evidenceId, validHash);
  const receipt = await tx.wait();

  const event = receipt?.logs
    .map((log) => {
      try {
        return registry.interface.parseLog(log);
      } catch {
        return null;
      }
    })
    .find((log) => log?.name === "EvidenceVerified");

  expect(event).to.not.equal(undefined);
  expect(event!.args.integrityMatched).to.equal(true);
  expect(event!.args.verifiedBy).to.equal(owner.address);
});

it("SC-T08: Should detect a mismatched SHA-256 hash", async function () {
  const { registry, owner } = await deployRegistry();

  await registry.registerEvidence(evidenceId, validHash);

  const tx = await registry.verifyEvidence(evidenceId, modifiedHash);
  const receipt = await tx.wait();

  const event = receipt?.logs
    .map((log) => {
      try {
        return registry.interface.parseLog(log);
      } catch {
        return null;
      }
    })
    .find((log) => log?.name === "EvidenceVerified");

  expect(event).to.not.equal(undefined);
  expect(event!.args.integrityMatched).to.equal(false);
  expect(event!.args.submittedHash).to.equal(modifiedHash);
  expect(event!.args.verifiedBy).to.equal(owner.address);
});

  it("SC-T09: Should reject verification of unregistered evidence", async function () {
    const { registry } = await deployRegistry();

    await expect(
      registry.verifyEvidence("BEI-EV-UNKNOWN", validHash)
    ).to.be.revertedWithCustomError(registry, "EvidenceNotFound");
  });

  it("SC-T10: Should preserve the original hash after verification", async function () {
    const { registry } = await deployRegistry();

    await registry.registerEvidence(evidenceId, validHash);

    await registry.verifyEvidence(evidenceId, modifiedHash);

    const record = await registry.getEvidence(evidenceId);

/*    expect(record.sha256Hash).to.equal(validHash);
  });
});
*/

    expect(record.sha256Hash).to.equal(validHash);
  });


  // Chain of Custody tests

  it("COC-T01: Should initiate handover", async function () {
    const { registry, owner, other } = await deployRegistry();
    await registry.registerEvidence(evidenceId, validHash);

    await expect(
      registry.handoverEvidence(evidenceId, other.address)
    ).to.emit(registry, "HandoverInitiated");

    const custody = await registry.getCustody(evidenceId);
    expect(custody.currentCustodian).to.equal(owner.address);
    expect(custody.pendingCustodian).to.equal(other.address);
  });

  it("COC-T02: Should accept handover", async function () {
    const { registry, other } = await deployRegistry();
    await registry.registerEvidence(evidenceId, validHash);
    await registry.handoverEvidence(evidenceId, other.address);

    await expect(
      registry.connect(other).acceptHandover(evidenceId)
    ).to.emit(registry, "HandoverAccepted");

    const custody = await registry.getCustody(evidenceId);
    expect(custody.currentCustodian).to.equal(other.address);
    expect(custody.pendingCustodian).to.equal(ethers.ZeroAddress);
  });

  it("COC-T03: Should reject unauthorized acceptance", async function () {
    const { registry, owner, other } = await deployRegistry();
    const [, , third] = await ethers.getSigners();

    await registry.registerEvidence(evidenceId, validHash);
    await registry.handoverEvidence(evidenceId, other.address);

    await expect(
      registry.connect(third).acceptHandover(evidenceId)
    ).to.be.revertedWithCustomError(registry, "NotPendingCustodian");

    const custody = await registry.getCustody(evidenceId);
    expect(custody.currentCustodian).to.equal(owner.address);
  });

  it("COC-T04: Should reject handover by non-custodian", async function () {
    const { registry, other } = await deployRegistry();
    const [, , third] = await ethers.getSigners();

    await registry.registerEvidence(evidenceId, validHash);

    await expect(
      registry.connect(other).handoverEvidence(evidenceId, third.address)
    ).to.be.revertedWithCustomError(registry, "NotCurrentCustodian");
  });

  it("COC-T05: Should reject zero-address recipient", async function () {
    const { registry } = await deployRegistry();
    await registry.registerEvidence(evidenceId, validHash);

    await expect(
      registry.handoverEvidence(evidenceId, ethers.ZeroAddress)
    ).to.be.revertedWithCustomError(registry, "InvalidRecipient");
  });

  it("COC-T06: Should reject handover to self", async function () {
    const { registry, owner } = await deployRegistry();
    await registry.registerEvidence(evidenceId, validHash);

    await expect(
      registry.handoverEvidence(evidenceId, owner.address)
    ).to.be.revertedWithCustomError(registry, "SameCustodian");
  });

  it("COC-T07: Should reject a second pending handover", async function () {
    const { registry, other } = await deployRegistry();
    const [, , third] = await ethers.getSigners();

    await registry.registerEvidence(evidenceId, validHash);
    await registry.handoverEvidence(evidenceId, other.address);

    await expect(
      registry.handoverEvidence(evidenceId, third.address)
    ).to.be.revertedWithCustomError(registry, "HandoverAlreadyPending");
  });

  it("COC-T08: Should cancel pending handover", async function () {
    const { registry, owner, other } = await deployRegistry();
    await registry.registerEvidence(evidenceId, validHash);
    await registry.handoverEvidence(evidenceId, other.address);

    await expect(
      registry.cancelHandover(evidenceId)
    ).to.emit(registry, "HandoverCancelled");

    const custody = await registry.getCustody(evidenceId);
    expect(custody.currentCustodian).to.equal(owner.address);
    expect(custody.pendingCustodian).to.equal(ethers.ZeroAddress);
  });

  it("COC-T09: Should reject acceptance without pending handover", async function () {
    const { registry, other } = await deployRegistry();
    await registry.registerEvidence(evidenceId, validHash);

    await expect(
      registry.connect(other).acceptHandover(evidenceId)
    ).to.be.revertedWithCustomError(registry, "NoPendingHandover");
  });

  it("COC-T10: Should reject cancellation by non-custodian", async function () {
    const { registry, owner, other } = await deployRegistry();
    await registry.registerEvidence(evidenceId, validHash);
    await registry.handoverEvidence(evidenceId, other.address);

    await expect(
      registry.connect(other).cancelHandover(evidenceId)
    ).to.be.revertedWithCustomError(registry, "NotCurrentCustodian");

    const custody = await registry.getCustody(evidenceId);
    expect(custody.currentCustodian).to.equal(owner.address);
    expect(custody.pendingCustodian).to.equal(other.address);
  });
});
