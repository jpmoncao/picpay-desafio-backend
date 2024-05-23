import UserProps from "../domain/user.js";
import { Repo } from "./Repo.js";

export default interface IUserRepo extends Repo {
    findUsers: (page: number, limit: number) => Promise<UserProps[] | undefined>;
    findUserById: (userId: number) => Promise<UserProps | undefined>;
    findUserByCPF: (cpf: string) => Promise<UserProps | undefined>;
    findUserByCNPJ: (cpnj: string) => Promise<UserProps | undefined>;
    findUserByEmail: (email: string) => Promise<UserProps | undefined>;
    createUser: (props: UserProps) => Promise<UserProps | undefined>;
    updateUser: (props: UserProps) => Promise<UserProps | undefined>;
    deleteUserById: (props: UserProps) => Promise<UserProps | undefined>;
}