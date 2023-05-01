import {Work} from "./Work";
import ArticleType from "./ArticleType";

class Article {
    id: number;

    title_ru: string;
    title_ar: string;

    quote_ru: string;
    quote_ar: string;

    quote_ru_highlight: string;
    quote_ar_highlight: string;

    description_ru: string;
    description_ar: string;

    transcription: string;
    picture_path: string;
    link: string;
    is_liked: boolean;

    article_type_id: string;
    article_type: ArticleType;

    work_id: string;
    work: Work;

    picture: any;
}

export default Article;