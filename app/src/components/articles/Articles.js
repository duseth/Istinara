import Cookies from "universal-cookie";
import {useForm} from "react-hook-form";
import {useParams, useSearchParams} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";

import './Articles.scss'
import API from "../../services/API";
import {Article} from "../../models/Article";
import {Feedback} from "../../models/Feedback";
import NotifyService from "../../services/NotifyService";
import {LanguageContext} from "../../languages/Language";
import AccountService from "../../services/AccountService";
import ArticleService from "../../services/ArticleService";
import {ArticlesPage, ArticlesPageForm, ArticlesText, GeneralForm} from "../../containers/Language";

const ARTICLES_LIMIT = 12;

const ArticlesListPage = () => {
    const cookies = new Cookies();
    const [searchParams, _] = useSearchParams();
    const languageContext = useContext(LanguageContext);
    const lang = languageContext.userLanguage;

    const [count, setCount] = useState(0);
    const [data: Array<Article>, setData] = useState()

    const query = searchParams.get("query") !== null
        ? 'query=' + searchParams.get("query") + "&"
        : "";

    const configHeader = AccountService.GetHeaders(true, cookies.get("token") !== undefined)

    useEffect(() => {
        document.title = languageContext.dictionary["titles"]["articles"] + " • Istinara";
    }, [languageContext]);

    useEffect(() => {
        const sort = lang === "ru" ? "title_ru" : "title_ar";
        API.get(`/articles?${query}offset=0&limit=${ARTICLES_LIMIT}&sort_by=${sort}`, configHeader)
            .then((response) => {
                setCount(response.data.count);
                setData(response.data.data);
            })
            .catch(() => {
                setData([]);
            });
    }, [languageContext]);

    if (!data) {
        return (
            <div className="album">
                <div className="container">
                    <div className="row justify-content-center align-items-center m-3">
                        <div className="information">
                            <div className="spinner-border" role="status"/>
                            <p className="mt-3"><ArticlesText tid="loading"/></p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const loadMore = () => {
        const sort = lang === "ru" ? "title_ru" : "title_ar";
        API.get(`/articles?${query}offset=${data.length}&limit=${ARTICLES_LIMIT}&sort_by=${sort}`)
            .then((response) => setData([...data, ...response.data.data]))
    };

    return (
        <div className="album">
            <div className="container">
                {
                    data.length > 0 ? (
                        <div className="row row-cols-md-2 justify-content-center align-items-center g-3 m-3">
                            {data.map((article) => ArticleService.GetArticleCard(data, article, lang))}
                        </div>
                    ) : (
                        <div className="information">
                            <i className="bi bi-folder-x information-icon"></i>
                            <p className="mt-3">
                                {query === "" ? <ArticlesText tid="no_data"/> : <ArticlesText tid="not_found"/>}
                            </p>
                        </div>
                    )
                }
                {
                    data.length < count &&
                    <div className="text-center m-3">
                        <button className="btn btn-outline-dark" onClick={loadMore}>
                            <ArticlesText tid="show_more"/>
                        </button>
                    </div>
                }
            </div>
        </div>
    );
};

const ArticlePage = () => {
    const cookies = new Cookies();
    const languageContext = useContext(LanguageContext);
    const lang = languageContext.userLanguage;

    const {link} = useParams()
    const [article: Article, setArticle] = useState();

    const configHeader = AccountService.GetHeaders(true, cookies.get("token") !== undefined)
    const {register, reset, setError, handleSubmit, formState: {errors}} = useForm();

    useEffect(() => {
        API.get("/articles/" + link, configHeader)
            .then((response) => setArticle(response.data))
            .catch(() => setArticle(null));
    }, []);

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
            setError("required", {message: <GeneralForm tid="error_required"/>});
            return;
        }

        let formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);

        const formDataHeaders = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        };

        await API.post(`/articles/${article.id}/feedback`, formData, formDataHeaders)
            .then(() => {
                NotifyService.Success(<ArticlesPageForm tid="success_notify"/>);
                reset();
            })
            .catch(() => NotifyService.Error(<ArticlesPageForm tid="error_notify"/>))
    };

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
                        ? "col text-start m-auto" : "col text-end m-auto"}>
                        <span className="badge text-bg-secondary">
                            {languageContext.userLanguage === "ru"
                                ? article.group.short_name_ru
                                : article.group.short_name_ar}
                        </span>
                    </div>
                    <div className={languageContext.userLanguage === "ru"
                        ? "col text-end m-auto" : "col text-start m-auto"}>
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
                {article.picture_path && (
                    <div className="article-cover-image my-3">
                        <img className="article-page-image" src={article.picture_path}
                             alt={languageContext.userLanguage === "ru" ? article.title_ru : article.title_ar}/>
                    </div>
                )}
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
                                {ArticleService.GetRussianHighlightedQuote(article)}
                            </blockquote>
                            <figcaption className="blockquote-footer mb-0">
                                {article.work.title_ru + ", "}{article.work.author.short_name_ru}
                            </figcaption>
                        </figure>
                    </div>
                    <div className="col-md-6 border-bottom border-2 pb-2 mb-2" dir="rtl">
                        <div className="article-item">{article.description_ar}</div>
                        <figure className="article-quote-block">
                            <blockquote className="blockquote pb-1">
                                {ArticleService.GetArabicHighlightedQuote(article)}
                            </blockquote>
                            <figcaption className="blockquote-footer mb-0">
                                {article.work.title_ar + ", "}{article.work.author.short_name_ar}
                            </figcaption>
                        </figure>
                    </div>
                </div>
                <div className="row">
                    {
                        article.linked_articles !== null && article.linked_articles.length > 0 && (
                            <div className="col-md-12 border-bottom border-2 mb-2">
                                <h5 className="text-center my-3"><ArticlesPage tid="linked_title"/></h5>
                                <div className="row row-cols-md-2 justify-content-center align-items-center g-3 m-3">
                                    {
                                        article.linked_articles.map((article) =>
                                            ArticleService.GetArticleCard(article.linked_articles, article, lang))
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
                                            <ArticlesPageForm tid="header"/>
                                        </button>
                                    </h2>
                                    <div id="flush-collapseFb" className="accordion-collapse collapse"
                                         aria-labelledby="flush-headingFb">
                                        <div className="accordion-body">
                                            <form onSubmit={handleSubmit((data) => sendFeedback(data))}
                                                  id="request-form" {...register("required")}>
                                                <div className="col-12">
                                                    <label htmlFor="title" className="form-label">
                                                        <ArticlesPageForm tid="title"/>
                                                    </label>
                                                    <input type="text" className="form-control"
                                                           id="title" {...register("title")}/>
                                                </div>
                                                <div className="col-12">
                                                    <label htmlFor="description" className="form-label">
                                                        <ArticlesPageForm tid="description"/>
                                                    </label>
                                                    <textarea rows="5" className="form-control"
                                                              id="description" {...register("description")}/>
                                                </div>
                                                <div className="form-error mt-4 mb-0">
                                                    {errors?.required?.message || errors?.email?.message}
                                                </div>
                                                <div
                                                    className="col-12 row justify-content-center align-items-center mt-2 m-auto">
                                                    <button type="submit" className="btn btn-outline-dark w-auto">
                                                        <ArticlesPageForm tid="button_text"/>
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
            </div>
        </section>
    )
}

export {ArticlePage, ArticlesListPage}