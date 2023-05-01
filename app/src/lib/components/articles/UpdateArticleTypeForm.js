import {ArticleTypesCreateForm, ArticleTypesForm, ArticleTypesUpdateForm, GeneralForm} from "../../containers/Language";
import React from "react";

const UpdateArticleTypeForm = (register, errors, is_update) => {
    return (
        <>
            <div className="pt-3">
                <p className="mb-2"><ArticleTypesForm tid="name"/></p>
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
            <div className="pt-3">
                <p className="mb-2"><ArticleTypesForm tid="picture"/></p>
                <div className="row">
                    <div className="col-12">
                        <input type="file" className="form-control" id="picture" {...register("picture")}
                               disabled={is_update}/>
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
                            ? <ArticleTypesCreateForm tid="button_text"/>
                            : <ArticleTypesUpdateForm tid="button_text"/>
                    }
                </button>
            </div>
        </>
    )
};

export default UpdateArticleTypeForm;