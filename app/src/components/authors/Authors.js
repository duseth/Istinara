import React, {useContext, useEffect, useState} from "react";
import {Author as AuthorDTO, AuthorCard} from "../../models/Author";
import {LanguageContext} from "../../languages/Language";
import {AuthorsPage, AuthorsText} from "../../containers/Language";
import api from "../../services/API";

import './Authors.scss'
import {useParams} from "react-router-dom";
import {Work as WorkDTO} from "../../models/Work";

const authors_per_page = 6;

const Authors = () => {
    const languageContext = useContext(LanguageContext);

    useEffect(() => {
        document.title = languageContext.dictionary["titles"]["authors"] + " • Istinara";
    }, [languageContext]);

    const [count, setCount] = useState(0);
    const [data: Array<AuthorDTO>, setData] = useState()

    useEffect(() => {
        api.get(`/authors?offset=0&limit=${authors_per_page}`)
            .then((response) => {
                setCount(response.data.count);
                setData(response.data.data);
            })
            .catch(() => {
                setData([]);
            });
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
        api.get(`/authors?offset=${data.length}&limit=${authors_per_page}`)
            .then((response) => setData([...data, ...response.data.data]))
    };

    const truncateString = (text) => text?.length > 125 ? `${text.substring(0, 120)}...` : text;

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

    const getAuthorCard = (author: AuthorDTO) => {
        if (languageContext.userLanguage === "ru") {
            return (
                <div className="author-card col-md align-items-center" key={author.id}>
                    <a className="author-link" href={"/authors/" + author.link}/>
                    <div className="row">
                        <div className="col-md-4 m-3 text-center">
                            <img className="author-image" src={author.picture_path} alt={author.short_name_ru}/>
                        </div>
                        <div className="col-md-7 m-2">
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
                    </div>
                </div>
            )
        } else if (languageContext.userLanguage === "ar") {
            return (
                <div className="author-card col-md align-items-center" key={author.id}>
                    <a className="author-link" href={"/authors/" + author.link}/>
                    <div className="row">
                        <div className="col-md-4 m-3 text-center">
                            <img className="author-image" src={author.picture_path} alt={author.short_name_ar}/>
                        </div>
                        <div className="col-md-7 m-2">
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
                            {data.map((author) => getAuthorCard(author))}
                        </div>
                    ) : (
                        <div className="information">
                            <i className="bi bi-folder-x information-icon"></i>
                            <p className="mt-3"><AuthorsText tid="no_data"/></p>
                        </div>
                    )
                }
                {
                    data.length < count &&
                    <div className="text-center m-3">
                        <button className="btn btn-outline-dark" onClick={loadMore}>
                            <AuthorsText tid="show_more"/>
                        </button>
                    </div>
                }
            </div>
        </div>
    );
};

const Author = () => {
    const languageContext = useContext(LanguageContext);

    const {link} = useParams()

    const [author: AuthorDTO, setAuthor] = useState();
    const [works: Array<WorkDTO>, setWorks] = useState();

    const [prevAuthor: AuthorDTO, setPrevAuthor] = useState();
    const [nextAuthor: AuthorDTO, setNextAuthor] = useState();
    const [authorCard: AuthorCard, setAuthorCard] = useState();

    useEffect(() => {
        api.get("/authors/" + link)
            .then((response) => setAuthor(response.data))
            .catch(() => setAuthor(null));
    }, []);

    useEffect(() => {
        if (author) {
            const title = languageContext.userLanguage === "ru" ? author.short_name_ru : author.short_name_ar;
            document.title = title + " • Istinara";
        }
    }, [author, languageContext]);

    useEffect(() => {
        if (author) {
            api.get(`/authors/${author.id}/works`).then((response) => setWorks(response.data));
        }
    }, [author]);

    useEffect(() => {
        if (author) {
            api.get("/authors").then((response) => {
                let authors: Array<AuthorDTO> = response.data.data;
                authors.map((item, index) => {
                    if (item.id === author.id) {
                        setPrevAuthor(authors[((index - 1) + authors.length) % authors.length]);
                        setNextAuthor(authors[(index + 1) % authors.length]);
                    }
                });
            });
        }
    }, [author]);

    useEffect(() => {
        if (author) {
            let card = {
                birth_date: author.birth_date,
                death_date: author.death_date,
                picture_path: author.picture_path,
                link: link
            };

            if (languageContext.userLanguage === "ru") {
                card.name = author.name_ru;
                card.short_name = author.short_name_ru;
                card.about = author.about_ru;
            } else if (languageContext.userLanguage === "ar") {
                card.name = author.name_ar;
                card.short_name = author.short_name_ar;
                card.about = author.about_ar;
            }

            setAuthorCard(card);
        }
    }, [author, languageContext]);

    if (author === null) {
        return (
            <div className="information">
                <i className="bi bi-folder-x information-icon"></i>
                <p className="mt-3"><AuthorsPage tid="no_data"/></p>
            </div>
        )
    }

    if (!author || !authorCard || !works || !prevAuthor || !nextAuthor) {
        return (
            <div className="album">
                <div className="container py-5">
                    <div className="row justify-content-center align-items-center m-3">
                        <div className="information">
                            <div className="spinner-border" role="status"/>
                            <p className="mt-3"><AuthorsPage tid="loading"/></p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const getDate = (date: Date) => {
        const locale = languageContext.userLanguage === "ru" ? "ru-RU" : "ar-AE";
        return new Date(date).toLocaleDateString(locale, {day: "numeric", month: "long", year: 'numeric'})
    };

    const getWorkCard = (work: WorkDTO, is_active: boolean) => {
        if (languageContext.userLanguage === "ru") {
            return (
                <div className={is_active ? "carousel-item active" : "carousel-item"} key={work.id}>
                    <div className="author-work-card m-auto">
                        <a className="work-card-link" href={"/works/" + work.link}/>
                        <img className="work-card-image" src={work.picture_path} alt={work.title_ru}/>
                        <div className="author-work-card-title left-20">{work.title_ru}</div>
                        <div className="author-work-card-about right-20">
                            {work.genre_ru} • {new Date(work.publication_date).getFullYear()}
                        </div>
                    </div>
                </div>
            )
        } else if (languageContext.userLanguage === "ar") {
            return (
                <div className={is_active ? "carousel-item active" : "carousel-item"} key={work.id}>
                    <div className="author-work-card m-auto">
                        <a className="work-card-link" href={"/works/" + work.link}/>
                        <img className="work-card-image" src={work.picture_path} alt={work.title_ar}/>
                        <div className="author-work-card-title left-20">{work.title_ar}</div>
                        <div className="author-work-card-about right-20">
                            {work.genre_ar} • {new Date(work.publication_date).getFullYear()}
                        </div>
                    </div>
                </div>

            )
        }
    };

    return (
        <section className="main-container">
            <div className="container py-5">
                <div className="row m-3">
                    <div className="text-center col-md-4">
                        <img className="author-page-image m-2 me-3" src={authorCard.picture_path}
                             alt={authorCard.name}/>
                        <h6 className="mt-0">{authorCard.short_name}</h6>
                        <div className="mt-3 mb-3">
                            <p className="author-date m-1">
                                <b><AuthorsPage tid="birth_date"/></b> {getDate(authorCard.birth_date)}
                            </p>
                            {
                                authorCard.death_date && (
                                    <p className="author-date m-1">
                                        <b><AuthorsPage tid="death_date"/></b> {getDate(authorCard.death_date)}
                                    </p>
                                )
                            }
                        </div>
                    </div>
                    <div className="col-md-8">
                        <h4>{authorCard.name}</h4>
                        <div className="author-page-about my-4">
                            {authorCard.about}
                        </div>
                        {
                            works?.length > 0 && (
                                <div className="text-center my-3">
                                    <hr/>
                                    <h5 className="mb-3"><AuthorsPage tid="works_title"/></h5>
                                    <div id="carouselExampleControls" className="carousel carousel-dark slide"
                                         data-bs-ride="carousel">
                                        <div className="carousel-inner">
                                            {
                                                works.map((work, index) => getWorkCard(work, index === 0))
                                            }
                                        </div>
                                        <button className="carousel-control-prev" type="button"
                                                data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                                            <span className="carousel-control-prev-icon text-dark"
                                                  aria-hidden="true"></span>
                                        </button>
                                        <button className="carousel-control-next" type="button"
                                                data-bs-target="#carouselExampleControls" data-bs-slide="next">
                                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                        </button>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
                <hr/>
                <div className="row justify-content-center align-items-center m-1">
                    <div className="jump-author-card col-md-3">
                        <a className="author-link" href={prevAuthor.link}/>
                        <i className={languageContext.userLanguage === "ru"
                            ? "bi bi-arrow-left jump-author-icon"
                            : "bi bi-arrow-right jump-author-icon"}></i>
                        <div className="jump-author-name col">
                            {languageContext.userLanguage === "ru"
                                ? prevAuthor.short_name_ru
                                : prevAuthor.short_name_ar}
                        </div>
                    </div>
                    <div className="col-md-5"/>
                    <div className="jump-author-card col-md-3">
                        <a className="author-link" href={nextAuthor.link}/>
                        <div className="jump-author-name col">
                            {languageContext.userLanguage === "ru"
                                ? nextAuthor.short_name_ru
                                : nextAuthor.short_name_ar}
                        </div>
                        <i className={languageContext.userLanguage === "ru"
                            ? "bi bi-arrow-right jump-author-icon"
                            : "bi bi-arrow-left jump-author-icon"}></i>
                    </div>
                </div>
            </div>
        </section>
    )
}

export {Author, Authors}