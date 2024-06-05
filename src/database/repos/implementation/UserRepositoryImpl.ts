import { Knex } from "knex";
import createConn from "../../conn.js";
import UserProps from "../../domain/user.js";
import IUserRepo from "../UserRepo.js";

export default class UserRepositoryImpl implements IUserRepo {
    trx: Knex.Transaction<any, any[]>;

    constructor(trx: Knex.Transaction<any, any[]>) {
        this.trx = trx;
    }

    public async findUsers(page: number, limit: number): Promise<UserProps[] | undefined> {
        if (page < 1) {
            page = 1;
        }

        if (limit < 1) {
            limit = 10;
        }

        let offset = (page - 1) * limit;
        if (page == 1)
            offset = 0;
        else if (limit == 1)
            offset = page - 1;

        const users = await this.trx('users')
            .select('id_user', 'name', 'cpf_cnpj', 'person_type', 'email')
            .limit(limit)
            .offset(offset)
            .orderBy('id_user', 'asc');
        return users;
    }

    public async findUserById(userId: number): Promise<UserProps | undefined> {
        const user: UserProps[] = await this.trx('users')
            .select('id_user', 'name', 'cpf_cnpj', 'person_type', 'email')
            .where('id_user', userId);
        return user[0];
    }

    public async findUserByCPF(cpf: string): Promise<UserProps | undefined> {
        const user: UserProps[] = await this.trx('users')
            .select('id_user', 'name', 'cpf_cnpj', 'person_type', 'email')
            .where('cpf_cnpj', cpf);
        return user[0];
    }

    public async findUserByCNPJ(cnpj: string): Promise<UserProps | undefined> {
        const user: UserProps[] = await this.trx('users')
            .select('id_user', 'name', 'cpf_cnpj', 'person_type', 'email')
            .where('cpf_cnpj', cnpj);
        return user[0];
    }

    public async findUserByEmail(email: string): Promise<UserProps | undefined> {
        const user: UserProps[] = await this.trx('users')
            .select('id_user', 'email', 'password')
            .where('email', email);
        return user[0];
    }


    public async createUser(props: UserProps): Promise<UserProps | undefined> {
        const userId: UserProps = await this.trx('users')
            .insert(props);

        return userId;
    }

    public async updateUser(props: UserProps): Promise<UserProps | undefined> {
        const user: UserProps = await this.trx('users')
            .update(props)
            .where('id_user', props.id_user);

        return user;
    }

    public async deleteUserById(props: UserProps): Promise<UserProps | undefined> {
        return await this.trx('users')
            .delete()
            .where('id_user', props.id_user);
    }
}