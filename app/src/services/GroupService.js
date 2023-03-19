import API from "./API";
import AccountService from "./AccountService";
import {Group} from "../models/Group";


class GroupService {
    async Create(author: Group) {
        let formData = new FormData();
        Object.entries(author).map((value) => formData.append(value[0], value[1].trim()));

        return await API.post("/groups", formData, AccountService.GetHeaders(true, true))
            .then(() => true)
            .catch(() => {
                throw new Error();
            })
    }

    async Update(id: number, group: Group) {
        let formData = new FormData();
        Object.entries(group).map((value) => formData.append(value[0], value[1].trim()));

        return await API.patch(`/groups/${id}`, formData, AccountService.GetHeaders(true, true))
            .then((response) => response.data?.link)
            .catch(() => {
                throw new Error();
            })
    }

    async Delete(group_id: string) {
        return await API.delete(`/groups/${group_id}`, AccountService.GetHeaders(true, true))
            .then(() => true)
            .catch(() => {
                throw new Error();
            })
    }
}

export default new GroupService();