import React, {useContext, useEffect} from "react";

import './About.scss'
import {AboutText} from "../../containers/Language";
import {LanguageContext} from "../../languages/Language";

const AboutPage = () => {
    const languageContext = useContext(LanguageContext);

    useEffect(() => {
        document.title = languageContext.dictionary["titles"]["about"] + " • Istinara"
    }, [languageContext]);

    return (
        <div className="container text-center py-5">
            <div className="row d-flex justify-content-center align-items-center m-1">
                <h1 className="contacts-header"><AboutText tid="header"/></h1>
                <i className="bi bi-person-workspace workspace-icon"></i>
                <div className="main-content">
                    <p className="main-text"><AboutText tid="main_text"/></p>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;