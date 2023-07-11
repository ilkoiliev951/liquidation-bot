import { HardhatUserConfig } from "hardhat/types";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import secrets from './secrets.json';
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.10",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    mainnet: {
      url: secrets.INFURA_HTTPS_MAIN,
      accounts: [secrets.PRIVATE_KEY],
      allowUnlimitedContractSize: true,
    },
    sepolia: {
      url: secrets.INFURA_WEBSOCKET_SEPOLIA,
      accounts: [secrets.PRIVATE_KEY],
      allowUnlimitedContractSize: true,
    },
    development: {
      url: "http://127.0.0.1:8545",
      allowUnlimitedContractSize: true,
    },
  }
};

export default config;