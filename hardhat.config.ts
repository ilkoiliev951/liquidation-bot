import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-toolbox";

module.exports = {
  solidity: "0.8.10",
  networks: {
    hardhat: {
      forking: {
        url: `https://eth-sepolia.g.alchemy.com/v2/tN4bl6Mhux2yS2pvZbJ_l1Wyu2JHb9YS`,
      }
    }
  }
};
