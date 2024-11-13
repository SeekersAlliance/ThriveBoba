// SPDX-License-Identifier: MIT
pragma solidity = 0.8.23;

import "../interfaces/IReferral.sol";
import "./Register.sol";

/** 
 * @title 
 * @author SeekersAlliance
 * @notice
 */

contract Referral is  IReferral{

        Register public register;

        mapping (address => ReferralInfo[]) public historyReferralInfo;
        mapping (address => address) public referralMap;
        mapping (address => uint32) public referralCount;

        constructor(address _register){
            register = Register(_register);
        }

        // @inheritdoc IReferral
        function deposit(address _sender, address _referral, uint256 _value, uint32 _amount) external{
            register.checkRole(register.MARKET(), msg.sender);
            if(_sender == address(0)) revert InvalidAddress();
            if(_referral == address(0)) revert InvalidAddress();
            if(_value == 0) revert InvalidValue();
            if(_amount == 0) revert InvalidAmount();

            historyReferralInfo[_referral].push(ReferralInfo(_value, _amount, _sender));
            emit ReferralDeposit(_sender, _referral, _value, _amount);
        }

        // @inheritdoc IReferral
        function getHistoryReferralInfo(address _user) external view returns (ReferralInfo[] memory){
            return historyReferralInfo[_user];
        }

        // @inheritdoc IReferral
        function getTotalReferralInfo(address _user) external view returns (TotalReferralInfo memory){
            ReferralInfo[] memory history = historyReferralInfo[_user];
            TotalReferralInfo memory total;
            for(uint i = 0; i < history.length; i++){
                total.value += history[i].value;
                total.amount += history[i].amount;
            }
            total.count = referralCount[_user];
            return total;
        }

        // @inheritdoc IReferral
        function getReferralAddress(address _user) external view returns (address){
            return referralMap[_user];
        }

        // @inheritdoc IReferral
        function setReferralAddress(address _user, address _referral) external{
            register.checkRole(register.MARKET(), msg.sender);
            if(referralMap[_user] == address(0)){
                referralMap[_user] = _referral;
                referralCount[_referral]++;
            }
        }

}