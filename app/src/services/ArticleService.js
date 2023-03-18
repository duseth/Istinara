import {Article} from "../models/Article";
import React from "react";
import API from "./API";
import Cookies from "universal-cookie";
import AccountService from "./AccountService";
import NotifyService from "./NotifyService";
import {ArticlesText} from "../containers/Language";

class ArticleService {
    cookies = new Cookies();
    configHeader = AccountService.GetHeaders(true, true);
    articleGroups = {
        "Ассоциативные": "bi-music-note",
        "Бытовые": "bi-house",
        "Ономастические": "bi-signpost-2",
        "Реалии государственного строя и общественной жизни": "bi-building",
        "Реалии природного мира": "bi-tree",
        "Этнографические и мифологические реалии": "bi-magic",
    };

    GetArticleCard(data: Array<Article>, article: Article, lang: string) {
        const logged = this.cookies.get("token") !== undefined;

        const getClassesByGroup = (name: string) => {
            return "bi " + this.articleGroups[name] + " group-icon";
        }

        return (
            <div className="article-card col-md my-3" key={article.id}>
                <a className="article-card-link" href={"/articles/" + article.link}/>
                <i className={getClassesByGroup(lang === "ru" ? article.group.name_ru : article.group.name_ar)}/>
                <div className="article-body">
                    {logged && (
                        <button onClick={(event) => this.LikeArticle(event, data, article)}
                                className="article-like">
                            {
                                article.is_liked
                                    ? <i className="bi liked-icon bi-star"/>
                                    : <i className="bi like-icon"/>
                            }
                        </button>
                    )}
                    <div className="article-card-title">{lang === "ru" ? article.title_ru : article.title_ar}</div>
                </div>
            </div>
        )
    }

    GetCarouselArticleCard(data: Array<Article>, article: Article, is_active: boolean, lang: string) {
        return (
            <div className={is_active ? "carousel-item active" : "carousel-item"} key={article.id}>
                <div className="row justify-content-center align-items-center m-2">
                    {this.GetArticleCard(data, article, lang)}
                </div>
            </div>
        )
    }

    LikeArticle(event: Event, data: Array<Article>, article: Article) {
        let articleIndex = null;
        data.map((art, index) => {
            if (art.id === article.id) {
                articleIndex = index;
            }
        });

        const target = event.target.querySelector("i") || event.target;
        let classList = target.classList;

        if (!article.is_liked) {
            API.post("/user/favourite/" + article.id, null, this.configHeader)
                .then(() => {
                    data[articleIndex].is_liked = true;
                    classList.remove("like-icon");
                    classList.add("liked-icon");
                })
                .catch(() => {
                    NotifyService.Error(<ArticlesText tid="favourite_error"/>);
                });
        } else {
            API.delete("/user/favourite/" + article.id, this.configHeader)
                .then(() => {
                    data[articleIndex].is_liked = false;
                    classList.remove("liked-icon");
                    classList.add("like-icon");
                })
                .catch(() => {
                    NotifyService.Error(<ArticlesText tid="favourite_error"/>);
                });
        }
    };

    GetRussianHighlightedQuote(article: Article) {
        const re = new RegExp("([^\\s\\.,]*)(" + article.title_ru.toLowerCase() + ")([^\\s\\.,]*)", "gi");
        const quote = article.quote_ru.toLowerCase();
        const title = quote.match(re);

        if (title === null) {
            return <p>{article.quote_ru}</p>
        }

        const start = quote.indexOf(title[0]);
        const end = start + title[0].length;

        return (
            <p>
                {article.quote_ru.substring(0, start)}
                <b className="article-quote">{article.quote_ru.substring(start, end)}</b>
                {article.quote_ru.substring(end, article.quote_ru.length)}
            </p>
        )
    };

    GetArabicHighlightedQuote(article: Article) {
        const remove_diacritics = (str) => {
            return str.replace((/[\u064B-\u0652]/g), "");
        };

        const re = new RegExp("([^\\s\\.,]*)(" + remove_diacritics(article.title_ar) + ")([^\\s\\.,]*)", "gi");
        const quote = remove_diacritics(article.quote_ar);
        const title = quote.match(re);

        if (title === null) {
            return <p>{article.quote_ar}</p>
        }

        const start = quote.indexOf(title[0]);
        const end = start + title[0].length;

        return (
            <p>
                {article.quote_ar.substring(0, start)}
                <b className="article-quote">{article.quote_ar.substring(start, end)}</b>
                {article.quote_ar.substring(end, article.quote_ar.length)}
            </p>
        )
    };

    async Create(article: Article) {
        let formData = new FormData();
        Object.entries(article).map((value) => formData.append(value[0], value[1]));

        return await API.post("/articles", formData, AccountService.GetHeaders(true, true))
            .then(() => true)
            .catch(() => {
                throw new Error();
            })
    }

    async Update(id: number, article: Article) {
        let formData = new FormData();
        Object.entries(article).map((value) => formData.append(value[0], value[1]));

        return await API.patch(`/articles/${id}`, formData, AccountService.GetHeaders(true, true))
            .then((response) => response.data?.link)
            .catch(() => {
                throw new Error();
            })
    }

    async Delete(article_id: string) {
        return await API.delete(`/articles/${article_id}`, AccountService.GetHeaders(true, true))
            .then(() => true)
            .catch(() => {
                throw new Error();
            })
    }

    async CreateLink(id: number, link: number) {
        return await API.post(`/articles/${id}/link/${link}`, null, AccountService.GetHeaders(true, true))
            .then((response) => response.data?.link)
            .catch(() => {
                throw new Error();
            })
    }

    async DeleteLink(id: number, link: number) {
        return await API.delete(`/articles/${id}/link/${link}`, AccountService.GetHeaders(true, true))
            .then((response) => response.data?.link)
            .catch(() => {
                throw new Error();
            })
    }
}

let service = new ArticleService();
export default service;