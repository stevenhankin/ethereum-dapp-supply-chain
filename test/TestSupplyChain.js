// const { getWeb3, getContractInstance } = require("./helpers")
// const web3 = getWeb3()
// const getInstance = getContractInstance(web3)

const truffleAssert = require('truffle-assertions');

// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
const SupplyChain = artifacts.require('SupplyChain');

let accounts;
let from;
let recipient;
let inspector;

contract('SupplyChain', async (accs) => {
    accounts = accs;
    from = accounts[0];
    recipient = accounts[1];
    inspector = accounts[2];
});


it('cannot create a Scheme with no name', async () => {
    let instance;
    try {
        instance = await SupplyChain.deployed();
        await instance.createScheme("", {from});
        assert.fail("The transaction should have thrown an error");
    } catch (e) {
        return true;
    }
});

it('can create a Scheme and emit correct event', async () => {
    const instance = await SupplyChain.deployed();
    const result = await instance.createScheme('myScheme');
    truffleAssert.eventEmitted(result, 'Created', (ev) => {
        const schemeId = parseInt(ev.schemeId.toString(10), 10);
        return schemeId > 0
    })
});


it('can endorse a Scheme and emit correct event', async () => {
    const instance = await SupplyChain.deployed();
    await instance.createScheme('myScheme');
    const result = await instance.endorseScheme(1);
    truffleAssert.eventEmitted(result, 'Endorsed', (ev) => {
        const schemeId = parseInt(ev.schemeId.toString(10), 10);
        return schemeId === 1
    })
});


it('Certifier can certify a Recipient and emit correct event', async () => {
    const instance = await SupplyChain.deployed();
    let result = await instance.createScheme('myScheme');
    const schemeId = parseInt(result.logs[0].args["0"].toString(10), 10)
    await instance.endorseScheme(schemeId);
    result = await instance.awardCertificate(1, recipient);
    truffleAssert.eventEmitted(result, 'Certified', (ev) => {
        const certId = parseInt(ev.certificateId.toString(10), 10);
        const certRecipient = ev.recipientId;
        return certId > 0 && certRecipient === recipient;
    });
});


it('Inspector can request access to a certificate from a Recipient', async () => {
    const instance = await SupplyChain.deployed();
    let result = await instance.createScheme('myScheme');
    const schemeId = parseInt(result.logs[0].args["0"].toString(10), 10)
    await instance.endorseScheme(schemeId);
    result = await instance.awardCertificate(schemeId, recipient);
    const certId = parseInt(result.logs[0].args["certificateId"].toString(10), 10);
    result = await instance.requestAccess(schemeId, certId, inspector);
    truffleAssert.eventEmitted(result, 'Requested', (ev) => {
        return ev.requestId > 0
    });
});


it('Recipient can decide whether to approve access request of Inspector', async () => {
    const instance = await SupplyChain.deployed();
    let result = await instance.createScheme('myScheme');
    const schemeId = parseInt(result.logs[0].args["0"].toString(10), 10)
    await instance.endorseScheme(schemeId);
    result = await instance.awardCertificate(schemeId, recipient);
    const certId = parseInt(result.logs[0].args["certificateId"].toString(10), 10);
    result = await instance.requestAccess(schemeId, certId, inspector);
    result = await instance.decideAccess(schemeId, certId, inspector);

    truffleAssert.eventEmitted(result, 'Requested', (ev) => {
        return ev.requestId > 0
    });
});
