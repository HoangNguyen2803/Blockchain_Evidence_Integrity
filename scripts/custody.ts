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
    const owner = await provider.getSigner(0);
    const recipient = await provider.getSigner(1);

    const ownerAddress = await owner.getAddress();
    const recipientAddress = await recipient.getAddress();

    const deployment = JSON.parse(
      await readFile(
        resolve("results/deployment_coc.json"),
        "utf8"
      )
    );

    const artifact = JSON.parse(
      await readFile(
        resolve("artifacts/contracts/EvidenceRegistry.sol/EvidenceRegistry.json"),
        "utf8"
      )
    );

    const contract = new ethers.Contract(
      deployment.contractAddress,
      artifact.abi,
      owner
    );

    const evidenceId = "BEI-EV-COC-001";

    const evidencePath = resolve(
      "evidence_samples/evidence_001.txt"
    );

    const evidenceHash = await calculateSHA256(evidencePath);

    console.log("=== CHAIN OF CUSTODY INTERACTION ===");
    console.log("Contract:", deployment.contractAddress);
    console.log("Evidence ID:", evidenceId);
    console.log("Evidence SHA-256:", evidenceHash);
    console.log("Initial custodian:", ownerAddress);
    console.log("Recipient:", recipientAddress);

    const alreadyRegistered =
      await contract.isEvidenceRegistered(evidenceId);

    if (alreadyRegistered) {
      throw new Error(
        "Evidence ID already registered. Stop to avoid duplicate registration."
      );
    }

    // 1. Register evidence
    const registerTx = await contract.registerEvidence(
      evidenceId,
      evidenceHash
    );

    const registerReceipt = await registerTx.wait();

    console.log("\n[1] Evidence registration: SUCCESS");
    console.log("Transaction:", registerTx.hash);
    console.log("Block:", registerReceipt?.blockNumber);

    // 2. Check initial custody
    let custody = await contract.getCustody(evidenceId);

    console.log("\n[2] Initial custody:");
    console.log("Current custodian:", custody[0]);
    console.log("Pending custodian:", custody[1]);

    // 3. Initiate handover
    const handoverTx = await contract.handoverEvidence(
      evidenceId,
      recipientAddress
    );

    const handoverReceipt = await handoverTx.wait();

    console.log("\n[3] Handover initiated: SUCCESS");
    console.log("Transaction:", handoverTx.hash);
    console.log("Block:", handoverReceipt?.blockNumber);

    custody = await contract.getCustody(evidenceId);

    console.log("Current custodian:", custody[0]);
    console.log("Pending custodian:", custody[1]);

    // 4. Recipient accepts handover
/*    const recipientContract = contract.connect(recipient);

    const acceptTx = await recipientContract.acceptHandover(
      evidenceId
    );
    */
    const recipientContract = new ethers.Contract(
  deployment.contractAddress,
  artifact.abi,
  recipient
);

const acceptTx = await recipientContract.getFunction(
  "acceptHandover"
)(evidenceId);

    const acceptReceipt = await acceptTx.wait();

    console.log("\n[4] Handover accepted: SUCCESS");
    console.log("Transaction:", acceptTx.hash);
    console.log("Block:", acceptReceipt?.blockNumber);

    // 5. Verify final custody
    custody = await contract.getCustody(evidenceId);

    console.log("\n[5] Final custody:");
    console.log("Current custodian:", custody[0]);
    console.log("Pending custodian:", custody[1]);

    if (
      custody[0].toLowerCase() !== recipientAddress.toLowerCase() ||
      custody[1] !== ethers.ZeroAddress
    ) {
      throw new Error("Final custody verification failed.");
    }

    // 6. Verify evidence integrity after handover
    const record = await contract.getEvidence(evidenceId);

    const verifyTx = await contract.verifyEvidence(
      evidenceId,
      evidenceHash
    );

    const verifyReceipt = await verifyTx.wait();

    let integrityMatched = false;

    for (const log of verifyReceipt!.logs) {
      try {
        const parsed = contract.interface.parseLog(log);

        if (parsed?.name === "EvidenceVerified") {
          integrityMatched = parsed.args.integrityMatched;
        }
      } catch {
        // Ignore unrelated logs.
      }
    }

    if (!integrityMatched || record[1] !== evidenceHash) {
      throw new Error("Evidence integrity verification failed.");
    }

    console.log("\n[6] Evidence integrity after handover: PASS");
    console.log("Stored hash:", record[1]);
    console.log("Integrity matched:", integrityMatched);

    console.log("\n=== CHAIN OF CUSTODY SUMMARY ===");
    console.log("Evidence registration: PASS");
    console.log("Handover initiation: PASS");
    console.log("Recipient acceptance: PASS");
    console.log("Custodian update: PASS");
    console.log("Evidence integrity: PASS");

  } finally {
    await provider.destroy();
  }
}

main().catch((error) => {
  console.error("Chain of Custody interaction failed:", error);
  process.exitCode = 1;
});
