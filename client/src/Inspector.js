import React, {useState, useEffect} from 'react';
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";


function Inspector(props) {

    const {drizzle, addAlert} = props;
    const contract = drizzle && drizzle.contracts.SupplyChain;

    const [inspectorId, setInspectorId] = useState("");
    const [certificateId, setCertificateId] = useState("1");
    const [requestId, setRequestId] = useState("1");


    // Set the Address Fields to default addresses
    useEffect(() => {
        const {accounts} = props;
        if (accounts.length > 3) {
            setInspectorId(accounts[3]);
        }
    }, [props]);


    // An inspector has request access to view a Recipient's certification
    const requestAccess = async () => {
        if (contract) {
            const requestAccess = contract.methods["requestAccess"];
            try {
                const res = await requestAccess(certificateId).send({from: inspectorId});
                const {requestId} = res.events.Requested.returnValues;
                addAlert(`✅  Request Id ${requestId} : Requested Access to certificate ${certificateId} - Tx Hash: ${res.transactionHash}`, 'success')
            } catch (err) {
                addAlert(err.message, 'danger')
            }
        }
    };


    // An inspector has viewed a certificate that has had access approved
    const viewCertificate = async () => {
        if (contract) {
            const viewCertificate = contract.methods["viewCertificate"];
            try {
                const res = await viewCertificate(requestId).send({from: inspectorId});
                addAlert(`✅  Viewed certificate for request ${requestId} - Tx Hash: ${res.transactionHash}`, 'success');
            } catch (err) {
                addAlert(err.message, 'danger')
            }
        }
    };

    return (
        <>
            <Form.Group>
                <Form.Label>Inspector Account</Form.Label>
                <FormControl
                    value={inspectorId}
                    onChange={(i) => setInspectorId(i.target.value)}
                />
            </Form.Group>

            <Form.Group>
                <Form.Label>Request Access</Form.Label>
                <InputGroup>
                    <InputGroup.Prepend><InputGroup.Text>Certificate Id</InputGroup.Text></InputGroup.Prepend>
                    <FormControl
                        value={certificateId}
                        onChange={(i) => setCertificateId(i.target.value)}
                    />
                    <InputGroup.Append>
                        <Button variant="primary" onClick={requestAccess}>Request</Button>
                    </InputGroup.Append>
                </InputGroup>
            </Form.Group>


            <Form.Group>
                <Form.Label>View Certificate</Form.Label>
                <InputGroup>
                    <InputGroup.Prepend><InputGroup.Text>Request Id</InputGroup.Text></InputGroup.Prepend>
                    <FormControl
                        value={requestId}
                        onChange={(i) => setRequestId(i.target.value)}
                    />
                    <InputGroup.Append>
                        <Button variant="primary" onClick={viewCertificate}>View</Button>
                    </InputGroup.Append>
                </InputGroup>
            </Form.Group>

        </>
    );

}

export default Inspector;
