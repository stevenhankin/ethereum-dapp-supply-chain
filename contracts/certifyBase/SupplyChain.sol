pragma solidity 0.5.8;

import "../certifyCore/Ownable.sol";
import "../certifyAccessControl/AuthorityRole.sol";
import "../certifyAccessControl/CertifierRole.sol";
import "../certifyAccessControl/InspectorRole.sol";
import "../certifyAccessControl/RecipientRole.sol";


contract SupplyChain is Ownable, CertifierRole, InspectorRole, RecipientRole {
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
}
