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
import contract from "truffle-contract";

const SupplyChainJSON = require('./contracts/SupplyChain.json');

function App() {

    let web3Provider = {};
    let web3 = {};

    // EVM accounts
    // const [web3, setWeb3] = useState({});
    const [accounts, setAccounts] = useState([]);
    // const [web3Provider, setWeb3Provider] = useState({});

    // Addresses of Actors
    const [certifierId, setCertifierId] = useState("");
    const [authorityId, setAuthorityId] = useState("");
    const [recipientId, setRecipientId] = useState("");
    const [inspectorId, setInspectorId] = useState("");

    const [schemeName, setSchemeName] = useState("");

    console.log({contract});
    console.log({certifierId});

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
            // If no injected web3 instance is detected, fall back to Ganache
            web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
        }
        web3 = new Web3(web3Provider);

        let _accounts = await web3.eth.getAccounts();

        setAccounts(_accounts);
        // Use first four addresses for the Actors
        setCertifierId(_accounts[0]);
        setAuthorityId(_accounts[1]);
        setRecipientId(_accounts[2]);
        setInspectorId(_accounts[3]);
        console.log('initWeb3 done');
    };


    const initContract = () => {
        let _contract = contract(SupplyChainJSON);
        console.log(web3Provider);
        _contract.setProvider(web3Provider);
        console.log({_contract});
        _contract.deployed().then((instance) => {
            console.log({instance})
        });
    };


    // On startup, setup Web3 and contracts
    useEffect(() => {
            (async () => initWeb3())()
                .then(
                    () => {
                        console.log('async finished!');
                        initContract();
                    }
                )
        }
        , []
    );


    const createScheme = () => {
        // web3
    };

    function moo() {
        console.log('MOOOO')
    }

    return (
        <React.Fragment>
            <Container>

                <Row>
                    <Col>
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Address</th>
                            </tr>
                            </thead>
                            <tbody>
                            {accounts.map((a, idx) =>
                                <tr key={a}>
                                    <td>{idx}</td>
                                    <td>{a}</td>
                                </tr>
                            )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Form>

                            <Form.Group>
                                <Form.Label>Certifier ID</Form.Label>
                                <FormControl
                                    value={certifierId}
                                    // onChange={(i) => setCertifierId(i.target.value)}
                                    onChange={(i) => moo()}
                                />

                                <Form.Label>Scheme Name</Form.Label>
                                <FormControl
                                    value={schemeName}
                                    onChange={(i) => setSchemeName(i.target.value)}
                                />

                                <Button variant="primary" onClick={createScheme}>
                                    Create Scheme
                                </Button>

                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Authority ID</Form.Label>
                                <FormControl
                                    value={authorityId}
                                    onChange={(i) => setAuthorityId(i.target.value)}
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Recipient ID</Form.Label>
                                <FormControl
                                    value={recipientId}
                                    onChange={(i) => setRecipientId(i.target.value)}
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Inspector ID</Form.Label>
                                <FormControl
                                    value={inspectorId}
                                    onChange={(i) => setInspectorId(i.target.value)}
                                />
                            </Form.Group>

                        </Form>
                    </Col>
                </Row>

            </Container>

        </React.Fragment>
    );
}


export default App;
