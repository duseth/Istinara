import Cookies from "universal-cookie";
import {useParams} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";

import './Works.scss'
import API from "../../services/API";
import {Author, Author as AuthorDTO} from "../../models/Author";
import {LanguageContext} from "../../languages/Language";
import {Article as ArticleDTO} from "../../models/Article";
import {Work, WorkCard} from "../../models/Work";
import ArticleService from "../../services/ArticleService";
import AccountService from "../../services/AccountService";
import {
    GeneralForm,
    WorksCreateForm,
    WorksDeleteForm,
    WorksForm,
    WorksPage,
    WorksText,
    WorksUpdateForm
} from "../../containers/Language";
import NotifyService from "../../services/NotifyService";
import {useForm} from "react-hook-form";
import WorkService from "../../services/WorkService";

const WORKS_LIMIT = 6;

const WorksListPage = () => {
    const languageContext = useContext(LanguageContext);
    const lang = languageContext.userLanguage;

    const [rerender, setRerender] = useState(false);
    const [count, setCount] = useState(0);
    const [data: Array<Work>, setData] = useState();
    const [authors: Array<Author>, setAuthors] = useState();

    const {register, setError, handleSubmit, formState: {errors}} = useForm();

    useEffect(() => {
        document.title = languageContext.dictionary["titles"]["works"] + " • Istinara";
    }, [languageContext]);

    useEffect(() => {
        if (AccountService.IsPrivilegedUser()) {
            API.get("/authors").then((response) => setAuthors(response.data?.data));
        }
    }, []);

    useEffect(() => {
        API.get(`/works?offset=0&limit=${WORKS_LIMIT}&sort_by=${lang === "ru" ? "title_ru" : "title_ar"}`)
            .then((response) => {
                setCount(response.data.count);
                setData(response.data.data);
            })
            .catch(() => {
                setData([]);
            });
    }, [languageContext, rerender]);

    if (!data) {
        return (
            <div className="album">
                <div className="container">
                    <div className="row justify-content-center align-items-center m-3">
                        <div className="information">
                            <div className="spinner-border" role="status"/>
                            <p className="mt-3"><WorksText tid="loading"/></p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const loadMore = () => {
        API.get(`/works?offset=${data.length}&limit=${WORKS_LIMIT}&sort_by=${lang === "ru" ? "title_ru" : "title_ar"}`)
            .then((response) => setData([...data, ...response.data.data]))
    };

    const getWorkCard = (work: Work) => {
        return (
            <div className="work-card col-md" key={work.id}>
                <a className="work-card-link" href={"/works/" + work.link}/>
                <img className="work-card-image" src={work.picture_path}
                     alt={lang === "ru" ? work.title_ru : work.title_ar}/>
                <div className="work-card-title left-20">{lang === "ru" ? work.title_ru : work.title_ar}</div>
                <div className="work-card-about right-20">
                    {lang === "ru" ? work.genre_ru : work.genre_ar} • {new Date(work.publication_date).getFullYear()}
                </div>
            </div>
        )
    };

    const createWork = async (data: Author) => {
        delete data["required"];

        const fields = Object.keys(data).filter(x => x !== "picture");
        for (const field of fields) {
            if (data[field].trim().length === 0) {
                setError("required", {message: <GeneralForm tid="error_required"/>});
                return;
            }
        }

        if (data.picture.length === 0) {
            setError("required", {message: <GeneralForm tid="error_required"/>});
            return;
        }

        data.picture = data.picture[0];
        try {
            await WorkService.Create(data);
            NotifyService.Success(<WorksCreateForm tid="success_notify"/>)
            setRerender(!rerender);
        } catch {
            NotifyService.Error(<WorksCreateForm tid="error_notify"/>)
        }
    };

    return (
        <div className="album">
            <div className="container">
                {
                    AccountService.IsPrivilegedUser() && authors && (
                        <>
                            <div className="col-md-8 m-auto pt-4">
                                <div className="accordion accordion-flush" id="accordionFlushExample">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="flush-heading">
                                            <button className={"accordion-button article-form-header collapsed" +
                                                (lang === "ar" ? " accordion-button-ar" : "")} type="button"
                                                    data-bs-toggle="collapse" data-bs-target="#flush-collapseAdd"
                                                    aria-expanded="false" aria-controls="flush-collapse">
                                                <WorksCreateForm tid="header"/>
                                            </button>
                                        </h2>
                                        <div id="flush-collapseAdd" className="accordion-collapse collapse"
                                             aria-labelledby="flush-heading">
                                            <div className="accordion-body pt-0">
                                                <form onSubmit={handleSubmit((data) => createWork(data))}
                                                      id="add-work-form" {...register("required")}>
                                                    {GetWorkForm(register, errors, authors?.map(author => {
                                                        return {
                                                            id: author.id,
                                                            name: lang === "ru" ? author.name_ru : author.name_ar
                                                        };
                                                    }))}
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                }
                {
                    data.length > 0 ? (
                        <div className="justify-content-center align-items-center row row-cols-md-2 g-3 m-3">
                            {data.map((work) => getWorkCard(work))}
                        </div>
                    ) : (
                        <div className="information">
                            <i className="bi bi-folder-x information-icon"></i>
                            <p className="mt-3"><WorksText tid="no_data"/></p>
                        </div>
                    )
                }
                {
                    data.length < count &&
                    <div className="text-center m-3">
                        <button className="btn btn-outline-dark" onClick={loadMore}>
                            <WorksText tid="show_more"/>
                        </button>
                    </div>
                }
            </div>
        </div>
    );
};

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

    const cookies = new Cookies();
    const configHeader = AccountService.GetHeaders(true, cookies.get("token") !== undefined)

    const {register, setError, handleSubmit, formState: {errors}} = useForm();

    useEffect(() => {
        API.get(`/works/${link}`).then((response) => setWork(response.data)).catch(() => setWork(null));
    }, []);

    useEffect(() => {
        if (AccountService.IsPrivilegedUser()) {
            API.get("/authors").then((response) => setAuthors(response.data?.data));
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
            API.get(`/works/${work.id}/articles?sort_by=${sort}`, configHeader)
                .then((response) => setArticles(response.data?.data));
        }
    }, [work]);

    useEffect(() => {
        if (work) {
            API.get(`/works?${lang === "ru" ? "title_ru" : "title_ar"}`)
                .then((response) => {
                    const works: Array<AuthorDTO> = response.data?.data;
                    works?.map((item, index) => {
                        if (item.id === work.id) {
                            setPrevWork(works[((index - 1) + works.length) % works.length]);
                            setNextWork(works[(index + 1) % works.length]);
                        }
                    });
                });
        }
    }, [work]);

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
    }, [work, languageContext]);

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
            if (data[property].trim().length === 0) {
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
                <div className="col-md-9 text-center m-auto">
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
                <div className="col-md-9 work-page-about">
                    <hr/>
                    {workCard.about}
                </div>
                <div className="col-md-9 m-auto mb-3">
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
                                                ArticleService.GetCarouselArticleCard(articles, article, index === 0, lang))
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
                                    <a className="author-link" href={prevWork.link}/>
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
                                    <a className="author-link" href={nextWork.link}/>
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
                                                    {GetWorkForm(register, errors, authors.map(author => {
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

const GetWorkForm = (register, errors, authors, work) => {
    return (
        <>
            <div className="pt-3">
                <div className="row">
                    <div className="col-12">
                        <select className="form-select" id="author_id" defaultValue={work ? work.author?.id : "null"}
                                name="author_id" {...register("author_id")}>
                            <option value="null" disabled><WorksForm tid="choose_author"/></option>
                            {
                                authors?.map((author) =>
                                    <option key={author.id} value={author.id}>{author.name}</option>
                                )
                            }
                        </select>
                    </div>
                </div>
            </div>
            <div className="pt-3">
                <p className="m-0"><WorksForm tid="title"/></p>
                <div className="row">
                    <div className="col-6">
                        <label htmlFor="title_ru" className="form-label">
                            <WorksForm tid="russian"/>
                        </label>
                        <input type="text" dir="ltr" className="form-control" id="title_ru"
                               {...register("title_ru")} defaultValue={work?.title_ru}/>
                    </div>
                    <div className="col-6">
                        <label htmlFor="title_ar" className="form-label">
                            <WorksForm tid="arabic"/>
                        </label>
                        <input type="text" dir="rtl" className="form-control" id="title_ar"
                               {...register("title_ar")} defaultValue={work?.title_ar}/>
                    </div>
                </div>
            </div>
            <div className="pt-3">
                <p className="m-0"><WorksForm tid="about"/></p>
                <div className="row">
                    <div className="col-12">
                        <label htmlFor="about_ru" className="form-label">
                            <WorksForm tid="russian"/>
                        </label>
                        <textarea rows="4" dir="ltr" className="form-control" id="about_ru"
                                  {...register("about_ru")} defaultValue={work?.about_ru}/>
                    </div>
                    <div className="col-12">
                        <label htmlFor="about_ar" className="form-label">
                            <WorksForm tid="arabic"/>
                        </label>
                        <textarea rows="4" dir="rtl" className="form-control" id="about_ar"
                                  {...register("about_ar")} defaultValue={work?.about_ar}/>
                    </div>
                </div>
            </div>
            <div className="pt-3">
                <p className="m-0"><WorksForm tid="genre"/></p>
                <div className="row">
                    <div className="col-6">
                        <label htmlFor="genre_ru" className="form-label">
                            <WorksForm tid="russian"/>
                        </label>
                        <input type="text" dir="rtl" className="form-control" id="genre_ru"
                               {...register("genre_ru")} defaultValue={work?.genre_ru}/>
                    </div>
                    <div className="col-6">
                        <label htmlFor="genre_ar" className="form-label">
                            <WorksForm tid="arabic"/>
                        </label>
                        <input type="text" dir="rtl" className="form-control" id="genre_ar"
                               {...register("genre_ar")} defaultValue={work?.genre_ar}/>
                    </div>
                </div>
            </div>
            <div className="pt-3">
                <div className="row">
                    <div className="col-12">
                        <label htmlFor="publication_date" className="date form-label">
                            <WorksForm tid="publication_date"/>
                        </label>
                        <input type="date" className="form-control" id="publication_date"
                               {...register("publication_date")}
                               defaultValue={work && work.publication_date && work.publication_date.slice(0, 10)}/>
                    </div>
                </div>
            </div>
            <div className="pt-3">
                <div className="row">
                    <div className="col-12">
                        <label htmlFor="picture" className="form-label"><WorksForm tid="picture"/></label>
                        <input type="file" className="form-control" id="picture" {...register("picture")}/>
                    </div>
                </div>
            </div>
            <div className="form-error mt-4 mb-0">
                {errors?.required?.message || errors?.email?.message}
            </div>
            <div
                className="col-12 row justify-content-center align-items-center mt-4 m-auto">
                <button type="submit" className="btn btn-outline-dark w-auto">
                    {
                        !work
                            ? <WorksCreateForm tid="button_text"/>
                            : <WorksUpdateForm tid="button_text"/>
                    }
                </button>
            </div>
        </>
    )
};


export {WorkPage, WorksListPage};