import { ethers } from "ethers";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

async function main() {
  const provider = new ethers.JsonRpcProvider(
    "http://127.0.0.1:8545"
  );

  try {
    const network = await provider.getNetwork();
    const deployer = await provider.getSigner(0);
    const deployerAddress = await deployer.getAddress();

    const artifactPath = resolve(
      "artifacts/contracts/EvidenceRegistry.sol/EvidenceRegistry.json"
    );

    const artifact = JSON.parse(
      await readFile(artifactPath, "utf8")
    );

    const factory = new ethers.ContractFactory(
      artifact.abi,
      artifact.bytecode,
      deployer
    );

    console.log("Deploying EvidenceRegistry with Chain of Custody...");
    console.log("Chain ID:", network.chainId.toString());
    console.log("Deployer:", deployerAddress);

    const contract = await factory.deploy();
    await contract.waitForDeployment();

    const contractAddress = await contract.getAddress();
    const deploymentTx = contract.deploymentTransaction();
    const receipt = await deploymentTx?.wait();

    if (!receipt || receipt.status !== 1) {
      throw new Error("Deployment transaction was unsuccessful.");
    }

    const bytecode = await provider.getCode(contractAddress);

    if (bytecode === "0x") {
      throw new Error("Contract bytecode is empty.");
    }

    const deployment = {
      contractName: "EvidenceRegistry",
      version: "Chain of Custody",
      contractAddress,
      transactionHash: deploymentTx?.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      deployer: deployerAddress,
      chainId: network.chainId.toString(),
      bytecodeVerified: true,
      deploymentStatus: "SUCCESS",
      deployedAt: new Date().toISOString()
    };

    await writeFile(
      resolve("results/deployment_coc.json"),
      JSON.stringify(deployment, null, 2) + "\n"
    );

    console.log("\n=== COC DEPLOYMENT SUCCESSFUL ===");
    console.log(JSON.stringify(deployment, null, 2));
  } finally {
    await provider.destroy();
  }
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
