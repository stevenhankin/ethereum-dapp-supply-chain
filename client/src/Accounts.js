import React, {useState, useEffect} from 'react';
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";


function Accounts(props) {

    const {drizzle,addAlert} = props;
    const contract = drizzle && drizzle.contracts.SupplyChain;

    const {accounts} = props;

    return (
        <Table striped bordered hover size={"sm"}>
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
    );

}

export default Accounts;
