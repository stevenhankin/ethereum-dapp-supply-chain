import React, {useState, useEffect} from 'react';
import './App.css';
import Web3 from 'web3';
import { DrizzleContext } from "drizzle-react";
import Overview from "./Overview";


function App() {

    let web3Provider = {};
    let web3 = {};


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
            {({drizzle}) =>

                <Overview drizzle={drizzle} />
            }
        </DrizzleContext.Consumer>
    );
}

export default App;
