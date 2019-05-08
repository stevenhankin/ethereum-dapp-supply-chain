# ethereum-dapp-supply-chain

Architect a Blockchain Supply Chain Solution - Part B.  Udacity Project, April 2019

### Overview
This DAPP is for a decentralized approach for certifcation schemes, issuance and verification.
Any party can become a Certifier and assign a suitable Authority that can delegate authority of certification

### Diagrams 
https://github.com/stevenhankin/ethereum-dapp-supply-chain/wiki
They are also checked in under Documentation directory

### Libraries

| Library             | Version       | Why used    |
|---------------------|---------------|-------------|
|Truffle              |5.0.15         |Compile/deploy/test contracts, Ganache for running local test node, Drizzle for React Provider |
|Solidity             |0.5.8          |Compile contracts|
|Node                 |10.15.3        |Build React UI   |
|Web3                 |1.0.0 (beta 37)|Connect UI to EVM |
|React                |16.8.6         |User interface|


### Deployed to RINKEBY

https://rinkeby.etherscan.io/tx/0x7a651f778d772c19ca0c9c23e6190302a0f0c81754ec00e78c0e738c6313d141

* Transaction ID:   0x7a651f778d772c19ca0c9c23e6190302a0f0c81754ec00e78c0e738c6313d141
* Contract address: 0x516d3ef1ddf0570636689ceb3773de77d1775e6f


### Example Use Cases
Here are 3 examples to illustrate how this could work:

| Authority                         | Certifier                   | Recipient     | Inspector         |
|-----------------------------------|-----------------------------|---------------|-------------------|
|Specialty Coffee Association       |London School Of Coffee      |Trainee Barista| Starbucks Manager |
|Driver and Vehicle Licensing Agency|Pymans Garage                |Car Owner      | Insurance company |
|Oracle Corporation                 |Oracle Certified Professional|Database Admin | Deutsche Bank HR  |

A Certifier would probably have a single Authority per Certificate.  Many certificates can be awarded from a scheme and potentially many "Inspectors" could request access to view one or more awarded certificates of a recipient



## Installation and Local Test
1) Download App
    ```
    git clone https://github.com/stevenhankin/ethereum-dapp-supply-chain.git
    cd ethereum-dapp-supply-chain
    ```
2) Run ganache cli
   ```
   ganache-clie
   ```
3) Install required packages
    ```
    npm install && cd client && npm install
    ```
4) From root dir, deploy contracts to network
    ```
    truffle compile
    truffle migrate --reset --network development
    ```
6) Start App Server
    ```
    cd client
    npm start
    ```
7) Application should now be available on http://localhost:3000

# Testing
```
truffle compile
truffle test
```
