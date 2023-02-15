import BaseModel from "./Base";
import Author from "./Author";

class Work extends BaseModel {
    title_ru: string;
    title_ar: string;
    about_ru: string;
    about_ar: string;
    genre_ru: string;
    genre_ar: string;
    picture_path: string;
    publication_date: Date;
    link: string;
    author: Author;
}

export default Work;