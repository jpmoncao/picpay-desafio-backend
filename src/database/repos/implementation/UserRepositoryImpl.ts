import { Knex } from "knex";
import createConn from "../../conn.js";
import UserProps from "../../domain/user.js";
import IUserRepo from "../UserRepo.js";

export default class UserRepositoryImpl implements IUserRepo {
    public conn: Knex<any, any[]>;

    constructor() {
        this.conn = createConn();
    }

    public async findUsers(page: number, limit: number): Promise<UserProps[] | undefined> {
        if (page < 1)
            page = 1;

        if (limit < 1)
            limit = 1;

        return await this.conn
            .select()
            .limit((limit * page))
            .offset((limit * page) - limit)
            .orderBy('id_user', 'asc')
            .from('users')
    }

    public async findUserById(userId: number): Promise<UserProps | undefined> {
        const user: UserProps[] = await this.conn
            .select('id_user', 'nome', 'cpf_cnpj', 'tipo_pessoa', 'email')
            .from('users')
            .where('id_user', userId);
        return user[0];
    }

    public async findUserByCPF(cpf: string): Promise<UserProps | undefined> {
        const user: UserProps[] = await this.conn
            .select('id_user', 'nome', 'cpf_cnpj', 'tipo_pessoa', 'email')
            .from('users')
            .where('cpf_cnpj', cpf);
        return user[0];
    }

    public async findUserByCNPJ(cnpj: string): Promise<UserProps | undefined> {
        const user: UserProps[] = await this.conn
            .select('id_user', 'nome', 'cpf_cnpj', 'tipo_pessoa', 'email')
            .from('users')
            .where('cpf_cnpj', cnpj);
        return user[0];
    }

    public async findUserByEmail(email: string): Promise<UserProps | undefined> {
        const user: UserProps[] = await this.conn
            .select('id_user', 'nome', 'cpf_cnpj', 'tipo_pessoa', 'email')
            .from('users')
            .where('email', email);
        return user[0];
    }

    public async createUser(props: UserProps): Promise<UserProps | undefined> {
        const userId: UserProps = await this.conn
            .insert(props)
            .into('users');

        return userId;
    }

    public async updateUser(props: UserProps): Promise<UserProps | undefined> {
        const user: UserProps = await this.conn
            .update(props)
            .from('users')
            .where('id_user', props.id_user);

        return user;
    }

    public async deleteUserById(props: UserProps): Promise<UserProps | undefined> {
        return await this.conn
            .delete()
            .from('users')
            .where('id_user', props.id_user);
    }
}