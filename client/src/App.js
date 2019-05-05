import React, {useState, useEffect} from 'react';
// import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Form from "react-bootstrap/Form";


function App(props) {

    const [web3, setWeb3] = useState({});
    const [accounts, setAccounts] = useState([]);

    const [certifierId, setCertifierId] = useState("");
    const [authorityId, setAuthorityId] = useState("");
    const [recipientId, setRecipientId] = useState("");
    const [inspectorId, setInspectorId] = useState("");

    console.log({certifierId});

    useEffect(() => {
            (async () => {
                let web3 = new Web3(Web3.givenProvider);
                let _accounts = await web3.eth.getAccounts();
                if (_accounts.length === 0) {
                    console.log('No provider accounts given, switching to local env');
                    web3 = new Web3('ws://127.0.0.1:8545');
                }
                _accounts = await web3.eth.getAccounts();
                setAccounts(_accounts);
                console.log({web3})
                setCertifierId(_accounts[0]);
                setAuthorityId(_accounts[1]);
                setRecipientId(_accounts[2]);
                setInspectorId(_accounts[3]);
            })()
        }
        , []
    );

    return (
        <React.Fragment>
            <Container>

                <Row>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Address</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            accounts.map((a, idx) =>
                                <tr key={a}>
                                    <td>{idx}</td>
                                    <td>{a}</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Row>

                {/*<Row>*/}
                <Row>
                    <Col>
                        <Form>

                            <Form.Group>
                                <Form.Label>Certifier ID</Form.Label>
                                <FormControl
                                    value={certifierId}
                                    onChange={(i) => setCertifierId(i.target.value)}
                                />
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
                {/*</Row>*/}


            </Container>

        </React.Fragment>
    );
}


export default App;
