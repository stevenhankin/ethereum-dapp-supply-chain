pragma solidity 0.5.8;

import "../certifyCore/Ownable.sol";
import "../certifyAccessControl/AuthorityRole.sol";
import "../certifyAccessControl/CertifierRole.sol";
import "../certifyAccessControl/InspectorRole.sol";
import "../certifyAccessControl/RecipientRole.sol";


contract SupplyChain is Ownable, CertifierRole, InspectorRole, RecipientRole {

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

    // Only the Inspector can view the certificate
    modifier onlyRequestor(uint32 _requestId) {
        require(msg.sender == requests[_requestId].inspectorId,
            "Only the address that requested access can view the certificate");
        _;
    }

    // Define a modifier that verifies the Caller
    modifier verifyCaller (address _address) {
        require(msg.sender == _address);
        _;
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

    // In the constructor set 'owner' to the address that instantiated the contract (i.e. the certifier)
    constructor() public payable {
        // Start all IDs from 1 when contract is created
//
        requestId = 1;
    }

    // An inspector has request access to view a Recipient's certification
    function requestAccess(uint32 _certificateId) public {
        requests[requestId].requestState = RequestState.Requested;
        requests[requestId].inspectorId = msg.sender;
        requests[requestId].certificateId = _certificateId;
        emit Requested(_certificateId, requestId);
        requestId++;
    }

    // A recipient decides whether or not to approve access to their certificate
    // from a data protection perspective
    function decideAccess(uint32 _requestId, bool _canAccess) public {
        if (_canAccess) {
            requests[_requestId].requestState = RequestState.Approved;
            emit Approved(_requestId);
        } else {
            requests[_requestId].requestState = RequestState.Denied;
            emit Denied(_requestId);
        }
    }

    // An inspector has viewed a certificate that has had access approved
    function viewCertificate(uint32 _requestId) public approved(_requestId) onlyRequestor(_requestId) {
        requests[_requestId].requestState = RequestState.Viewed;
        emit Viewed(_requestId);
    }



}
