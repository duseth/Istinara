import BaseModel from "./Base";
import {Work} from "./Work";
import {Group} from "./Group";

class Article extends BaseModel {
    title_ru: string;
    title_ar: string;
    quote_ru: string;
    quote_ar: string;
    description_ru: string;
    description_ar: string;
    transcription: string;
    picture_path: string;
    is_liked: boolean;
    group: Group;
    work: Work;
    link: string;
    linked_articles: Array<Article>;
}

export {Article};