import React, {useEffect, useState} from 'react';

import "./styles.scss"

import api from "../../../config/API";
import {WelcomeText} from "../../containers/Language";
import NotifyService from "../../services/NotifyService";
import Scores from "../../models/Score";

const WelcomePage = () => {
    document.title = "Istinara";

    const [scores: Scores, setScores] = useState({
        authors_count: 0,
        works_count: 0,
        articles_count: 0,
        article_types_count: 0,
        contributions_count: 0
    });

    useEffect(() => {
        api.get("statistics/scores").then((response) => {
            setScores(response.data);
        })
    }, []);

    const redirectToRandomArticle = async () => {
        if (scores.articles_count === 0) {
            NotifyService.Warning(<WelcomeText tid="zero_articles"/>)
            return;
        }

        const queryParams = {
            "limit": 1,
            "offset": Math.floor(Math.random() * Math.floor(scores.articles_count))
        }

        api.get(`/articles?${new URLSearchParams(queryParams).toString()}`)
            .then((response) => {
                response.data.data.length > 0
                    ? window.location.href += "articles/" + response.data.data[0].link
                    : NotifyService.Error(<WelcomeText tid="random_error"/>)
            })
            .catch(() => NotifyService.Error(<WelcomeText tid="random_error"/>));
    };

    return (
        <>
            <section className="main-container position-relative">
                <img className="welcome-image" src="/images/cover.jpg" alt="culture"/>
                <div className="welcome-page">
                    <img alt="Istinara" src="/images/istinara_ar.svg" className="caption-logo"/>
                    <div className="welcome-block m-auto mb-5">
                        <h2 className="welcome-header"><WelcomeText tid="header"/></h2>
                        <button className="btn btn-outline-light btn-home-random" onClick={redirectToRandomArticle}>
                            <WelcomeText tid="feeling_lucky"/> <i className="bi bi-dice-5 random-article-icon"/>
                        </button>
                    </div>
                </div>
            </section>
            <div className="album py-5 bg-light">
                <div className="container">
                    <h4 className="text-center"><WelcomeText tid="header_stat"/></h4>
                    <div className="row justify-content-center align-items-center g-3 m-1">
                        <div className="stat-card text-center col-md-3">
                            <img className="stat-card-image" src="/images/authors.jpg" alt="Authors"/>
                            <a className="stat-link" href="/authors"> </a>
                            <p className="stats-text"><WelcomeText tid="authors_stat"/></p>
                            <i className="bi bi-person-lines-fill stats-icon"> {scores.authors_count}</i>
                        </div>
                        <div className="stat-card text-center col-md-3">
                            <img className="stat-card-image" src="/images/works.jpg" alt="Authors"/>
                            <a className="stat-link" href="/works"> </a>
                            <p className="stats-text"><WelcomeText tid="works_stat"/></p>
                            <i className="bi bi-book stats-icon"> {scores.works_count}</i>
                        </div>
                        <div className="stat-card text-center col-md-3">
                            <img className="stat-card-image" src="/images/articles.jpg" alt="Authors"/>
                            <a className="stat-link" href="/articles"> </a>
                            <p className="stats-text"><WelcomeText tid="articles_stat"/></p>
                            <i className="bi bi-file-earmark stats-icon"> {scores.articles_count}</i>
                        </div>
                    </div>
                    <div className="col-md-12 m-auto mt-5">
                        <p className="welcome-text text-center"><WelcomeText tid="main_text"/></p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default WelcomePage;