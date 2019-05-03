pragma solidity 0.5.7;

// Importing openzeppelin-solidity ERC-721 implemented Standard
//import "openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol";
//import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";

/** SupplyChain Contract declaration inheritance the ERC721 openzeppelin implementation */
contract SupplyChain {

    // Certifier that created the scheme will be initial owner
    address payable public owner;

    //    address authorityId;  // Metamask-Ethereum address
    //    address originCertifierID; // Metamask-Ethereum address of the Certifier
    //    string  originCertificateName; // Certifier Name

    mapping(uint32 => Scheme) schemes;
    mapping(uint32 => Certificate) certificates;
    mapping(uint32 => Request) requests;


    // Latest Scheme ID for schemes represented by contract
    uint32  public schemeId;

    // Latest Certificate ID for certificates represented by contract
    uint32  public certificateId;

    // Latest Request ID for requests represented by contract
    uint32  public requestId;

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
    }

    struct Certificate {
        CertificateState certificateState;  // Product State as represented in the enum above
        address payable recipientId;        // Metamask-Ethereum address of recipient who will pay for certificate
        uint schemeId;                      // Scheme that this certificate belongs to
    }

    struct Request {
        RequestState requestState;  // Product State as represented in the enum above
        address inspectorId;        // Metamask-Ethereum address
        uint32 certificateId;       // Certificate that this Request is referencing
    }

    // Events for Schemes
    event Created(uint32 schemeId);
    event Endorsed(uint32 schemeId);
    event Invalidated (uint32 schemeId);
    // Events for Certificates
    event Certified(uint32 certificateId, address recipientId);
    event Revoked(uint32 certificateId);
    // Events for Requests
    event Requested(uint32 certificateId, uint32 requestId);
    event Approved(uint32 requestId);
    event Denied(uint32 requestId);
    event Viewed(uint32 requestId);

    // Define a modifier that checks to see if msg.sender == owner of the contract
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

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


    // Modifier to assert certificate state
    modifier certified(uint32 _certificateId) {
        require(certificates[_certificateId].certificateState == CertificateState.Certified, "Scheme is not Certified");
        _;
    }

    // Modifier to assert certificate state
    modifier revoked(uint32 _certificateId) {
        require(certificates[_certificateId].certificateState == CertificateState.Revoked, "Scheme is not Revoked");
        _;
    }

    // Modifier to assert request state
    modifier requested(uint32 _requestId) {
        require(requests[_requestId].requestState == RequestState.Requested);
        _;
    }

    // Modifier to assert request state
    modifier approved(uint32 _requestId) {
        require(requests[_requestId].requestState == RequestState.Approved);
        _;
    }

    // In the constructor set 'owner' to the address that instantiated the contract (i.e. the certifier)
    constructor() public payable {
        owner = msg.sender;
        // Start all IDs from 1 when contract is created
        schemeId = 1;
        certificateId = 1;
        requestId = 1;
    }

    // Certifier can destroy the contract
    function close() public onlyOwner {
        selfdestruct(owner);
    }

    function createScheme(string memory _schemeName) public {
        assert(bytes(_schemeName).length != 0);
        schemes[schemeId].schemeState = DEFAULT_STATE;
        schemes[schemeId].schemeName = _schemeName;
        emit Created(schemeId);
        schemeId++;
    }

    // An authority officially endorsed the certification scheme as approved
    function endorseScheme(uint32 _schemeId) public created(_schemeId) {
        assert(_schemeId != 0);
        schemes[_schemeId].schemeState = SchemeState.Endorsed;
        emit Endorsed(_schemeId);
    }

    // The certifier awards a certificate to a recipient
    function awardCertificate(uint32 _schemeId, address payable _recipientId) public endorsed(_schemeId) {
        assert(_schemeId != 0);
        certificates[certificateId].certificateState = CertificateState.Certified;
        certificates[certificateId].recipientId = _recipientId;
        certificates[certificateId].schemeId = _schemeId;
        emit Certified(certificateId, _recipientId);
        certificateId++;
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

    // A certifier has revoked a recipient's certificate (perhaps they cheated during an exam!)
    function revokeCertificate(uint32 _certificateId) public onlyOwner() {
        certificates[_certificateId].certificateState = CertificateState.Revoked;
        emit Revoked(_certificateId);
    }

    // Scheme is invalidated to end the scheme
    function invalidateScheme(uint32 _schemeId) public onlyOwner() {
        schemes[_schemeId].schemeState = SchemeState.Invalidated;
        emit Invalidated(_schemeId);
    }

}
