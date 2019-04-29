const AuthorityRole = artifacts.require("AuthorityRole");
const CertifierRole = artifacts.require("CertifierRole");
const InspectorRole = artifacts.require("InspectorRole");
const RecipientRole = artifacts.require("RecipientRole");
const SupplyChain = artifacts.require("SupplyChain");

module.exports = function(deployer) {
    deployer.deploy(AuthorityRole);
    deployer.deploy(CertifierRole);
    deployer.deploy(InspectorRole);
    deployer.deploy(RecipientRole);
    deployer.deploy(SupplyChain);
};
