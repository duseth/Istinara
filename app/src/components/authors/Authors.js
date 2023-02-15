import React, {useContext, useEffect, useState} from "react";
import Author from "../../models/Author";
import {LanguageContext} from "../../languages/Language";
import {AuthorsText} from "../../containers/Language";
import api from "../../services/API";

import './Authors.scss'

const authors_per_page = 6;

const Authors = () => {
    const languageContext = useContext(LanguageContext);

    useEffect(() => {
        document.title = languageContext.dictionary["titles"]["authors"] + " • Istinara";
    }, [languageContext]);

    const [next, setNext] = useState(authors_per_page);
    const [data: Array<Author>, setData] = useState()

    useEffect(() => {
        api.get("/authors").then((response) => setData(response.data));
    }, []);

    if (!data) {
        return (
            <div className="album">
                <div className="container">
                    <div className="row justify-content-center align-items-center m-3">
                        <div className="information">
                            <div className="spinner-border" role="status"/>
                            <p className="mt-3"><AuthorsText tid="loading"/></p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const loadMore = () => {
        setNext(next + authors_per_page)
    };

    const truncateString = (text) => text?.length > 100 ? `${text.substring(0, 95)}...` : text;

    const getAuthorLifeDates = (birth: Date, death: Date) => {
        const options = {year: 'numeric'};
        const locale = languageContext.userLanguage === "ru" ? "ru-RU" : "ar-AE";

        const birth_date = new Date(birth).toLocaleDateString(locale, options);

        return (
            <p>
                {birth_date} ― {death !== undefined
                ? new Date(death).toLocaleDateString(locale, options)
                : <AuthorsText tid="not_death"/>}
            </p>
        )
    };

    const getAuthorCard = (author: Author) => {
        if (languageContext.userLanguage === "ru") {
            return (
                <div className="author-card col-md" key={author.id}>
                    <a className="author-link" href={"/authors/" + author.link}/>
                    <div className="w-50 h-100 mb-3">
                        <img className="author-image" src={author.picture_path} alt={author.short_name_ru}/>
                    </div>
                    <div className="author-body">
                        <div className="author-name">{author.name_ru}<br/>
                            <hr/>
                        </div>
                        <div className="author-life">
                            {getAuthorLifeDates(author.birth_date, author.death_date)}
                        </div>
                        <div className="author-biography">{truncateString(author.about_ru)}</div>
                    </div>
                </div>
            )
        } else if (languageContext.userLanguage === "ar") {
            return (
                <div className="author-card col-md" key={author.id}>
                    <a className="author-link" href={"/authors/" + author.link}/>
                    <div className="w-50 h-100 mb-3">
                        <img className="author-image" src={author.picture_path} alt={author.short_name_ar}/>
                    </div>
                    <div className="author-body">
                        <div className="author-name">{author.name_ar}<br/>
                            <hr/>
                        </div>
                        <div className="author-life">
                            {getAuthorLifeDates(author.birth_date, author.death_date)}
                        </div>
                        <div className="author-biography">{truncateString(author.about_ar)}</div>
                    </div>
                </div>
            )
        }
    };

    return (
        <div className="album">
            <div className="container">
                {
                    data.length > 0 ? (
                        <div className="justify-content-center align-items-center row row-cols-md-3 g-3 m-3">
                            {data.slice(0, next).map((author) => getAuthorCard(author))}
                        </div>
                    ) : (
                        <div className="information">
                            <i className="bi bi-folder-x information-icon"></i>
                            <p className="mt-3"><AuthorsText tid="no_data"/></p>
                        </div>
                    )
                }
                {
                    next < data?.length &&
                    <div className="text-center m-3">
                        <button className="btn btn-outline-dark" onClick={loadMore}>
                            <AuthorsText tid="show_more"/>
                        </button>
                    </div>
                }
            </div>
        </div>
    );
}

export default Authors