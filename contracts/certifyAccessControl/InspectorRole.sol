pragma solidity 0.5.8;

import "./Roles.sol";


contract InspectorRole {
    using Roles for Roles.Role;

    mapping(uint32 => Request) public requests;

    // Latest Request ID for requests represented by contract
    uint32  public requestId;

    enum RequestState {
        Requested, // 0
        Approved, // 1
        Denied, // 2
        Viewed      // 3
    }

    struct Request {
        RequestState requestState;  // Product State as represented in the enum above
        address inspectorId;        // Metamask-Ethereum address
        uint32 certificateId;       // Certificate that this Request is referencing
    }

    // Events for Requests
    event Requested(uint32 certificateId, uint32 requestId);
    event Approved(uint32 requestId);
    event Denied(uint32 requestId);
    event Viewed(uint32 requestId);


    // Define 2 events, one for Adding, and other for Removing
    event InspectorAdded(address indexed account);
    event InspectorRemoved(address indexed account);

    // Inheriting  struct Role from 'Roles' library,
    Roles.Role private inspectors;

    // In the constructor make the address that deploys this contract the 1st inspector
    constructor() public {
        requestId = 1;
        _addInspector(msg.sender);
    }

    // Define a modifier that checks to see if msg.sender has the appropriate role
    modifier onlyInspector() {
        require(isInspector(msg.sender));
        _;
    }

    // Define a function 'isInspector' to check this role
    function isInspector(address account) public view returns (bool) {
        return inspectors.has(account);
    }

    // Define a function 'addInspector' that adds this role
    function addInspector(address account) public onlyInspector {
        _addInspector(account);
    }

    // Define a function 'renounceInspector' to renounce this role
    function renounceInspector() public {
        _removeInspector(msg.sender);
    }

    // Define an internal function '_addInspector' to add this role, called by 'addInspector'
    function _addInspector(address account) internal {
        inspectors.add(account);
        emit InspectorAdded(account);
    }

    // Define an internal function '_removeInspector' to remove this role, called by 'renounceInspector'
    function _removeInspector(address account) internal {
        inspectors.remove(account);
        emit InspectorRemoved(account);
    }

    // Modifier to assert request state
    modifier requested(uint32 _requestId) {
        require(requests[_requestId].requestState == RequestState.Requested, "Access has not been requested");
        _;
    }

    // Modifier to assert request state
    modifier approved(uint32 _requestId) {
        require(requests[_requestId].requestState == RequestState.Approved, "Access has not been approved");
        _;
    }

    // Only the Inspector can view the certificate
    modifier onlyRequestor(uint32 _requestId) {
        require(msg.sender == requests[_requestId].inspectorId,
            "Only the address that requested access can view the certificate");
        _;
    }

    // An inspector has request access to view a Recipient's certification
    function requestAccess(uint32 _certificateId) public {
        requests[requestId].requestState = RequestState.Requested;
        requests[requestId].inspectorId = msg.sender;
        requests[requestId].certificateId = _certificateId;
        emit Requested(_certificateId, requestId);
        requestId++;
    }

    // An inspector has viewed a certificate that has had access approved
    function viewCertificate(uint32 _requestId) public approved(_requestId) onlyRequestor(_requestId) {
        requests[_requestId].requestState = RequestState.Viewed;
        emit Viewed(_requestId);
    }
}
