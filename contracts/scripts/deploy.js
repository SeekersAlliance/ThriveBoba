const hre = require("hardhat");

async function main() {
  // eslint-disable-next-line no-undef
  const [owner, referralAccount, ...otherAccounts] = await ethers.getSigners();

  // 部署 Register 合約
  const Register = await hre.ethers.getContractFactory("Register");
  const register = await Register.deploy(owner.address);
  console.log("Register deployed to:", register.target);

  // 部署 ERC20Token 合約
  const ERC20Token = await hre.ethers.getContractFactory("ERC20Token");
  const token = await ERC20Token.deploy(6, owner.address, "Test Token");
  console.log("ERC20Token deployed to:", token.target);

  // 部署 PrizeItems 合約
  const PrizeItems = await hre.ethers.getContractFactory("PrizeItems");
  const prizeItems = await PrizeItems.deploy(
    owner.address,
    register.target,
    "ipfs://QmavVun2oGtas452SehhDE638vVX1ukyt4CSAveLgCEA4Z"
  );
  console.log("PrizeItems deployed to:", prizeItems.target);

  // 部署 MarketplaceReceiver 合約
  const MarketplaceExample = await hre.ethers.getContractFactory("MarketplaceReceiver");
  const marketplace = await MarketplaceExample.deploy(token.target, owner.address, register.target);
  console.log("MarketplaceReceiver deployed to:", marketplace.target);

  // 部署 Fomo3d 合約
  const Fomo3d = await hre.ethers.getContractFactory("Fomo3d");
  const fomo3d = await Fomo3d.deploy(token.target, register.target, 1000000);
  console.log("Fomo3d deployed to:", fomo3d.target);

  // 部署 Jackpot 合約
  const Jackpot = await hre.ethers.getContractFactory("Jackpot");
  const jackpot = await Jackpot.deploy(owner.address, token.target, prizeItems.target, [1, 2, 3, 4, 5]);
  console.log("Jackpot deployed to:", jackpot.target);

  // 部署 Referral 合約
  const Referral = await hre.ethers.getContractFactory("Referral");
  const referral = await Referral.deploy(register.target);
  console.log("Referral deployed to:", referral.target);

  // 部署 VRFManager 合約
  const VRFv2SubscriptionManagerTEST = await hre.ethers.getContractFactory("VRFManager");
  const vrf = await VRFv2SubscriptionManagerTEST.deploy(marketplace.target, register.target);
  console.log("VRFManager deployed to:", vrf.target);

  // 部署 HierarchicalDrawing 合約
  const HierarchicalDrawing = await hre.ethers.getContractFactory("HierarchicalDrawing");
  const hierarchicalDrawing = await HierarchicalDrawing.deploy(owner.address, register.target, prizeItems.target);
  console.log("HierarchicalDrawing deployed to:", hierarchicalDrawing.target);

  // 設定角色
  await register.grantRole(await register.FOMO3D(), fomo3d.target);
  await register.grantRole(await register.JACKPOT(), jackpot.target);
  await register.grantRole(await register.MARKET(), marketplace.target);
  await register.grantRole(await register.PRIZE_ITEMS(), prizeItems.target);
  await register.grantRole(await register.REFERRAL(), referral.target);
  await register.grantRole(await register.VRF(), vrf.target);
  await register.grantRole(await register.DRAW(), hierarchicalDrawing.target);
  await register.grantRole(await register.TOKEN(), token.target);
  console.log("Roles granted successfully");

  // 設定 Marketplace 和 HierarchicalDrawing
  const pack_price = [10000000, 100000000]; // 示例，根據實際需要更改
  await marketplace.setPack(0, pack_price[0], [0], [1]);
  await marketplace.setPack(1, pack_price[1], [0], [11]);
  await hierarchicalDrawing.setTokenPool([1, 2, 3, 4, 5]);
  await hierarchicalDrawing.setTokenMaxAmount([50000, 50000, 50000, 50000, 50000]);
  await hierarchicalDrawing.setUnitPool(0, [50, 0, 0, 0, 50]);
  await hierarchicalDrawing.setUnitPool(1, [0, 50, 50, 0, 0]);
  await hierarchicalDrawing.setUnitPool(2, [0, 0, 0, 100, 0]);
  await hierarchicalDrawing.setDrawingPool(0, [0, 1, 2], [875, 100, 25]);
  console.log("Marketplace and HierarchicalDrawing configured successfully");

  // 給 owner 鑄造 token
  await token.mint(owner.address, 1000000000);
  await token.approve(marketplace.target, 100000000000);
  console.log("Token minted and approved successfully");

  console.log("Deployment complete!");
}

// 處理異常和啟動主腳本
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
//   Register deployed to: 0x0c64B8ff467aC7E0D429a9ec2b6292F6e9A9e498
//   ERC20Token deployed to: 0x2D9a163085725135CF253bc4046ce4c2ab9cc7f1
//   PrizeItems deployed to: 0xa01aeb570D2a3F18Ed31C18FA3c10B41cc3463c3
//   MarketplaceReceiver deployed to: 0xACcEF77c3701dEa122405A27b405e4c0A0951EA7
//   Fomo3d deployed to: 0xEE9b7D5DD39DB79f2aD922B17B03FCB17a680FdB
//   Jackpot deployed to: 0x7FD34832678c84AAD0120a0471188b63f0c9eC22
//   Referral deployed to: 0x356EEF064f0995f30c14f6d0178A8C59A76A939e
//   VRFManager deployed to: 0xb7A9F4Afcdaf1aeb5427F74B5d2Af0b882Ee9dBA
//   HierarchicalDrawing deployed to: 0x43E12A23b963FbAdfd91bfDD4C08a9eAF02f8E5d
//   Roles granted successfully
//   Marketplace and HierarchicalDrawing configured successfully
//   Token minted and approved successfully
//   Deployment complete!