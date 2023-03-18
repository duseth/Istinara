import {isInteger} from "lodash";
import React, {useContext} from 'react';

import './Index.scss'
import API from "../../services/API";
import {WelcomeText} from "../../containers/Language";
import NotifyService from "../../services/NotifyService";
import {LanguageContext} from "../../languages/Language";

const WelcomePage = () => {
    document.title = "Istinara";
    const languageContext = useContext(LanguageContext);

    const redirectToRandomArticle = async () => {
        const articlesCount = await API.get("/articles?limit=0")
            .then((response) => response.data.count)
            .catch(() => NotifyService.Error(<WelcomeText tid="random_error"/>));

        if (!isInteger(articlesCount)) {
            return;
        }

        if (articlesCount === 0) {
            NotifyService.Warning(<WelcomeText tid="zero_articles"/>)
            return;
        }

        const randomNum = Math.floor(Math.random() * Math.floor(articlesCount));
        API.get(`/articles?offset=${randomNum}&limit=1`)
            .then((response) => {
                response.data.data.length > 0
                    ? window.location.href += "articles/" + response.data.data[0].link
                    : NotifyService.Error(<WelcomeText tid="random_error"/>)
            })
            .catch(() => NotifyService.Error(<WelcomeText tid="random_error"/>));
    };

    const getIconByLanguage = () => {
        return languageContext.userLanguage === "ru"
            ? "bi bi-arrow-right logout-bi-icon"
            : "bi bi-arrow-left logout-bi-icon";
    };

    return (
        <>
            <section className="main-container position-relative">
                <img className="welcome-image" src="/images/index.jpg" alt="culture"/>
                <div className="welcome-page">
                    <img alt="Istinara" src="/istinara.svg" className="caption-logo"/>
                    <div className="welcome-block m-auto mb-5">
                        <h2 className="welcome-header"><WelcomeText tid="header"/></h2>
                        <button className="btn btn-outline-light btn-home-random" onClick={redirectToRandomArticle}>
                            <WelcomeText tid="feeling_lucky"/> <i className={getIconByLanguage()}/>
                        </button>
                    </div>
                </div>
            </section>
            <div className="album py-5 bg-light">
                <div className="container text-center">
                    <p className="welcome-text"><WelcomeText tid="main_text"/></p>
                </div>
            </div>
        </>
    );
};

export default WelcomePage;