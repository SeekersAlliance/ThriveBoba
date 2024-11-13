// SPDX-License-Identifier: MIT
pragma solidity = 0.8.23;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IHierarchicalDrawing.sol";
import "../interfaces/IFomo3d.sol";
import "../interfaces/IReferral.sol";
import "../interfaces/IJackpot.sol";
import "../interfaces/IMarketplace.sol";
import "./Register.sol";


contract MarketplaceReceiver is Ownable, IMarketplace {

    mapping (address => uint256) public totalAmount;
    mapping (uint32 => PackInfo) public packsInfo;

    ERC20 public paymentToken;
    Register public register;
    
    constructor(
        address _basePaymentToken,
        address _initialAdmin,
        address _register
    ) Ownable(_initialAdmin){
        paymentToken = ERC20(_basePaymentToken);
        register = Register(_register);
    }


    // @dev Function to set the pack
    function setPack(uint32 _packID, uint256 _packPrice, uint32[] calldata _poolsID, uint32[] calldata _amounts) external onlyOwner {
        packsInfo[_packID].basePrice = _packPrice;
        packsInfo[_packID].poolsID = _poolsID;
        packsInfo[_packID].amounts = _amounts;
    }

    // @inheritdoc IMarketplaceReceiver
    function purchasePack(uint32 _packID, uint32 _packAmounts, address _referral) external override {
        uint256 basePrice = packsInfo[_packID].basePrice;
        uint256 totalPayment;
        address purchaser = msg.sender;
        
        if(_packAmounts == 0) revert InvalidAmount();

        totalPayment = _packAmounts*basePrice;
        
        /// @notice Check if the purchaser has enough allowance and balance
        if(paymentToken.allowance(purchaser, address(this)) < totalPayment) revert InsufficientAllowance();
        if(paymentToken.balanceOf(purchaser) < totalPayment) revert InsufficientBalance();

        
        
        uint32[] memory _amounts = packsInfo[_packID].amounts;
        uint32[] memory totalAmounts = new uint32[](_amounts.length);
        uint32 total = 0;

        for(uint256 i; i<_amounts.length; i++) {
            totalAmounts[i] = _amounts[i]*_packAmounts;
            total += totalAmounts[i];
        }

        // If the referral address is not set, set it to the owner of this contract
        if(IReferral(register.getContract(register.REFERRAL())).getReferralAddress(purchaser) == address(0)){
            if(_referral == address(0)){
                _referral = owner();
            }else{
                IReferral(register.getContract(register.REFERRAL())).setReferralAddress(purchaser, _referral);
            }
        }else{
            _referral = IReferral(register.getContract(register.REFERRAL())).getReferralAddress(purchaser);
        }

        // Transfer tokens from buyer to fomo3d, jackpot and referral contracts respectively, 10% to fomo3d, 80% to jackpot and 10% to referral

        paymentToken.transferFrom(purchaser, register.getContract(register.FOMO3D()), totalPayment/10);
        IFomo3d(register.getContract(register.FOMO3D())).deposit(purchaser, totalPayment/10, total);
       
        paymentToken.transferFrom(purchaser, register.getContract(register.JACKPOT()), totalPayment*8/10);

        paymentToken.transferFrom(purchaser, _referral, totalPayment/10);
        IReferral(register.getContract(register.REFERRAL())).deposit(purchaser, _referral, totalPayment/10, total);


        // Call the sendRequest function from the draw contract
        IHierarchicalDrawing(register.getContract(register.DRAW())).sendRequest(purchaser, packsInfo[_packID].poolsID, totalAmounts); 
        emit PackPurchased(purchaser, _packAmounts);
    }
    
    // Function for the owner to withdraw funds from the contract
    function withdrawFunds(address _token, uint256 _amount) external onlyOwner {
        ERC20 withdrawToken = ERC20(_token);

        if(withdrawToken.balanceOf(address(this)) < _amount) revert InsufficientBalance();

        // Transfer funds to the owner
        withdrawToken.transfer(owner(), _amount);
    }

    /// @notice Function to withdraw Native from the contract
    function withdrawNative() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}