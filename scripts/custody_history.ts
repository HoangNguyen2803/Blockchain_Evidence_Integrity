import { ethers } from "ethers";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

async function main() {
  const provider = new ethers.JsonRpcProvider(
    "http://127.0.0.1:8545"
  );

  try {
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

    const contractInterface = new ethers.Interface(artifact.abi);

    const evidenceId = "BEI-EV-COC-001";

    const eventNames = [
      "EvidenceRegistered",
      "HandoverInitiated",
      "HandoverAccepted",
      "HandoverCancelled"
    ];

    const history: object[] = [];

    console.log("=== CHAIN OF CUSTODY EVENT HISTORY ===");
    console.log("Contract:", deployment.contractAddress);
    console.log("Evidence ID:", evidenceId);

    for (const eventName of eventNames) {
      const eventFragment =
        contractInterface.getEvent(eventName);

      if (!eventFragment) {
        throw new Error(`Event not found: ${eventName}`);
      }

      const logs = await provider.getLogs({
        address: deployment.contractAddress,
        topics: [eventFragment.topicHash],
        fromBlock: 0,
        toBlock: "latest"
      });

      for (const log of logs) {
        const parsed = contractInterface.parseLog(log);

        if (!parsed || parsed.args[0] !== evidenceId) {
          continue;
        }

        const block = await provider.getBlock(log.blockNumber);

        const item = {
          event: eventName,
          evidenceId: parsed.args[0],
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
          timestamp: block
            ? new Date(Number(block.timestamp) * 1000).toISOString()
            : null,
          details:
            eventName === "EvidenceRegistered"
              ? {
                  sha256Hash: parsed.args[2],
                  registeredBy: parsed.args[3]
                }
              : eventName === "HandoverInitiated" ||
                eventName === "HandoverAccepted"
              ? {
                  fromCustodian: parsed.args[1],
                  toCustodian: parsed.args[2]
                }
              : {
                  fromCustodian: parsed.args[1],
                  cancelledRecipient: parsed.args[2]
                }
        };

        history.push(item);

        console.log("\nEvent:", item.event);
        console.log("Block:", item.blockNumber);
        console.log("Transaction:", item.transactionHash);
        console.log("Timestamp:", item.timestamp);
        console.log("Details:", item.details);
      }
    }

    history.sort((a: any, b: any) =>
      a.blockNumber - b.blockNumber
    );

    await writeFile(
      resolve("results/coc_event_history.json"),
      JSON.stringify(history, null, 2) + "\n"
    );

    console.log("\n=== HISTORY SUMMARY ===");
    console.log("Total matching events:", history.length);
    console.log("History file: results/coc_event_history.json");

  } finally {
    await provider.destroy();
  }
}

main().catch((error) => {
  console.error("History query failed:", error);
  process.exitCode = 1;
});
