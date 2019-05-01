const { getWeb3, getContractInstance } = require("./helpers")
const web3 = getWeb3()
const getInstance = getContractInstance(web3)

// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
const SupplyChain = artifacts.require('SupplyChain');

let accounts;
let from;
let recipient;
// let instance;

contract('SupplyChain', async (accs) => {
    accounts = accs;
    from = accounts[0];
    recipient = accounts[1];

    // // build up and tear down a new SupplyChain contract before each test
    // beforeEach(async () => {
    //     // instance = await SupplyChain.deployed();
    //     instance = await SupplyChain.new();
    //     console.log('created instance',{instance})
    // });
    //
    //
    // afterEach(async () => {
    //     await instance.kill({from});
    // });

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
    // let instance = await SupplyChain.deployed();
    const instance = getInstance("SupplyChain");
    // console.log({myContract});
    const createScheme = instance
        .methods
        .createScheme(schemeName);
    await createScheme.send({from})
        .once('Created', (x) => {
            console.log('Created a scheme!!! heard event')
        });
    assert.strictEqual(event, 'Created');
});

it('can endorse a Scheme and emit correct event', async () => {
    let schemeName = 'myScheme';
    let instance = await SupplyChain.deployed();
    let {events} = instance;
    console.log({events})
    // instance.once('Created',{},(err,res) => {console.log('watching innit',{err,res})});
    // instance.events.Created({},(err,res) => {console.log('watching innit',{err,res})});
    await instance.createScheme(schemeName, {from})
        .on('Created', x => {
            console.log('HERE', x)
        });
    let {logs} = await instance.endorseScheme(1);
    let {event} = logs[0];
    assert.strictEqual(event, 'Endorsed');
});

it('can certify a Recipient and emit correct event', async () => {
    let schemeName = 'myScheme';
    let instance = await SupplyChain.deployed();
    let event = instance.createScheme(schemeName, {from});
    event.watch((err, res) => {
        console.log('In watch!', {err, res});
    });
    console.log({output})
    await instance.endorseScheme(2);
    // await instance.endorseScheme(1);
    // let {logs} = await instance.createCertificate(2,'testName',recipient);
    // console.log({logs})
    // let {event} = logs[0];
    // assert.strictEqual(event, 'Certified');
});
