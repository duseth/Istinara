class Author {
    id: number;
    name_ru: string;
    name_ar: string;
    short_name_ru: string;
    short_name_ar: string;
    about_ru: string;
    about_ar: string;
    birth_date: Date;
    death_date: Date;
    picture_path: string;
    link: string;
}

class AuthorCard {
    name: string;
    short_name: string;
    about: string;
}

export {Author, AuthorCard};