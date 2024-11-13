// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "../interfaces/IHierarchicalDrawing.sol";
import "../interfaces/IVRFManager.sol";
import "../periphery/Register.sol";

contract VRFManager is IVRFManager, AccessControl {    
    IHierarchicalDrawing public drawingContract;
    Register public register;

    struct RequestStatus {
        bool fulfilled; // whether the request has been successfully fulfilled
        bool exists; // whether a requestId exists
        uint256[] randomWords;
    }

    /* requestId --> requestStatus */
    mapping(uint256 => RequestStatus) public s_requests; 
    
    uint256[] public requestIds;
    uint256 public lastRequestId;
    
    bytes32 public constant REQUESTER_ROLE = keccak256("REQUESTER_ROLE");
    
    constructor(
        address _initialAdmin,
        address _register
        ){
        _grantRole(DEFAULT_ADMIN_ROLE, _initialAdmin);
        register = Register(_register);
        }

    modifier onlyOwner() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Restricted to admin.");
        _;
    }


    // Takes request sender as the parameter.
    function requestRandomWords(address _requester) external  returns(uint256 requestId){
        register.checkRole(register.DRAW(), msg.sender);
        requestId = uint256(keccak256(abi.encodePacked(_requester, block.timestamp)));

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
    ) external onlyOwner {
        require(s_requests[_requestId].exists, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;

        drawingContract = IHierarchicalDrawing(register.getContract(register.DRAW()));
        
        drawingContract.fulfillRandomWords(_requestId, _randomWords);
        emit RequestFulfilled(_requestId, _randomWords);
    }

    function getRequestStatus(
        uint256 _requestId
    ) external view returns (bool fulfilled, uint256[] memory randomWords) {
        require(s_requests[_requestId].exists, "request not found");
        RequestStatus memory request = s_requests[_requestId];
        return (request.fulfilled, request.randomWords);
    }
}
