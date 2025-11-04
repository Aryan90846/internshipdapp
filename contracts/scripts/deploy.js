const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying InternCertificateNFT...");
  console.log("📍 Network:", hre.network.name);
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("👤 Deploying with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH");

  // Deploy contract
  const InternCertificateNFT = await hre.ethers.getContractFactory("InternCertificateNFT");
  const certificate = await InternCertificateNFT.deploy();
  
  await certificate.waitForDeployment();
  const contractAddress = await certificate.getAddress();

  console.log("\n✅ Contract deployed successfully!");
  console.log("📝 Contract Address:", contractAddress);
  console.log("🔗 Explorer:", getExplorerUrl(hre.network.name, contractAddress));
  
  // Grant ISSUER_ROLE to the specified admin wallet
  const ADMIN_WALLET = "0xbE27dFb76bdb342313B13357252A42a4CA34431d";
  const ISSUER_ROLE = await certificate.ISSUER_ROLE();
  
  console.log("\n🔐 Granting ISSUER_ROLE to admin wallet...");
  const grantTx = await certificate.grantRole(ISSUER_ROLE, ADMIN_WALLET);
  await grantTx.wait();
  console.log("✅ ISSUER_ROLE granted to:", ADMIN_WALLET);

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    contractAddress: contractAddress,
    deployer: deployer.address,
    adminWallet: ADMIN_WALLET,
    deploymentTime: new Date().toISOString(),
    explorerUrl: getExplorerUrl(hre.network.name, contractAddress),
  };

  console.log("\n📋 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  console.log("\n⚠️  Next Steps:");
  console.log("1. Verify contract: npm run verify:" + hre.network.name.replace("polygon", "").replace("Amoy", "amoy") + " " + contractAddress);
  console.log("2. Update .env with CONTRACT_ADDRESS=" + contractAddress);
  console.log("3. Update src/config/web3.ts with the contract address");
  console.log("\n🎉 Deployment complete!");
}

function getExplorerUrl(network, address) {
  const explorers = {
    polygonAmoy: `https://amoy.polygonscan.com/address/${address}`,
    baseSepolia: `https://sepolia.basescan.org/address/${address}`,
  };
  return explorers[network] || address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
