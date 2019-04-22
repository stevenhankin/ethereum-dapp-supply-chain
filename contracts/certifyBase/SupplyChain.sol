pragma solidity 0.5.3;

// Importing openzeppelin-solidity ERC-721 implemented Standard
//import "openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol";
//import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";


/** SupplyChain Contract declaration inheritance the ERC721 openzeppelin implementation */
contract SupplyChain {

    // Define 'owner'
    address public owner;

    // Universal Product Code (UPC) for identifying a type of certificate externally
    uint  public upc;

    // Stock Keeping Unit (SKU) to track an instance of a certificate internally
    uint public sku;

    // Public mapping of the UPC to an Certificate.
    mapping  (uint => Certificate) certificates;

    // Define a public mapping 'certificatesHistory' that maps the UPC to an array of TxHash,
    // that track its journey through the supply chain -- to be sent from DApp.
    mapping  (uint => string[]) certificatesHistory;

    // States as documented in UML State Diagram documentation
    enum State {
        Created,    // 0
        Endorsed,   // 1
        Certified,  // 2
        Requested,  // 3
        Approved,   // 4
        Denied,     // 5
        Viewed,     // 6
        Revoked,    // 7
        Invalidated // 8
    }

    State private constant DEFAULT_STATE = State.Created;

    struct Certificate {
        uint    sku;  // Stock Keeping Unit (SKU)
        uint    upc; // Universal Product Code (UPC), generated by the Certifier and can be verified by the Inspector
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
    event Created(uint upc);
    event Endorsed(uint upc);
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
        sku = 1;
        upc = 1;
    }

    // Not sure if required
    function kill() public {
        if (msg.sender == owner) {
            selfdestruct(owner);
        }
    }

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
