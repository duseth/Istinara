import React, {useContext, useEffect, useState} from "react";
import {Article as ArticleDTO} from "../../models/Article";
import {LanguageContext} from "../../languages/Language";
import {ArticlesText} from "../../containers/Language";
import api from "../../services/API";

import './Articles.scss'
import toast from "react-hot-toast";
import Cookies from "universal-cookie";
import AccountService from "../../services/AccountService";
import {useParams} from "react-router-dom";

const articles_per_page = 12;

const Articles = () => {
    const languageContext = useContext(LanguageContext);
    useEffect(() => {
        document.title = languageContext.dictionary["titles"]["articles"] + " • Istinara";
    }, [languageContext]);

    const cookies = new Cookies();

    let configHeader = null;
    if (cookies.get("token") !== undefined) {
        configHeader = AccountService.GetHeaders(true, true)
    }

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

    const likeArticle = (event: Event, article: ArticleDTO) => {
        let articleIndex = null;
        data.map((art, index) => {
            if (art.id === article.id) {
                articleIndex = index;
            }
        });

        let classList = event.target.classList;
        const title = languageContext.userLanguage === "ru" ? article.title_ru : article.title_ar;

        if (!article.is_liked) {
            api.post("/user/favourite/" + article.id, null, configHeader)
                .then(() => {
                    data[articleIndex].is_liked = true;
                    classList.remove("like-icon");
                    classList.add("liked-icon");
                    toast(`«${title}» ${languageContext.dictionary["articles"]["like_success"]}`, {icon: "🌟"});
                })
                .catch(() => {
                    toast.error(languageContext.dictionary["articles"]["like_error"]);
                });
        } else {
            api.delete("/user/favourite/" + article.id, configHeader)
                .then(() => {
                    data[articleIndex].is_liked = false;
                    classList.remove("liked-icon");
                    classList.add("like-icon");
                    toast(`«${title}» ${languageContext.dictionary["articles"]["dislike_success"]}`, {icon: "➖"});
                })
                .catch(() => {
                    toast.error(languageContext.dictionary["articles"]["dislike_error"]);
                });
        }
    };

    return (
        <div className="album">
            <div className="container">
                {
                    data.length > 0 ? (
                        <div className="justify-content-center align-items-center row row-cols-md-2 g-3 m-3">
                            {data.map((article) => GetArticleCard(languageContext.userLanguage,
                                article, cookies.get("token") !== undefined, likeArticle))}
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

const GetArticleCard = (lang: string, article: ArticleDTO, is_favorites: boolean, like_func: Function) => {
    if (lang === "ru") {
        return (
            <div className="article-card col-md" key={article.id}>
                <a className="article-card-link" href={"/articles/" + article.link}/>
                <div className="article-body">
                    {is_favorites && (
                        <button onClick={(event) => like_func(event, article)} className="article-like">
                            {
                                article.is_liked
                                    ? <i className="bi liked-icon bi-star"/>
                                    : <i className="bi like-icon"/>
                            }
                        </button>
                    )}
                    <div className="article-card-title">{article.title_ru}</div>
                </div>
            </div>
        )
    } else if (lang === "ar") {
        return (
            <div className="article-card col-md" key={article.id}>
                <a className="article-card-link" href={"/articles/" + article.link}/>
                <div className="article-body">
                    {is_favorites && (
                        <button onClick={(event) => like_func(event, article)} className="article-like">
                            {
                                article.is_liked
                                    ? <i className="bi liked-icon"/>
                                    : <i className="bi like-icon"/>
                            }
                        </button>
                    )}
                    <div className="article-card-title">{article.title_ar}</div>
                </div>
            </div>
        )
    }
}

const Article = () => {
    const {link} = useParams()
    return (
        <div>{link}</div>
    )
}

export {GetArticleCard}
export {Article, Articles}