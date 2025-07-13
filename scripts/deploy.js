
const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying ThoughtLedger contract...");

  // Get the contract factory
  const ThoughtLedger = await hre.ethers.getContractFactory("ThoughtLedger");
  
  // Deploy the contract
  const thoughtLedger = await ThoughtLedger.deploy();
  
  // Wait for deployment to finish
  await thoughtLedger.waitForDeployment();
  
  const contractAddress = await thoughtLedger.getAddress();
  
  console.log("✅ ThoughtLedger deployed successfully!");
  console.log("📍 Contract Address:", contractAddress);
  console.log("🔗 Network:", hre.network.name);
  
  // Verify contract on Etherscan (if not on localhost)
  if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
    console.log("⏳ Waiting for block confirmations...");
    await thoughtLedger.deploymentTransaction().wait(6);
    
    console.log("🔍 Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on Etherscan!");
    } catch (error) {
      console.log("❌ Contract verification failed:", error.message);
    }
  }
  
  console.log("\n🎉 Deployment complete!");
  console.log("📋 Next steps:");
  console.log("1. Update the contract address in your frontend");
  console.log("2. Test the contract functions");
  console.log("3. Deploy your frontend to Cloudflare Pages");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });

