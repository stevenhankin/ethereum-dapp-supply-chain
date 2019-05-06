import React, {useState, useEffect} from 'react';
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
// import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Jumbotron from "react-bootstrap/Jumbotron";
import Accounts from "./Accounts";
import Certifier from "./Certifier";
// import {DrizzleContext} from "drizzle-react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Alert from 'react-bootstrap/Alert'
import md5 from 'md5';

function Overview(props) {

    // EVM accounts
    const [accounts, setAccounts] = useState([]);

    const [key, setKey] = useState('certifier');

    // Addresses of Actors
    const [authorityId, setAuthorityId] = useState("");
    const [recipientId, setRecipientId] = useState("");
    const [inspectorId, setInspectorId] = useState("");

    const [alerts, setAlerts] = useState([]);

    const {drizzle, drizzleState} = props;

    useEffect(() => {

        if (props && props.drizzle && props.drizzle.web3) {
            // let _accounts = await
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
            setTimeout(() => removeAlert(id), 3000);
        }
    };


    return (
        <React.Fragment>


            <Container>

                <Row>
                    <Col>

                        <Jumbotron>
                            <h1>Hello, world!</h1>
                            <p>
                                This is a simple hero unit, a simple jumbotron-style component for calling
                                extra attention to featured content or information.
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
                                <Form.Group>
                                    <Form.Label>Authority ID</Form.Label>
                                    <FormControl
                                        value={authorityId}
                                        onChange={(i) => setAuthorityId(i.target.value)}
                                    />
                                </Form.Group>
                            </Tab>
                            <Tab eventKey="recipient" title="Recipient">
                                <Form.Group>
                                    <Form.Label>Recipient ID</Form.Label>
                                    <FormControl
                                        value={recipientId}
                                        onChange={(i) => setRecipientId(i.target.value)}
                                    />
                                </Form.Group>
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
