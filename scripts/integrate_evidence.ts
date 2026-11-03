import { ethers } from "ethers";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

async function main() {
  const root = process.cwd();

  const evidenceFile = path.join(root, "evidence_samples/evidence_001.txt");
  const manifestFile = path.join(root, "results/evidence_001.signature.json");
  const publicKeyFile = path.join(root, "keys/public_key.pem");
  const deploymentFile = path.join(root, "results/deployment_coc.json");
  const artifactFile = path.join(
    root,
    "artifacts/contracts/EvidenceRegistry.sol/EvidenceRegistry.json"
  );

  const deployment = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  const artifact = JSON.parse(fs.readFileSync(artifactFile, "utf8"));
  const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));

  console.log("=== BEI-2026 PYTHON ↔ BLOCKCHAIN INTEGRATION ===");

  // 1. Calculate SHA-256 using the existing Python module.
  const hashOutput = execFileSync(
    "python3",
    ["python/hash_evidence.py", "hash", evidenceFile],
    { encoding: "utf8" }
  );
  const hashResult = JSON.parse(hashOutput);
  const evidenceHash = "0x" + hashResult.sha256;

  console.log("[PASS] Python SHA-256:", hashResult.sha256);

  // 2. Verify Ed25519 signature before any blockchain transaction.
  const verifyOutput = execFileSync(
    "python3",
    [
      "python/digital_signature.py",
      "verify",
      evidenceFile,
      "--manifest",
      manifestFile,
      "--public-key",
      publicKeyFile,
    ],
    { encoding: "utf8" }
  );
  const signatureResult = JSON.parse(verifyOutput);

  if (
    signatureResult.integrity_verified !== true ||
    signatureResult.signature_valid !== true ||
    signatureResult.metadata_matches !== true
  ) {
    throw new Error("Digital signature or evidence integrity verification failed.");
  }

  console.log("[PASS] Ed25519 signature:", signatureResult.verification_status);

  const evidenceId = manifest.payload.evidence_id;

  if (hashResult.sha256 !== manifest.payload.sha256) {
    throw new Error("Calculated SHA-256 does not match signed manifest.");
  }

  // 3. Connect to the Chain of Custody contract.
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const network = await provider.getNetwork();

  if (network.chainId !== BigInt(deployment.chainId)) {
    throw new Error(`Unexpected chain ID: ${network.chainId}`);
  }

  const signer = await provider.getSigner(0);
  const contract = new ethers.Contract(
    deployment.contractAddress,
    artifact.abi,
    signer
  );

  console.log("[PASS] Connected to chain ID:", network.chainId.toString());
  console.log("[INFO] Contract:", deployment.contractAddress);
  console.log("[INFO] Evidence ID:", evidenceId);

  // 4. Prevent duplicate registration.
  const alreadyRegistered = await contract.isEvidenceRegistered(evidenceId);

  if (alreadyRegistered) {
    throw new Error(
      `Evidence ID ${evidenceId} is already registered. No transaction sent.`
    );
  }

  // 5. Register the verified evidence hash.
  const tx = await contract.registerEvidence(evidenceId, evidenceHash);
  console.log("[INFO] Registration transaction:", tx.hash);

  const receipt = await tx.wait();

  if (!receipt || receipt.status !== 1) {
    throw new Error("Blockchain registration transaction failed.");
  }

  console.log("[PASS] Blockchain registration, block:", receipt.blockNumber);

  // 6. Read back and compare the on-chain hash.
  const record = await contract.getEvidence(evidenceId);
  const onChainHash = record.sha256Hash;

  if (onChainHash.toLowerCase() !== evidenceHash.toLowerCase()) {
    throw new Error("On-chain hash does not match Python SHA-256.");
  }

  console.log("[PASS] On-chain hash matches Python SHA-256.");
  console.log("Registered by:", record.registeredBy);
  console.log("Current custodian:", await contract.getCustody(evidenceId));
  console.log("=== INTEGRATION RESULT: PASS ===");
  console.log("Transaction:", tx.hash);
}

main().catch((error) => {
  console.error("=== INTEGRATION RESULT: FAIL ===");
  console.error(error);
  process.exitCode = 1;
});
