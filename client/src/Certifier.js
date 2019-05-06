import React, {useState, useEffect} from 'react';
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";


function Certifier(props) {

    const {drizzle,addAlert} = props;
    const contract = drizzle && drizzle.contracts.SupplyChain;

    const [certifierId, setCertifierId] = useState("");
    const [schemeName, setSchemeName] = useState("");
    const [recipientId, setRecipientId] = useState("");

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
                    result => addAlert(`✅ Tx Hash : ${result.transactionHash}`,'success'),
                    err => addAlert(err.message,'danger')
                );
            } catch (err) {
                addAlert(err.message,'danger')
            }
        }
    };

    const certifyRecipient = async () => {
        if (contract) {
            const awardCertificate = contract.methods["awardCertificate"];
            try {
                await awardCertificate(99999999, recipientId).send({from: certifierId}).then(
                    result => console.log('success', {result}),
                    err => alert(err.message)
                )
            } catch (err) {
                alert(err.message)
            }
        }
    };

    return (
        <>
            <Form.Group>
                <Form.Label>Certifier ID</Form.Label>
                <FormControl
                    value={certifierId}
                    onChange={(i) => setCertifierId(i.target.value)}
                />
            </Form.Group>

            <Form.Group>
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
                <Form.Label>Recipient ID</Form.Label>
                <FormControl
                    value={recipientId}
                    onChange={(i) => setRecipientId(i.target.value)}
                />
                <Button variant="primary" onClick={certifyRecipient}>
                    Certify Recipient
                </Button>
            </Form.Group>
        </>
    );

}

export default Certifier;
