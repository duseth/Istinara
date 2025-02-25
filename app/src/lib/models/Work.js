import {Author, AuthorCard} from "./Author";

class Work {
    id: number;
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
    author: AuthorCard;
}

export {Work, WorkCard};