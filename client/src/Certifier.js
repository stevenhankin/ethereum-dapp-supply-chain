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

    const [certificateId, setCertificateId] = useState("1");

    // Set the Address Fields to default addresses
    useEffect(() => {
        const {accounts} = props;
        if (accounts.length > 0) {
            setCertifierId(accounts[0]);
            setRecipientId(accounts[2]);
        }
    }, [props]);

    // Certifier produces a scheme to be used for generating certificates
    const createScheme = async () => {
        if (contract) {
            const createScheme = contract.methods["createScheme"];
            try {
                const result = await createScheme(schemeName).send({from: certifierId});
                console.log({result})
                const {schemeId} = result.events.Created.returnValues;
                addAlert(`✅  Created scheme ${schemeId} - Tx Hash : ${result.transactionHash}`, 'success')
            } catch (err) {
                addAlert(err.message, 'danger')
            }
        }
    };

    // The certifier awards a certificate to a recipient
    const certifyRecipient = async () => {
        if (contract) {
            const awardCertificate = contract.methods["awardCertificate"];
            try {
                const result = await awardCertificate(schemeId, recipientId).send({from: certifierId});
                addAlert(`✅  Certified recipient with certificate ${certificateId} - Tx Hash : ${result.transactionHash}`, 'success');
            } catch (err) {
                addAlert(err.message, 'danger')
            }
        }
    };

    // A certifier has revoked a recipient's certificate (perhaps they cheated during an exam!)
    const revokeCertificate = async () => {
        if (contract) {
            const revokeCertificate = contract.methods["revokeCertificate"];
            try {
                const result = await revokeCertificate(certificateId).send({from: certifierId});
                addAlert(`✅  Revoked certificate ${certificateId} - Tx Hash : ${result.transactionHash}`, 'success')
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


            <Form.Group>
                <Form.Label>Revoke Certificate</Form.Label>
                <InputGroup>
                    <InputGroup.Prepend><InputGroup.Text>Certificate Id</InputGroup.Text></InputGroup.Prepend>
                    <FormControl
                        value={certificateId}
                        onChange={(i) => setCertificateId(i.target.value)}
                    />
                    <InputGroup.Append>
                        <Button variant="primary" onClick={revokeCertificate}>
                            Revoke
                        </Button>
                    </InputGroup.Append>

                </InputGroup>
            </Form.Group>
        </>
    );

}

export default Certifier;
