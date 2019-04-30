// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
const SupplyChain = artifacts.require('SupplyChain');

let accounts;
let from;
let recipient;

contract('SupplyChain', async (accs) => {
    accounts = accs;
    from = accounts[0];
    recipient = accounts[1];
});


it('cannot create a Scheme with no name', async () => {
    try {
        let instance = await SupplyChain.deployed();
        await instance.createScheme("", {from});
        assert.fail("The transaction should have thrown an error");
    } catch (e) {
        console.log("Correctly failed")
    }
});


it('can create a Scheme and emit correct event', async () => {
    let schemeName = 'myScheme';
    let instance = await SupplyChain.deployed();
    let {logs} = await instance.createScheme(schemeName, {from});
    let {event} = logs[0];
    assert.strictEqual(event, 'Created');
});

it('can endorse a Scheme and emit correct event', async () => {
    let schemeName = 'myScheme';
    let instance = await SupplyChain.deployed();
    await instance.createScheme(schemeName, {from});
    let {logs} = await instance.endorseScheme(1);
    let {event} = logs[0];
    assert.strictEqual(event, 'Endorsed');
});

// it('can certify a Recipient and emit correct event', async () => {
//     let schemeName = 'myScheme';
//     let instance = await SupplyChain.deployed();
//     await instance.createScheme(schemeName, {from});
//     await instance.endorseScheme(1);
//     let {logs} = await instance.createCertificate(999,'testName',recipient);
//     console.log({logs})
//     let {event} = logs[0];
//     assert.strictEqual(event, 'Certified');
// });
