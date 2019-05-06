import React, {useState, useEffect} from 'react';
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";


function Authority(props) {

    const {drizzle, addAlert} = props;
    const contract = drizzle && drizzle.contracts.SupplyChain;

    const [authorityId, setAuthorityId] = useState("");
    const [schemeId, setSchemeId] = useState("1");


    // Set the Address Fields to default addresses
    useEffect(() => {
        const {accounts} = props;
        if (accounts.length > 0) {
            setAuthorityId(accounts[1]);
        }
    }, [props.accounts]);


    // An authority can officially endorse the certification scheme as approved
    const endorseScheme = async () => {
        if (contract) {
            const endorseScheme = contract.methods["endorseScheme"];
            try {
                await endorseScheme(schemeId).send({from: authorityId}).then(
                    addAlert('✅  Endorsed scheme', 'success'),
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
                <Form.Label>Authority Account</Form.Label>
                <FormControl
                    value={authorityId}
                    onChange={(i) => setAuthorityId(i.target.value)}
                />
            </Form.Group>

            <Form.Group>
                <Form.Label>Endorse Scheme</Form.Label>
                <InputGroup>
                    <InputGroup.Prepend><InputGroup.Text>Scheme Id</InputGroup.Text></InputGroup.Prepend>
                    <FormControl
                        value={schemeId}
                        onChange={(i) => setSchemeId(i.target.value)}
                    />
                    <InputGroup.Append>
                        <Button variant="primary"
                                onClick={endorseScheme}
                        >
                            Endorse Scheme
                        </Button>
                    </InputGroup.Append>

                </InputGroup>
            </Form.Group>
        </>
    );

}

export default Authority;
