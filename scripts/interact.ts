import { ethers } from "ethers";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve } from "node:path";

async function calculateSHA256(filePath: string): Promise<string> {
  const content = await readFile(filePath);

  return (
    "0x" +
    createHash("sha256")
      .update(content)
      .digest("hex")
  );
}

async function main() {
  const provider = new ethers.JsonRpcProvider(
    "http://127.0.0.1:8545"
  );

  try {
    const signer = await provider.getSigner(0);

    const deploymentPath = resolve(
      "results/deployment_local.json"
    );

    const deployment = JSON.parse(
      await readFile(deploymentPath, "utf8")
    );

    const artifactPath = resolve(
      "artifacts/contracts/EvidenceRegistry.sol/EvidenceRegistry.json"
    );

    const artifact = JSON.parse(
      await readFile(artifactPath, "utf8")
    );

    const contract = new ethers.Contract(
      deployment.contractAddress,
      artifact.abi,
      signer
    );

    const evidenceId = "BEI-EV-001";

    const originalPath = resolve(
      "evidence_samples/evidence_001.txt"
    );

    const modifiedPath = resolve(
      "evidence_samples/evidence_001_modified.txt"
    );

    const originalHash = await calculateSHA256(originalPath);
    const modifiedHash = await calculateSHA256(modifiedPath);

    console.log("=== BLOCKCHAIN INTERACTION ===");
    console.log("Contract:", deployment.contractAddress);
    console.log("Evidence ID:", evidenceId);

    const alreadyRegistered =
      await contract.isEvidenceRegistered(evidenceId);

    console.log("\n[1] Initial registration status:",
      alreadyRegistered);

    if (alreadyRegistered) {
      throw new Error(
        "Evidence ID already exists. Stop to avoid duplicate registration."
      );
    }

    console.log("\n[2] Original SHA-256:", originalHash);
    console.log("[3] Modified SHA-256:", modifiedHash);

    const registerTx = await contract.registerEvidence(
      evidenceId,
      originalHash
    );

    const registerReceipt = await registerTx.wait();

    console.log("\n[4] Registration transaction:", registerTx.hash);
    console.log("[5] Registration block:", registerReceipt?.blockNumber);

    const record = await contract.getEvidence(evidenceId);

    console.log("\n[6] Stored evidence record:");
    console.log("Evidence ID:", record[0]);
    console.log("Stored hash:", record[1]);
    console.log("Registered by:", record[2]);
    console.log("Registered at:", record[3].toString());
    console.log("Exists:", record[4]);

    const correctTx = await contract.verifyEvidence(
      evidenceId,
      originalHash
    );

    const correctReceipt = await correctTx.wait();

    let correctEventFound = false;

    for (const log of correctReceipt!.logs) {
      try {
        const parsed = contract.interface.parseLog(log);

        if (parsed?.name === "EvidenceVerified") {
          correctEventFound = true;
          console.log("\n[7] Original file verification:");
          console.log("Integrity matched:", parsed.args.integrityMatched);
          console.log("Verified by:", parsed.args.verifiedBy);
        }
      } catch {
        // Ignore logs from other contracts.
      }
    }

    const modifiedTx = await contract.verifyEvidence(
      evidenceId,
      modifiedHash
    );

    const modifiedReceipt = await modifiedTx.wait();

    let modifiedEventFound = false;

    for (const log of modifiedReceipt!.logs) {
      try {
        const parsed = contract.interface.parseLog(log);

        if (parsed?.name === "EvidenceVerified") {
          modifiedEventFound = true;
          console.log("\n[8] Modified file verification:");
          console.log("Integrity matched:", parsed.args.integrityMatched);
          console.log("Verified by:", parsed.args.verifiedBy);
        }
      } catch {
        // Ignore logs from other contracts.
      }
    }

    if (!correctEventFound || !modifiedEventFound) {
      throw new Error("Verification event was not found.");
    }

    console.log("\n=== INTERACTION SUMMARY ===");
    console.log("Registration: SUCCESS");
    console.log("Original file: EXPECTED MATCH");
    console.log("Modified file: EXPECTED MISMATCH");
    console.log("Blockchain interaction: SUCCESS");

  } finally {
    await provider.destroy();
  }
}

main().catch((error) => {
  console.error("Interaction failed:", error);
  process.exitCode = 1;
});
