import React, {useContext, useEffect} from 'react';

import './Index.scss'
import {HomeText} from "../../containers/Language";
import {LanguageContext} from "../../languages/Language";

const Home = () => {
    const languageContext = useContext(LanguageContext);
    useEffect(() => {
        document.title = languageContext.dictionary["titles"]["home"] + " • Istinara";
    }, [languageContext]);

    return (
        <main>
            <section className="container py-5 text-center">
                <div className="row py-5">
                    <div className="col-md-9 m-auto">
                        <h1 className="fw-light my-4"><HomeText tid="header"/></h1>
                        <p className="lead text-muted"><HomeText tid="main_text"/></p>
                    </div>
                </div>
            </section>
            <div className="album py-5 bg-light">
                <div className="container">

                </div>
            </div>
        </main>
    );
};

export default Home;