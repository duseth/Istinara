import Article from "../../models/Article";
import React from "react";
import ArticleCard from "./ArticleCard";

const CarouselArticleCard = (data: Array<Article>, article: Article, is_active: boolean, lang: string) => {
    return (
        <div className={is_active ? "carousel-item active" : "carousel-item"} key={article.id}>
            <div className="row justify-content-center align-items-center m-2">
                {ArticleCard(data, article, lang)}
            </div>
        </div>
    )
}

export default CarouselArticleCard;