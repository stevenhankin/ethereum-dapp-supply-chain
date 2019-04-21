pragma solidity 0.5.3;

// Importing openzeppelin-solidity ERC-721 implemented Standard
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";


/** SupplyChain Contract declaration inheritance the ERC721 openzeppelin implementation */
contract SupplyChain is ERC721Full, ERC721Mintable {

    /**
      Initialise name and symbol properties through the constructor
      as per example on https://www.npmjs.com/package/openzeppelin-solidity
    */
    constructor() ERC721Full("SupplyChain Token", "SUP") public {
    }

    function upgrade(address newContractAddress) public {};
    function pause(address scheme) public {};

    function createScheme(uint256 schemeId) public {}
    function endorseScheme(uint256 schemeId) public {}
    function createCertificate(uint256 certificateId) public {}
    function requestAccess(uint256 accessId) public {}
    function decideAccess(uint256 accessId, bool canAccess) public {}
    function viewCertificate(uint256 certificateId) public {}
    function revokeCertificate(uint256 certificateId) public {}
    function invalidateScheme(uint256 schemeId) public {}

    function setAuthority(address authorityAddress) public {}
    function setCertifier(address certifierAddress) public {}
    function setRecipient(address recipientAddress) public {}
    function setInspector(address inspectorAddress) public {}

}
