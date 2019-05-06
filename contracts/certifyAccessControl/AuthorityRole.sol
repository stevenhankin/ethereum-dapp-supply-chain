pragma solidity 0.5.8;

// Import the library 'Roles'
import "./Roles.sol";


contract AuthorityRole {
    using Roles for Roles.Role;

    // Define 2 events, one for Adding, and other for Removing
    event AuthorityAdded(address indexed account);
    event AuthorityRemoved(address indexed account);

    // Inheriting  struct Role from 'Roles' library,
    Roles.Role private authorities;

    // In the constructor make the address that deploys this contract the 1st authority
    constructor() public {
        _addAuthority(msg.sender);
    }

    // Define a modifier that checks to see if msg.sender has the appropriate role
    modifier onlyAuthority() {
        require(isAuthority(msg.sender));
        _;
    }

    // Define a function 'isAuthority' to check this role
    function isAuthority(address account) public view returns (bool) {
        return authorities.has(account);
    }

    // Define a function 'addAuthority' that adds this role
    function addAuthority(address account) public onlyAuthority {
        _addAuthority(account);
    }

    // Define a function 'renounceAuthority' to renounce this role
    function renounceAuthority() public {
        _removeAuthority(msg.sender);
    }

    // Define an internal function '_addAuthority' to add this role, called by 'addAuthority'
    function _addAuthority(address account) internal {
        authorities.add(account);
        emit AuthorityAdded(account);
    }

    // Define an internal function '_removeAuthority' to remove this role, called by 'renounceAuthority'
    function _removeAuthority(address account) internal {
        authorities.remove(account);
        emit AuthorityRemoved(account);
    }
}
