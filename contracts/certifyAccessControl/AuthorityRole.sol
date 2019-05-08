pragma solidity 0.5.8;

import "./Roles.sol";


contract AuthorityRole {
    using Roles for Roles.Role;

    mapping(uint32 => Scheme) public schemes;

    // States as documented in UML State Diagram documentation
    enum SchemeState {
        Created, // 0
        Endorsed, // 1
        Invalidated // 2
    }

    // Events for Schemes
    event Created(uint32 schemeId);
    event Endorsed(uint32 schemeId);
    event Invalidated (uint32 schemeId);

    struct Scheme {
        string schemeName;
        address authorityId;            // Set once endorsed
        SchemeState schemeState;
    }

    // Inheriting  struct Role from 'Roles' library,
    Roles.Role private authorities;

    constructor() public {}

    // Only the Authority can invalidate a scheme
    modifier onlyAuthority(uint32 _schemeId) {
        require(msg.sender == schemes[_schemeId].authorityId,
            "Only the authority that endorsed the scheme can invalidate it");
        _;
    }

    // Define a function 'isAuthority' to check this role
    function isAuthority(address account) public view returns (bool) {
        return authorities.has(account);
    }

    // Scheme is invalidated to end the scheme
    function invalidateScheme(uint32 _schemeId) public onlyAuthority(_schemeId) endorsed(_schemeId) {
        schemes[_schemeId].schemeState = SchemeState.Invalidated;
        emit Invalidated(_schemeId);
    }

    // Modifier to assert scheme state
    modifier endorsed(uint32 _schemeId) {
        require(schemes[_schemeId].schemeState == SchemeState.Endorsed, "Scheme is not Endorsed");
        _;
    }
}
