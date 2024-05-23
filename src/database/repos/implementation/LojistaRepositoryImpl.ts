import { Knex } from "knex";
import createConn from "../../conn.js";
import LojistaProps from "../../domain/lojista.js";
import ILojistaRepo from "../LojistaRepo.js";

export default class LojistaRepositoryImpl implements ILojistaRepo {
    public conn: Knex<any, any[]>;

    constructor() {
        this.conn = createConn();
    }

    public async findUsers(page: number, limit: number): Promise<LojistaProps[] | undefined> {
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
            .innerJoin('lojistas', 'users.id_user', 'lojistas.id_user');
    }

    public async findUserById(userId: number): Promise<LojistaProps | undefined> {
        const user: LojistaProps[] = await this.conn
            .select('id_user', 'nome', 'cpf_cnpj', 'tipo_pessoa', 'email')
            .from('users')
            .innerJoin('lojistas', 'users.id_user', 'lojistas.id_user')
            .where('id_user', userId);
        return user[0];
    }

    public async findUserByCPF(cpf: string): Promise<LojistaProps | undefined> {
        const user: LojistaProps[] = await this.conn
            .select('id_user', 'nome', 'cpf_cnpj', 'tipo_pessoa', 'email')
            .from('users')
            .innerJoin('lojistas', 'users.id_user', 'lojistas.id_user')
            .where('cpf_cnpj', cpf);
        return user[0];
    }

    public async findUserByCNPJ(cnpj: string): Promise<LojistaProps | undefined> {
        const user: LojistaProps[] = await this.conn
            .select('id_user', 'nome', 'cpf_cnpj', 'tipo_pessoa', 'email')
            .from('users')
            .innerJoin('lojistas', 'users.id_user', 'lojistas.id_user')
            .where('cpf_cnpj', cnpj);
        return user[0];
    }

    public async findUserByEmail(email: string): Promise<LojistaProps | undefined> {
        const user: LojistaProps[] = await this.conn
            .select('id_user', 'nome', 'cpf_cnpj', 'tipo_pessoa', 'email')
            .from('users')
            .innerJoin('lojistas', 'users.id_user', 'lojistas.id_user')
            .where('email', email);
        return user[0];
    }

    public async createUser(props: LojistaProps): Promise<LojistaProps | undefined> {
        const lojistaId: LojistaProps = await this.conn
            .insert(props)
            .into('lojistas');

        return lojistaId;
    }
}