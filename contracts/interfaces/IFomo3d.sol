// SPDX-License-Identifier: MIT
pragma solidity = 0.8.23;


/**
 * @title Interface of Fomo3d.sol
 */

interface IFomo3d {
    // Events
    event Fomo3dDeposit(address indexed user, uint256 value, uint256 amount);
    event Fomo3dClaim(address indexed user, uint256 value);


    // Errors
    error InvalidAddress();
    error InvalidValue();
    error InvalidAmount();
    error InsufficientAllowance();
    error InsufficientBalance();

    struct HistoryInfo {
        address user;
        uint256 value;
        uint256 amount;
    }

    /** 
     * @notice Deposit from the user
     * @notice Only the admin role can call this function
     * @param _user The user address
     * @param _value The value of the deposit
     * @param _amount The amount of the deposit
     */
    function deposit(address _user, uint256 _value, uint256 _amount) external;

    /**
     * @notice Withdraw all the value from the unclaim part
     */
    function claim() external;

    /**
     * @notice Return how much the user can get when he put more amount here
     * @param _user The user address
     * @param _amount The amount of user put more here
     */
    function getPredict(address _user, uint256 _amount) external view returns (uint256 value);

    /**
     * @notice get user info
     * @param _user The user address
     */
    function getUnclaim(address _user) external view returns (uint256 value);
    function getClaimed(address _user) external view returns (uint256 value);
    function getTotalProfit(address _user) external view returns (uint256 value);

    /**
     * @notice get history current nonce. (The nonce of the last history)
     */
    function getCurrentHistoryNonce() external view returns (uint32 nonce);
    /**
     * @notice get history info with nonce
     * @param _nonce The nonce of the history
     */
    function getHistory(uint32 _nonce) external view returns (HistoryInfo memory);

}