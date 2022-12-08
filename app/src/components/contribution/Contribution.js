import React, {useContext, useEffect} from 'react';

import './Contribution.scss'
import {LanguageContext} from "../../languages/Language";

const Contribution = () => {
    const languageContext = useContext(LanguageContext);

    useEffect(() => {
        document.title = languageContext.dictionary["titles"]["contribution"] + " • Istinara"
    }, [languageContext]);

    return (
        <div>
            <h1>Contribution to the Project</h1>
        </div>
    );
};

export default Contribution;