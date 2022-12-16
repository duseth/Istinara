import React, {useContext, useEffect} from 'react';

import './Contacts.scss'
import {LanguageContext} from "../../languages/Language";
import {ContactsText} from "../../containers/Language";

const Contacts = () => {
    const languageContext = useContext(LanguageContext);

    useEffect(() => {
        document.title = languageContext.dictionary["titles"]["contacts"] + " • Istinara"
    }, [languageContext]);

    return (
        <div className="container text-center py-5">
            <div className="row d-flex justify-content-center align-items-center m-1">
                <h1 className="contacts-header"><ContactsText tid="header"/></h1>
                <i className="bi bi-envelope mail-icon"/>
                <div className="main-content">
                    <p className="main-text">
                        <ContactsText tid="main_text"/>
                        <a className="email-text" href="mailto:istinara@gmail.com"><b> istinara@gmail.com</b></a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Contacts;