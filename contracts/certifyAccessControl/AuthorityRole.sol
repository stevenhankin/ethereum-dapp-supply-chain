pragma solidity 0.5.8;

import "./Roles.sol";


contract AuthorityRole {
    using Roles for Roles.Role;
    // Latest Scheme ID for schemes represented by contract
    uint32  public schemeId;

    struct Scheme {
        string schemeName;
        address authorityId;            // Set once endorsed
        SchemeState schemeState;
    }

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

    // Inheriting  struct Role from 'Roles' library,
    Roles.Role private authorities;

    constructor() public {
        schemeId = 1;
    }

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


    // Modifier to assert scheme state
    modifier created(uint32 _schemeId) {
        require(schemes[_schemeId].schemeState == SchemeState.Created, "Scheme has not been Created");
        _;
    }

    // Modifier to assert scheme state
    modifier endorsed(uint32 _schemeId) {
        require(schemes[_schemeId].schemeState == SchemeState.Endorsed, "Scheme is not Endorsed");
        _;
    }

    // Certifier produces a scheme to be used for generating certificates
    function createScheme(string memory _schemeName) public {
        assert(bytes(_schemeName).length != 0);
        schemes[schemeId].schemeState = SchemeState.Created;
        schemes[schemeId].schemeName = _schemeName;
        schemes[schemeId].authorityId = msg.sender;
        emit Created(schemeId);
        schemeId++;
    }

    // An authority officially endorsed the certification scheme as approved
    function endorseScheme(uint32 _schemeId) public created(_schemeId) {
        assert(_schemeId != 0);
        schemes[_schemeId].schemeState = SchemeState.Endorsed;
        schemes[_schemeId].authorityId = msg.sender;
        emit Endorsed(_schemeId);
    }

    // Scheme is invalidated to end the scheme
    function invalidateScheme(uint32 _schemeId) public onlyAuthority(_schemeId) endorsed(_schemeId) {
        schemes[_schemeId].schemeState = SchemeState.Invalidated;
        emit Invalidated(_schemeId);
    }


}
