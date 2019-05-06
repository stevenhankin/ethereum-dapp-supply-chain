import React, {useState, useEffect} from 'react';
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

function Certifier(props) {

    const [certifierId, setCertifierId] = useState("");
    const [schemeName, setSchemeName] = useState("");

    useEffect(() => { console.log('Setting certifier'); setCertifierId(props.accounts[0]) },[props.accounts])

    console.log({props});

    const createScheme = () => {
        const {drizzle} = props;
        if (drizzle && drizzle.contracts.SupplyChain) {
            const contract = drizzle.contracts.SupplyChain;
            const createScheme = contract.methods["createScheme"];
            console.log({createScheme});
            createScheme( schemeName).send({from:props.accounts[3]} ).then(console.log);
        }
    };

    return (
        <Form.Group>

            <Form.Label>Certifier ID</Form.Label>
            <FormControl
                value={certifierId}
                onChange={(i) => setCertifierId(i.target.value)}
            />

            <Form.Label>Scheme Name</Form.Label>
            <FormControl
                value={schemeName}
                onChange={(i) => setSchemeName(i.target.value)}
            />

            <Button variant="primary" onClick={createScheme}>
                Create Scheme
            </Button>

        </Form.Group>);

}

export default Certifier;
