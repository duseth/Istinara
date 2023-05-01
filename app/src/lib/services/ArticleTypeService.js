import api from "../../config/API";
import ArticleType from "../models/ArticleType";


class ArticleTypeService {
    async Create(author: ArticleType) {
        let formData = new FormData();
        Object.entries(author).map((value) => formData.append(value[0], value[1]));

        return await api.post("/articles/types", formData)
            .then(() => true)
            .catch(() => {
                throw new Error();
            })
    }

    async Update(id: number, article_type: ArticleType) {
        let formData = new FormData();
        Object.entries(article_type).map((value) => formData.append(value[0], value[1]));

        return await api.patch(`/articles/types/${id}`, formData)
            .then((response) => response.data?.link)
            .catch(() => {
                throw new Error();
            })
    }

    async Delete(article_type_id: string) {
        return await api.delete(`/articles/types/${article_type_id}`)
            .then(() => true)
            .catch(() => {
                throw new Error();
            })
    }
}

const service = new ArticleTypeService();
export default service;