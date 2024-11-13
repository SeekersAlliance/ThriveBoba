// SPDX-License-Identifier: MIT
pragma solidity = 0.8.23;

/**
 * @title Interface of HierarchicalDrawing.sol
 */
interface IMarketplace{
    // Events
    event PackPurchased(address indexed buyer, uint32 amount);

    // Errors
    error InvalidAmount();
    error InsufficientAllowance();
    error InsufficientBalance();

    

    struct PackInfo {
        uint256 basePrice;
        uint32[] poolsID;
        uint32[] amounts;
    }

    /** 
     * @notice purchase a pack
     * @param _packID The pack ID
     * @param _packAmounts The amount of the pack
     * @param _referral The referral address
    */
    function purchasePack(uint32 _packID, uint32 _packAmounts, address _referral) external;

   
}