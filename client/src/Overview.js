import React, {useState, useEffect} from 'react';
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Certifier from "./Certifier";
import {DrizzleContext} from "drizzle-react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";


function Overview(props) {

    // EVM accounts
    const [accounts, setAccounts] = useState([]);

    const [key, setKey] = useState('certifier');

    // Addresses of Actors
    const [authorityId, setAuthorityId] = useState("");
    const [recipientId, setRecipientId] = useState("");
    const [inspectorId, setInspectorId] = useState("");


    const {drizzle, drizzleState} = props;

    useEffect(() => {
        console.log('HERE!!!!!!!!!!', {props})

        if (props && props.drizzle) {
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


    console.log({props});

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


                        <Tabs activeKey={key} onSelect={key => setKey(key)}>
                            <Tab eventKey="certifier" title="Certifier">
                                <Certifier accounts={accounts} drizzle={drizzle} drizzleState={drizzleState}/>
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

            </Container>

        </React.Fragment>)

}

export default Overview;
