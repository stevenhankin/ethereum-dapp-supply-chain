# ethereum-dapp-supply-chain

Architect a Blockchain Supply Chain Solution - Part B.  Udacity Project, April 2019

SEE THE DIAGRAMS HERE: https://github.com/stevenhankin/ethereum-dapp-supply-chain/wiki

### Overview
This DAPP is for a decentralized approach for certifcation schemes, issuance and verification.
Any party can become a Certifier and assign a suitable Authority that can delegate authority of certification

### Example Use Cases
Here are 3 examples to illustrate how this could work:

| Authority                         | Certifier                   | Recipient     | Inspector         |
|-----------------------------------|-----------------------------|---------------|-------------------|
|Specialty Coffee Association       |London School Of Coffee      |Trainee Barista| Starbucks Manager |
|Driver and Vehicle Licensing Agency|Pymans Garage                |Car Owner      | Insurance company |
|Oracle Corporation                 |Oracle Certified Professional|Database Admin | Deutsche Bank HR  |

A Certifier would probably have a single Authority per Certificate.  Many certificates can be awarded from a scheme and potentially many "Inspectors" could request access to view one or more awarded certificates of a recipient



## Setup Infura

1) Login to [Infura](https://infura.io/dashboard)
1) Create New Project (e.g. Ether-DAPP-Supply-Chain)
1) View Project to get
    * Project ID
    * Project Secret
    * EndPoint  ```Use Drop-Down to select Rinkeby ```






## Requirements
* Truffle
* OpenZeppelin 
* Node
* [Infura Account](https://infura.io/)
* MetaMask Browser Add-on

Asset|Details
---|---
Truffle Version|5.0.4
OpenZeppelin|2.1.2
ERC-721 Token Name|StarNotary Token
ERC-721 Token Symbol|SUN
Token Address @ Rinkeby|[0x120b6ca46177800c31d7da64c06f3396501bf13f](https://rinkeby.etherscan.io/address/0x120b6ca46177800c31d7da64c06f3396501bf13f)

## Installation
1) Download App
    ```
    git clone https://github.com/stevenhankin/ethereum-dapp-supply-chain.git
    cd ethereum-dapp-supply-chain
    ```
2) Put your [Infura](https://infura.io) Project Secret into ".secret" file
    ```
    echo "MY-PROJECT-SECRET-ID" > .secret
    ```
3) Install required packages
    ```
    npm install && cd client && npm install
    ```
4) In truffle-config.js, set **infuraKey** to be your Infura Project ID
5) From Crypto-Star-Dapp root, deploy StarNotary contract to network
    ```
    truffle compile
    truffle migrate --reset --network rinkeby
    ```
6) Start App Server
    ```
    cd client
    npm start
    ```
7) Application should now be available on http://localhost:3000

# Testing
Start ```truffle develop``` then run the following:
```
migrate --reset
test
```
