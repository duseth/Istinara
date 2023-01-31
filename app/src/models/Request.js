import BaseModel from "./Base";

class Request extends BaseModel {
    name: string;
    email: string;
    title_ru: string;
    title_ar: string;
    quote_ru: string;
    quote_ar: string;
    description_ru: string;
    description_ar: string;
    work_id: number;
    author_id: number;
}

export default Request;