import BaseModel from "./Base";
import {Article} from "./Article";

class Feedback extends BaseModel {
    title: string;
    description: string;
    article: Article;
}

export {Feedback};