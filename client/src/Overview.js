import React, {useState, useEffect} from 'react';
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
// import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Jumbotron from "react-bootstrap/Jumbotron";
// import {DrizzleContext} from "drizzle-react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Alert from 'react-bootstrap/Alert'
import md5 from 'md5';
import Accounts from "./Accounts";
import Certifier from "./Certifier";
import Authority from "./Authority";
import Recipient from "./Recipient";

function Overview(props) {

    // EVM accounts
    const [accounts, setAccounts] = useState([]);

    // Tab selection default
    const [key, setKey] = useState('certifier');

    // Addresses of Actors
    const [authorityId, setAuthorityId] = useState("");
    const [recipientId, setRecipientId] = useState("");
    const [inspectorId, setInspectorId] = useState("");

    const [alerts, setAlerts] = useState([]);

    const {drizzle, drizzleState} = props;

    // When accounts are available, map them as defaults to actors
    useEffect(() => {
        if (props && props.drizzle && props.drizzle.web3) {
            props.drizzle.web3.eth.getAccounts()
                .then(_accounts => {
                    setAccounts(_accounts);
                    // Use first four addresses for the Actors
                    setAuthorityId(_accounts[1]);
                    setRecipientId(_accounts[2]);
                    setInspectorId(_accounts[3]);
                });
        }
    }, [props.drizzle]);

    const removeAlert = (id) => {
        setAlerts(_alerts => _alerts.filter(alert => alert.id !== id));
    };

    const addAlert = (msg, variant) => {
        const id = md5(msg);
        if (!alerts.filter(alert => alert.id === id).length) {
            setAlerts(_alerts => !_alerts.filter(alert => alert.id === id).length && [..._alerts, {id, msg, variant}]);
            setTimeout(() => removeAlert(id), 9000);
        }
    };


    return (
        <React.Fragment>


            <Container>

                <Row>
                    <Col>

                        <Jumbotron>
                            <h1>World Certifier</h1>
                            <p>
                                This DAPP is for a decentralized approach for certifcation schemes, issuance
                                and verification
                            </p>
                            <p>
                                Any party can become a Certifier and assign a suitable Authority
                                that can endorse authority of certification
                            </p>
                        </Jumbotron>
                    </Col>
                </Row>


                <Row>
                    <Col>
                        <hr/>

                        <Tabs activeKey={key} onSelect={key => setKey(key)}>
                            <Tab eventKey="accounts" title="Accounts">
                                <Accounts addAlert={addAlert} accounts={accounts} drizzle={drizzle}
                                          drizzleState={drizzleState}/>
                            </Tab>
                            <Tab eventKey="certifier" title="Certifier">
                                <Certifier addAlert={addAlert} accounts={accounts} drizzle={drizzle}
                                           drizzleState={drizzleState}/>
                            </Tab>
                            <Tab eventKey="authority" title="Authority">
                                <Authority addAlert={addAlert} accounts={accounts} drizzle={drizzle}
                                           drizzleState={drizzleState}/>
                            </Tab>
                            <Tab eventKey="recipient" title="Recipient">
                                <Recipient addAlert={addAlert} accounts={accounts} drizzle={drizzle}
                                           drizzleState={drizzleState}/>
                            </Tab>
                            <Tab eventKey="inspector" title="Inspector">
                                <Form.Group>
                                    <Form.Label>Inspector ID</Form.Label>
                                    <FormControl
                                        value={inspectorId}
                                        onChange={(i) => setInspectorId(i.target.value)}
                                    />
                                </Form.Group>
                            </Tab>
                        </Tabs>

                    </Col>
                </Row>

                <Row>
                    <Col>
                        <hr/>
                        <h3>Transaction History</h3>
                        {
                            alerts.length === 0 ? <div>No recent updates</div>
                                :
                                alerts.reverse().map(alert =>
                                    <Alert key={alert.id} variant={alert.variant}>
                                        {typeof alert.msg == 'object' ? JSON.stringify(alert.msg)
                                            : alert.msg
                                        }
                                    </Alert>
                                )
                        }
                    </Col>
                </Row>

            </Container>

        </React.Fragment>)

}

export default Overview;
