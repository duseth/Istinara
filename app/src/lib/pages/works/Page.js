import React, {useContext, useEffect, useState} from "react";
import {LanguageContext} from "../../../bin/context/Language";
import {useParams} from "react-router-dom";
import {Work, WorkCard} from "../../models/Work";
import {Article as ArticleDTO} from "../../models/Article";
import {Author as AuthorDTO, Author} from "../../models/Author";
import {useForm} from "react-hook-form";
import api from "../../../config/API";
import AccountService from "../../services/AccountService";
import {GeneralForm, WorksDeleteForm, WorksPage, WorksUpdateForm} from "../../containers/Language";
import WorkService from "../../services/WorkService";
import NotifyService from "../../services/NotifyService";
import CarouselArticleCard from "../../components/articles/CarouselArticleCard";
import UpdateWorkForm from "../../components/works/UpdateWorkForm";

const WorkPage = () => {
    const languageContext = useContext(LanguageContext);
    const lang = languageContext.userLanguage;

    const {link} = useParams()

    const [work: Work, setWork] = useState();
    const [articles: Array<ArticleDTO>, setArticles] = useState();
    const [authors: Array<Author>, setAuthors] = useState();

    const [prevWork: Work, setPrevWork] = useState();
    const [nextWork: Work, setNextWork] = useState();
    const [workCard: WorkCard, setWorkCard] = useState();

    const {register, setError, handleSubmit, formState: {errors}} = useForm();

    useEffect(() => {
        api.get(`/works/${link}`).then((response) => setWork(response.data)).catch(() => setWork(null));
    }, [link]);

    useEffect(() => {
        if (AccountService.IsPrivilegedUser()) {
            api.get("/authors/signatures").then((response) => setAuthors(response.data));
        }
    }, []);

    useEffect(() => {
        if (work) {
            const title = languageContext.userLanguage === "ru" ? work.title_ru : work.title_ar;
            document.title = title + " • Istinara";
        }
    }, [work, languageContext]);

    useEffect(() => {
        const sort = lang === "ru" ? "title_ru" : "title_ar";
        if (work) {
            api.get(`/works/${work.id}/articles?sort_by=${sort}`)
                .then((response) => setArticles(response.data));
        }
    }, [work, lang]);

    useEffect(() => {
        if (work) {
            api.get(`/works/signatures?sort_by=${lang === "ru" ? "title_ru" : "title_ar"}`)
                .then((response) => {
                    const works: Array<AuthorDTO> = response.data;
                    works?.forEach((item, index) => {
                        if (item.id === work.id) {
                            setPrevWork(works[((index - 1) + works.length) % works.length]);
                            setNextWork(works[(index + 1) % works.length]);
                        }
                    });
                });
        }
    }, [work, lang]);

    useEffect(() => {
        if (work) {
            setWorkCard({
                title: lang === "ru" ? work.title_ru : work.title_ar,
                about: lang === "ru" ? work.about_ru : work.about_ar,
                genre: lang === "ru" ? work.genre_ru : work.genre_ar,
                author: {
                    short_name: lang === "ru" ? work.author.short_name_ru : work.author.short_name_ar
                }
            });
        }
    }, [work, lang]);

    if (work === null) {
        return (
            <div className="information">
                <i className="bi bi-folder-x information-icon"></i>
                <p className="mt-3"><WorksPage tid="no_data"/></p>
            </div>
        )
    }

    if (!work || !workCard || !articles || !prevWork || !nextWork) {
        return (
            <div className="album">
                <div className="container py-5">
                    <div className="row justify-content-center align-items-center m-3">
                        <div className="information">
                            <div className="spinner-border" role="status"/>
                            <p className="mt-3"><WorksPage tid="loading"/></p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const updateWork = async (data: Work) => {
        delete data["required"];
        const properties = Object.keys(data).filter(x => !["picture", "author_id", "publication_date"].includes(x));

        for (const property of properties) {
            data[property] = data[property].trim();
            if (data[property].length === 0) {
                setError("required", {message: <GeneralForm tid="error_required"/>});
                return;
            }
        }

        for (const property of properties) {
            if (data[property] === work[property]) {
                delete data[property];
            }
        }

        if (data["publication_date"] === work.publication_date?.slice(0, 10)) {
            delete data["publication_date"];
        }

        if (data["author_id"] === work.author.id) {
            delete data["author_id"];
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
            const link = await WorkService.Update(work.id, data);
            NotifyService.Success(<WorksUpdateForm tid="success_notify"/>)
            window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1) + link;
        } catch {
            NotifyService.Error(<WorksUpdateForm tid="error_notify"/>)
        }
    };

    const deleteWork = async () => {
        try {
            await WorkService.Delete(work.id);
            NotifyService.Success(<WorksDeleteForm tid="success_notify"/>)
            window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
        } catch {
            NotifyService.Error(<WorksDeleteForm tid="error_notify"/>)
        }
    };

    return (
        <section className="main-container">
            <div className="container py-5">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className={lang === "ru" ? "breadcrumb-item" : "breadcrumb-item-rtl"}>
                            <a className="breadcrumb-link" href={"/authors/" + work.author.link}>
                                {workCard.author.short_name}
                            </a>
                        </li>
                        <li className={lang === "ru" ? "breadcrumb-item active" : "breadcrumb-item-rtl active"}
                            aria-current="page">
                            {workCard.title}
                        </li>
                    </ol>
                </nav>
                <hr className="mb-5"/>
                <div className="work-cover-image">
                    <img className="work-page-image" src={work.picture_path} alt={workCard.title}/>
                </div>
                <h4 className="text-center my-3">{workCard.title}</h4>
                <div className="col-md-12 text-center m-auto">
                    <hr/>
                    <div className="row">
                        <p className="col-md-4 m-0">
                            <b><WorksPage tid="author"/>:</b> {workCard.author.short_name}
                        </p>
                        <p className="col-md-4 m-0">
                            <b><WorksPage tid="genre"/>:</b> {workCard.genre}
                        </p>
                        <p className="col-md-4 m-0">
                            <b><WorksPage
                                tid="publication_year"/>:</b> {new Date(work.publication_date).getFullYear()}
                        </p>
                    </div>
                </div>
                <div className="col-md-12 work-page-about">
                    <hr/>
                    {workCard.about}
                </div>
                <div className="col-md-12 m-auto mb-3">
                    {
                        articles?.length > 0 && (
                            <div className="text-center my-3">
                                <hr/>
                                <h5 className="mb-3"><WorksPage tid="articles_title"/></h5>
                                <div id="carouselExampleControls" className="carousel carousel-dark slide mx-2"
                                     data-bs-ride="carousel">
                                    <div className="carousel-inner">
                                        {
                                            articles.map((article, index) =>
                                                CarouselArticleCard(articles, article, index === 0, lang))
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
                {
                    (prevWork || nextWork) && (
                        <div className="row">
                            <hr/>
                            <div className="col-md-6 d-flex flex-row">
                                <div className="jump-author-card">
                                    <a className="author-link" href={prevWork.link}> </a>
                                    <i className={lang === "ru"
                                        ? "bi bi-arrow-left jump-author-icon"
                                        : "bi bi-arrow-right jump-author-icon"}/>
                                    <div className="jump-author-name col">
                                        {lang === "ru" ? prevWork.title_ru : prevWork.title_ar}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 d-flex flex-row-reverse">
                                <div className="jump-author-card">
                                    <a className="author-link" href={nextWork.link}> </a>
                                    <div className="jump-author-name col">
                                        {lang === "ru" ? nextWork.title_ru : nextWork.title_ar}
                                    </div>
                                    <i className={lang === "ru"
                                        ? "bi bi-arrow-right jump-author-icon"
                                        : "bi bi-arrow-left jump-author-icon"}/>
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                    AccountService.IsPrivilegedUser() && authors && (
                        <div className="row">
                            <div className="col-md-9 m-auto pt-4">
                                <div className="accordion accordion-flush" id="accordionFlushExample">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="flush-heading">
                                            <button className={"accordion-button article-form-header collapsed" +
                                                (lang === "ar" ? " accordion-button-ar" : "")} type="button"
                                                    data-bs-toggle="collapse" data-bs-target="#flush-collapse"
                                                    aria-expanded="false" aria-controls="flush-collapse">
                                                <WorksUpdateForm tid="header"/>
                                            </button>
                                        </h2>
                                        <div id="flush-collapse" className="accordion-collapse collapse"
                                             aria-labelledby="flush-heading">
                                            <div className="accordion-body pt-0">
                                                <form onSubmit={handleSubmit((data, event) => updateWork(data, event))}
                                                      id="update-work-form" {...register("required")}>
                                                    {UpdateWorkForm(register, errors, authors.map(author => {
                                                        return {
                                                            id: author.id,
                                                            name: lang === "ru" ? author.name_ru : author.name_ar
                                                        };
                                                    }), work)}
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
                                                <WorksDeleteForm tid="confirm"/>,
                                                <WorksDeleteForm tid="accept"/>,
                                                <WorksDeleteForm tid="dismiss"/>,
                                                deleteWork
                                            );
                                        }}>
                                    <WorksDeleteForm tid="button_text"/>
                                </button>
                            </div>
                        </div>
                    )
                }
            </div>
        </section>
    )
};

export default WorkPage;