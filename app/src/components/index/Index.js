import React, {useEffect, useState} from 'react';

import './Index.scss'
import {AuthorsPage, HomeText} from "../../containers/Language";
import api from "../../services/API";
import {Article} from "../../models/Article";

const Home = () => {
    document.title = "Istinara";

    const [article: Article, setArticle] = useState();
    const [max: number, setMax] = useState(0);

    useEffect(() => {
        api.get("/articles?limit=0").then((response) => setMax(response.data.count));
    }, []);

    useEffect(() => {
        if (max !== 0) {
            const random = Math.floor(Math.random() * Math.floor(max));
            console.log(random);
            api.get(`/articles?offset=${random}&limit=1`)
                .then((response) => setArticle(response.data.data[0]))
                .catch(() => setArticle(null));
        }
    }, [max]);

    if (article === null) {
        return (
            <div className="information">
                <i className="bi bi-folder-x information-icon"></i>
                <p className="mt-3"><AuthorsPage tid="no_data"/></p>
            </div>
        )
    }

    if (article === undefined || max === 0) {
        return (
            <div className="album">
                <div className="container py-5">
                    <div className="row justify-content-center align-items-center m-3">
                        <div className="information">
                            <div className="spinner-border" role="status"/>
                            <p className="mt-3"><AuthorsPage tid="loading"/></p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <main>
            <section className="main-container position-relative">
                <img className="welcome-image" src="/images/index.jpg" alt="culture"/>
                <div className="welcome-page">
                    <img alt="Istinara" src="/istinara.svg" className="caption-logo"/>
                    <div className="welcome-block m-auto mb-5">
                        <h2 className="welcome-header"><HomeText tid="header"/></h2>
                        <a href={"/articles/" + article.link}>
                            <button className="btn btn-outline-light btn-home-random">
                                Мне повезет <i className="bi bi-arrow-right logout-bi-icon"/>
                            </button>
                        </a>
                    </div>
                </div>
            </section>
            <div className="album py-5 bg-light">
                <div className="container text-center">
                    <p className="welcome-text"><HomeText tid="main_text"/></p>
                </div>
            </div>
        </main>
    );
};

export default Home;