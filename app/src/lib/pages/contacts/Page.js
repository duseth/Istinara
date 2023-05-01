import React, {useContext, useEffect} from 'react';

import {ContactsText} from "../../containers/Language";
import {LanguageContext} from "../../../bin/context/Language";

import "./styles.scss"

const ContactsPage = () => {
    const languageContext = useContext(LanguageContext);

    useEffect(() => {
        document.title = languageContext.dictionary["titles"]["contacts"] + " • Istinara";
    }, [languageContext]);

    return (
        <div className="container text-center py-5">
            <div className="row justify-content-center align-items-center m-1">
                <h1 className="contacts-header"><ContactsText tid="header"/></h1>
                <i className="bi bi-envelope mail-icon"/>
                <div className="main-content">
                    <p className="main-text">
                        <ContactsText tid="main_text"/>
                        <a className="email-text" href="mailto:contact.istinara@gmail.com">
                            <b> contact.istinara@gmail.com</b>
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ContactsPage;