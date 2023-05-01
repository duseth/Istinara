import {Work} from "../models/Work";
import api from "../../config/API";

class WorkService {
    async Create(work: Work) {
        let formData = new FormData();
        Object.entries(work).map((value) => formData.append(value[0], value[1]));

        return await api.post("/works", formData)
            .then(() => true)
            .catch(() => {
                throw new Error();
            })
    }

    async Update(id: number, work: Work) {
        let formData = new FormData();
        Object.entries(work).map((value) => formData.append(value[0], value[1]));

        return await api.patch(`/works/${id}`, formData)
            .then((response) => response.data?.link)
            .catch(() => {
                throw new Error();
            })
    }

    async Delete(work_id: string) {
        return await api.delete(`/works/${work_id}`)
            .then(() => true)
            .catch(() => {
                throw new Error();
            })
    }
}

const service = new WorkService();
export default service;