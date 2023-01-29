import BaseModel from "./Base";

class Work extends BaseModel {
    title_ru: string;
    title_ar: string;
    description_ru: string;
    description_ar: string;
    picture_path: string;
    author_id: number;
    link: string;
}

export default Work;