import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import { ethers } from "ethers";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.13",
    settings: {
      optimizer: {
        enabled: true,
        runs: 10_000,
      },
    },
  },
  networks: {
    hardhat: {},
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${process.env.RPC_ENDPOINT_ETHEREUM_KEY}`,
      accounts: [process.env.PRIVATE_KEY || ""],
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.RPC_ENDPOINT_POLYGON_KEY}`,
      accounts: [process.env.PRIVATE_KEY || ""],
    },
  },
  mocha: {
    timeout: 40_000,
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_ETHEREUM_API_KEY,
      polygonMumbai: process.env.ETHERSCAN_POLYGON_API_KEY,
    },
  },
};

export default config;
