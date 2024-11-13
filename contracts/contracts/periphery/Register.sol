// SPDX-License-Identifier: MIT
pragma solidity = 0.8.23;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract Register is AccessControl{
    // ROLES
    bytes32 public constant FOMO3D = keccak256("FOMO3D");
    bytes32 public constant JACKPOT = keccak256("JACKPOT");
    bytes32 public constant MARKET = keccak256("MARKET");
    bytes32 public constant PRIZE_ITEMS = keccak256("PRIZE_ITEMS");
    bytes32 public constant REFERRAL = keccak256("REFERRAL");
    bytes32 public constant VRF = keccak256("VRF");
    bytes32 public constant TOKEN = keccak256("TOKEN");
    bytes32 public constant DRAW = keccak256("DRAW");

    mapping (bytes32 => address) public currentContract;

    constructor(address _initialAdmin) {
        _grantRole(DEFAULT_ADMIN_ROLE, _initialAdmin);
    }

    function grantRole(bytes32 role, address account) public override onlyRole(getRoleAdmin(role)){
        _grantRole(role, account);
        currentContract[role] = account;
    }
    
    function checkRole(bytes32 _role, address _account) public view {
        require(hasRole(_role, _account), "Register: INVALID_ROLE");
    }
    function getContract(bytes32 _role) public view returns (address){
        return currentContract[_role];
    }

    
    
}