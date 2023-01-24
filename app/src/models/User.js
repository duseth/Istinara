import BaseModel from "./Base";

class User extends BaseModel {
    username: string;
    email: string;
    is_privileged: boolean;
}

export default User;