import {Work} from "../models/Work";
import API from "./API";
import AccountService from "./AccountService";

class WorkService {
    async Create(work: Work) {
        let formData = new FormData();
        Object.entries(work).map((value) => formData.append(value[0], value[1]));

        return await API.post("/works", formData, AccountService.GetHeaders(true, true))
            .then(() => true)
            .catch(() => {
                throw new Error();
            })
    }

    async Update(id: number, work: Work) {
        let formData = new FormData();
        Object.entries(work).map((value) => formData.append(value[0], value[1]));

        return await API.patch(`/works/${id}`, formData, AccountService.GetHeaders(true, true))
            .then((response) => response.data?.link)
            .catch(() => {
                throw new Error();
            })
    }

    async Delete(work_id: string) {
        return await API.delete(`/works/${work_id}`, AccountService.GetHeaders(true, true))
            .then(() => true)
            .catch(() => {
                throw new Error();
            })
    }
}

export default new WorkService();