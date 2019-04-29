pragma solidity 0.5.7;

// Import the library 'Roles'
import "./Roles.sol";


contract RecipientRole {
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
}
