pragma solidity 0.5.8;

import "./Roles.sol";
import "./InspectorRole.sol";


contract RecipientRole is InspectorRole {
    using Roles for Roles.Role;

    // Define 2 events, one for Adding, and other for Removing
    event RecipientAdded(address indexed account);
    event RecipientRemoved(address indexed account);

    // Inheriting  struct Role from 'Roles' library,
    Roles.Role private recipients;

    // In the constructor make the address that deploys this contract the 1st recipient
    constructor() public {
        _addRecipient(msg.sender);
    }

    // Define a modifier that checks to see if msg.sender has the appropriate role
    modifier onlyRecipient() {
        require(isRecipient(msg.sender));
        _;
    }

    // Define a function 'isRecipient' to check this role
    function isRecipient(address account) public view returns (bool) {
        return recipients.has(account);
    }

    // Define a function 'addRecipient' that adds this role
    function addRecipient(address account) public onlyRecipient {
        _addRecipient(account);
    }

    // Define a function 'renounceRecipient' to renounce this role
    function renounceRecipient() public {
        _removeRecipient(msg.sender);
    }

    // Define an internal function '_addRecipient' to add this role, called by 'addRecipient'
    function _addRecipient(address account) internal {
        recipients.add(account);
        emit RecipientAdded(account);
    }

    // Define an internal function '_removeRecipient' to remove this role, called by 'renounceRecipient'
    function _removeRecipient(address account) internal {
        recipients.remove(account);
        emit RecipientRemoved(account);
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
}
