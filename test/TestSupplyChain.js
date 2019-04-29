// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
const SupplyChain = artifacts.require('SupplyChain');

let accounts;
let owner;

console.log('Creating contract...');

contract('SupplyChain', (accs) => {
    accounts = accs;
    owner = accounts[0];
});



console.log('Running tests...');

it('can Create a Scheme', async () => {
    // let schemeId = 1;
    let schemeName = 'myScheme';
    let from = accounts[0];
    let instance = await SupplyChain.deployed();
    console.log('account', {from});
    await instance.createScheme(schemeName, {from});
    // await instance.createScheme(schemeId, schemeName, {from});
    // assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!')
    assert.strictEqual(1,1);
});


/*
function createScheme(uint _schemeId, string memory _schemeName) public {
    schemes[_schemeId].schemeState = DEFAULT_STATE;
    schemes[_schemeId].schemeName = _schemeName;
    emit Created(_schemeId);
}
*/