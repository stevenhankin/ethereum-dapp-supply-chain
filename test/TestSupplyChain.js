const SupplyChain = artifacts.require('SupplyChain');

var accounts;
var owner;

contract('SupplyChain', (accs) => {
    accounts = accs;
    owner = accounts[0];
});
