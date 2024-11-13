// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DeploymentModule", (m) => {
  const pack_price = [10000000, 100000000];

  // 設定參數
  const ownerAddress = m.getAccount(0);
//   const referralAccount = m.getAccount(1);
//   const otherAccounts = m.getAccounts(2, 11);

  // 部署合約
  const register = m.contract("Register", [ownerAddress]);
  const token = m.contract("ERC20Token", [6, ownerAddress, "Test Token"]);
  const prizeItems = m.contract("PrizeItems", [
    ownerAddress,
    register,
    "ipfs://QmavVun2oGtas452SehhDE638vVX1ukyt4CSAveLgCEA4Z",
  ]);

  const marketplace = m.contract("MarketplaceReceiver", [
    token,
    ownerAddress,
    register,
  ]);

  const fomo3d = m.contract("Fomo3d", [token, register, 1000000]);

  const jackpot = m.contract("Jackpot", [
    ownerAddress,
    token,
    prizeItems,
    [1, 2, 3, 4, 5],
  ]);

  const referral = m.contract("Referral", [register]);

  const vrf = m.contract("VRFv2SubscriptionManagerTEST", [
    ownerAddress,
    ownerAddress,
    register,
  ]);

  const hierarchicalDrawing = m.contract("HierarchicalDrawing", [
    ownerAddress,
    register,
    prizeItems,
  ]);

  // 設定 Register 合約中的角色
//   m.call(register, "grantRole", [register.FOMO3D(), fomo3d]);
//   m.call(register, "grantRole", [register.JACKPOT(), jackpot]);
//   m.call(register, "grantRole", [register.MARKET(), marketplace]);
//   m.call(register, "grantRole", [register.PRIZE_ITEMS(), prizeItems]);
//   m.call(register, "grantRole", [register.REFERRAL(), referral]);
//   m.call(register, "grantRole", [register.VRF(), vrf]);
//   m.call(register, "grantRole", [register.DRAW(), hierarchicalDrawing]);
//   m.call(register, "grantRole", [register.TOKEN(), token]);

  // 配置 Marketplace 和 HierarchicalDrawing 合約
//   m.call(marketplace, "setPack", [0, pack_price[0], [0], [1]]);
//   m.call(marketplace, "setPack", [1, pack_price[1], [0], [11]]);

//   m.call(hierarchicalDrawing, "setTokenPool", [[1, 2, 3, 4, 5]]);
//   m.call(hierarchicalDrawing, "setTokenMaxAmount", [
//     [50000, 50000, 50000, 50000, 50000],
//   ]);
//   m.call(hierarchicalDrawing, "setUnitPool", [0, [50, 0, 0, 0, 50]]);
//   m.call(hierarchicalDrawing, "setUnitPool", [1, [0, 50, 50, 0, 0]]);
//   m.call(hierarchicalDrawing, "setUnitPool", [2, [0, 0, 0, 100, 0]]);
//   m.call(hierarchicalDrawing, "setDrawingPool", [0, [0, 1, 2], [875, 100, 25]]);

  return {
    register,
    token,
    prizeItems,
    marketplace,
    fomo3d,
    jackpot,
    referral,
    vrf,
    hierarchicalDrawing,
  };
});
