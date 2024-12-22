# Jackpot

## Introduction
This repository includes jackpot and revenue-sharing contracts. It also includes the Flexible Hierarchical Drawing Pools to provide a fair card-drawing mechanism. The contract allows for the customization of Hierarchical Drawing Pools so that game developers can freely customize pool probabilities at each level according to their game design at launch, updates, and new releases while maintaining constant and fair pull rates. 

The revenue-sharing mechanism is divided into three parts:
- Jackpot (80%): Players can claim all the prizes in the jackpot once they collect all the specified cards.
- Referral (10%): If a referral link is used, this portion of the revenue will be transferred to the referral address immediately after each transaction.
- FOMO3D (10%): This portion of the revenue will be evenly distributed based on the number of cards each address has purchased.

The following document contains the setup instructions for our smart contracts, which has several roles to setup. Follow the steps below to set up each contract:
## Contracts Structure
![Alt text](./Jackpot.png?raw=true "Contract Structure")

---

## Setup Steps

### Register Contract
- Grants the corresponding roles to the respective contracts. 
    ![image](https://hackmd.io/_uploads/rJefx9sM0.png)
### Marketplace Contract
- setPack
### Hierarchical Prize Pool Contract
1. setTokenPool 
2. setTokenMax 
3. setUnitPool 
4. setDrawingPool  

## Deployed Contracts:
### Boba Sepolia:


| Contract Name | Address    | Purpose                                                                                                                     |
|:------------- | --- |:--------------------------------------------------------------------------------------------------------------------------- |
| PaymentToken  | [0xC4734D1D2c7CD7F8241A1a83816E27e2Dc6Fd1af](https://testnet.bobascan.com/address/0xC4734D1D2c7CD7F8241A1a83816E27e2Dc6Fd1af)    | ERC-20 contract for use as our test token, "SA".                                                                            |
| PrizeNFT      |   [0x46d657Ba75C5A1fd60b9E4dee64318Ff69e670fe](https://testnet.bobascan.com/address/0x46d657Ba75C5A1fd60b9E4dee64318Ff69e670fe)  | ERC-1155 contract for minting NFTs.                                                                                         |
| MarketPlace   |   [0xCa24de3a05FDDBCA9F39dd02937cA86cD815A1f6](https://testnet.bobascan.com/address/0xCa24de3a05FDDBCA9F39dd02937cA86cD815A1f6)   | Allows users to buy cards. Automatically distributes the revenue from card purchases to other contracts & referrer wallets. |
| FOMO3D        |  [0xf0C8283157f9C6C59D34083D52955783a3F0414A](https://testnet.bobascan.com/address/0xf0C8283157f9C6C59D34083D52955783a3F0414A)   | Calculates and stores the earnings from early-buyer profit-sharing.                                                         |
| Jackpot       |   [0x22b605fC43AC6cAf517D02fA06AcF1a49ba860Ed](https://testnet.bobascan.com/address/0x22b605fC43AC6cAf517D02fA06AcF1a49ba860Ed)  | Manages the jackpot value, allowing a user to claim all by burning the required cards.                                      |
| Referral      |  [0xDd866d81B0E56DBa8a5eAdC9A3787f411F3e3E3C](https://testnet.bobascan.com/address/0xDd866d81B0E56DBa8a5eAdC9A3787f411F3e3E3C)   | Calculates and stores referral information.                                                                                 |
| VRFManager    | [0xD4F87E159060000cd3111AA6b58f61720Cd43AE3](https://testnet.bobascan.com/address/0xD4F87E159060000cd3111AA6b58f61720Cd43AE3)    | Fullfills the random seed.                                                                                                  |
| Draw          |  [0x354256aF8b725662E4411EBE178c47d1f97a509B](https://testnet.bobascan.com/address/0x354256aF8b725662E4411EBE178c47d1f97a509B)   | Requests a random number from the VRFManager and mints the corresponding NFT(s) to buyer.                                   |
| Register      | [0x1b73Ae17FD3ccFd91aE61ac3bB0CF314054B1eb4](https://testnet.bobascan.com/address/0x1b73Ae17FD3ccFd91aE61ac3bB0CF314054B1eb4)    | Manage all the contracts.                                                                                                   |



