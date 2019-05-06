import React, {useState, useEffect} from 'react';
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";


function Certifier(props) {

    const {drizzle, addAlert} = props;
    const contract = drizzle && drizzle.contracts.SupplyChain;

    const [certifierId, setCertifierId] = useState("");
    const [schemeName, setSchemeName] = useState("My example scheme");
    const [recipientId, setRecipientId] = useState("");

    const [schemeId, setSchemeId] = useState("1");


    // Set the Address Fields to default addresses
    useEffect(() => {
        const {accounts} = props;
        if (accounts.length > 0) {
            setCertifierId(accounts[0]);
            setRecipientId(accounts[2]);
        }
    }, [props.accounts]);


    const createScheme = () => {
        if (contract) {
            const createScheme = contract.methods["createScheme"];
            try {
                createScheme(schemeName).send({from: certifierId}).then(
                    result => {
                        const {schemeId} = result.events.Created.returnValues;
                        addAlert(`✅  Created scheme ${schemeId} - Tx Hash : ${result.transactionHash}`, 'success')
                    },
                    err => addAlert(err.message, 'danger')
                );
            } catch (err) {
                addAlert(err.message, 'danger')
            }
        }
    };

    const certifyRecipient = async () => {
        if (contract) {
            const awardCertificate = contract.methods["awardCertificate"];
            try {
                await awardCertificate(schemeId, recipientId).send({from: certifierId}).then(
                    addAlert('✅  Certified recipient', 'success'),
                    err => addAlert(err.message, 'danger')
                )
            } catch (err) {
                addAlert(err.message, 'danger')
            }
        }
    };

    return (
        <>
            <Form.Group>
                <Form.Label>Certifier Account</Form.Label>
                <FormControl
                    value={certifierId}
                    onChange={(i) => setCertifierId(i.target.value)}
                />
            </Form.Group>

            <Form.Group>
                <Form.Label>Scheme Creation</Form.Label>
                <InputGroup>
                    <InputGroup.Prepend><InputGroup.Text>Scheme Name</InputGroup.Text></InputGroup.Prepend>
                    <FormControl
                        value={schemeName}
                        onChange={(i) => setSchemeName(i.target.value)}
                    />
                    <InputGroup.Append>
                        <Button variant="primary" onClick={createScheme}>
                            Create Scheme
                        </Button>
                    </InputGroup.Append>

                </InputGroup>
            </Form.Group>

            <Form.Group>
                <Form.Label>Certify a Recipient</Form.Label>
                <InputGroup>
                    <InputGroup.Prepend><InputGroup.Text>Scheme ID</InputGroup.Text></InputGroup.Prepend>
                    <FormControl
                        value={schemeId}
                        onChange={(i) => setSchemeId(i.target.value)}
                    />
                </InputGroup>

                <InputGroup>
                    <InputGroup.Prepend><InputGroup.Text>Recipient ID</InputGroup.Text></InputGroup.Prepend>
                    <FormControl
                        value={recipientId}
                        onChange={(i) => setRecipientId(i.target.value)}
                    />
                </InputGroup>
                <Button variant="primary" onClick={certifyRecipient}>
                    Certify Recipient
                </Button>
            </Form.Group>
        </>
    );

}

export default Certifier;
