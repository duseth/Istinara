import API from "./API";
import React from "react";
import {Author} from "../models/Author";
import AccountService from "./AccountService";

class AuthorService {
    async Create(author: Author) {
        let formData = new FormData();
        Object.entries(author).map((value) => formData.append(value[0], value[1]));

        return await API.post("/authors", formData, AccountService.GetHeaders(true, true))
            .then(() => true)
            .catch(() => {
                throw new Error();
            })
    }

    async Update(id: number, author: Author) {
        let formData = new FormData();
        Object.entries(author).map((value) => formData.append(value[0], value[1]));

        return await API.patch(`/authors/${id}`, formData, AccountService.GetHeaders(true, true))
            .then((response) => response.data?.link)
            .catch(() => {
                throw new Error();
            })
    }

    async Delete(author_id: string) {
        return await API.delete(`/authors/${author_id}`, AccountService.GetHeaders(true, true))
            .then(() => true)
            .catch(() => {
                throw new Error();
            })
    }
}

export default new AuthorService();