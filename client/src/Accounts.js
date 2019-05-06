import React from 'react';
import Table from "react-bootstrap/Table";


function Accounts(props) {

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
