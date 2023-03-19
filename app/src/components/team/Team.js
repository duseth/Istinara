import React, {useContext, useEffect} from "react";

import './Team.scss'
import {TeamText} from "../../containers/Language";
import {LanguageContext} from "../../languages/Language";

const TeamPage = () => {
    const languageContext = useContext(LanguageContext);

    useEffect(() => {
        document.title = languageContext.dictionary["titles"]["team"] + " • Istinara"
    }, [languageContext]);

    return (
        <div className="container text-center py-5">
            <div className="row d-flex justify-content-center align-items-center m-1">
                <h1 className="team-header"><TeamText tid="header"/></h1>
            </div>
        </div>
    );
};

export default TeamPage;