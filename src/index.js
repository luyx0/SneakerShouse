import React, {createContext} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {HashRouter} from "react-router-dom";
import UserStore from "./store/UserStore";
import 'macro-css';

export const Context = createContext(null)


ReactDOM.render(
    <React.StrictMode>

        <Context.Provider value={{
            user: new UserStore()
        }}>
            <HashRouter>
                <App/>
            </HashRouter>
        </Context.Provider>
    </React.StrictMode>,


    document.getElementById('root')
);

