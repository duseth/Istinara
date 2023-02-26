import React, {useContext, useEffect, useState} from "react";
import {Article as ArticleDTO} from "../../models/Article";
import {LanguageContext} from "../../languages/Language";
import {ArticlesText} from "../../containers/Language";
import api from "../../services/API";

import './Articles.scss'
import AccountService from "../../services/AccountService";
import {useParams} from "react-router-dom";
import ArticleService from "../../services/ArticleService";
import Cookies from "universal-cookie";

const articles_per_page = 12;

const Articles = () => {
    const languageContext = useContext(LanguageContext);
    useEffect(() => {
        document.title = languageContext.dictionary["titles"]["articles"] + " • Istinara";
    }, [languageContext]);

    const cookies = new Cookies();
    const configHeader = AccountService.GetHeaders(true, cookies.get("token") !== undefined)

    const [count, setCount] = useState(0);
    const [data: Array<ArticleDTO>, setData] = useState()

    useEffect(() => {
        api.get(`/articles?offset=0&limit=${articles_per_page}`, configHeader)
            .then((response) => {
                setCount(response.data.count);
                setData(response.data.data);
            })
            .catch(() => {
                setData([]);
            });
    }, []);

    if (!data) {
        return (
            <div className="album">
                <div className="container">
                    <div className="row justify-content-center align-items-center m-3">
                        <div className="information">
                            <div className="spinner-border" role="status"/>
                            <p className="mt-3"><ArticlesText tid="loading"/></p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const loadMore = () => {
        api.get(`/articles?offset=${data.length}&limit=${articles_per_page}`)
            .then((response) => setData([...data, ...response.data.data]))
    };

    return (
        <div className="album">
            <div className="container">
                {
                    data.length > 0 ? (
                        <div className="row row-cols-md-2 g-3 m-3">
                            {data.map((article) => ArticleService.GetArticleCard(data, article, languageContext))}
                        </div>
                    ) : (
                        <div className="information">
                            <i className="bi bi-folder-x information-icon"></i>
                            <p className="mt-3"><ArticlesText tid="no_data"/></p>
                        </div>
                    )
                }
                {
                    data.length < count &&
                    <div className="text-center m-3">
                        <button className="btn btn-outline-dark" onClick={loadMore}>
                            <ArticlesText tid="show_more"/>
                        </button>
                    </div>
                }
            </div>
        </div>
    );
};

const Article = () => {
    const {link} = useParams()
    return (
        <div>{link}</div>
    )
}

export {Article, Articles}