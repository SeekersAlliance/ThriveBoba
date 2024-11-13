// SPDX-License-Identifier: MIT
pragma solidity = 0.8.23;


/**
 * @title Interface of Fomo3d.sol
 */


interface IJackpot {
    // Events
    event JackpotClaim(address indexed user, uint256 value);
    
    // Errors
    error InvalidAddress();
    error InvalidValue();
    error InvalidAmount();
    error EmptyJackpot();
    error NotCollectedCards();

    /** 
     * @notice Deposit from the user
     * @notice Only the admin role can call this function
     * @param _user The user address
     * @param _value The value of the deposit
     * @param _amount The amount of the deposit
     */
    //function deposit(address _user, uint256 _value, uint256 _amount) external;

    /**
     * @notice Try to claim the value from this jackpot if the sender has the right to claim
     */
    function claim() external;

    /**
     * @notice Return the tatol value of the jackpot
     */
    function getTotalValue() external view returns (uint256 value);

    /**
     * @notice Set the cards ID which needed to be collected to claim the jackpot
     * @notice Only the admin role can call this function
     * @param _cardsID The cards ID
     */
    function setCollectedCardsID(uint32[] memory _cardsID) external;

    /**
     * @notice Get the cards ID which needed to be collected to claim the jackpot
     */
    function getCollectedCardsID() external view returns (uint32[] memory cardsID);


}
