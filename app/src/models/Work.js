import BaseModel from "./Base";
import {Author, AuthorCard} from "./Author";

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

class WorkCard {
    title: string;
    about: string;
    genre: string;
    publication_date: Date;
    picture_path: string;
    link: string;
    author: AuthorCard;
}

export {Work, WorkCard};