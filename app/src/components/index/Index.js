import React, {useContext, useEffect} from 'react';

import './Index.scss'
import {LanguageContext} from "../../languages/Language";

const Home = () => {
    const languageContext = useContext(LanguageContext);

    useEffect(() => {
        document.title = languageContext.dictionary["titles"]["home"] + " • Istinara"
    }, [languageContext]);

    return (
        <div>
            <h1>Welcome to Istinara</h1>
        </div>
    );
};

export default Home;