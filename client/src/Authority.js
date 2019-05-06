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
        if (accounts.length > 1) {
            setAuthorityId(accounts[1]);
        }
    }, [props]);


    // An authority can officially endorse the certification scheme as approved
    const endorseScheme = async () => {
        if (contract) {
            const endorseScheme = contract.methods["endorseScheme"];
            try {
                const result = await endorseScheme(schemeId).send({from: authorityId});
                addAlert(`✅  Endorsed scheme ${schemeId} - Tx Hash : ${result.transactionHash}`, 'success');
            } catch (err) {
                addAlert(err.message, 'danger')
            }
        }
    };

    const invalidateScheme = async () => {
        if (contract) {
            const invalidateScheme = contract.methods["invalidateScheme"];
            try {
                const result = await invalidateScheme(schemeId).send({from: authorityId});
                addAlert(`✅  Invalidated scheme ${schemeId} - Tx Hash : ${result.transactionHash}`, 'success');
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
                            Endorse
                        </Button>
                    </InputGroup.Append>

                </InputGroup>
            </Form.Group>


            <Form.Group>
                <Form.Label>Invalidate Scheme</Form.Label>
                <InputGroup>
                    <InputGroup.Prepend><InputGroup.Text>Scheme Id</InputGroup.Text></InputGroup.Prepend>
                    <FormControl
                        value={schemeId}
                        onChange={(i) => setSchemeId(i.target.value)}
                    />
                    <InputGroup.Append>
                        <Button variant="primary"
                                onClick={invalidateScheme}
                        >
                            Invalidate
                        </Button>
                    </InputGroup.Append>

                </InputGroup>
            </Form.Group>
        </>
    );

}

export default Authority;
