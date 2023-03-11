import {useForm} from "react-hook-form";
import React, {useContext, useEffect, useState} from 'react';

import './Contribution.scss'
import API from "../../services/API";
import {Work} from "../../models/Work";
import {User} from "../../models/User";
import {Request} from "../../models/Request";
import {Author} from "../../models/Author";
import {LanguageContext} from "../../languages/Language";
import NotifyService from "../../services/NotifyService";
import AccountService from "../../services/AccountService";
import {ContributionForm, ContributionText, GeneralForm} from "../../containers/Language";

const ContributionPage = () => {
    const languageContext = useContext(LanguageContext);

    const lang = languageContext.userLanguage;
    const user: User = AccountService.GetCurrentUser();

    const [works: Array<Work>, setWorks] = useState();
    const [authors: Array<Author>, setAuthors] = useState();

    const {register, reset, setError, handleSubmit, formState: {errors}} = useForm();

    useEffect(() => {
        document.title = languageContext.dictionary["titles"]["contribution"] + " • Istinara";
    }, [languageContext]);

    useEffect(() => {
        API.get("/authors").then((response) => setAuthors(response.data.data));
    }, []);

    const unlockWorks = (author) => {
        const uuid = author.target.value;
        API.get(`/authors/${uuid}/works`).then((response) => setWorks(response.data));
        document.getElementById("work_id").disabled = false;
    };

    const sendRequest = async (data: Request) => {
        const fields = ["name", "email", "title", "quote", "description"];

        if (data.author_id === "null") {
            setError("required", {message: <GeneralForm tid="error_required"/>});
            return;
        }

        if (data.work_id === undefined || data.work_id === "null") {
            setError("required", {message: <GeneralForm tid="error_required"/>});
            return;
        }

        let success = true;
        fields.map((field) => {
            if (data[field].trim().length === 0) {
                setError("required", {message: <GeneralForm tid="error_required"/>});
                success = false;
            }
        });

        if (!success) {
            return;
        }

        const emailValidation = new RegExp(".+@.+\\.[A-Za-z]+$");
        if (!emailValidation.test(data.email)) {
            setError("email", {message: <GeneralForm tid="error_email"/>});
            return;
        }

        let formData = new FormData();
        formData.append("author_id", data.author_id);
        formData.append("work_id", data.work_id);

        fields.map((field) => {
            formData.append(field, data[field])
        });

        let formDataHeaders = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        };

        await API.post("/requests", formData, formDataHeaders)
            .then(() => {
                NotifyService.Success(<ContributionForm tid="success_notify"/>);
                reset();
            })
            .catch(() => NotifyService.Error(<ContributionForm tid="error_notify"/>))
    };

    return (
        <section className="main-container">
            <div className="container py-5">
                <div className="row justify-content-center align-items-center m-1">
                    <div className="contribution-header">
                        <i className="bi bi-folder-plus contribution-icon"/>
                        <p><ContributionText tid="header"/></p>
                    </div>
                    <form onSubmit={handleSubmit((data) => sendRequest(data))}
                          className="contribution-form row" id="request-form" {...register("required")}>
                        <p className="contribution-form-header"><ContributionForm tid="header"/></p>
                        <div className="col-12 mt-3">
                            <select className="form-select" id="author_id" defaultValue="null" name="author_id"
                                    {...register("author_id")} onChange={unlockWorks}>
                                <option value="null" disabled><ContributionForm tid="choose-author"/></option>
                                {
                                    authors?.map((author) =>
                                        <option key={author.id} value={author.id}>
                                            {lang === "ru" ? author.name_ru : author.name_ar}
                                        </option>
                                    )
                                }
                            </select>
                        </div>
                        <div className="col-12 mt-3">
                            <select className="form-select" id="work_id" defaultValue="null" name="work_id"
                                    {...register("work_id")} disabled>
                                <option value="null" disabled><ContributionForm tid="choose-work"/></option>
                                {
                                    works?.map((work) =>
                                        <option key={work.id} value={work.id}>
                                            {lang === "ru" ? work.title_ru : work.title_ar}
                                        </option>
                                    )
                                }
                            </select>
                        </div>
                        <div className="col-12 mt-3">
                            <label htmlFor="title" className="form-label">
                                <ContributionForm tid="title"/>
                            </label>
                            <input type="text" className="form-control" id="title" {...register("title")}/>
                        </div>
                        <div className="col-12 mt-3">
                            <label htmlFor="quote" className="form-label">
                                <ContributionForm tid="quote"/>
                            </label>
                            <input type="text" className="form-control" id="quote" {...register("quote")}/>
                        </div>
                        <div className="col-12 mt-3">
                            <label htmlFor="description" className="form-label">
                                <ContributionForm tid="description"/>
                            </label>
                            <textarea rows="5" className="form-control" id="description" {...register("description")}/>
                        </div>
                        <hr className="mt-4"/>
                        <div className="col-md-6 mt-3">
                            <label htmlFor="name" className="form-label"><ContributionForm tid="name"/></label>
                            <input type="text" className="form-control" id="name"
                                   defaultValue={user?.username} {...register("name")}/>
                        </div>
                        <div className="col-md-6 mt-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" className="form-control" id="email"
                                   defaultValue={user?.email} {...register("email")}/>
                        </div>
                        <div className="form-error mt-4 mb-0">
                            {errors?.required?.message || errors?.email?.message}
                        </div>
                        <div className="col-12 row justify-content-center align-items-center mt-3 m-auto">
                            <button type="submit" className="btn btn-outline-dark w-auto">
                                <ContributionForm tid="button_text"/>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ContributionPage;