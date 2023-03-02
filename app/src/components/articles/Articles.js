import React, {useContext, useEffect, useState} from "react";
import {Article as ArticleDTO} from "../../models/Article";
import {LanguageContext} from "../../languages/Language";
import {ArticlesPage, ArticlesPageForm, ArticlesText, GeneralForm} from "../../containers/Language";
import api from "../../services/API";

import './Articles.scss'
import AccountService from "../../services/AccountService";
import {useParams} from "react-router-dom";
import ArticleService from "../../services/ArticleService";
import Cookies from "universal-cookie";
import NotifyService from "../../services/NotifyService";
import {useForm} from "react-hook-form";

const articles_per_page = 12;

const Articles = () => {
    const languageContext = useContext(LanguageContext);
    useEffect(() => {
        document.title = languageContext.dictionary["titles"]["articles"] + " • Istinara";
    }, [languageContext]);

    const cookies = new Cookies();
    const configHeader = AccountService.GetHeaders(true, cookies.get("token") !== undefined)

    const [count, setCount] = useState(0);
    const [data: Array<ArticleDTO>, setData] = useState()

    useEffect(() => {
        api.get(`/articles?offset=0&limit=${articles_per_page}`, configHeader)
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
                            <p className="mt-3"><ArticlesText tid="loading"/></p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const loadMore = () => {
        api.get(`/articles?offset=${data.length}&limit=${articles_per_page}`)
            .then((response) => setData([...data, ...response.data.data]))
    };

    return (
        <div className="album">
            <div className="container">
                {
                    data.length > 0 ? (
                        <div className="row row-cols-md-2 justify-content-center align-items-center g-3 m-3">
                            {data.map((article) => ArticleService.GetArticleCard(data, article, languageContext))}
                        </div>
                    ) : (
                        <div className="information">
                            <i className="bi bi-folder-x information-icon"></i>
                            <p className="mt-3"><ArticlesText tid="no_data"/></p>
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

const Article = () => {
    const languageContext = useContext(LanguageContext);

    const {link} = useParams()
    const [article: ArticleDTO, setArticle] = useState();

    const cookies = new Cookies();
    const configHeader = AccountService.GetHeaders(true, cookies.get("token") !== undefined)

    let {register, reset, setError, handleSubmit, formState: {errors}} = useForm();

    useEffect(() => {
        api.get("/articles/" + link, configHeader)
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

    const getRussianHighlightedQuote = () => {
        const re = new RegExp("(?<=[^а-я0-9])[а-я0-9]*" + article.title_ru.toLowerCase() + "[а-я0-9]*(?=([^а-я0-9]))", "gi");
        const quote = article.quote_ru.toLowerCase();
        const title = quote.match(re);

        if (title === null) {
            return <p>{article.quote_ru}</p>
        }

        const start = quote.indexOf(title[0]);
        const end = start + title[0].length;

        return (
            <p>
                {article.quote_ru.substring(0, start)}
                <b className="article-quote">{article.quote_ru.substring(start, end)}</b>
                {article.quote_ru.substring(end, article.quote_ru.length)}
            </p>
        )
    };

    const getArabicHighlightedQuote = () => {
        const normalize_text = function (str) {
            const arabicNormChar = {
                'ك': 'ک',
                'ﻷ': 'لا',
                'ؤ': 'و',
                'ى': 'ی',
                'ي': 'ی',
                'ئ': 'ی',
                'أ': 'ا',
                'إ': 'ا',
                'آ': 'ا',
                'ٱ': 'ا',
                'ٳ': 'ا',
                'ة': 'ه',
                'ء': '',
                'ِ': '',
                'ْ': '',
                'ُ': '',
                'َ': '',
                'ّ': '',
                'ٍ': '',
                'ً': '',
                'ٌ': '',
                'ٓ': '',
                'ٰ': '',
                'ٔ': '',
                '�': ''
            };

            return str.replace(/[^\u0000-\u007E]/g, function (a) {
                let retrieval = arabicNormChar[a]
                if (retrieval === undefined) {
                    retrieval = a
                }
                return retrieval;
            }).normalize("NFKD").toLowerCase();
        };

        const re = new RegExp("(?<=[^؀-ۿ0-9])[؀-ۿ0-9]*" + normalize_text(article.title_ar) + "[؀-ۿ0-9]*(?=([^؀-ۿ0-9]))", "gi");
        const quote = normalize_text(article.quote_ar);
        const title = quote.match(re);

        if (title === null) {
            return <p>{article.quote_ar}</p>
        }

        const start = quote.indexOf(title[0]);
        const end = start + title[0].length;

        return (
            <p>
                {article.quote_ar.substring(0, start)}
                <b className="article-quote">{article.quote_ar.substring(start, end)}</b>
                {article.quote_ar.substring(end, article.quote_ar.length)}
            </p>
        )
    };

    const likeArticle = (event: Event) => {
        const target = event.target.querySelector("i") || event.target;
        let classList = target.classList;

        if (!article.is_liked) {
            api.post("/user/favourite/" + article.id, null, configHeader)
                .then(() => {
                    let liked = article;
                    liked.is_liked = true;
                    setArticle(liked);

                    classList.remove("like-icon");
                    classList.add("liked-icon");
                })
                .catch(() => {
                    NotifyService.Error(languageContext.dictionary["articles"]["favourite_error"]);
                });
        } else {
            api.delete("/user/favourite/" + article.id, configHeader)
                .then(() => {
                    let liked = article;
                    liked.is_liked = false;
                    setArticle(liked);

                    classList.remove("liked-icon");
                    classList.add("like-icon");
                })
                .catch(() => {
                    NotifyService.Error(languageContext.dictionary["articles"]["favourite_error"]);
                });
        }
    };

    const getArticleFormAccordionButton = () => {
        return languageContext.userLanguage === "ru"
            ? "accordion-button article-form-header collapsed"
            : "accordion-button article-form-header accordion-button-ar collapsed";
    };

    const sendFeedback = async (data) => {
        if (data.title.trim().length === 0 || data.description.trim().length === 0) {
            setError("required", {message: <GeneralForm tid="error_required"/>});
            return;
        }

        let formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);

        let formDataHeaders = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        };

        await api.post(`/articles/${article.id}/feedback`, formData, formDataHeaders)
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
                            <button onClick={(event) => likeArticle(event)} className="article-page-fav">
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
                <div className="row">
                    <div className="col-md-6" dir="ltr">
                        <h3 className="text-center my-2">«{article.title_ru}»</h3>
                    </div>
                    <div className="col-md-6" dir="rtl">
                        <h3 className="text-center my-2">
                            «{article.title_ar}» {article.transcription !== "" && article.transcription}
                        </h3>
                    </div>
                    <div className="col-md-6" dir="ltr">
                        <div className="article-item">
                            <div className="accordion accordion-flush" id="accordionFlushExample">
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="flush-headingRu">
                                        <button className="accordion-button collapsed" type="button"
                                                data-bs-toggle="collapse" data-bs-target="#flush-collapseRu"
                                                aria-expanded="false" aria-controls="flush-collapseRu">
                                            Описание
                                        </button>
                                    </h2>
                                    <div id="flush-collapseRu" className="accordion-collapse collapse"
                                         aria-labelledby="flush-headingRu">
                                        <div className="accordion-body">{article.description_ru}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <figure className="article-quote-block">
                            <blockquote className="blockquote pb-1">
                                {getRussianHighlightedQuote()}
                            </blockquote>
                            <figcaption className="blockquote-footer mb-0">
                                {article.work.title_ru + ", "}{article.work.author.short_name_ru}
                            </figcaption>
                        </figure>
                    </div>
                    <div className="col-md-6" dir="rtl">
                        <div className="article-item">
                            <div className="accordion accordion-flush" id="accordionFlushExample">
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="flush-headingAr">
                                        <button className="accordion-button accordion-button-ar collapsed" type="button"
                                                data-bs-toggle="collapse" data-bs-target="#flush-collapseAr"
                                                aria-expanded="false" aria-controls="flush-collapseAr">
                                            وصف
                                        </button>
                                    </h2>
                                    <div id="flush-collapseAr" className="accordion-collapse collapse"
                                         aria-labelledby="flush-headingAr">
                                        <div className="accordion-body">{article.description_ar}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <figure className="article-quote-block">
                            <blockquote className="blockquote pb-1">
                                {getArabicHighlightedQuote()}
                            </blockquote>
                            <figcaption className="blockquote-footer mb-0">
                                {article.work.title_ar + ", "}{article.work.author.short_name_ar}
                            </figcaption>
                        </figure>
                    </div>
                    {
                        article.linked_articles !== null && article.linked_articles.length > 0 && (
                            <div className="col-md-12">
                                <hr/>
                                <h5 className="text-center mb-3"><ArticlesPage tid="linked_title"/></h5>
                                <div className="row row-cols-md-2 justify-content-center align-items-center g-3 m-3">
                                    {
                                        article.linked_articles.map((article) =>
                                            ArticleService.GetArticleCard(article.linked_articles, article, languageContext))
                                    }
                                </div>
                            </div>
                        )
                    }
                    <div className="col-md-12 justify-content-center align-items-center">
                        <hr/>
                        <div className="col-md-6 m-auto">
                            <div className="accordion accordion-flush" id="accordionFlushExample">
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="flush-headingFb">
                                        <button className={getArticleFormAccordionButton()} type="button"
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

export {Article, Articles}