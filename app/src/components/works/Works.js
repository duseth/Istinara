import React, {useContext, useEffect, useState} from "react";
import {LanguageContext} from "../../languages/Language";
import api from "../../services/API";

import './Works.scss'
import {WorksPage, WorksText} from "../../containers/Language";
import {useParams} from "react-router-dom";
import {Article as ArticleDTO} from "../../models/Article";
import {Work as WorkDTO, WorkCard} from "../../models/Work";
import {Author as AuthorDTO} from "../../models/Author";
import Cookies from "universal-cookie";
import ArticleService from "../../services/ArticleService";
import AccountService from "../../services/AccountService";

const works_per_page = 6;

const Works = () => {
    const languageContext = useContext(LanguageContext);
    useEffect(() => {
        document.title = languageContext.dictionary["titles"]["works"] + " • Istinara";
    }, [languageContext]);

    const [count, setCount] = useState(0);
    const [data: Array<WorkDTO>, setData] = useState();

    useEffect(() => {
        api.get(`/works?offset=0&limit=${works_per_page}`)
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
                            <p className="mt-3"><WorksText tid="loading"/></p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const loadMore = () => {
        api.get(`/works?offset=${data.length}&limit=${works_per_page}`)
            .then((response) => setData([...data, ...response.data.data]))
    };

    const getWorkCard = (work: WorkDTO) => {
        if (languageContext.userLanguage === "ru") {
            return (
                <div className="work-card col-md" key={work.id}>
                    <a className="work-card-link" href={"/works/" + work.link}/>
                    <img className="work-card-image" src={work.picture_path} alt={work.title_ru}/>
                    <div className="work-card-title left-20">{work.title_ru}</div>
                    <div className="work-card-about right-20">
                        {work.genre_ru} • {new Date(work.publication_date).getFullYear()}
                    </div>
                </div>
            )
        } else if (languageContext.userLanguage === "ar") {
            return (
                <div className="work-card col-md" key={work.id}>
                    <a className="work-card-link" href={"/works/" + work.link}/>
                    <img className="work-card-image" src={work.picture_path} alt={work.title_ar}/>
                    <div className="work-card-title left-20">{work.title_ar}</div>
                    <div className="work-card-about left-20">
                        {work.genre_ar} • {new Date(work.publication_date).getFullYear()}
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

const Work = () => {
    const languageContext = useContext(LanguageContext);

    const {link} = useParams()

    const [work: WorkDTO, setWork] = useState();
    const [articles: Array<ArticleDTO>, setArticles] = useState();

    const [prevWork: WorkDTO, setPrevWork] = useState();
    const [nextWork: WorkDTO, setNextWork] = useState();
    const [workCard: WorkCard, setWorkCard] = useState();

    const cookies = new Cookies();
    const configHeader = AccountService.GetHeaders(true, cookies.get("token") !== undefined)

    useEffect(() => {
        api.get("/works/" + link)
            .then((response) => setWork(response.data))
            .catch(() => setWork(null));
    }, []);

    useEffect(() => {
        if (work) {
            const title = languageContext.userLanguage === "ru" ? work.title_ru : work.title_ar;
            document.title = title + " • Istinara";
        }
    }, [work, languageContext]);

    useEffect(() => {
        if (work) {
            api.get(`/works/${work.id}/articles`, configHeader).then((response) => setArticles(response.data));
        }
    }, [work]);

    useEffect(() => {
        if (work) {
            api.get("/works").then((response) => {
                let works: Array<AuthorDTO> = response.data.data;
                works.map((item, index) => {
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
            let card: WorkCard = {
                picture_path: work.picture_path,
                publication_date: work.publication_date,
                author: {},
                link: link
            };

            card.author.link = work.author.link;
            if (languageContext.userLanguage === "ru") {
                card.title = work.title_ru;
                card.about = work.about_ru;
                card.genre = work.genre_ru;
                card.author.short_name = work.author.short_name_ru;
            } else if (languageContext.userLanguage === "ar") {
                card.title = work.title_ar;
                card.about = work.about_ar;
                card.genre = work.genre_ar;
                card.author.short_name = work.author.short_name_ar;
            }

            setWorkCard(card);
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

    return (
        <section className="main-container">
            <div className="container py-5">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className={languageContext.userLanguage === "ar" ? "breadcrumb-item-rtl" : "breadcrumb-item"}>
                            <a className="breadcrumb-link" href={"/authors/" + workCard.author.link}>
                                {workCard.author.short_name}
                            </a>
                        </li>
                        <li className={languageContext.userLanguage === "ar"
                            ? "breadcrumb-item-rtl active" : "breadcrumb-item active"} aria-current="page">
                            {workCard.title}
                        </li>
                    </ol>
                </nav>
                <hr className="mb-5"/>
                <div className="work-cover-image">
                    <img className="work-page-image" src={workCard.picture_path} alt={workCard.title}/>
                </div>
                <h4 className="text-center my-3">«{workCard.title}»</h4>
                <div className="col-md-9 text-center m-auto">
                    <hr/>
                    <div className="row">
                        <p className="col-md-4 m-0">
                            <b><WorksPage tid="author"/></b> {workCard.author.short_name}
                        </p>
                        <p className="col-md-4 m-0">
                            <b><WorksPage tid="genre"/></b> {workCard.genre}
                        </p>
                        <p className="col-md-4 m-0">
                            <b><WorksPage
                                tid="publication_year"/></b> {new Date(workCard.publication_date).getFullYear()}
                        </p>
                    </div>
                </div>
                <div className="col-md-9 m-auto mb-3">
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
                                                ArticleService.GetCarouselArticleCard(articles, article, index === 0, languageContext))
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
                <div className="col-md-9 m-auto mb-3">
                    <hr/>
                    <div className="row justify-content-center align-items-center my-2">
                        <div className="jump-work-card col-md-3">
                            <a className="author-link" href={prevWork.link}/>
                            <i className={languageContext.userLanguage === "ru"
                                ? "bi bi-arrow-left jump-author-icon"
                                : "bi bi-arrow-right jump-author-icon"}></i>
                            <div className="jump-work-name col">
                                {languageContext.userLanguage === "ru"
                                    ? prevWork.title_ru
                                    : prevWork.title_ar}
                            </div>
                        </div>
                        <div className="col-md-4"/>
                        <div className="jump-work-card col-md-3">
                            <a className="author-link" href={nextWork.link}/>
                            <div className="jump-work-name col">
                                {languageContext.userLanguage === "ru"
                                    ? nextWork.title_ru
                                    : nextWork.title_ar}
                            </div>
                            <i className={languageContext.userLanguage === "ru"
                                ? "bi bi-arrow-right jump-author-icon"
                                : "bi bi-arrow-left jump-author-icon"}></i>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export {Work, Works};