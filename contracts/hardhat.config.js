require("@nomicfoundation/hardhat-toolbox");
const { vars } = require("hardhat/config");
const PRIVATE_KEY = vars.get("PRIVATE");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.23"
      },
      {
        version: "0.8.27" // 如果有使用其他版本也可以在此添加
      }
    ]
  },
  networks: {
    hardhat: {
      chainId: 1337 // We set 1337 to make interacting with MetaMask simpler
    },
    sepolia: {
      url: `https://ethereum-sepolia-rpc.publicnode.com`,
      accounts: [PRIVATE_KEY],
    },
    scroll_test: {
      url: `https://scroll-sepolia-rpc.publicnode.com`,
      accounts: [PRIVATE_KEY],
      gas: "auto", 
      gasPrice: "auto", 
    },

  }
};
