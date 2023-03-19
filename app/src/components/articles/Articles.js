import Cookies from "universal-cookie";
import {useForm} from "react-hook-form";
import {useParams, useSearchParams} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";

import './Articles.scss'
import API from "../../services/API";
import {Group} from "../../models/Group";
import {Article} from "../../models/Article";
import {Feedback} from "../../models/Feedback";
import NotifyService from "../../services/NotifyService";
import {LanguageContext} from "../../languages/Language";
import AccountService from "../../services/AccountService";
import ArticleService from "../../services/ArticleService";
import {
    ArticlesCreateForm,
    ArticlesCreateLinkForm,
    ArticlesDeleteForm,
    ArticlesDeleteLinkForm,
    ArticlesFeedbackForm,
    ArticlesForm,
    ArticlesPage,
    ArticlesText,
    ArticlesUpdateForm,
    GeneralForm,
    GroupsCreateForm,
    GroupsDeleteForm,
    GroupsForm,
    GroupsUpdateForm
} from "../../containers/Language";
import {Work} from "../../models/Work";
import GroupService from "../../services/GroupService";

const ARTICLES_LIMIT = 12;

const ArticlesListPage = () => {
    const cookies = new Cookies();
    const [searchParams, _] = useSearchParams();

    const languageContext = useContext(LanguageContext);
    const lang = languageContext.userLanguage;

    const [count, setCount] = useState(0);
    const [data: Array<Article>, setData] = useState()
    const [works: Array<Work>, setWorks] = useState(null);
    const [groups: Array<Group>, setGroups] = useState(null);

    const query = searchParams.get("query") !== null
        ? "query=" + searchParams.get("query") + "&"
        : "";

    const configHeader = AccountService.GetHeaders(true, cookies.get("token") !== undefined)
    const {register, setError, handleSubmit, formState: {errors}} = useForm();

    const {
        register: createGroupRegister,
        setError: setCreateGroupError,
        handleSubmit: createGroupHandler,
        formState: {
            errors: createGroupErrors
        }
    } = useForm();

    const {
        register: updateGroupRegister,
        setError: setUpdateGroupError,
        handleSubmit: updateGroupHandle,
        setValue: updateGroupSetValue,
        formState: {
            errors: updateGroupErrors
        }
    } = useForm();

    const {
        register: deleteGroupRegister,
        setError: setDeleteGroupError,
        handleSubmit: deleteGroupHandle,
        formState: {
            errors: deleteGroupErrors
        }
    } = useForm();

    useEffect(() => {
        document.title = languageContext.dictionary["titles"]["articles"] + " • Istinara";
    }, [languageContext]);

    useEffect(() => {
        if (AccountService.IsPrivilegedUser()) {
            API.get("/works").then((response) => setWorks(response.data?.data));
        }
    }, []);

    useEffect(() => {
        if (AccountService.IsPrivilegedUser()) {
            API.get("/groups").then((response) => setGroups(response.data?.data));
        }
    }, []);

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

    const loadMore = () => {
        const sort = lang === "ru" ? "title_ru" : "title_ar";
        API.get(`/articles?${query}offset=${data.length}&limit=${ARTICLES_LIMIT}&sort_by=${sort}`)
            .then((response) => setData([...data, ...response.data.data]))
    };

    const createArticle = async (data: Article) => {
        delete data["required"];

        if (data.group_id === undefined || data.group_id === "null") {
            setError("required", {message: <GeneralForm tid="error_required"/>});
            return;
        }

        if (data.work_id === undefined || data.work_id === "null") {
            setError("required", {message: <GeneralForm tid="error_required"/>});
            return;
        }

        const fields = Object.keys(data).filter(x => !["picture", "group_id", "work_id", "transcription"].includes(x));
        for (const field of fields) {
            if (data[field].trim().length === 0) {
                setError("required", {message: <GeneralForm tid="error_required"/>});
                return;
            }
        }

        if (data.picture.length !== 0) {
            data.picture = data.picture[0];
        } else {
            delete data["picture"];
        }

        if (data.transcription.length === 0) {
            delete data["transcription"];
        }

        try {
            await ArticleService.Create(data);
            NotifyService.Success(<ArticlesCreateForm tid="success_notify"/>);
        } catch {
            NotifyService.Error(<ArticlesCreateForm tid="error_notify"/>);
        }
    };

    const createGroup = async (data: Group) => {
        delete data["required"];

        const fields = Object.keys(data);
        for (const field of fields) {
            if (data[field].trim().length === 0) {
                setCreateGroupError("required", {message: <GeneralForm tid="error_required"/>});
                return;
            }
        }

        try {
            await GroupService.Create(data);
            NotifyService.Success(<GroupsCreateForm tid="success_notify"/>);
        } catch {
            NotifyService.Error(<GroupsCreateForm tid="error_notify"/>);
        }
    };

    const updateGroup = async (data: Group) => {
        delete data["required"];

        if (data["group_id"] === undefined || data["group_id"] === "null") {
            setUpdateGroupError("required", {message: <GeneralForm tid="error_required"/>});
            return;
        }
        const group_id = data["group_id"];
        delete data["group_id"];

        const properties = Object.keys(data).filter(x => x !== "group_id");
        for (const property of properties) {
            if (data[property].trim().length === 0) {
                setUpdateGroupError("required", {message: <GeneralForm tid="error_required"/>});
                return;
            }
        }

        const group = groups.filter(x => x.id === group_id)[0];
        for (const property of properties) {
            if (data[property] === group[property]) {
                delete data[property];
            }
        }

        if (Object.keys(data).length === 0) {
            setUpdateGroupError("required", {message: <GeneralForm tid="error_no_changes"/>});
            return;
        }

        try {
            await GroupService.Update(group_id, data);
            NotifyService.Success(<GroupsUpdateForm tid="success_notify"/>);
        } catch {
            NotifyService.Error(<GroupsUpdateForm tid="error_notify"/>);
        }
    };

    const deleteGroup = async (data) => {
        delete data["required"];
        if (data["group_id"] === undefined || data["group_id"] === "null") {
            setDeleteGroupError("required", {message: <GeneralForm tid="error_required"/>});
            return;
        }

        const group = groups.filter(x => x.id === data["group_id"])[0];
        try {
            await GroupService.Delete(group.id);
            NotifyService.Success(<GroupsDeleteForm tid="success_notify"/>)
        } catch {
            NotifyService.Error(<GroupsDeleteForm tid="error_notify"/>)
        }
    };

    const unlockUpdateGroupForm = event => {
        const form = document.getElementById("update-group-form");
        const group = groups.filter(x => x.id === event.target.value)[0];

        for (const property of Object.keys(group).filter(x => !["id", "group_id"].includes(x))) {
            const inputElement = form.getElementsByTagName("input")[property];

            inputElement.disabled = false;
            updateGroupSetValue(property, group[property]);
        }
    };

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

    return (
        <div className="album">
            <div className="container">
                {
                    AccountService.IsPrivilegedUser() && (
                        <div className="col-md-8 m-auto pt-4">
                            <div className="accordion accordion-flush" id="accordionFlushExample">
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="flush-heading">
                                        <button className={"accordion-button article-form-header collapsed" +
                                            (lang === "ar" ? " accordion-button-ar" : "")} type="button"
                                                data-bs-toggle="collapse" data-bs-target="#flush-collapseGc"
                                                aria-expanded="false" aria-controls="flush-collapseGc">
                                            <GroupsCreateForm tid="header"/>
                                        </button>
                                    </h2>
                                    <div id="flush-collapseGc" className="accordion-collapse collapse"
                                         aria-labelledby="flush-heading">
                                        <div className="accordion-body pt-0">
                                            <form onSubmit={createGroupHandler(data => createGroup(data))}
                                                  id="create-group-form" {...createGroupRegister("required")}>
                                                {
                                                    GetGroupForm(createGroupRegister, createGroupErrors)
                                                }
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                    AccountService.IsPrivilegedUser() && works?.length > 0 && (
                        <>
                            <div className="col-md-8 m-auto pt-4">
                                <div className="accordion accordion-flush" id="accordionFlushExample">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="flush-heading">
                                            <button className={"accordion-button article-form-header collapsed" +
                                                (lang === "ar" ? " accordion-button-ar" : "")} type="button"
                                                    data-bs-toggle="collapse" data-bs-target="#flush-collapseGu"
                                                    aria-expanded="false" aria-controls="flush-collapseGu">
                                                <GroupsUpdateForm tid="header"/>
                                            </button>
                                        </h2>
                                        <div id="flush-collapseGu" className="accordion-collapse collapse"
                                             aria-labelledby="flush-heading">
                                            <div className="accordion-body pt-0">
                                                <form onSubmit={updateGroupHandle(data => updateGroup(data))}
                                                      id="update-group-form" {...updateGroupRegister("required")}>
                                                    <div className="pt-3">
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <select className="form-select" id="group_id"
                                                                        defaultValue={"null"} name="group_id"
                                                                        {...updateGroupRegister("group_id")}
                                                                        onChange={unlockUpdateGroupForm}>
                                                                    <option value="null" disabled>
                                                                        <GeneralForm tid="choose_group"/>
                                                                    </option>
                                                                    {
                                                                        groups?.map((group) => <option key={group.id}
                                                                                                       value={group.id}>{lang === "ru" ? group.name_ru : group.name_ar}</option>)
                                                                    }
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {
                                                        GetGroupForm(updateGroupRegister, updateGroupErrors, true)
                                                    }
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-8 m-auto pt-4">
                                <div className="accordion accordion-flush" id="accordionFlushExample">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="flush-heading">
                                            <button className={"accordion-button article-form-header collapsed" +
                                                (lang === "ar" ? " accordion-button-ar" : "")} type="button"
                                                    data-bs-toggle="collapse" data-bs-target="#flush-collapseGd"
                                                    aria-expanded="false" aria-controls="flush-collapseGd">
                                                <GroupsDeleteForm tid="header"/>
                                            </button>
                                        </h2>
                                        <div id="flush-collapseGd" className="accordion-collapse collapse"
                                             aria-labelledby="flush-heading">
                                            <div className="accordion-body pt-0">
                                                <form onSubmit={deleteGroupHandle((data) => deleteGroup(data))}
                                                      id="update-group-form" {...deleteGroupRegister("required")}>
                                                    <div className="pt-3">
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <select className="form-select" id="group_id"
                                                                        defaultValue={"null"} name="group_id"
                                                                        {...deleteGroupRegister("group_id")}>
                                                                    <option value="null" disabled>
                                                                        <GeneralForm tid="choose_group"/>
                                                                    </option>
                                                                    {
                                                                        groups?.map((group) => <option key={group.id}
                                                                                                       value={group.id}>{lang === "ru" ? group.name_ru : group.name_ar}</option>)
                                                                    }
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="form-error mt-4 mb-0">
                                                        {deleteGroupErrors?.required?.message}
                                                    </div>
                                                    <div
                                                        className="col-12 row justify-content-center align-items-center mt-4 m-auto">
                                                        <button type="submit" className="btn btn-outline-dark w-auto">
                                                            <GroupsDeleteForm tid="button_text"/>
                                                        </button>
                                                    </div>
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
                    AccountService.IsPrivilegedUser() && works?.length > 0 && groups?.length > 0 && (
                        <>
                            <div className="col-md-8 m-auto pt-4">
                                <div className="accordion accordion-flush" id="accordionFlushExample">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="flush-heading">
                                            <button className={"accordion-button article-form-header collapsed" +
                                                (lang === "ar" ? " accordion-button-ar" : "")} type="button"
                                                    data-bs-toggle="collapse" data-bs-target="#flush-collapseAdd"
                                                    aria-expanded="false" aria-controls="flush-collapse">
                                                <ArticlesCreateForm tid="header"/>
                                            </button>
                                        </h2>
                                        <div id="flush-collapseAdd" className="accordion-collapse collapse"
                                             aria-labelledby="flush-heading">
                                            <div className="accordion-body pt-0">
                                                <form onSubmit={handleSubmit((data) => createArticle(data))}
                                                      id="create-article-form" {...register("required")}>
                                                    {
                                                        GetArticleForm(
                                                            register,
                                                            errors,
                                                            works?.map(work => {
                                                                return {
                                                                    id: work.id,
                                                                    title: lang === "ru" ? work.title_ru : work.title_ar
                                                                };
                                                            }),
                                                            groups?.map(group => {
                                                                return {
                                                                    id: group.id,
                                                                    name: lang === "ru" ? group.name_ru : group.name_ar
                                                                };
                                                            })
                                                        )
                                                    }
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
    const [articles: Array<Article>, setArticles] = useState();
    const [articleLinks: Array<Article>, setArticleLinks] = useState();
    const [works: Array<Work>, setWorks] = useState();
    const [groups: Array<Group>, setGroups] = useState();

    const configHeader = AccountService.GetHeaders(true, cookies.get("token") !== undefined)
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
        API.get("/articles/" + link, configHeader)
            .then((response) => setArticle(response.data))
            .catch(() => setArticle(null));
    }, []);

    useEffect(() => {
        if (article) {
            API.get(`/articles/${article.id}/links`, configHeader)
                .then((response) => setArticleLinks(response.data?.data))
                .catch(() => setArticle(null));
        }
    }, [article]);

    useEffect(() => {
        if (AccountService.IsPrivilegedUser()) {
            API.get("/works")
                .then((response) => setWorks(response.data?.data))
                .catch(() => setWorks(null));
        }
    }, []);

    useEffect(() => {
        if (AccountService.IsPrivilegedUser()) {
            API.get("/groups")
                .then((response) => setGroups(response.data?.data))
                .catch(() => setGroups(null));
        }
    }, []);

    useEffect(() => {
        if (AccountService.IsPrivilegedUser() && article && articleLinks) {
            API.get("/articles")
                .then((response) => {
                    setArticles(
                        response.data?.data.filter(
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

        const formDataHeaders = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        };

        await API.post(`/articles/${article.id}/feedback`, formData, formDataHeaders)
            .then(() => {
                NotifyService.Success(<ArticlesFeedbackForm tid="success_notify"/>);
                feedbackReset();
            })
            .catch(() => NotifyService.Error(<ArticlesFeedbackForm tid="error_notify"/>))
    };

    const updateArticle = async (data: Article) => {
        delete data["required"];
        const properties = Object.keys(data).filter(x => !["picture", "work_id", "group_id"].includes(x));

        if (data.group_id === undefined || data.group_id === "null") {
            setUpdateArticleError("required", {message: <GeneralForm tid="error_required"/>});
            return;
        }

        if (data.work_id === undefined || data.work_id === "null") {
            setUpdateArticleError("required", {message: <GeneralForm tid="error_required"/>});
            return;
        }

        for (const property of properties) {
            if (data[property].trim().length === 0) {
                setUpdateArticleError("required", {message: <GeneralForm tid="error_required"/>});
                return;
            }
        }

        for (const property of properties) {
            if (data[property] === article[property]) {
                delete data[property];
            }
        }

        if (data["group_id"] === article.group.id) {
            delete data["group_id"];
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
                {
                    article.picture_path && (
                        <div className="article-cover-image my-3">
                            <img className="article-page-image" src={article.picture_path}
                                 alt={languageContext.userLanguage === "ru" ? article.title_ru : article.title_ar}/>
                        </div>
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
                                {ArticleService.GetHighlightedQuote(article.quote_ru, article.title_ru)}
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
                                {ArticleService.GetHighlightedQuote(article.quote_ar, article.title_ar)}
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
                                            ArticleService.GetArticleCard(articleLinks, article, lang))
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
                    AccountService.IsPrivilegedUser() && works && groups && (
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
                                                      onSubmit={updateArticleHandle((data, event) => updateArticle(data, event))}>
                                                    {
                                                        GetArticleForm(
                                                            updateArticleRegister,
                                                            updateArticleErrors,
                                                            works?.map(work => {
                                                                return {
                                                                    id: work.id,
                                                                    title: lang === "ru" ? work.title_ru : work.title_ar
                                                                };
                                                            }),
                                                            groups?.map(group => {
                                                                return {
                                                                    id: group.id,
                                                                    name: lang === "ru" ? group.name_ru : group.name_ar
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
                                                                <select className="form-select" id="group_id"
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
                                                                <select className="form-select" id="group_id"
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

const GetGroupForm = (register, errors, is_update) => {
    return (
        <>
            <div className="pt-3">
                <p className="m-0"><GroupsForm tid="short_name"/></p>
                <div className="row">
                    <div className="col-6">
                        <label htmlFor="short_name_ru" className="form-label"><GeneralForm tid="russian"/></label>
                        <input type="text" dir="ltr" className="form-control" id="short_name_ru"
                               {...register("short_name_ru")} disabled={is_update}/>
                    </div>
                    <div className="col-6">
                        <label htmlFor="short_name_ar" className="form-label"><GeneralForm tid="arabic"/></label>
                        <input type="text" dir="rtl" className="form-control" id="short_name_ar"
                               {...register("short_name_ar")} disabled={is_update}/>
                    </div>
                </div>
            </div>
            <div className="pt-3">
                <p className="m-0"><GroupsForm tid="name"/></p>
                <div className="row">
                    <div className="col-12">
                        <label htmlFor="name_ru" className="form-label"><GeneralForm tid="russian"/></label>
                        <input type="text" dir="ltr" className="form-control" id="name_ru"
                               {...register("name_ru")} disabled={is_update}/>
                    </div>
                    <div className="col-12">
                        <label htmlFor="name_ar" className="form-label"><GeneralForm tid="arabic"/></label>
                        <input type="text" dir="rtl" className="form-control" id="name_ar"
                               {...register("name_ar")} disabled={is_update}/>
                    </div>
                </div>
            </div>
            <div className="form-error mt-4 mb-0">
                {errors?.required?.message}
            </div>
            <div className="col-12 row justify-content-center align-items-center mt-4 m-auto">
                <button type="submit" className="btn btn-outline-dark w-auto">
                    {
                        !is_update
                            ? <GroupsCreateForm tid="button_text"/>
                            : <GroupsUpdateForm tid="button_text"/>
                    }
                </button>
            </div>
        </>
    )
};

const GetArticleForm = (register, errors, works, groups, article) => {
    return (
        <>
            <div className="pt-3">
                <div className="row">
                    <div className="col-12">
                        <select className="form-select" id="group_id"
                                defaultValue={article ? article.group?.id : "null"}
                                name="group_id" {...register("group_id")}>
                            <option value="null" disabled><GeneralForm tid="choose_group"/></option>
                            {
                                groups?.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)
                            }
                        </select>
                    </div>
                </div>
            </div>
            <div className="pt-3">
                <div className="row">
                    <div className="col-12">
                        <select className="form-select" id="work_id"
                                defaultValue={article ? article.work?.id : "null"}
                                name="work_id" {...register("work_id")}>
                            <option value="null" disabled><GeneralForm tid="choose_work"/></option>
                            {
                                works?.map((work) => <option key={work.id} value={work.id}>{work.title}</option>)
                            }
                        </select>
                    </div>
                </div>
            </div>
            <div className="pt-3">
                <p className="m-0"><ArticlesForm tid="title"/></p>
                <div className="row">
                    <div className="col-6">
                        <label htmlFor="title_ru" className="form-label"><GeneralForm tid="russian"/></label>
                        <input type="text" dir="ltr" className="form-control" id="title_ru"
                               {...register("title_ru")} defaultValue={article?.title_ru}/>
                    </div>
                    <div className="col-6">
                        <label htmlFor="title_ar" className="form-label"><GeneralForm tid="arabic"/></label>
                        <input type="text" dir="rtl" className="form-control" id="title_ar"
                               {...register("title_ar")} defaultValue={article?.title_ar}/>
                    </div>
                </div>
            </div>
            <div className="pt-3">
                <p className="m-0"><ArticlesForm tid="quote"/></p>
                <div className="row">
                    <div className="col-12">
                        <label htmlFor="quote_ru" className="form-label"><GeneralForm tid="russian"/></label>
                        <textarea rows="4" dir="ltr" className="form-control" id="quote_ru"
                                  {...register("quote_ru")} defaultValue={article?.quote_ru}/>
                    </div>
                    <div className="col-12">
                        <label htmlFor="quote_ar" className="form-label"><GeneralForm tid="arabic"/></label>
                        <textarea rows="4" dir="rtl" className="form-control" id="quote_ar"
                                  {...register("quote_ar")} defaultValue={article?.quote_ar}/>
                    </div>
                </div>
            </div>
            <div className="pt-3">
                <p className="m-0"><ArticlesForm tid="description"/></p>
                <div className="row">
                    <div className="col-12">
                        <label htmlFor="description_ru" className="form-label">
                            <GeneralForm tid="russian"/>
                        </label>
                        <textarea rows="4" dir="ltr" className="form-control" id="description_ru"
                                  {...register("description_ru")} defaultValue={article?.description_ru}/>
                    </div>
                    <div className="col-12">
                        <label htmlFor="description_ar" className="form-label">
                            <GeneralForm tid="arabic"/>
                        </label>
                        <textarea rows="4" dir="rtl" className="form-control" id="description_ar"
                                  {...register("description_ar")} defaultValue={article?.description_ar}/>
                    </div>
                </div>
            </div>
            <div className="pt-3">
                <p className="mb-2"><ArticlesForm tid="transcription"/></p>
                <div className="row">
                    <div className="col-12">
                        <input type="text" dir="ltr" className="form-control" id="transcription"
                               {...register("transcription")} defaultValue={article?.transcription}/>
                    </div>
                </div>
            </div>
            <div className="pt-3">
                <p className="mb-2"><ArticlesForm tid="picture"/></p>
                <div className="row">
                    <div className="col-12">
                        <input type="file" className="form-control" id="picture" {...register("picture")}/>
                    </div>
                </div>
            </div>
            <div className="form-error mt-4 mb-0">
                {errors?.required?.message}
            </div>
            <div className="col-12 row justify-content-center align-items-center mt-4 m-auto">
                <button type="submit" className="btn btn-outline-dark w-auto">
                    {
                        !article
                            ? <ArticlesCreateForm tid="button_text"/>
                            : <ArticlesUpdateForm tid="button_text"/>
                    }
                </button>
            </div>
        </>
    )
};

export {ArticlePage, ArticlesListPage}