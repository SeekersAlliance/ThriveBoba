/* eslint-disable no-undef */
const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ZeroAddress } = require("ethers");
const pack_price = [10000000, 100000000];

// describe("Lock", function () {
//   // We define a fixture to reuse the same setup in every test.
//   // We use loadFixture to run this setup once, snapshot that state,
//   // and reset Hardhat Network to that snapshot in every test.
//   async function deployOneYearLockFixture() {
//     const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
//     const ONE_GWEI = 1_000_000_000;

//     const lockedAmount = ONE_GWEI;
//     const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

//     // Contracts are deployed using the first signer/account by default
//     // eslint-disable-next-line no-undef
//     const [owner, otherAccount] = await ethers.getSigners();

//     // eslint-disable-next-line no-undef
//     const Lock = await ethers.getContractFactory("Lock");
//     const lock = await Lock.deploy(unlockTime, { value: lockedAmount });
//     return { lock, unlockTime, lockedAmount, owner, otherAccount };
//   }

//   describe("Deployment", function () {
//     it("Should set the right unlockTime", async function () {
//       const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);

//       expect(await lock.unlockTime()).to.equal(unlockTime);
//     });

//     it("Should set the right owner", async function () {
//       const { lock, owner } = await loadFixture(deployOneYearLockFixture);

//       expect(await lock.owner()).to.equal(owner.address);
//     });

//     it("Should receive and store the funds to lock", async function () {
//       const { lock, lockedAmount } = await loadFixture(
//         deployOneYearLockFixture
//       );

//       // eslint-disable-next-line no-undef
//       expect(await ethers.provider.getBalance(lock.target)).to.equal(
//         lockedAmount
//       );
//     });

//     it("Should fail if the unlockTime is not in the future", async function () {
//       // We don't use the fixture here because we want a different deployment
//       const latestTime = await time.latest();
//       // eslint-disable-next-line no-undef
//       const Lock = await ethers.getContractFactory("Lock");
//       await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
//         "Unlock time should be in the future"
//       );
//     });
//   });

//   describe("Withdrawals", function () {
//     describe("Validations", function () {
//       it("Should revert with the right error if called too soon", async function () {
//         const { lock } = await loadFixture(deployOneYearLockFixture);

//         await expect(lock.withdraw()).to.be.revertedWith(
//           "You can't withdraw yet"
//         );
//       });

//       it("Should revert with the right error if called from another account", async function () {
//         const { lock, unlockTime, otherAccount } = await loadFixture(
//           deployOneYearLockFixture
//         );

//         // We can increase the time in Hardhat Network
//         await time.increaseTo(unlockTime);

//         // We use lock.connect() to send a transaction from another account
//         await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
//           "You aren't the owner"
//         );
//       });

//       it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
//         const { lock, unlockTime } = await loadFixture(
//           deployOneYearLockFixture
//         );

//         // Transactions are sent using the first signer by default
//         await time.increaseTo(unlockTime);

//         await expect(lock.withdraw()).not.to.be.reverted;
//       });
//     });

//     describe("Events", function () {
//       it("Should emit an event on withdrawals", async function () {
//         const { lock, unlockTime, lockedAmount } = await loadFixture(
//           deployOneYearLockFixture
//         );

//         await time.increaseTo(unlockTime);

//         await expect(lock.withdraw())
//           .to.emit(lock, "Withdrawal")
//           .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
//       });
//     });

//     describe("Transfers", function () {
//       it("Should transfer the funds to the owner", async function () {
//         const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
//           deployOneYearLockFixture
//         );

//         await time.increaseTo(unlockTime);

//         await expect(lock.withdraw()).to.changeEtherBalances(
//           [owner, lock],
//           [lockedAmount, -lockedAmount]
//         );
//       });
//     });
//   });
// });

