import {AuthorsCreateForm, AuthorsForm, AuthorsUpdateForm, GeneralForm} from "../../containers/Language";
import React from "react";

const UpdateAuthorForm = (register, errors, author) => {
    return (
        <>
            <div className="pt-3">
                <p className="m-0"><AuthorsForm tid="name"/></p>
                <div className="row">
                    <div className="col-6">
                        <label htmlFor="name_ru" className="form-label">
                            <GeneralForm tid="russian"/>
                        </label>
                        <input type="text" dir="ltr" className="form-control"
                               id="name_ru" {...register("name_ru")} defaultValue={author?.name_ru}/>
                    </div>
                    <div className="col-6">
                        <label htmlFor="name_ar" className="form-label">
                            <GeneralForm tid="arabic"/>
                        </label>
                        <input type="text" dir="rtl" className="form-control"
                               id="name_ar" {...register("name_ar")} defaultValue={author?.name_ar}/>
                    </div>
                </div>
            </div>
            <div className="pt-3">
                <p className="m-0"><AuthorsForm tid="short_name"/></p>
                <div className="row">
                    <div className="col-6">
                        <label htmlFor="short_name_ru" className="form-label">
                            <GeneralForm tid="russian"/>
                        </label>
                        <input type="text" dir="ltr" className="form-control"
                               id="short_name_ru" {...register("short_name_ru")} defaultValue={author?.short_name_ru}/>
                    </div>
                    <div className="col-6">
                        <label htmlFor="short_name_ar" className="form-label">
                            <GeneralForm tid="arabic"/>
                        </label>
                        <input type="text" dir="rtl" className="form-control"
                               id="short_name_ar" {...register("short_name_ar")} defaultValue={author?.short_name_ar}/>
                    </div>
                </div>
            </div>
            <div className="pt-3">
                <p className="m-0"><AuthorsForm tid="about"/></p>
                <div className="row">
                    <div className="col-12">
                        <label htmlFor="about_ru" className="form-label">
                            <GeneralForm tid="russian"/>
                        </label>
                        <textarea rows="4" dir="ltr" className="form-control"
                                  id="about_ru" {...register("about_ru")} defaultValue={author?.about_ru}/>
                    </div>
                    <div className="col-12">
                        <label htmlFor="about_ar" className="form-label">
                            <GeneralForm tid="arabic"/>
                        </label>
                        <textarea rows="4" dir="rtl" className="form-control"
                                  id="about_ar" {...register("about_ar")} defaultValue={author?.about_ar}/>
                    </div>
                </div>
            </div>
            <div className="pt-3">
                <div className="row">
                    <div className="col-6">
                        <label htmlFor="birth_date" className="form-label">
                            <AuthorsForm tid="birth_date"/>
                        </label>
                        <input type="date" className="date form-control"
                               id="birth_date" {...register("birth_date")}
                               defaultValue={author && author.birth_date && author.birth_date.slice(0, 10)}/>
                    </div>
                    <div className="col-6">
                        <label htmlFor="death_date" className="date form-label">
                            <AuthorsForm tid="death_date"/>
                        </label>
                        <input type="date" className="form-control"
                               id="death_date" {...register("death_date")}
                               defaultValue={author && author.death_date && author.death_date.slice(0, 10)}/>
                    </div>
                </div>
            </div>
            <div className="pt-3">
                <div className="row">
                    <div className="col-12">
                        <label htmlFor="picture" className="form-label">
                            <AuthorsForm tid="picture"/>
                        </label>
                        <input type="file" className="form-control" id="picture"
                               {...register("picture")}/>
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
                        !author
                            ? <AuthorsCreateForm tid="button_text"/>
                            : <AuthorsUpdateForm tid="button_text"/>
                    }
                </button>
            </div>
        </>
    )
};

export default UpdateAuthorForm;