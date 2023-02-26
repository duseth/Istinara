import {Article as ArticleDTO} from "../models/Article";
import React from "react";
import api from "./API";
import toast from "react-hot-toast";
import Cookies from "universal-cookie";
import AccountService from "./AccountService";

class ArticleService {
    cookies = new Cookies();
    configHeader = AccountService.GetHeaders(true, true);
    articleGroups = {
        "Ассоциативные": "bi-music-note-beamed",
        "Бытовые": "bi-house",
        "Ономастические": "bi-signpost",
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
                <div className="article-card col-md m-auto my-3" key={article.id}>
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
                <div className="article-card col-md m-auto my-3" key={article.id}>
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

    LikeArticle(event: Event, data: Array<ArticleDTO>, article: ArticleDTO, languageContext) {
        let articleIndex = null;
        data.map((art, index) => {
            if (art.id === article.id) {
                articleIndex = index;
            }
        });

        let classList = event.target.classList;
        const title = languageContext.userLanguage === "ru" ? article.title_ru : article.title_ar;

        if (!article.is_liked) {
            api.post("/user/favourite/" + article.id, null, this.configHeader)
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
            api.delete("/user/favourite/" + article.id, this.configHeader)
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
}

let service = new ArticleService();
export default service;