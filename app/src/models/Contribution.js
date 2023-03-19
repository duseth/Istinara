import BaseModel from "./Base";

class Contribution extends BaseModel {
    name: string;
    email: string;
    title_ru: string;
    title_ar: string;
    quote_ru: string;
    quote_ar: string;
    description_ru: string;
    description_ar: string;
    work_id: number;
}

export {Contribution};