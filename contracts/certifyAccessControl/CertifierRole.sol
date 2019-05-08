pragma solidity 0.5.8;

// Import the library 'Roles'
import "./Roles.sol";
import "./AuthorityRole.sol";
import "../certifyCore/Ownable.sol";


contract CertifierRole is AuthorityRole, Ownable {
    using Roles for Roles.Role;

    mapping(uint32 => Certificate) public certificates;

    // Latest Certificate ID for certificates represented by contract
    uint32  public certificateId;

    event CertifierAdded(address indexed account);
    event CertifierRemoved(address indexed account);
    // Events for Certificates
    event Certified(uint32 certificateId, address recipientId);
    event Revoked(uint32 certificateId);

    // Inheriting  struct Role from 'Roles' library,
    Roles.Role private certifiers;

    enum CertificateState {
        Certified, // 0
        Revoked    // 1
    }

    struct Certificate {
        CertificateState certificateState;  // Product State as represented in the enum above
        address payable recipientId;        // Metamask-Ethereum address of recipient who will pay for certificate
        uint schemeId;                      // Scheme that this certificate belongs to
    }

    // In the constructor make the address that deploys this contract the 1st certifier
    constructor() public {
        certificateId = 1;
        _addCertifier(msg.sender);
    }

    // Define a modifier that checks to see if msg.sender has the appropriate role
    modifier onlyCertifier() {
        require(isCertifier(msg.sender));
        _;
    }

    // Define a function 'isCertifier' to check this role
    function isCertifier(address account) public view returns (bool) {
        return certifiers.has(account);
    }

    // Define a function 'addCertifier' that adds this role
    function addCertifier(address account) public onlyCertifier {
        _addCertifier(account);
    }

    // Define a function 'renounceCertifier' to renounce this role
    function renounceCertifier() public {
        _removeCertifier(msg.sender);
    }

    // Define an internal function '_addCertifier' to add this role, called by 'addCertifier'
    function _addCertifier(address account) internal {
        certifiers.add(account);
        emit CertifierAdded(account);
    }

    // Define an internal function '_removeCertifier' to remove this role, called by 'renounceCertifier'
    function _removeCertifier(address account) internal {
        certifiers.remove(account);
        emit CertifierRemoved(account);
    }

    // Modifier to assert certificate state
    modifier certified(uint32 _certificateId) {
        require(certificates[_certificateId].certificateState == CertificateState.Certified, "Recipient is not Certified");
        _;
    }

    // Modifier to assert certificate state
    modifier revoked(uint32 _certificateId) {
        require(certificates[_certificateId].certificateState == CertificateState.Revoked, "Certificate is not Revoked");
        _;
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

    // A certifier has revoked a recipient's certificate (perhaps they cheated during an exam!)
    function revokeCertificate(uint32 _certificateId) public onlyOwner() {
        certificates[_certificateId].certificateState = CertificateState.Revoked;
        emit Revoked(_certificateId);
    }
}
