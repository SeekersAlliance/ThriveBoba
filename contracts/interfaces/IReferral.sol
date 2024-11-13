// SPDX-License-Identifier: MIT
pragma solidity = 0.8.23;


/**
 * @title Interface of Fomo3d.sol
 */

interface IReferral {
    // Events
    event ReferralDeposit(address indexed sender, address indexed referral, uint256 value, uint32 amount);

    // Errors
    error InvalidAddress();
    error InvalidValue();
    error InvalidAmount();


    struct TotalReferralInfo {
        uint256 value;
        uint32 amount;
        uint32 count;
    }
    struct ReferralInfo {
        uint256 value;
        uint32 amount;
        address from;
    }

    /** 
     * @notice Deposit from the user
     * @notice Only the admin role can call this function
     * @param _sender The sender address
     * @param _referral The referral address
     * @param _value The value of the deposit
     * @param _amount The amount of the deposit
     */
    function deposit(address _sender, address _referral, uint256 _value, uint32 _amount) external;

    /**
     * @notice Get total referral info of the user
     * @param _user The user address  
     */
    function getTotalReferralInfo(address _user) external view returns (TotalReferralInfo memory);

    /**
     * @notice Get the history of user's referral info
     * @notice Return a array of referral info of the user
     * @param _user The user address
     */
    function getHistoryReferralInfo(address _user) external view returns (ReferralInfo[] memory);

    /**
     * @notice Get referral address of the user
     * @notice If the user has no referral address, return address(0)
     * @param _user The user address
     */
    function getReferralAddress(address _user) external returns (address);

    /**
     * @notice set referral address of the user
     * @notice If the user has no referral address, set it to the referralMap
     * @param _user The user address
     */
    function setReferralAddress(address _user, address _referral) external;

}