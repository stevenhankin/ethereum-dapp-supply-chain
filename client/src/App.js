import React, {useState, useEffect} from 'react';
// import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import Form from "react-bootstrap/Form";
import TruffleContract from "truffle-contract";
// import { drizzleConnect } from 'drizzle-react'
import { DrizzleContext } from "drizzle-react";
import Overview from "./Overview";

// const SupplyChainJSON = require('./contracts/SupplyChain.json');
import SupplyChain from './contracts/SupplyChain.json';



function App(props, context) {

    console.log('******* PROPS',{props});
    console.log('******* CONTEXT',{context});

    let web3Provider = {};
    let web3 = {};



    // console.log({contract});
    // console.log({certifierId});
    if (props) {
        console.log('drizzle',props.drizzle)
    }





    // Use supplied provider or fallback to Ganache
    const initWeb3 = async () => {

        console.log('initWeb3');

        // Modern dapp browsers...
        if (window.ethereum) {
            web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        } else if (window.web3) {
            // Legacy dapp browsers...
            web3Provider = window.web3.currentProvider;
        } else {
            // If no injected web3 instance is detected, fall back to Ganache CLI
            web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
            console.log({web3Provider})
        }
        web3 = new Web3(web3Provider);

        // let _accounts = await web3.eth.getAccounts();
        //
        // setAccounts(_accounts);
        // // Use first four addresses for the Actors
        // setAuthorityId(_accounts[1]);
        // setRecipientId(_accounts[2]);
        // setInspectorId(_accounts[3]);
        console.log('initWeb3 done');


        // let _contract = TruffleContract(SupplyChain);
        // _contract.setProvider(web3Provider);

    };


    const initContract = async () => {
        console.log('initContract')
        let _contract = TruffleContract(SupplyChain);
        console.log(web3Provider);
        _contract.setProvider(web3Provider);
        // console.log({_contract});
        // const deployed = await SupplyChain.deployed();
        // console.log({deployed})
        _contract.deployed().then((instance) => {
            console.log({instance})
        }, (err) => {console.log(err)});
    };


    // On startup, setup Web3 and contracts
    useEffect(() => {
            (async () =>
            {
                initWeb3();
                // setTimeout(()=>initContract(),2000)
                // initContract();
            })()
        }
        , []
    );




    return (
        <DrizzleContext.Consumer>
            {({drizzle, drizzleState, initialized}) =>

                <Overview drizzle={drizzle} />
            }
        </DrizzleContext.Consumer>
    );
}

// const mapStateToProps = state => {
//     return {
//         drizzleStatus: state.drizzleStatus,
//         SupplyChain: state.contracts.SupplyChain
//     }
// };
//
// export default drizzleConnect(App, mapStateToProps);

export default App;
