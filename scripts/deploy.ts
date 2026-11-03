import { ethers } from "ethers";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

async function main() {
  // Connect to the local Hardhat JSON-RPC node
  const provider = new ethers.JsonRpcProvider(
    "http://127.0.0.1:8545"
  );

  // Use the first unlocked account provided by Hardhat Network
  const deployer = await provider.getSigner(0);
  const deployerAddress = await deployer.getAddress();

  // Load the compiled contract artifact
  const artifactPath = resolve(
    "artifacts/contracts/EvidenceRegistry.sol/EvidenceRegistry.json"
  );

  const artifact = JSON.parse(
    await readFile(artifactPath, "utf8")
  );

  // Deploy EvidenceRegistry
  const factory = new ethers.ContractFactory(
    artifact.abi,
    artifact.bytecode,
    deployer
  );

  console.log("Deploying EvidenceRegistry...");
  console.log("Deployer:", deployerAddress);

  const contract = await factory.deploy();
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  const deploymentTx = contract.deploymentTransaction();
  const receipt = await deploymentTx?.wait();

  console.log("\n=== DEPLOYMENT SUCCESSFUL ===");
  console.log("Contract:", "EvidenceRegistry");
  console.log("Address:", contractAddress);
  console.log("Transaction Hash:", deploymentTx?.hash);
  console.log("Block Number:", receipt?.blockNumber);
  console.log("Gas Used:", receipt?.gasUsed.toString());
  console.log("Deployer:", deployerAddress);

  await provider.destroy();
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
