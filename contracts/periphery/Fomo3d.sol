// SPDX-License-Identifier: MIT
pragma solidity = 0.8.23;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../interfaces/IFomo3d.sol";
import "./Register.sol";

/** 
 * @title 
 * @author SeekersAlliance
 * @notice
 */

contract Fomo3d is IFomo3d{

    ERC20 public paymentToken;
    Register public register;

    mapping (address => uint256) public amount;
    mapping (address => uint256) public mask;
    mapping (address => uint256) public unclaim;
    mapping (address => uint256) public claimed;
    mapping (uint32 => HistoryInfo) public historyInfo;

    uint32 public historyNonce;
    uint256 public totalAmount;
    uint256 public totalValue;
    uint256 public valuePerAmount;
    uint32 public decimal;
    uint256 public price;
    

    constructor(
        address _basePaymentToken,
        address _register,
        uint256 _price
    ){
        paymentToken = ERC20(_basePaymentToken);
        decimal = paymentToken.decimals();
        historyNonce = 0;
        // This _price is part of the price of a pack which is distributed to the fomo3d
        price = _price;
        register = Register(_register);
    }

    // @inheritdoc IFomo3d
    function deposit(address _user, uint256 _value, uint256 _amount) external override{
        register.checkRole(register.MARKET(), msg.sender);
        if(_user == address(0)) revert InvalidAddress();
        if(_value == 0) revert InvalidValue();
        if(_amount == 0) revert InvalidAmount();
        
        unclaim[_user] += (amount[_user] * (valuePerAmount-mask[_user]))/(10**decimal);
        totalValue += _value;
        mask[_user] = valuePerAmount;
        amount[_user] += _amount;
        totalAmount += _amount;
        valuePerAmount += (_value*(10**decimal)/totalAmount);
        historyInfo[historyNonce] = HistoryInfo(_user, uint256(_value), uint256(_amount));
        historyNonce++;
        emit Fomo3dDeposit(_user, _value, _amount);
    }
    
    // @inheritdoc IFomo3d
    function claim() external{
        address _user = msg.sender;
        if(_user == address(0)) revert InvalidAddress();
        uint256 _value = _getUnclaim(_user);
        paymentToken.transfer(_user, _value);
        claimed[_user] += _value;
        emit Fomo3dClaim(_user, _value);
    }

    // @inheritdoc IFomo3d
    function getPredict(address _user, uint256 _amount) external view returns (uint256 value){
        if(_user == address(0)) revert InvalidAddress();
        uint256 userAmount = amount[_user] + _amount;
        if(totalAmount+_amount == 0) return 0;
        uint256 ratio = (userAmount*(10**decimal))/(totalAmount+_amount);
        return  (ratio * (price/10))/ (10**decimal);
    }
    // @inheritdoc IFomo3d
    function getUnclaim(address _user) external view returns (uint256 value){
        return _getUnclaim(_user);
    }
    // @inheritdoc IFomo3d
    function getClaimed(address _user) external view returns (uint256 value){
        return claimed[_user];
    }
    // @inheritdoc IFomo3d
    function getTotalProfit(address _user) external view returns (uint256 value){
        return claimed[_user] + _getUnclaim(_user);
    }
    // @inheritdoc IFomo3d
    function getCurrentHistoryNonce() external view returns (uint32 nonce){
        if(historyNonce == 0) return 0;
        return historyNonce-1;
    }
    // @inheritdoc IFomo3d
    function getHistory(uint32 _nonce) external view returns (HistoryInfo memory){
        return historyInfo[_nonce];
    }





    function _getUnclaim(address _user) internal view returns (uint256 value){
        return unclaim[_user] + (amount[_user] * (valuePerAmount-mask[_user]))/(10**decimal) - claimed[_user];
    }

}
    