import React, {useContext, useEffect} from "react";
import './About.scss'
import {LanguageContext} from "../../languages/Language";

const About = () => {
    const languageContext = useContext(LanguageContext);

    useEffect(() => {
        document.title = languageContext.dictionary["titles"]["about"] + " • Istinara"
    }, [languageContext]);

    return (
        <div>
            <h1>
                Istinara Vocabulary.
            </h1>
        </div>
    );
};

export default About;