import React from 'react';
import './App.css';
import { DrizzleContext } from "drizzle-react";
import Overview from "./Overview";


function App() {

    return (
        <DrizzleContext.Consumer>
            {({drizzle}) =>

                <Overview drizzle={drizzle} />
            }
        </DrizzleContext.Consumer>
    );
}

export default App;
