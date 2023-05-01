import {GeneralForm, WorksCreateForm, WorksForm, WorksUpdateForm} from "../../containers/Language";
import React from "react";

const UpdateWorkForm = (register, errors, authors, work) => {
    return (
        <>
            <div className="pt-3">
                <div className="row">
                    <div className="col-12">
                        <select className="form-select" id="author_id" defaultValue={work ? work.author?.id : "null"}
                                name="author_id" {...register("author_id")}>
                            <option value="null" disabled><GeneralForm tid="choose_author"/></option>
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
                            <GeneralForm tid="russian"/>
                        </label>
                        <input type="text" dir="ltr" className="form-control" id="title_ru"
                               {...register("title_ru")} defaultValue={work?.title_ru}/>
                    </div>
                    <div className="col-6">
                        <label htmlFor="title_ar" className="form-label">
                            <GeneralForm tid="arabic"/>
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
                            <GeneralForm tid="russian"/>
                        </label>
                        <textarea rows="4" dir="ltr" className="form-control" id="about_ru"
                                  {...register("about_ru")} defaultValue={work?.about_ru}/>
                    </div>
                    <div className="col-12">
                        <label htmlFor="about_ar" className="form-label">
                            <GeneralForm tid="arabic"/>
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
                            <GeneralForm tid="russian"/>
                        </label>
                        <input type="text" dir="rtl" className="form-control" id="genre_ru"
                               {...register("genre_ru")} defaultValue={work?.genre_ru}/>
                    </div>
                    <div className="col-6">
                        <label htmlFor="genre_ar" className="form-label">
                            <GeneralForm tid="arabic"/>
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

export default UpdateWorkForm;