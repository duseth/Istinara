import {Article as ArticleDTO} from "../models/Article";
import React from "react";
import api from "./API";
import Cookies from "universal-cookie";
import AccountService from "./AccountService";
import NotifyService from "./NotifyService";

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

    GetArticleCard(data: Array<ArticleDTO>, article: ArticleDTO, languageContext) {
        const logged = this.cookies.get("token") !== undefined;

        const getClassesByGroup = (name: string) => {
            return "bi " + this.articleGroups[name] + " group-icon";
        }

        if (languageContext.userLanguage === "ru") {
            return (
                <div className="article-card col-md my-3" key={article.id}>
                    <a className="article-card-link" href={"/articles/" + article.link}/>
                    <i className={getClassesByGroup(article.group.name_ru)}/>
                    <div className="article-body">
                        {logged && (
                            <button onClick={(event) => this.LikeArticle(event, data, article, languageContext)}
                                    className="article-like">
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
        } else if (languageContext.userLanguage === "ar") {
            return (
                <div className="article-card col-md my-3" key={article.id}>
                    <a className="article-card-link" href={"/articles/" + article.link}/>
                    <i className={getClassesByGroup(article.group.name_ru)}/>
                    <div className="article-body">
                        {logged && (
                            <button onClick={(event) => this.LikeArticle(event, data, article, languageContext)}
                                    className="article-like">
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

    GetCarouselArticleCard(data: Array<ArticleDTO>, article: ArticleDTO, is_active: boolean, languageContext) {
        return (
            <div className={is_active ? "carousel-item active" : "carousel-item"} key={article.id}>
                <div className="row justify-content-center align-items-center m-2">
                    {this.GetArticleCard(data, article, languageContext)}
                </div>
            </div>
        )
    }

    LikeArticle(event: Event, data: Array<ArticleDTO>, article: ArticleDTO, languageContext) {
        let articleIndex = null;
        data.map((art, index) => {
            if (art.id === article.id) {
                articleIndex = index;
            }
        });

        const target = event.target.querySelector("i") || event.target;
        let classList = target.classList;

        if (!article.is_liked) {
            api.post("/user/favourite/" + article.id, null, this.configHeader)
                .then(() => {
                    data[articleIndex].is_liked = true;
                    classList.remove("like-icon");
                    classList.add("liked-icon");
                })
                .catch(() => {
                    NotifyService.Error(languageContext.dictionary["articles"]["favourite_error"]);
                });
        } else {
            api.delete("/user/favourite/" + article.id, this.configHeader)
                .then(() => {
                    data[articleIndex].is_liked = false;
                    classList.remove("liked-icon");
                    classList.add("like-icon");
                })
                .catch(() => {
                    NotifyService.Error(languageContext.dictionary["articles"]["favourite_error"]);
                });
        }
    };
}

let service = new ArticleService();
export default service;