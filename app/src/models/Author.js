import BaseModel from "./Base";

class Author extends BaseModel {
    name_ru: string;
    name_ar: string;
    short_name_ru: string;
    short_name_ar: string;
    biography_ru: string;
    biography_ar: string;
    picture_path: string;
}

export default Author;