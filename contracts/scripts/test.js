const hre = require("hardhat");
const { ZeroAddress } = require("ethers");

async function main() {
  // Register deployed to: 0x1b73Ae17FD3ccFd91aE61ac3bB0CF314054B1eb4
  // ERC20Token deployed to: 0xC4734D1D2c7CD7F8241A1a83816E27e2Dc6Fd1af
  // PrizeItems deployed to: 0x46d657Ba75C5A1fd60b9E4dee64318Ff69e670fe
  // MarketplaceReceiver deployed to: 0xCa24de3a05FDDBCA9F39dd02937cA86cD815A1f6
  // Fomo3d deployed to: 0xf0C8283157f9C6C59D34083D52955783a3F0414A
  // Jackpot deployed to: 0x22b605fC43AC6cAf517D02fA06AcF1a49ba860Ed
  // Referral deployed to: 0xDd866d81B0E56DBa8a5eAdC9A3787f411F3e3E3C
  // VRFManager deployed to: 0xD4F87E159060000cd3111AA6b58f61720Cd43AE3
  // HierarchicalDrawing deployed to: 0x354256aF8b725662E4411EBE178c47d1f97a509B
  const tokenAddress = "0x2D9a163085725135CF253bc4046ce4c2ab9cc7f1";
  const marketplaceAddress = "0xACcEF77c3701dEa122405A27b405e4c0A0951EA7";
  const registerAddress = "0x0c64B8ff467aC7E0D429a9ec2b6292F6e9A9e498";
  const prizeItemsAddress = "0xa01aeb570D2a3F18Ed31C18FA3c10B41cc3463c3";
  const fomo3dAddress = "0xEE9b7D5DD39DB79f2aD922B17B03FCB17a680FdB";
  const jackpotAddress = "0x7FD34832678c84AAD0120a0471188b63f0c9eC22";
  const referralAddress = "0x356EEF064f0995f30c14f6d0178A8C59A76A939e";
  const vrfAddress = "0xb7A9F4Afcdaf1aeb5427F74B5d2Af0b882Ee9dBA";
  const hierarchicalDrawingAddress = "0x43E12A23b963FbAdfd91bfDD4C08a9eAF02f8E5d";




  const [signer] = await hre.ethers.getSigners(); // 默认使用第一个账户签名交易

  // 获取合约的 ABI 和合约工厂
  let contractABI = require("../artifacts/contracts/tests/ERC20Token.sol/ERC20Token.json").abi;
  const token = new hre.ethers.Contract(tokenAddress, contractABI, signer);
  contractABI = require("../artifacts/contracts/periphery/MarketplaceExample.sol/MarketplaceReceiver.json").abi;
  const marketplace = new hre.ethers.Contract(marketplaceAddress, contractABI, signer);
  contractABI = require("../artifacts/contracts/periphery/Register.sol/Register.json").abi;
  const register = new hre.ethers.Contract(registerAddress, contractABI, signer);
  contractABI = require("../artifacts/contracts/periphery/PrizeItem.sol/PrizeItems.json").abi;
  const prizeItems = new hre.ethers.Contract(prizeItemsAddress, contractABI, signer);

  // 调用合约的方法
  console.log("Reading data from the contract...");
  let data = await token.balanceOf(signer.address); // 替换为你的读操作函数及参数
  let data2 = await prizeItems.balanceOfBatch([signer.address, signer.address, signer.address, signer.address, signer.address], [1,2,3,4,5]);
  console.log("token.balanceOf:", data.toString());
  console.log("prizeItems.balanceOfBatch:", data2.toString());


  // 写操作示例（需要支付 Gas）
  console.log("Writing data to the contract...");
  let tx =  await marketplace.purchasePack(1, 1, ZeroAddress, [Math.floor(Math.random() * 1000000)]);
  await tx.wait(); // 等待交易被矿工确认
  console.log("Transaction confirmed. Hash:", tx.hash);

  console.log("Reading data from the contract...");
  data = await token.balanceOf(signer.address); // 替换为你的读操作函数及参数
  data2 = await prizeItems.balanceOfBatch([signer.address, signer.address, signer.address, signer.address, signer.address], [1,2,3,4,5]);
  console.log("token.balanceOf:", data.toString());
  console.log("prizeItems.balanceOfBatch:", data2.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
