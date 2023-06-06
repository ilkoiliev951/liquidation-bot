const hre = require("hardhat")

async function deployContract() {
  const liquidationContract = await hre.ethers.getContractFactory("LiquidationArb");
  const library = await liquidationContract.deploy();
  await library.deployed();
  console.log(`The Liquidation Contract was deployed to ${library.address}`);
}

deployContract().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});