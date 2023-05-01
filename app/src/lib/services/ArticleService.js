import Article from "../models/Article";
import React from "react";
import api from "../../config/API";
import NotifyService from "./NotifyService";
import {ArticlesText} from "../containers/Language";

class ArticleService {
    LikeArticle(event: Event, data: Array<Article>, article: Article) {
        let articleIndex = null;
        data.forEach((art, index) => {
            if (art.id === article.id) {
                articleIndex = index;
            }
        });

        const target = event.target.querySelector("i") || event.target;
        let classList = target.classList;

        if (!article.is_liked) {
            api.post("/users/favourites/" + article.id, null)
                .then(() => {
                    data[articleIndex].is_liked = true;
                    classList.remove("like-icon");
                    classList.add("liked-icon");
                })
                .catch(() => {
                    NotifyService.Error(<ArticlesText tid="favourite_error"/>);
                });
        } else {
            api.delete("/users/favourites/" + article.id)
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

    async Create(article: Article) {
        let formData = new FormData();
        Object.entries(article).map((value) => formData.append(value[0], value[1]));

        return await api.post("/articles", formData)
            .then(() => true)
            .catch(() => {
                throw new Error();
            })
    }

    async Update(id: number, article: Article) {
        let formData = new FormData();
        Object.entries(article).forEach((value) => formData.append(value[0], value[1]));

        return await api.patch(`/articles/${id}`, formData)
            .then((response) => response.data?.link)
            .catch(() => {
                throw new Error();
            })
    }

    async Delete(article_id: string) {
        return await api.delete(`/articles/${article_id}`)
            .then(() => true)
            .catch(() => {
                throw new Error();
            })
    }

    async CreateLink(id: number, link: number) {
        return await api.post(`/articles/${id}/links?link_id=${link}`, null)
            .then(() => true)
            .catch(() => {
                throw new Error();
            })
    }

    async DeleteLink(id: number, link: number) {
        return await api.delete(`/articles/${id}/links?link_id=${link}`)
            .then(() => true)
            .catch(() => {
                throw new Error();
            })
    }
}

const service = new ArticleService();
export default service;