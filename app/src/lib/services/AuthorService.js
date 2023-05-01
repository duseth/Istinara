import api from "../../config/API";
import {Author} from "../models/Author";

class AuthorService {
    async Create(author: Author) {
        let formData = new FormData();
        Object.entries(author).map((value) => formData.append(value[0], value[1]));

        return await api.post("/authors", formData)
            .then(() => true)
            .catch(() => {
                throw new Error();
            })
    }

    async Update(id: number, author: Author) {
        let formData = new FormData();
        Object.entries(author).map((value) => formData.append(value[0], value[1]));

        return await api.patch(`/authors/${id}`, formData)
            .then((response) => response.data?.link)
            .catch(() => {
                throw new Error();
            })
    }

    async Delete(author_id: string) {
        return await api.delete(`/authors/${author_id}`)
            .then(() => true)
            .catch(() => {
                throw new Error();
            })
    }
}

const service = new AuthorService();
export default service;