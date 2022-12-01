import React, {useContext, useEffect} from 'react';

import './Contacts.scss'
import {LanguageContext} from "../../languages/Language";

const Contacts = () => {
    const languageContext = useContext(LanguageContext);

    useEffect(() => {
        document.title = languageContext.dictionary["titles"]["contacts"] + " • Istinara"
    }, [languageContext]);

    return (
        <div>
            <h1>Mail us on feedback@istinara.org</h1>
        </div>
    );
};

export default Contacts;