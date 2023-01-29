import React, {useContext, useEffect, useState} from "react";
import Author from "../../models/Author";
import {LanguageContext} from "../../languages/Language";
import {AuthorsText} from "../../containers/Language";
import api from "../../services/API";

import './Authors.scss'

const authors_per_page = 5;

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
        return <div>Loading...</div>;
    }

    const loadMore = () => {
        setNext(next + authors_per_page)
    }

    const getAuthorCard = (author: Author) => {
        if (languageContext.userLanguage === "ru") {
            return (
                <div className="author-card" key={author.id}>
                    <a className="author-link" href={"/authors/" + author.link}/>
                    <div className="w-50">
                        <img className="author-image" src={author.picture_path} alt={author.short_name_ru}/>
                        <p className="text-center mb-3 ms-4">{author.short_name_ru}</p>
                    </div>
                    <div className="author-body">
                        <div className="author-name">{author.name_ru}<br/>•</div>
                        <div className="author-biography">{author.biography_ru}</div>
                    </div>
                </div>
            )
        } else if (languageContext.userLanguage === "ar") {
            return (
                <div className="author-card" key={author.id}>
                    <a className="author-link" href={"/authors/" + author.link}/>
                    <div className="w-50">
                        <img className="author-image" src={author.picture_path} alt={author.short_name_ar}/>
                        <p className="text-center mb-3 ms-4">{author.short_name_ar}</p>
                    </div>
                    <div className="author-body">
                        <div className="author-name">{author.name_ar}<br/>•</div>
                        <div className="author-biography">{author.biography_ar}</div>
                    </div>
                </div>
            )
        }
    };

    return (
        <div className="album">
            <div className="container">
                <div className="row justify-content-center align-items-center m-3">
                    {
                        data.length > 0 ? (
                            data.slice(0, next).map((author) => getAuthorCard(author))
                        ) : (
                            <div className="no-data">
                                <i className="bi bi-folder-x no-data-icon"></i>
                                <p className="no-data-message"><AuthorsText tid="no_data"/></p>
                            </div>
                        )
                    }
                    {
                        next < data?.length &&
                        <div className="text-center">
                            <button className="btn btn-outline-dark" onClick={loadMore}>
                                <AuthorsText tid="show_more"/>
                            </button>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default Authors