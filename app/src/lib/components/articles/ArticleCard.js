import Article from "../../models/Article";
import React from "react";
import AccountService from "../../services/AccountService";
import ArticleService from "../../services/ArticleService";

const ArticleCard = (data: Array<Article>, article: Article, lang: string) => {
    return (
        <div className="article-card col-md my-3" key={article.id}>
            <a className="article-card-link" href={"/articles/" + article.link}>{}</a>
            <img className="group-icon" src={article.article_type.picture_path}
                 alt={lang === "ru" ? article.article_type.name_ru : article.article_type.name_ar}/>
            <div className="article-body">
                {AccountService.GetCurrentUser() && (
                    <button onClick={(event) => ArticleService.LikeArticle(event, data, article)}
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

export default ArticleCard;