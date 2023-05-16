import {useForm} from "react-hook-form";
import {useParams} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";

import api from "../../../config/API";
import {Work as WorkDTO} from "../../models/Work";
import {Author, AuthorCard} from "../../models/Author";
import {LanguageContext} from "../../../bin/context/Language";
import AccountService from "../../services/AccountService";
import {AuthorsDeleteForm, AuthorsPage, AuthorsUpdateForm, GeneralForm} from "../../containers/Language";
import AuthorService from "../../services/AuthorService";
import NotifyService from "../../services/NotifyService";

import UpdateAuthorForm from "../../components/authors/UpdateAuthorForm";


const AuthorPage = () => {
    const languageContext = useContext(LanguageContext);
    const lang = languageContext.userLanguage;

    const {link} = useParams()

    const [author: Author, setAuthor] = useState();
    const [works: Array<WorkDTO>, setWorks] = useState();

    const [prevAuthor: Author, setPrevAuthor] = useState();
    const [nextAuthor: Author, setNextAuthor] = useState();
    const [authorCard: AuthorCard, setAuthorCard] = useState();

    const {register, setError, handleSubmit, formState: {errors}} = useForm();

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
            api.get(`/authors?sort_by=${lang === "ru" ? "name_ru" : "name_ar"}`).then((response) => {
                const authors: Array<Author> = response.data?.data;
                authors?.map((item, index) => {
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
            setAuthorCard({
                name: lang === "ru" ? author.name_ru : author.name_ar,
                short_name: lang === "ru" ? author.short_name_ru : author.short_name_ar,
                about: lang === "ru" ? author.about_ru : author.about_ar,
            });
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
        const locale = lang === "ru" ? "ru-RU" : "ar-AE";
        return new Date(date).toLocaleDateString(locale, {day: "numeric", month: "long", year: 'numeric'})
    };

    const getWorkCard = (work: WorkDTO, is_active: boolean) => {
        return (
            <div className={is_active ? "carousel-item active" : "carousel-item"} key={work.id}>
                <div className="author-work-card m-auto">
                    <a className="work-card-link" href={"/works/" + work.link}/>
                    <img className="work-card-image" src={work.picture_path}
                         alt={lang === "ru" ? work.title_ru : work.title_ar}/>
                    <div className="author-work-card-title left-20">
                        {lang === "ru" ? work.title_ru : work.title_ar}
                    </div>
                    <div className="author-work-card-about right-20">
                        {lang === "ru" ? work.genre_ru : work.genre_ar} • {new Date(work.publication_date).getFullYear()}
                    </div>
                </div>
            </div>
        )
    };

    const updateAuthor = async (data: Author) => {
        delete data["required"];
        const properties = Object.keys(data).filter(x => !["birth_date", "death_date", "picture"].includes(x));

        for (const property of properties) {
            data[property] = data[property].trim();
            if (data[property].length === 0) {
                setError("required", {message: <GeneralForm tid="error_required"/>});
                return;
            }
        }

        for (const property of properties) {
            if (data[property] === author[property]) {
                delete data[property];
            }
        }

        if (data["birth_date"] === author["birth_date"]?.slice(0, 10)) {
            delete data["birth_date"];
        }

        if (data["death_date"].length === 0 || data["death_date"] === author["death_date"]?.slice(0, 10)) {
            delete data["death_date"];
        }

        if (data["picture"].length === 0) {
            delete data["picture"];
        } else {
            data.picture = data.picture[0];
        }

        if (Object.keys(data).length === 0) {
            setError("required", {message: <GeneralForm tid="error_no_changes"/>});
            return;
        }

        try {
            const link = await AuthorService.Update(author.id, data);
            NotifyService.Success(<AuthorsUpdateForm tid="success_notify"/>);
            if (link) {
                window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1) + link;
            }
        } catch {
            NotifyService.Error(<AuthorsUpdateForm tid="error_notify"/>)
        }
    };

    const deleteAuthor = async () => {
        try {
            await AuthorService.Delete(author.id);
            NotifyService.Success(<AuthorsDeleteForm tid="success_notify"/>)
            window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
        } catch {
            NotifyService.Error(<AuthorsDeleteForm tid="error_notify"/>)
        }
    };

    return (
        <section className="main-container">
            <div className="container py-5 px-3">
                <div className="row">
                    <div className="text-center col-lg-4 p-4">
                        <img className="author-page-image m-2 me-3" src={author.picture_path}
                             alt={authorCard.name}/>
                        <h6 className="mt-0">{authorCard.short_name}</h6>
                        <div className="mt-3 mb-3">
                            <p className="author-date m-1">
                                <b><AuthorsPage tid="birth_date"/>:</b> {getDate(author.birth_date)}
                            </p>
                            {
                                author.death_date && (
                                    <p className="author-date m-1">
                                        <b><AuthorsPage tid="death_date"/>:</b> {getDate(author.death_date)}
                                    </p>
                                )
                            }
                        </div>
                    </div>
                    <div className="text-center col-lg-8 p-3">
                        <h4>{authorCard.name}</h4>
                        <div className="author-page-about">
                            {authorCard.about}
                        </div>
                        {
                            works?.length > 0 && (
                                <div className="text-center my-3">
                                    <hr/>
                                    <h5 className="mb-3"><AuthorsPage tid="works_title"/></h5>
                                    <div id="carouselExampleControls" className="carousel carousel-dark slide"
                                         data-bs-ride="carousel">
                                        <div className="carousel-inner rounded-3">
                                            {
                                                works.map((work, index) => getWorkCard(work, index === 0))
                                            }
                                        </div>
                                        <button className="carousel-control-prev" type="button"
                                                data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                                            <span className="carousel-control-prev-icon text-dark" aria-hidden="true"/>
                                        </button>
                                        <button className="carousel-control-next" type="button"
                                                data-bs-target="#carouselExampleControls" data-bs-slide="next">
                                            <span className="carousel-control-next-icon" aria-hidden="true"/>
                                        </button>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
                {
                    (prevAuthor || nextAuthor) && (
                        <div className="row">
                            <hr/>
                            <div className="col-md-6 d-flex flex-row p-2">
                                <div className="jump-author-card">
                                    <a className="author-link" href={prevAuthor.link}/>
                                    <i className={languageContext.userLanguage === "ru"
                                        ? "bi bi-arrow-left jump-author-icon"
                                        : "bi bi-arrow-right jump-author-icon"}></i>
                                    <div className="jump-author-name col">
                                        {lang === "ru" ? prevAuthor.short_name_ru : prevAuthor.short_name_ar}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 d-flex flex-row-reverse p-2">
                                <div className="jump-author-card">
                                    <a className="author-link" href={nextAuthor.link}/>
                                    <div className="jump-author-name col">
                                        {lang === "ru" ? nextAuthor.short_name_ru : nextAuthor.short_name_ar}
                                    </div>
                                    <i className={lang === "ru" ? "bi bi-arrow-right jump-author-icon" : "bi bi-arrow-left jump-author-icon"}/>
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                    AccountService.IsPrivilegedUser() && (
                        <div className="row">
                            <div className="col-md-9 m-auto pt-4">
                                <div className="accordion accordion-flush" id="accordionFlushExample">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="flush-heading">
                                            <button className={"accordion-button article-form-header collapsed" +
                                                (lang === "ar" ? " accordion-button-ar" : "")} type="button"
                                                    data-bs-toggle="collapse" data-bs-target="#flush-collapse"
                                                    aria-expanded="false" aria-controls="flush-collapse">
                                                <AuthorsUpdateForm tid="header"/>
                                            </button>
                                        </h2>
                                        <div id="flush-collapse" className="accordion-collapse collapse"
                                             aria-labelledby="flush-heading">
                                            <div className="accordion-body pt-0">
                                                <form onSubmit={handleSubmit((data, event) => updateAuthor(data, event))}
                                                      id="add-author-form" {...register("required")}>
                                                    {UpdateAuthorForm(register, errors, author)}
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 pt-4 my-2">
                                <button type="button" className="btn btn-outline-danger"
                                        onClick={() => {
                                            NotifyService.Confirm(
                                                <AuthorsDeleteForm tid="confirm"/>,
                                                <AuthorsDeleteForm tid="accept"/>,
                                                <AuthorsDeleteForm tid="dismiss"/>,
                                                deleteAuthor
                                            );
                                        }}>
                                    <AuthorsDeleteForm tid="button_text"/>
                                </button>
                            </div>
                        </div>
                    )
                }
            </div>
        </section>
    )
};

export default AuthorPage;