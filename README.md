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


| Contract Name | Purpose                                                                                                                     |
|:------------- |:--------------------------------------------------------------------------------------------------------------------------- |
| PaymentToken  | ERC-20 contract for use as our test token, "SA".                                                                            |
| PrizeNFT      | ERC-1155 contract for minting NFTs.                                                                                         |
| MarketPlace   | Allows users to buy cards. Automatically distributes the revenue from card purchases to other contracts & referrer wallets. |
| FOMO3D        | Calculates and stores the earnings from early-buyer profit-sharing.                                                         |
| Jackpot       | Manages the jackpot value, allowing a user to claim all by burning the required cards.                                      |
| Referral      | Calculates and stores referral information.                                                                                 |
| VRFManager    | Fullfills the random seed.                                                        |
| Draw          | Requests a random number from the VRFManager and mints the corresponding NFT(s) to buyer.                                   |
| Register      | Manage all the contracts.                                                                                                   |



