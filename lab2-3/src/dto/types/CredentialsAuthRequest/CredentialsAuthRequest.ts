import {IUserSchema} from "../../../model/User";

export interface CredentialsAuthRequest {
    login: NonNullable<IUserSchema["login"]>;
    password: NonNullable<IUserSchema["password"]>;
}