pragma solidity 0.5.8;

import "../certifyCore/Ownable.sol";
import "../certifyAccessControl/CertifierRole.sol";
import "../certifyAccessControl/RecipientRole.sol";


contract SupplyChain is Ownable, CertifierRole, RecipientRole {}