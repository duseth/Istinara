import React, {useContext, useEffect, useState} from "react";
import Article from "../../models/Article";
import {LanguageContext} from "../../languages/Language";
import {ArticlesText, AuthorsText} from "../../containers/Language";
import api from "../../services/API";

import './Articles.scss'

const articles_per_page = 5;

const Authors = () => {
    const languageContext = useContext(LanguageContext);
    useEffect(() => {
        document.title = languageContext.dictionary["titles"]["articles"] + " • Istinara";
    }, [languageContext]);

    const [next, setNext] = useState(articles_per_page);
    const [data: Array<Article>, setData] = useState()

    useEffect(() => {
        api.get("/articles").then((response) => setData(response.data));
    }, []);

    if (!data) {
        return <div>Loading...</div>;
    }

    const loadMore = () => {
        setNext(next + articles_per_page)
    }

    const getArticleCard = (article: Article) => {
        if (languageContext.userLanguage === "ru") {
            return (
                <div className="article-card" key={article.id}>
                </div>
            )
        } else if (languageContext.userLanguage === "ar") {
            return (
                <div className="article-card" key={article.id}>
                </div>
            )
        }
    };

    return (
        <div className="album">
            <div className="container">
                <div className="row justify-content-center align-items-center m-3">
                    {
                        data.length > 0 ? (
                            data.slice(0, next).map((article) => getArticleCard(article))
                        ) : (
                            <div className="no-data">
                                <i className="bi bi-folder-x no-data-icon"></i>
                                <p className="no-data-message"><ArticlesText tid="no_data"/></p>
                            </div>
                        )
                    }
                    {
                        next < data?.length &&
                        <div className="text-center">
                            <button className="btn btn-outline-dark" onClick={loadMore}>
                                <AuthorsText tid="show_more"/>
                            </button>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default Authors