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

    GetHighlightedQuote(input_quote: string, input_title: string) {
        const remove_diacritics = (str) => {
            return str.replace((/[\u064B-\u0652]/g), "");
        };

        const titleLength = input_title.length;
        const quote = remove_diacritics(input_quote);

        let title = null;
        const variables = [
            input_title,
            input_title.slice(0, titleLength - 1),
            input_title.slice(0, titleLength - 2),
            input_title.slice(1, titleLength),
            input_title.slice(2, titleLength)
        ];

        for (const variable of variables) {
            const re = new RegExp("([^\\s\\.,]*)(" + remove_diacritics(variable) + ")([^\\s\\.,]*)", "gi");
            title = quote.match(re);

            if (title) {
                break;
            }
        }

        if (title === null) {
            return <p>{input_quote}</p>
        }

        const start = input_quote.indexOf(title[0]);
        const end = start + title[0].length;

        return (
            <p>
                {input_quote.substring(0, start)}
                <b className="article-quote">{input_quote.substring(start, end)}</b>
                {input_quote.substring(end, input_quote.length)}
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