import React from "react";
import {ArticlesCreateForm, ArticlesForm, ArticlesUpdateForm, GeneralForm} from "../../containers/Language";

const UpdateArticleForm = (register, errors, works, groups, article) => {
    return (
        <>
            <div className="pt-3">
                <div className="row">
                    <div className="col-12">
                        <select className="form-select" id="article_type_id"
                                defaultValue={article ? article.group?.id : "null"}
                                name="article_type_id" {...register("article_type_id")}>
                            <option value="null" disabled><GeneralForm tid="choose_article_type"/></option>
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
                <p className="m-0"><ArticlesForm tid="quote_highlight"/></p>
                <div className="row">
                    <div className="col-6">
                        <label htmlFor="quote_ru_highlight" className="form-label"><GeneralForm tid="russian"/></label>
                        <input type="text" dir="ltr" className="form-control" id="quote_ru_highlight"
                               {...register("quote_ru_highlight")} defaultValue={article?.quote_ru_highlight}/>
                    </div>
                    <div className="col-6">
                        <label htmlFor="quote_ar_highlight" className="form-label"><GeneralForm tid="arabic"/></label>
                        <input type="text" dir="rtl" className="form-control" id="quote_ar_highlight"
                               {...register("quote_ar_highlight")} defaultValue={article?.quote_ar_highlight}/>
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


export default UpdateArticleForm;