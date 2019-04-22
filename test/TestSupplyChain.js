// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
const SupplyChain = artifacts.require('SupplyChain');

var accounts;
var owner;

contract('SupplyChain', (accs) => {
    accounts = accs;
    owner = accounts[0];
});
