pragma solidity 0.5.3;

// Importing openzeppelin-solidity ERC-721 implemented Standard
//import "openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol";
//import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";

/** SupplyChain Contract declaration inheritance the ERC721 openzeppelin implementation */
contract SupplyChain {

    // Certifier that created the scheme will be initial owner
    // before being passed to the Authority
    address public owner;
    string  public schemeName;

    // Latest Certificate ID for certificates represented by contract
    uint  public certificateId;

    // Latest Request ID for requests represented by contract
    uint  public requestId;

    // Public mapping of Scheme ID to Scheme
    mapping  (uint => Scheme) schemes;

//    // Define a public mapping 'certificatesHistory' that maps the UPC to an array of TxHash,
//    // that track its journey through the supply chain -- to be sent from DApp.
//    mapping  (uint => string[]) certificatesHistory;

    // States as documented in UML State Diagram documentation
    enum SchemeState {
        Created,   // 0
        Endorsed,   // 1
        Invalidated // 2
    }

    enum CertificateState {
        Certified,  // 0
        Revoked    // 1
    }

    enum RequestState {
        Requested,  // 0
        Approved,   // 1
        Denied,     // 2
        Viewed      // 3
    }

    SchemeState private constant DEFAULT_STATE = SchemeState.Created;

    struct Scheme {
        uint schemeId;
        SchemeState schemeState;
        address authorityID;  // Metamask-Ethereum address
        address originCertifierID; // Metamask-Ethereum address of the Certifier
        string  originCertificateName; // Certifier Name
        mapping  (uint => Certificate) certificates; // a scheme can have many certificates
    }

    struct Certificate {
        uint    certificateId; // Unique per certificate and a child of a scheme
        CertificateState   certificateState;  // Product State as represented in the enum above
        address payable recipientID; // Metamask-Ethereum address
        address inspectorID; // Metamask-Ethereum address
        mapping  (uint => Request) requests; // a certificate can have many view requests
    }

    struct Request {
        uint    certificateId; // Unique per certificate and a child of a scheme
        address ownerID;  // Metamask-Ethereum address of the current owner as the product moves through 9 stages
        address originCertifierID; // Metamask-Ethereum address of the Certifier
        string  originCertificateName; // Certifier Name
        uint    productID;  // Potentially a combination of upc + sku
        string  productNotes; // Product Notes
        uint    productPrice; // Product Price
        State   certificateState;  // Product State as represented in the enum above
        address authorityID;  // Metamask-Ethereum address
        address payable recipientID; // Metamask-Ethereum address
        address inspectorID; // Metamask-Ethereum address
    }


    // 9 events with the same 8 state values and accept 'upc' as input argument
    event Created(uint schemeId);
    event Endorsed(uint schemeId);
    event Certified(uint upc);
    event Requested(uint upc);
    event Approved(uint upc);
    event Denied(uint upc);
    event Viewed(uint upc);
    event Revoked(uint upc);
    event Invalidated (uint upc);

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

    // Define a modifier that checks if the paid amount is sufficient to cover the price
    modifier paidEnough(uint _price) {
        require(msg.value >= _price);
        _;
    }

    // Define a modifier that checks the price and refunds the remaining balance
    modifier checkValue(uint _upc) {
        _;
        uint _price = certificates[_upc].productPrice;
        uint amountToReturn = msg.value - _price;
        certificates[_upc].recipientID.transfer(amountToReturn);
    }

    modifier created(uint _upc) {
        require(certificates[_upc].certificateState == State.Created);
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

    // Not sure if required
//    function kill() public {
//        if (msg.sender == owner) {
//            selfdestruct(owner);
//        }
//    }

    function createScheme(uint _schemeId, string memory _schemeName) public {
        sku++;
    }

    function endorseScheme(uint schemeId) public {}
    function createCertificate(uint certificateId, string memory certificateName) public {}
    function requestAccess(uint accessId) public {}
    function decideAccess(uint accessId, bool canAccess) public {}
    function viewCertificate(uint certificateId) public {}
    function revokeCertificate(uint certificateId) public {}
    function invalidateScheme(uint schemeId) public {}

}
