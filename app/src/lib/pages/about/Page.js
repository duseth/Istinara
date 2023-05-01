import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import React, {useContext, useEffect} from "react";

import "./styles.scss"

import {AboutText} from "../../containers/Language";
import {LanguageContext} from "../../../bin/context/Language";

const AboutPage = () => {
    const languageContext = useContext(LanguageContext);
    const sources = languageContext.dictionary["about"]["sources"];

    useEffect(() => {
        document.title = languageContext.dictionary["titles"]["about"] + " • Istinara"
    }, [languageContext]);

    return (
        <div className="container text-center py-5">
            <div className="row justify-content-center align-items-center m-2">
                <h1 className="contacts-header"><AboutText tid="header"/></h1>
                <i className="bi bi-person-workspace about-icon"/>
                <div className="main-content">
                    <Tabs className="account-nav-items justify-content-center align-items-center"
                          defaultActiveKey="about">
                        <Tab tabClassName="account-nav-item" eventKey="about"
                             title={<AboutText tid="about_tab"/>}>
                            <div className="about-text"><AboutText tid="about_text"/></div>
                        </Tab>
                        <Tab tabClassName="account-nav-item" eventKey="sources"
                             title={<AboutText tid="sources_tab"/>}>
                            <ul className="list-group list-group-flush">
                                {
                                    sources.map((source) => {
                                        return (
                                            <li key={source.ru} className="list-group-item bg-transparent py-4">
                                                <p className="source-item">{source.ru}</p>
                                                <p className="source-item">{source.ar}</p>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;