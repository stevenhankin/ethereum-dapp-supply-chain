pragma solidity 0.5.7;

// Importing openzeppelin-solidity ERC-721 implemented Standard
//import "openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol";
//import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";

/** SupplyChain Contract declaration inheritance the ERC721 openzeppelin implementation */
contract SupplyChain {

    // Certifier that created the scheme will be initial owner
    // before being passed to the Authority
    address public owner;

    address authorityID;  // Metamask-Ethereum address
    address originCertifierID; // Metamask-Ethereum address of the Certifier
    string  originCertificateName; // Certifier Name

    mapping(uint => Scheme) schemes;


    // Latest Scheme ID for schemes represented by contract
    uint  public schemeId;

    // Latest Certificate ID for certificates represented by contract
    uint  public certificateId;

    // Latest Request ID for requests represented by contract
    uint  public requestId;

    // States as documented in UML State Diagram documentation
    enum SchemeState {
        Created, // 0
        Endorsed, // 1
        Invalidated // 2
    }

    enum CertificateState {
        Certified, // 0
        Revoked    // 1
    }

    enum RequestState {
        Requested, // 0
        Approved, // 1
        Denied, // 2
        Viewed      // 3
    }

    SchemeState private constant DEFAULT_STATE = SchemeState.Created;

    struct Scheme {
        string schemeName;
        SchemeState schemeState;
        mapping(uint => Certificate) certificates; // a scheme can have many certificates
    }

    struct Certificate {
        CertificateState certificateState;  // Product State as represented in the enum above
        string certificateName;
        address payable recipientID; // Metamask-Ethereum address of recipient who will pay for certificate
        mapping(uint => Request) requests; // a certificate can have many view requests
    }

    struct Request {
        RequestState requestState;  // Product State as represented in the enum above
        address inspectorID; // Metamask-Ethereum address
    }

    // Events for Schemes
    event Created(uint schemeId);
    event Endorsed(uint schemeId);
    event Invalidated (uint schemeId);
    // Events for Certificates
    event Certified(uint certificateId);
    event Revoked(uint certificateId);
    // Events for Requests
    event Requested(uint requestId);
    event Approved(uint requestId);
    event Denied(uint requestId);
    event Viewed(uint requestId);

    // Define a modifier that checks to see if msg.sender == owner of the contract
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // Define a modifier that verifies the Caller
    modifier verifyCaller (address _address) {
        require(msg.sender == _address);
        _;
    }

    // Modifier to assert scheme state
    modifier created(uint _schemeId) {
        require(schemes[_schemeId].schemeState == SchemeState.Created);
        _;
    }

    // Modifier to assert scheme state
    modifier endorsed(uint _schemeId) {
        require(schemes[_schemeId].schemeState == SchemeState.Endorsed, "Scheme should be Endorsed");
        _;
    }

    // Modifier to assert scheme state
    modifier invalidated(uint _schemeId) {
        require(schemes[_schemeId].schemeState == SchemeState.Invalidated);
        _;
    }

    // Modifier to assert certificate state
    modifier certified(uint _schemeId, uint _certificateId) {
        require(schemes[_schemeId].certificates[_certificateId].certificateState == CertificateState.Certified);
        _;
    }

    // Modifier to assert certificate state
    modifier revoked(uint _schemeId, uint _certificateId) {
        require(schemes[_schemeId].certificates[_certificateId].certificateState == CertificateState.Revoked);
        _;
    }

    // Modifier to assert request state
    modifier requested(uint _schemeId, uint _certificateId, uint _requestId) {
        require(schemes[_schemeId]
        .certificates[_certificateId]
        .requests[_requestId].requestState == RequestState.Requested);
        _;
    }

    // In the constructor set 'owner' to the address that instantiated the contract
    // and set 'sku' to 1
    // and set 'upc' to 1
    constructor() public payable {
        owner = msg.sender;
        // Start all IDs from 1 when contract is created
        schemeId = 1;
        certificateId = 1;
        requestId = 1;
    }

    function createScheme(string memory _schemeName) public {
        assert(bytes(_schemeName).length != 0);
        schemes[schemeId].schemeState = DEFAULT_STATE;
        schemes[schemeId].schemeName = _schemeName;
        emit Created(schemeId);
        schemeId++;
    }

    function endorseScheme(uint _schemeId) public created(_schemeId) {
        assert(_schemeId != 0);
        schemes[_schemeId].schemeState = SchemeState.Endorsed;
        emit Endorsed(_schemeId);
    }

    // The certifier awards a certificate to a recipient
    function createCertificate(uint _schemeId, string memory _certificateName, address payable _recipientID) public endorsed(_schemeId) {
        assert(bytes(_certificateName).length != 0);
        schemes[_schemeId].certificates[certificateId].certificateName = _certificateName;
        schemes[_schemeId].certificates[certificateId].certificateState = CertificateState.Certified;
        schemes[_schemeId].certificates[certificateId].recipientID = _recipientID;
        emit Certified(certificateId);
        certificateId++;
    }

    function requestAccess(uint _schemeId, uint _certificateId, uint _requestId, address _inspectorID) public {
        schemes[_schemeId].certificates[_certificateId].requests[_requestId].requestState = RequestState.Requested;
        schemes[_schemeId].certificates[_certificateId].requests[_requestId].inspectorID = _inspectorID;
        emit Requested(_certificateId);
    }

    function decideAccess(uint _schemeId, uint _certificateId, uint _requestId, bool _canAccess) public {
        if (_canAccess) {
            schemes[_schemeId].certificates[_certificateId].requests[_requestId].requestState = RequestState.Approved;
            emit Approved(_requestId);
        } else {
            schemes[_schemeId].certificates[_certificateId].requests[_requestId].requestState = RequestState.Denied;
            emit Denied(_requestId);
        }
    }

    function viewCertificate(uint _schemeId, uint _certificateId, uint _requestId) public {
        schemes[_schemeId].certificates[_certificateId].requests[_requestId].requestState = RequestState.Viewed;
        emit Viewed(_certificateId);
    }

    function revokeCertificate(uint _schemeId, uint _certificateId) public {
        schemes[_schemeId].certificates[_certificateId].certificateState = CertificateState.Revoked;
        emit Revoked(_certificateId);
    }

    function invalidateScheme(uint _schemeId) public {
        schemes[_schemeId].schemeState = SchemeState.Invalidated;
        emit Invalidated(_schemeId);
    }

}
