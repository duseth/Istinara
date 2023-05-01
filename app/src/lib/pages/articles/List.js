import {useForm} from "react-hook-form";
import {useSearchParams} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";

import './styles.scss'
import api from "../../../config/API";
import ArticleType from "../../models/ArticleType";
import Article from "../../models/Article";
import NotifyService from "../../services/NotifyService";
import {LanguageContext} from "../../../bin/context/Language";
import AccountService from "../../services/AccountService";
import ArticleService from "../../services/ArticleService";
import {
    ArticlesCreateForm,
    ArticlesText,
    ArticleTypesCreateForm,
    ArticleTypesDeleteForm,
    ArticleTypesUpdateForm,
    GeneralForm
} from "../../containers/Language";
import {Work} from "../../models/Work";
import ArticleTypeService from "../../services/ArticleTypeService";
import ArticleCard from "../../components/articles/ArticleCard";
import UpdateArticleForm from "../../components/articles/UpdateArticleForm";
import UpdateArticleTypeForm from "../../components/articles/UpdateArticleTypeForm";

const ARTICLES_LIMIT = 12;

const ArticlesListPage = () => {
    const [searchParams] = useSearchParams();

    const languageContext = useContext(LanguageContext);
    const lang = languageContext.userLanguage;

    const [count, setCount] = useState(0);
    const [data: Array<Article>, setData] = useState()
    const [works: Array<Work>, setWorks] = useState(null);
    const [articleTypes: Array<ArticleType>, setArticleTypes] = useState(null);

    const query = searchParams.get("query") !== null
        ? "query=" + searchParams.get("query") + "&"
        : "";

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
            api.get("/works/signatures").then((response) => setWorks(response.data));
        }
    }, []);

    useEffect(() => {
        if (AccountService.IsPrivilegedUser()) {
            api.get("/articles/types").then((response) => setArticleTypes(response.data));
        }
    }, []);

    useEffect(() => {
        const sort = lang === "ru" ? "title_ru" : "title_ar";
        api.get(`/articles?${query}offset=0&limit=${ARTICLES_LIMIT}&sort_by=${sort}`)
            .then((response) => {
                setCount(response.data.count);
                setData(response.data.data);
            })
            .catch(() => {
                setData([]);
            });
    }, [lang, query]);

    const loadMore = () => {
        const sort = lang === "ru" ? "title_ru" : "title_ar";
        api.get(`/articles?${query}offset=${data.length}&limit=${ARTICLES_LIMIT}&sort_by=${sort}`)
            .then((response) => setData([...data, ...response.data.data]))
    };

    const createArticle = async (data: Article) => {
        delete data["required"];

        if (data.article_type_id === undefined || data.article_type_id === "null") {
            setError("required", {message: <GeneralForm tid="error_required"/>});
            return;
        }

        if (data.work_id === undefined || data.work_id === "null") {
            setError("required", {message: <GeneralForm tid="error_required"/>});
            return;
        }

        const excludeFields = ["picture", "article_type_id", "work_id", "transcription", "quote_ru_highlight", "quote_ar_highlight"];
        const properties = Object.keys(data).filter(x => !excludeFields.includes(x));
        for (const property of properties) {
            data[property] = data[property].trim();
            if (data[property].length === 0) {
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

    const createArticleType = async (data: ArticleType) => {
        delete data["required"];

        const fields = Object.keys(data).filter(x => !x.includes(["picture"]));
        for (const field of fields) {
            data[field] = data[field].trim()
            if (data[field].length === 0) {
                setCreateGroupError("required", {message: <GeneralForm tid="error_required"/>});
                return;
            }
        }

        if (data.picture.length === 0) {
            setCreateGroupError("required", {message: <GeneralForm tid="error_required"/>});
            return;
        }

        data.picture = data.picture[0];
        try {
            await ArticleTypeService.Create(data);
            NotifyService.Success(<ArticleTypesCreateForm tid="success_notify"/>);
        } catch {
            NotifyService.Error(<ArticleTypesCreateForm tid="error_notify"/>);
        }
    };

    const updateArticleType = async (data: ArticleType) => {
        delete data["required"];

        if (data["article_type_id"] === undefined || data["article_type_id"] === "null") {
            setUpdateGroupError("required", {message: <GeneralForm tid="error_required"/>});
            return;
        }
        const article_type_id = data["article_type_id"];
        delete data["article_type_id"];

        const properties = Object.keys(data).filter(x => !["article_type_id", "picture"].includes(x));
        for (const property of properties) {
            data[property] = data[property].trim()
            if (data[property].length === 0) {
                setUpdateGroupError("required", {message: <GeneralForm tid="error_required"/>});
                return;
            }
        }

        const articleType = articleTypes.filter(x => x.id === article_type_id)[0];
        for (const property of properties) {
            if (data[property] === articleType[property]) {
                delete data[property];
            }
        }

        if (!data["picture"] || data["picture"].length === 0) {
            delete data["picture"];
        } else {
            data.picture = data.picture[0];
        }

        if (Object.keys(data).length === 0) {
            setUpdateGroupError("required", {message: <GeneralForm tid="error_no_changes"/>});
            return;
        }

        try {
            await ArticleTypeService.Update(article_type_id, data);
            NotifyService.Success(<ArticleTypesUpdateForm tid="success_notify"/>);
        } catch {
            NotifyService.Error(<ArticleTypesUpdateForm tid="error_notify"/>);
        }
    };

    const deleteArticleType = async (data) => {
        delete data["required"];
        if (data["article_type_id"] === undefined || data["article_type_id"] === "null") {
            setDeleteGroupError("required", {message: <GeneralForm tid="error_required"/>});
            return;
        }

        const articleType = articleTypes.filter(x => x.id === data["article_type_id"])[0];
        try {
            await ArticleTypeService.Delete(articleType.id);
            NotifyService.Success(<ArticleTypesDeleteForm tid="success_notify"/>)
        } catch {
            NotifyService.Error(<ArticleTypesDeleteForm tid="error_notify"/>)
        }
    };

    const unlockUpdateArticleTypeForm = event => {
        const form = document.getElementById("update-article-type-form");
        const articleType = articleTypes.filter(x => x.id === event.target.value)[0];

        const excludeFields = ["id", "article_type_id", "picture_path"];
        const properties = Object.keys(articleType).filter(x => !excludeFields.includes(x));
        properties.push("picture");

        for (const property of properties) {
            const inputElement = form.getElementsByTagName("input")[property];

            inputElement.disabled = false;
            updateGroupSetValue(property, articleType[property]);
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
                                            <ArticleTypesCreateForm tid="header"/>
                                        </button>
                                    </h2>
                                    <div id="flush-collapseGc" className="accordion-collapse collapse"
                                         aria-labelledby="flush-heading">
                                        <div className="accordion-body pt-0">
                                            <form onSubmit={createGroupHandler((data) => createArticleType(data))}
                                                  id="create-article-type-form" {...createGroupRegister("required")}>
                                                {
                                                    UpdateArticleTypeForm(createGroupRegister, createGroupErrors)
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
                    AccountService.IsPrivilegedUser() && articleTypes?.length > 0 && (
                        <>
                            <div className="col-md-8 m-auto pt-4">
                                <div className="accordion accordion-flush" id="accordionFlushExample">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="flush-heading">
                                            <button className={"accordion-button article-form-header collapsed" +
                                                (lang === "ar" ? " accordion-button-ar" : "")} type="button"
                                                    data-bs-toggle="collapse" data-bs-target="#flush-collapseGu"
                                                    aria-expanded="false" aria-controls="flush-collapseGu">
                                                <ArticleTypesUpdateForm tid="header"/>
                                            </button>
                                        </h2>
                                        <div id="flush-collapseGu" className="accordion-collapse collapse"
                                             aria-labelledby="flush-heading">
                                            <div className="accordion-body pt-0">
                                                <form onSubmit={updateGroupHandle((data) => updateArticleType(data))}
                                                      id="update-article-type-form" {...updateGroupRegister("required")}>
                                                    <div className="pt-3">
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <select className="form-select" id="article_type_id"
                                                                        defaultValue={"null"} name="article_type_id"
                                                                        {...updateGroupRegister("article_type_id")}
                                                                        onChange={unlockUpdateArticleTypeForm}>
                                                                    <option value="null" disabled>
                                                                        <GeneralForm tid="choose_article_type"/>
                                                                    </option>
                                                                    {
                                                                        articleTypes?.map((article_type) =>
                                                                            <option key={article_type.id}
                                                                                    value={article_type.id}>
                                                                                {
                                                                                    lang === "ru"
                                                                                        ? article_type.name_ru
                                                                                        : article_type.name_ar
                                                                                }
                                                                            </option>)
                                                                    }
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {
                                                        UpdateArticleTypeForm(updateGroupRegister, updateGroupErrors, true)
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
                                                <ArticleTypesDeleteForm tid="header"/>
                                            </button>
                                        </h2>
                                        <div id="flush-collapseGd" className="accordion-collapse collapse"
                                             aria-labelledby="flush-heading">
                                            <div className="accordion-body pt-0">
                                                <form onSubmit={deleteGroupHandle((data) => deleteArticleType(data))}
                                                      id="update-article-type-form" {...deleteGroupRegister("required")}>
                                                    <div className="pt-3">
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <select className="form-select" id="article_type_id"
                                                                        defaultValue={"null"} name="article_type_id"
                                                                        {...deleteGroupRegister("article_type_id")}>
                                                                    <option value="null" disabled>
                                                                        <GeneralForm tid="choose_article_type"/>
                                                                    </option>
                                                                    {
                                                                        articleTypes?.map((article_type) =>
                                                                            <option key={article_type.id}
                                                                                    value={article_type.id}>
                                                                                {
                                                                                    lang === "ru"
                                                                                        ? article_type.name_ru
                                                                                        : article_type.name_ar
                                                                                }
                                                                            </option>)
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
                                                            <ArticleTypesDeleteForm tid="button_text"/>
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
                    AccountService.IsPrivilegedUser() && works?.length > 0 && articleTypes?.length > 0 && (
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
                                                        UpdateArticleForm(
                                                            register,
                                                            errors,
                                                            works?.map(work => {
                                                                return {
                                                                    id: work.id,
                                                                    title: lang === "ru" ? work.title_ru : work.title_ar
                                                                };
                                                            }),
                                                            articleTypes?.map(article_type => {
                                                                return {
                                                                    id: article_type.id,
                                                                    name: lang === "ru" ? article_type.name_ru : article_type.name_ar
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
                            {data.map((article) => ArticleCard(data, article, lang))}
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


export default ArticlesListPage;