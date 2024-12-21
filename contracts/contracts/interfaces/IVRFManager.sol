// SPDX-License-Identifier: MIT
pragma solidity = 0.8.23;

interface IVRFManager {
    error RequestNotExist(uint256 requestId);    

    event RequestSent(uint256 requestId, address _requester);
    event RequestFulfilled(uint256 requestId, uint256[] randomWords);

    function getRequestStatus(uint256 _requestId) external view returns (bool fulfilled, uint256[] memory randomWords);
    function getLastRequestId() external view returns(uint256);
    function requestRandomWords(address requester) external returns (uint256 requestId);
    function fulfillRandomWords(uint256 _requestId, uint256[] memory _randomWords) external;  
}
