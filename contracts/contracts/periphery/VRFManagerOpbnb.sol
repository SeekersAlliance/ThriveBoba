// SPDX-License-Identifier: MIT
pragma solidity = 0.8.23;


import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {VRFCoordinatorInterface} from "../interfaces/IVRFCoordinatorOpbnb.sol";
import {VRFConsumerBase} from "../interfaces/IVRFBaseOpbnb.sol";
import "../interfaces/IHierarchicalDrawing.sol";
import "./Register.sol";

// This contract uses Chainlink product: VRF
// We utilize random words fulfilled from VRF to draw tokenIDs from the defined pools for verifiable fairness.

contract VRFv2SubscriptionManager is VRFConsumerBase, AccessControl {    
    bytes32 public constant REQUESTER_ROLE = keccak256("REQUESTER_ROLE");

    VRFCoordinatorInterface public COORDINATOR;
    Register public register;

    struct RequestStatus {
        bool fulfilled; // whether the request has been successfully fulfilled
        bool exists; // whether a requestId exists
        uint256[] randomWords;
    }

    /* requestId --> requestStatus */
    mapping(uint256 => RequestStatus) public s_requests; 
    
    address public vrfCoordinator;
    bytes32 public keyHash;
    uint16 public requestConfirmations;
    uint32 public callbackGasLimit;

    uint64 public s_subscriptionId;
    uint256[] public requestIds;
    uint256 public lastRequestId;
    
    constructor(
        address _initialAdmin,
        address _vrfCoordinator,
        address _register,
        bytes32 _keyHash,
        uint32 _callbackGasLimit,
        uint16 _requestConfirmations
        ) VRFConsumerBase(_vrfCoordinator) {
        _grantRole(DEFAULT_ADMIN_ROLE, _initialAdmin);
        COORDINATOR = VRFCoordinatorInterface(_vrfCoordinator);
        keyHash = _keyHash;
        callbackGasLimit = _callbackGasLimit;
        requestConfirmations = _requestConfirmations;
        register = Register(_register);

        //Create a new subscription when you deploy the contract.
        createNewSubscription();
    }
    


    // Takes request sender as the parameter and submits the request to the VRF coordinator contract.
    function requestRandomWords(address _requester) external returns(uint256 requestId){
        // Will revert if subscription is not set and funded.
        register.checkRole(register.DRAW(), msg.sender);
        requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            1
        );

        s_requests[requestId] = RequestStatus({
        randomWords: new uint256[](0),
        exists: true,
        fulfilled: false
        });

        requestIds.push(requestId);
        lastRequestId = requestId;
        emit RequestSent(requestId, _requester);
        return requestId;
    }

    // Receives random values and stores them in your drawing contract.
    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        if(!s_requests[_requestId].exists) revert RequestNotExist(_requestId);
        
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;
        
        IHierarchicalDrawing(register.getContract(register.DRAW())).fulfillRandomWords(_requestId, _randomWords);
        emit RequestFulfilled(_requestId, _randomWords);
    }

    function getRequestStatus(
        uint256 _requestId
    ) external view returns (bool fulfilled, uint256[] memory randomWords) {
        if(!s_requests[_requestId].exists) revert RequestNotExist(_requestId);
        RequestStatus memory request = s_requests[_requestId];
        return (request.fulfilled, request.randomWords);
    }

    // Create a new subscription when the contract is initially deployed.
    function createNewSubscription() private onlyRole(DEFAULT_ADMIN_ROLE) {
        s_subscriptionId = COORDINATOR.createSubscription();
        // Add this contract as a consumer of its own subscription.
        COORDINATOR.addConsumer(s_subscriptionId, address(this));
    }

    // Assumes this contract owns link.
    function topUpSubscription(uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        
    }

    function addConsumer(address consumerAddress) external onlyRole(DEFAULT_ADMIN_ROLE) {
        // Add a consumer contract to the subscription.
        COORDINATOR.addConsumer(s_subscriptionId, consumerAddress);
        _grantRole(REQUESTER_ROLE, consumerAddress);
    }

    function removeConsumer(address consumerAddress) external onlyRole(DEFAULT_ADMIN_ROLE) {
        // Remove a consumer contract from the subscription.
        COORDINATOR.removeConsumer(s_subscriptionId, consumerAddress);
    }

    function cancelSubscription(address receivingWallet) external onlyRole(DEFAULT_ADMIN_ROLE) {
        // Cancel the subscription and send the remaining LINK to a wallet address.
        COORDINATOR.cancelSubscription(s_subscriptionId, receivingWallet);
        s_subscriptionId = 0;
    }
    function deposit() public payable {
        // Deposit funds to the cooridnator contract.
        COORDINATOR.deposit{value: msg.value}(s_subscriptionId);
    }
}