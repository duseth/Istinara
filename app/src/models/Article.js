import BaseModel from "./Base";

class Article extends BaseModel {
    title_ru: string;
    title_ar: string;
    quote_ru: string;
    quote_ar: string;
    description_ru: string;
    description_ar: string;
    transcription: string;
    picture_path: string;
    work_id: number;
    link: string;
}

export default Article;