describe("jackpot", function () {
  async function SettingContracts() {
    // eslint-disable-next-line no-undef
    const [owner, referralAccount, playe1, player2, player3, player4, player5, player6, player7, player8, player9, player10] = await ethers.getSigners();
    let otherAccount = [playe1, player2, player3, player4, player5, player6, player7, player8, player9, player10];
    // eslint-disable-next-line no-undef
    const Register = await ethers.getContractFactory("Register");
    const register = await Register.deploy(owner.address);
    const ERC20Token = await ethers.getContractFactory("ERC20Token");
    const token = await ERC20Token.deploy(6, owner.address, "Test Token");
    const PrizeItems = await ethers.getContractFactory("PrizeItems");
    const prizeItems = await PrizeItems.deploy(owner.address, register.target, 'ipfs://QmavVun2oGtas452SehhDE638vVX1ukyt4CSAveLgCEA4Z');
    const MarketplaceExample = await ethers.getContractFactory("MarketplaceReceiver");
    const marketplace = await MarketplaceExample.deploy(token.target, owner.address, register.target);
    const Fomo3d = await ethers.getContractFactory("Fomo3d");
    const fomo3d = await Fomo3d.deploy(token.target, register.target, 1000000);
    const Jackpot = await ethers.getContractFactory("Jackpot");
    const jackpot = await Jackpot.deploy(owner.address, token.target, prizeItems.target, [1,2,3,4,5]);
    const Referral = await ethers.getContractFactory("Referral");
    const referral = await Referral.deploy(register.target);
    const VRFv2SubscriptionManagerTEST = await ethers.getContractFactory("VRFv2SubscriptionManagerTEST");
    const vrf = await VRFv2SubscriptionManagerTEST.deploy(owner.address, owner.address, register.target);
    const HierarchicalDrawing = await ethers.getContractFactory("HierarchicalDrawing");
    const hierarchicalDrawing = await HierarchicalDrawing.deploy(owner.address, register.target, prizeItems.target)
    // register.
    await register.grantRole(register.FOMO3D(), fomo3d.target);
    await register.grantRole(register.JACKPOT(), jackpot.target);
    await register.grantRole(register.MARKET(), marketplace.target);
    await register.grantRole(register.PRIZE_ITEMS(), prizeItems.target);
    await register.grantRole(register.REFERRAL(), referral.target);
    await register.grantRole(register.VRF(), vrf.target);
    await register.grantRole(register.DRAW(), hierarchicalDrawing.target);
    await register.grantRole(register.TOKEN(), token.target);
    // set config
    await marketplace.setPack(0, pack_price[0],[0],[1]);
    await marketplace.setPack(1, pack_price[1],[0],[11]);
    await hierarchicalDrawing.setTokenPool([1,2,3,4,5]);
    await hierarchicalDrawing.setTokenMaxAmount([50000,50000,50000,50000,50000]);
    await hierarchicalDrawing.setUnitPool(0,[50,0,0,0,50]);
    await hierarchicalDrawing.setUnitPool(1,[0,50,50,0,0]);
    await hierarchicalDrawing.setUnitPool(2,[0,0,0,100,0]);
    await hierarchicalDrawing.setDrawingPool(0,[0,1,2],[875,100,25]);

    // mint token to owner
    await token.mint(owner.address, 1000000000);
    await token.approve(marketplace.target, 100000000000);


    return { register, token, prizeItems, marketplace, fomo3d, jackpot, referral, vrf, hierarchicalDrawing, owner, otherAccount, referralAccount };
  }
  describe("Market", function () {
    it("Should set the right owner", async function () {
      const { jackpot, owner } = await loadFixture(SettingContracts);
      expect(await jackpot.owner()).to.equal(owner.address);
    });
    it("Buy in market", async function () {
      const { jackpot, owner, prizeItems, marketplace, vrf } = await loadFixture(SettingContracts);
      await marketplace.purchasePack(1, 1, ZeroAddress);
      // generate rand num by js
      await vrf.fulfillRandomWordsTest(await vrf.getCurRequestId(), [Math.floor(Math.random() * 1000000)]);
      nfts = await prizeItems.balanceOfBatch([owner.address, owner.address, owner.address, owner.address, owner.address], [1,2,3,4,5]);
      totalNums = nfts.map(a => Number(a)).reduce((a, b) => a + b, 0);
      // console.log('nft', nfts);
      expect(totalNums).to.equal(11);
    });
    it("check heirarchical drawing probability", async function () {
      draw_times = 300;
      const { token, owner, prizeItems, marketplace, vrf, hierarchicalDrawing } = await loadFixture(SettingContracts);
      for (let i = 0; i < draw_times; i++) {
        token.mint(owner.address, 1000000000);
        token.approve(marketplace.target, 1000000000);
        // console.log('token left', await token.balanceOf(owner.address));
        await marketplace.purchasePack(1, 1, ZeroAddress);
        // generate rand num by js
        await vrf.fulfillRandomWordsTest(await vrf.getCurRequestId(), [Math.floor(Math.random() * 1000000)]);
      }
      nfts = (await prizeItems.balanceOfBatch([owner.address, owner.address, owner.address, owner.address, owner.address], [1,2,3,4,5])).map(a => Number(a));
      // console.log('nft', nfts);

      draw_pool = (await hierarchicalDrawing.getPoolInfo(0)).map(a => a.map(b => Number(b)));
      unit_pool = []
      for (let i = 0; i < 3; i++) {
        unit_pool.push((await hierarchicalDrawing.getUnitPoolInfo(i))[0].map(a => Number(a)));
      }
      // console.log('draw pool', draw_pool, unit_pool);
      totalNums = nfts.reduce((a, b) => a + b, 0);
      // check drawing pool probability
      for (let i = 0; i < draw_pool[0].length; i++) {
        curUnitPoolNum = nfts.filter((a, idx) => unit_pool[i][idx] > 0).reduce((a, b) => a + b, 0);
        
        // console.log('curUnitPoolNum', curUnitPoolNum / totalNums);
        expect(curUnitPoolNum / totalNums).to.be.closeTo(draw_pool[1][i]/draw_pool[2][draw_pool[0].length-1], 0.05);
      }

      // check unit pool probability
      for (let i = 0; i < unit_pool.length; i++) {
        curUnitPoolNum = nfts.filter((a, idx) => unit_pool[i][idx] > 0).reduce((a, b) => a + b, 0);
        curUnitPoolTotalProb = unit_pool[i].reduce((a, b) => a + b, 0);
        for(let j = 0; j < unit_pool[i].length; j++) {
          if (unit_pool[i][j] === 0)
            continue;
          // console.log('unit pool', nfts[j]/curUnitPoolNum, unit_pool[i][j]/ curUnitPoolTotalProb);
          expect(nfts[j] / curUnitPoolNum).to.be.closeTo(unit_pool[i][j] / curUnitPoolTotalProb, 0.1);
        }
      }
    });
  });
  describe("Revenue share", function () {
    it('check revenue share is correct', async function () {
      const { token, owner, jackpot, marketplace, referralAccount, fomo3d, otherAccount } = await loadFixture(SettingContracts);
      let num = 3; // max: otherAccount.length-1
      let ownerCurBalance = Number(await token.balanceOf(owner.address));
      for (let i = 0; i < num; i++) {
        await token.mint(otherAccount[i].address, pack_price[0]);
        await token.connect(otherAccount[i]).approve(marketplace.target, pack_price[0]);
        await marketplace.connect(otherAccount[i]).purchasePack(0, 1, referralAccount.address);
      }
      expect(Number(await token.balanceOf(referralAccount.address))).to.equal((pack_price[0] * num)/10);
      expect(Number(await token.balanceOf(jackpot.target))).to.equal((pack_price[0] * num)/10*8);
      expect(Number(await token.balanceOf(fomo3d.target))).to.equal((pack_price[0] * num)/10);

      // have no referral address
      await token.mint(otherAccount[num+1].address, pack_price[0]);
      await token.connect(otherAccount[num+1]).approve(marketplace.target, pack_price[0]);
      await token.mint(otherAccount[num+1].address, pack_price[0]);
      await token.approve(marketplace.target, pack_price[0]);
      await marketplace.connect(otherAccount[num+1]).purchasePack(0, 1, ZeroAddress);
      // console.log('jackpot', await token.balanceOf(ZeroAddress));
      expect(Number(await token.balanceOf(owner.address))).to.equal(ownerCurBalance + pack_price[0]/10);
    });
    it("check fomo3d revenue share", async function () {
      const { token, owner, jackpot, marketplace, referralAccount, fomo3d, otherAccount } = await loadFixture(SettingContracts);
      actNum = 100
      // generate random list, length is actNum, element is 0-(len(otherAccount)-1)
      let randomPlayer = [];
      let randomAct = [];
      let totalNums = 0;
      let claumValue = new Array(otherAccount.length).fill(0);
      let cardNum = new Array(otherAccount.length).fill(0);
      let totalProfit = new Array(otherAccount.length).fill(0);
      for (let i = 0; i < actNum; i++) {
        randomPlayer.push(Math.floor(Math.random() * otherAccount.length));//active player 0-3
        randomAct.push(Math.ceil(Math.random() * 15));
      }

      // console.log('randomPlayer', randomPlayer);
      // console.log('randomAct', randomAct);
      for (let idx = 0; idx < actNum; idx++) {
        let player = randomPlayer[idx];
        if(randomAct[idx] > 13){
          let unclaimed = Number(await fomo3d.getUnclaim(otherAccount[player].address));
          if (unclaimed > 0) {
            await fomo3d.connect(otherAccount[player]).claim();
            claumValue[player] += unclaimed;
            // console.log(`${player} claim ${unclaimed}`);
          }
          continue;
        }
        total_pay = pack_price[0]*randomAct[idx];
        await token.mint(otherAccount[player].address, total_pay);
        await token.connect(otherAccount[player]).approve(marketplace.target, total_pay);
        await marketplace.connect(otherAccount[player]).purchasePack(0, randomAct[idx], referralAccount.address);
        cardNum[player] += randomAct[idx];
        totalNums += randomAct[idx];
        for (let i = 0; i < otherAccount.length; i++) {
          totalProfit[i] += (cardNum[i]/totalNums) * (total_pay/10);
        }
        
      }

      // check fomo3d revenue share
      for (let idx = 0; idx < otherAccount.length; idx++) {
        // console.log('claumValue', await fomo3d.getTotalProfit(otherAccount[idx].address), await fomo3d.getUnclaim(otherAccount[idx].address), await fomo3d.getClaimed(otherAccount[idx].address));
        expect(Number(await fomo3d.getTotalProfit(otherAccount[idx].address))).to.closeTo(totalProfit[idx], 100);
        expect(Number(await fomo3d.getUnclaim(otherAccount[idx].address))).to.closeTo(totalProfit[idx] - claumValue[idx], 100);
        expect(Number(await fomo3d.getClaimed(otherAccount[idx].address))).to.closeTo(claumValue[idx], 100);
      }

    });
  });
  
});
