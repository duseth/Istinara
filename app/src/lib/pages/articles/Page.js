import Cookies from "universal-cookie";
import React, {useContext, useEffect, useState} from "react";
import {LanguageContext} from "../../../bin/context/Language";
import {useParams} from "react-router-dom";
import Article from "../../models/Article";
import {Work} from "../../models/Work";
import ArticleType from "../../models/ArticleType";
import {useForm} from "react-hook-form";
import api from "../../../config/API";
import AccountService from "../../services/AccountService";
import {
    ArticlesCreateLinkForm,
    ArticlesDeleteForm,
    ArticlesDeleteLinkForm,
    ArticlesFeedbackForm,
    ArticlesPage,
    ArticlesUpdateForm,
    GeneralForm
} from "../../containers/Language";
import {Feedback} from "../../models/Feedback";
import NotifyService from "../../services/NotifyService";
import ArticleService from "../../services/ArticleService";
import HighlightedQuote from "../../components/articles/HighlightedQuote";
import ArticleCard from "../../components/articles/ArticleCard";
import UpdateArticleForm from "../../components/articles/UpdateArticleForm";

const ArticlePage = () => {
    const cookies = new Cookies();
    const languageContext = useContext(LanguageContext);
    const lang = languageContext.userLanguage;

    const {link} = useParams()
    const [article: Article, setArticle] = useState();
    const [articles: Array<Article>, setArticles] = useState();
    const [articleLinks: Array<Article>, setArticleLinks] = useState();
    const [works: Array<Work>, setWorks] = useState();
    const [articleTypes: Array<ArticleType>, setArticleTypes] = useState();

    const {
        register: feedbackRegister,
        reset: feedbackReset,
        setError: setFeedbackError,
        handleSubmit: feedbackHandle,
        formState: {
            errors: feedbackErrors
        }
    } = useForm();

    const {
        register: updateArticleRegister,
        setError: setUpdateArticleError,
        handleSubmit: updateArticleHandle,
        formState: {
            errors: updateArticleErrors
        }
    } = useForm();

    const {
        register: createLinkRegister,
        setError: setCreateLinkError,
        handleSubmit: createLinkHandler,
        formState: {
            errors: createLinkErrors
        }
    } = useForm();

    const {
        register: deleteLinkRegister,
        setError: setDeleteLinkError,
        handleSubmit: deleteLinkHandler,
        formState: {
            errors: deleteLinkErrors
        }
    } = useForm();

    useEffect(() => {
        api.get("/articles/" + link)
            .then((response) => setArticle(response.data))
            .catch(() => setArticle(null));
    }, [link]);

    useEffect(() => {
        if (article) {
            api.get(`/articles/${article.id}/links`)
                .then((response) => setArticleLinks(response.data))
                .catch(() => setArticle(null));
        }
    }, [article]);

    useEffect(() => {
        if (AccountService.IsPrivilegedUser()) {
            api.get("/works/signatures")
                .then((response) => setWorks(response.data))
                .catch(() => setWorks(null));
        }
    }, []);

    useEffect(() => {
        if (AccountService.IsPrivilegedUser()) {
            api.get("/articles/types")
                .then((response) => setArticleTypes(response.data))
                .catch(() => setArticleTypes(null));
        }
    }, []);

    useEffect(() => {
        if (AccountService.IsPrivilegedUser() && article && articleLinks) {
            api.get("/articles/signatures")
                .then((response) => {
                    setArticles(
                        response.data?.filter(
                            x => !articleLinks.map(x => x.id).includes(x.id) && x.id !== article.id
                        )
                    );
                })
                .catch(() => setArticles(null))
        }
    }, [article, articleLinks]);

    useEffect(() => {
        if (article) {
            const title = languageContext.userLanguage === "ru" ? article.title_ru : article.title_ar;
            document.title = title + " • Istinara";
        }
    }, [article, languageContext]);

    if (article === null) {
        return (
            <div className="information">
                <i className="bi bi-folder-x information-icon"></i>
                <p className="mt-3"><ArticlesPage tid="no_data"/></p>
            </div>
        )
    }

    if (!article) {
        return (
            <div className="album">
                <div className="container py-5">
                    <div className="row justify-content-center align-items-center m-3">
                        <div className="information">
                            <div className="spinner-border" role="status"/>
                            <p className="mt-3"><ArticlesPage tid="loading"/></p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const sendFeedback = async (data: Feedback) => {
        if (data.title.trim().length === 0 || data.description.trim().length === 0) {
            setFeedbackError("required", {message: <GeneralForm tid="error_required"/>});
            return;
        }

        let formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);

        await api.post(`/articles/${article.id}/feedback`, formData)
            .then(() => {
                NotifyService.Success(<ArticlesFeedbackForm tid="success_notify"/>);
                feedbackReset();
            })
            .catch(() => NotifyService.Error(<ArticlesFeedbackForm tid="error_notify"/>))
    };

    const updateArticle = async (data: Article) => {
        delete data["required"];
        const excludeFields = ["picture", "article_type_id", "work_id", "transcription", "quote_ru_highlight", "quote_ar_highlight"];
        const properties = Object.keys(data).filter(x => !excludeFields.includes(x));

        if (data.article_type_id === undefined || data.article_type_id === "null") {
            setUpdateArticleError("required", {message: <GeneralForm tid="error_required"/>});
            return;
        }

        if (data.work_id === undefined || data.work_id === "null") {
            setUpdateArticleError("required", {message: <GeneralForm tid="error_required"/>});
            return;
        }

        for (const property of properties) {
            data[property] = data[property].trim();
            if (data[property].length === 0) {
                setUpdateArticleError("required", {message: <GeneralForm tid="error_required"/>});
                return;
            }
        }

        for (const property of properties) {
            if (data[property] === article[property]) {
                delete data[property];
            }
        }

        for (const property of ["transcription", "quote_ru_highlight", "quote_ar_highlight"]) {
            data[property] = data[property].trim();
            if (data[property].length === 0 || data[property] === article[property]) {
                delete data[property];
            }
        }

        if (data["article_type_id"] === article.article_type.id) {
            delete data["article_type_id"];
        }

        if (data["work_id"] === article.work.id) {
            delete data["work_id"];
        }

        if (data["picture"].length === 0) {
            delete data["picture"];
        } else {
            data.picture = data.picture[0];
        }

        if (Object.keys(data).length === 0) {
            setUpdateArticleError("required", {message: <GeneralForm tid="error_no_changes"/>});
            return;
        }

        try {
            const link = await ArticleService.Update(article.id, data);
            NotifyService.Success(<ArticlesUpdateForm tid="success_notify"/>)
            window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1) + link;
        } catch {
            NotifyService.Error(<ArticlesUpdateForm tid="error_notify"/>)
        }
    };

    const deleteArticle = async () => {
        try {
            await ArticleService.Delete(article.id);
            NotifyService.Success(<ArticlesDeleteForm tid="success_notify"/>)
            window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
        } catch {
            NotifyService.Error(<ArticlesDeleteForm tid="error_notify"/>)
        }
    };

    const createLink = async (data) => {
        if (data.link_id === undefined || data.link_id === "null") {
            setCreateLinkError("create_link", {message: <GeneralForm tid="error_required"/>});
            return;
        }

        try {
            await ArticleService.CreateLink(article.id, data.link_id);
            NotifyService.Success(<ArticlesCreateLinkForm tid="success_notify"/>);
        } catch {
            NotifyService.Error(<ArticlesCreateLinkForm tid="error_notify"/>)
        }
    };

    const deleteLink = async (data) => {
        if (data.link_id === undefined || data.link_id === "null") {
            setDeleteLinkError("delete_link", {message: <GeneralForm tid="error_required"/>});
            return;
        }

        try {
            await ArticleService.DeleteLink(article.id, data.link_id);
            NotifyService.Success(<ArticlesDeleteLinkForm tid="success_notify"/>)
        } catch {
            NotifyService.Error(<ArticlesDeleteLinkForm tid="error_notify"/>)
        }
    };

    const getArticleOption = (article) => {
        const name = lang === "ru" ? article.title_ru : article.title_ar;
        return (<option key={article.id} value={article.id}>{name.slice(0, 45)}</option>);
    }

    return (
        <section className="main-container">
            <div className="container py-5">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mx-2">
                        <li className={languageContext.userLanguage === "ar" ? "breadcrumb-item-rtl" : "breadcrumb-item"}>
                            <a className="breadcrumb-link" href={"/authors/" + article.work.author.link}>
                                {
                                    languageContext.userLanguage === "ru"
                                        ? article.work.author.short_name_ru
                                        : article.work.author.short_name_ar
                                }
                            </a>
                        </li>
                        <li className={languageContext.userLanguage === "ar" ? "breadcrumb-item-rtl" : "breadcrumb-item"}>
                            <a className="breadcrumb-link" href={"/works/" + article.work.link}>
                                {
                                    languageContext.userLanguage === "ru"
                                        ? article.work.title_ru
                                        : article.work.title_ar
                                }
                            </a>
                        </li>
                        <li className={languageContext.userLanguage === "ar"
                            ? "breadcrumb-item-rtl active" : "breadcrumb-item active"} aria-current="page">
                            {
                                languageContext.userLanguage === "ru"
                                    ? article.title_ru
                                    : article.title_ar
                            }
                        </li>
                    </ol>
                </nav>
                <hr className="mb-1"/>
                <div className="row mx-1">
                    <div className={languageContext.userLanguage === "ru"
                        ? "col-10 text-start m-auto" : "col-10 text-end m-auto"}>
                        <span className="badge text-bg-secondary text-wrap">
                            {languageContext.userLanguage === "ru"
                                ? article.article_type.name_ru
                                : article.article_type.name_ar}
                        </span>
                    </div>
                    <div className={languageContext.userLanguage === "ru"
                        ? "col-2 text-end m-auto" : "col-2 text-start m-auto"}>
                        {cookies.get("token") !== undefined && (
                            <button onClick={(event) => ArticleService.LikeArticle(event, [article], article)}
                                    className="article-page-fav">
                                {
                                    article.is_liked
                                        ? <i className="bi liked-icon"/>
                                        : <i className="bi like-icon"/>
                                }
                            </button>
                        )}
                    </div>
                </div>
                {
                    article.picture_path && (
                        <>
                            <div className="article-cover-image my-3">
                                <img className="article-page-image" src={article.picture_path}
                                     alt={languageContext.userLanguage === "ru" ? article.title_ru : article.title_ar}/>
                            </div>
                            <hr className="mt-4"/>
                        </>
                    )
                }
                <div className="row" dir="ltr">
                    <div className="col-md-6" dir="ltr">
                        <h4 className="text-center my-2">{article.title_ru}</h4>
                    </div>
                    <div className="col-md-6" dir="rtl">
                        <h4 className="text-center my-2">
                            {article.title_ar} {article.transcription !== "" && article.transcription}
                        </h4>
                    </div>
                    <div className="col-md-6 border-bottom border-2 pb-2 mb-2" dir="ltr">
                        <div className="article-item">{article.description_ru}</div>
                        <figure className="article-quote-block">
                            <blockquote className="blockquote pb-1">
                                {HighlightedQuote(article.quote_ru, article.title_ru, article.quote_ru_highlight)}
                            </blockquote>
                            <figcaption className="blockquote-footer mb-0">
                                {article.work.title_ru + ", "}{article.work.author.short_name_ru}
                            </figcaption>
                        </figure>
                    </div>
                    <div className="col-md-6 border-bottom border-2 pb-2 mb-2" dir="rtl">
                        <div className="article-item">{article.description_ar}</div>
                        <figure className="article-quote-block-ar">
                            <blockquote className="blockquote pb-1">
                                {HighlightedQuote(article.quote_ar, article.title_ar, article.quote_ar_highlight)}
                            </blockquote>
                            <figcaption className="blockquote-footer mb-0">
                                {article.work.title_ar + ", "}{article.work.author.short_name_ar}
                            </figcaption>
                        </figure>
                    </div>
                </div>
                <div className="row">
                    {
                        articleLinks && articleLinks.length > 0 && (
                            <div className="col-md-12 border-bottom border-2 mb-2">
                                <h5 className="text-center my-3"><ArticlesPage tid="linked_title"/></h5>
                                <div className="row row-cols-md-2 justify-content-center align-items-center g-3 m-3">
                                    {
                                        articleLinks?.map((article) =>
                                            ArticleCard(articleLinks, article, lang))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
                <div className="row">
                    <div className="col-md-12 justify-content-center align-items-center">
                        <div className="col-md-6 m-auto">
                            <div className="accordion accordion-flush" id="accordionFlushExample">
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="flush-headingFb">
                                        <button className={"accordion-button article-form-header collapsed" +
                                            (lang === "ar" ? " accordion-button-ar" : "")}
                                                type="button"
                                                data-bs-toggle="collapse" data-bs-target="#flush-collapseFb"
                                                aria-expanded="false" aria-controls="flush-collapseFb">
                                            <ArticlesFeedbackForm tid="header"/>
                                        </button>
                                    </h2>
                                    <div id="flush-collapseFb" className="accordion-collapse collapse"
                                         aria-labelledby="flush-headingFb">
                                        <div className="accordion-body">
                                            <form onSubmit={feedbackHandle((data) => sendFeedback(data))}
                                                  id="request-form" {...feedbackRegister("feedback")}>
                                                <div className="col-12">
                                                    <label htmlFor="title" className="form-label">
                                                        <ArticlesFeedbackForm tid="title"/>
                                                    </label>
                                                    <input type="text" className="form-control"
                                                           id="title" {...feedbackRegister("title")}/>
                                                </div>
                                                <div className="col-12">
                                                    <label htmlFor="description" className="form-label">
                                                        <ArticlesFeedbackForm tid="description"/>
                                                    </label>
                                                    <textarea rows="5" className="form-control"
                                                              id="description" {...feedbackRegister("description")}/>
                                                </div>
                                                <div className="form-error mt-4 mb-0">
                                                    {feedbackErrors?.required?.message}
                                                </div>
                                                <div
                                                    className="col-12 row justify-content-center align-items-center mt-2 m-auto">
                                                    <button type="submit" className="btn btn-outline-dark w-auto">
                                                        <ArticlesFeedbackForm tid="button_text"/>
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    AccountService.IsPrivilegedUser() && works && articleTypes && (
                        <div className="row">
                            <div className="col-md-9 m-auto pt-4">
                                <div className="accordion accordion-flush" id="accordionFlushExample">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="flush-heading">
                                            <button className={"accordion-button article-form-header collapsed" +
                                                (lang === "ar" ? " accordion-button-ar" : "")} type="button"
                                                    data-bs-toggle="collapse" data-bs-target="#flush-collapse"
                                                    aria-expanded="false" aria-controls="flush-collapse">
                                                <ArticlesUpdateForm tid="header"/>
                                            </button>
                                        </h2>
                                        <div id="flush-collapse" className="accordion-collapse collapse"
                                             aria-labelledby="flush-heading">
                                            <div className="accordion-body pt-0">
                                                <form id="update-article-form" {...updateArticleRegister("required")}
                                                      onSubmit={updateArticleHandle((data) => updateArticle(data))}>
                                                    {
                                                        UpdateArticleForm(
                                                            updateArticleRegister,
                                                            updateArticleErrors,
                                                            works?.map(work => {
                                                                return {
                                                                    id: work.id,
                                                                    title: lang === "ru" ? work.title_ru : work.title_ar
                                                                };
                                                            }),
                                                            articleTypes?.map(articleType => {
                                                                return {
                                                                    id: articleType.id,
                                                                    name: lang === "ru" ? articleType.name_ru : articleType.name_ar
                                                                };
                                                            }),
                                                            article
                                                        )
                                                    }
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
                                                <ArticlesDeleteForm tid="confirm"/>,
                                                <ArticlesDeleteForm tid="accept"/>,
                                                <ArticlesDeleteForm tid="dismiss"/>,
                                                deleteArticle
                                            );
                                        }}>
                                    <ArticlesDeleteForm tid="button_text"/>
                                </button>
                            </div>
                            <div className="col-md-6 m-auto pt-4">
                                <div className="accordion accordion-flush" id="accordionFlushExample">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="flush-heading">
                                            <button className={"accordion-button article-form-header collapsed" +
                                                (lang === "ar" ? " accordion-button-ar" : "")} type="button"
                                                    data-bs-toggle="collapse" data-bs-target="#flush-collapseCl"
                                                    aria-expanded="false" aria-controls="flush-collapseCl">
                                                <ArticlesCreateLinkForm tid="header"/>
                                            </button>
                                        </h2>
                                        <div id="flush-collapseCl" className="accordion-collapse collapse"
                                             aria-labelledby="flush-heading">
                                            <div className="accordion-body pt-0">
                                                <form
                                                    onSubmit={createLinkHandler((data) => createLink(data))}
                                                    id="update-article-form" {...createLinkRegister("required")}>
                                                    <div className="pt-3">
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <select className="form-select" id="article_type_id"
                                                                        defaultValue={"null"}
                                                                        name="link_id" {...createLinkRegister("link_id")}>
                                                                    <option value="null" disabled><GeneralForm
                                                                        tid="choose_link"/></option>
                                                                    {
                                                                        articles?.map((article) => getArticleOption(article))
                                                                    }
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="form-error mt-4 mb-0">
                                                        {createLinkErrors?.required?.message}
                                                    </div>
                                                    <div
                                                        className="col-12 row justify-content-center align-items-center mt-4 m-auto">
                                                        <button type="submit" className="btn btn-outline-dark w-auto">
                                                            <ArticlesCreateLinkForm tid="button_text"/>
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 m-auto pt-4">
                                <div className="accordion accordion-flush" id="accordionFlushExample">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="flush-heading">
                                            <button className={"accordion-button article-form-header collapsed" +
                                                (lang === "ar" ? " accordion-button-ar" : "")} type="button"
                                                    data-bs-toggle="collapse" data-bs-target="#flush-collapseDl"
                                                    aria-expanded="false" aria-controls="flush-collapseDl">
                                                <ArticlesDeleteLinkForm tid="header"/>
                                            </button>
                                        </h2>
                                        <div id="flush-collapseDl" className="accordion-collapse collapse"
                                             aria-labelledby="flush-heading">
                                            <div className="accordion-body pt-0">
                                                <form
                                                    onSubmit={deleteLinkHandler((data) => deleteLink(data))}
                                                    id="update-article-form" {...deleteLinkRegister("delete_link")}>
                                                    <div className="pt-3">
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <select className="form-select" id="article_type_id"
                                                                        defaultValue={"null"}
                                                                        name="link_id" {...deleteLinkRegister("link_id")}>
                                                                    <option value="null" disabled><GeneralForm
                                                                        tid="choose_link"/></option>
                                                                    {
                                                                        articleLinks?.map((article) => getArticleOption(article))
                                                                    }
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="form-error mt-4 mb-0">
                                                        {deleteLinkErrors?.delete_link?.message}
                                                    </div>
                                                    <div
                                                        className="col-12 row justify-content-center align-items-center mt-4 m-auto">
                                                        <button type="submit" className="btn btn-outline-dark w-auto">
                                                            <ArticlesDeleteLinkForm tid="button_text"/>
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </section>
    )
};

export default ArticlePage;