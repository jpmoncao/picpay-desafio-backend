import { Knex } from "knex";
import createConn from "../../conn.js";
import ShopkeeperProps from "../../domain/shopkeeper.js";
import IShopkeeperRepo from "../ShopkeeperRepo.js";

export default class ShopkeeperRepositoryImpl implements IShopkeeperRepo {
    public conn: Knex<any, any[]>;

    constructor() {
        this.conn = createConn();
    }

    public async findShopkeepers(page: number, limit: number): Promise<ShopkeeperProps[] | undefined> {
        if (page < 1)
            page = 1;

        if (limit < 1)
            limit = 1;

        return await this.conn
            .select()
            .limit((limit * page))
            .offset((limit * page) - limit)
            .orderBy('shopkeepers.id_user', 'asc')
            .from('users')
            .innerJoin('shopkeepers', 'users.id_user', 'shopkeepers.id_user');
    }

    public async findShopkeeperById(userId: number): Promise<ShopkeeperProps | undefined> {
        const user: ShopkeeperProps[] = await this.conn
            .select('shopkeepers.id_user', 'name', 'cpf_cnpj', 'person_type', 'email')
            .from('users')
            .innerJoin('shopkeepers', 'users.id_user', 'shopkeepers.id_user')
            .where('shopkeepers.id_user', userId);
        return user[0];
    }

    public async findShopkeeperByCPF(cpf: string): Promise<ShopkeeperProps | undefined> {
        const user: ShopkeeperProps[] = await this.conn
            .select('shopkeepers.id_user', 'name', 'cpf_cnpj', 'person_type', 'email')
            .from('users')
            .innerJoin('shopkeepers', 'users.id_user', 'shopkeepers.id_user')
            .where('cpf_cnpj', cpf);
        return user[0];
    }

    public async findShopkeeperByCNPJ(cnpj: string): Promise<ShopkeeperProps | undefined> {
        const user: ShopkeeperProps[] = await this.conn
            .select('shopkeepers.id_user', 'name', 'cpf_cnpj', 'person_type', 'email')
            .from('users')
            .innerJoin('shopkeepers', 'users.id_user', 'shopkeepers.id_user')
            .where('cpf_cnpj', cnpj);
        return user[0];
    }

    public async findShopkeeperByEmail(email: string): Promise<ShopkeeperProps | undefined> {
        const user: ShopkeeperProps[] = await this.conn
            .select('shopkeepers.id_user', 'name', 'cpf_cnpj', 'person_type', 'email')
            .from('users')
            .innerJoin('shopkeepers', 'users.id_user', 'shopkeepers.id_user')
            .where('email', email);
        return user[0];
    }

    public async createShopkeeper(props: ShopkeeperProps): Promise<ShopkeeperProps | undefined> {
        const shopkeeperId: ShopkeeperProps = await this.conn
            .insert(props)
            .into('shopkeepers');

        return shopkeeperId;
    }
}