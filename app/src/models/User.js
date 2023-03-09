import BaseModel from "./Base";

class User extends BaseModel {
    username: string;
    email: string;
}

export default User;