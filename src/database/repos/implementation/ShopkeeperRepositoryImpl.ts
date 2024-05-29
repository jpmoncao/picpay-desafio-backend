import { Knex } from "knex";
import createConn from "../../conn.js";
import ShopkeeperProps from "../../domain/shopkeeper.js";
import IShopkeeperRepo from "../ShopkeeperRepo.js";

export default class ShopkeeperRepositoryImpl implements IShopkeeperRepo {
    trx: Knex.Transaction<any, any[]>;

    constructor(trx: Knex.Transaction<any, any[]>) {
        this.trx = trx;
    }

    public async findShopkeepers(page: number, limit: number): Promise<ShopkeeperProps[] | undefined> {
        if (page < 1) page = 1;
        if (limit < 1) limit = 1;

        const shopkeepers = await this.trx('shopkeepers')
            .select('shopkeepers.id_shopkeeper', 'users.*')
            .limit(limit)
            .offset((page - 1) * limit)
            .orderBy('shopkeepers.id_user', 'asc')
            .innerJoin('users', 'users.id_user', 'shopkeepers.id_user');
        return shopkeepers;
    }

    public async findShopkeeperByUserId(userId: number): Promise<ShopkeeperProps | undefined> {
        const shopkeeper: ShopkeeperProps[] = await this.trx('shopkeepers')
            .select('shopkeepers.id_user', 'name', 'cpf_cnpj', 'person_type', 'email')
            .innerJoin('users', 'shopkeepers.id_user', 'users.id_user')
            .where('shopkeepers.id_user', userId);
        return shopkeeper[0];
    }

    public async findShopkeeperByCPF(cpf: string): Promise<ShopkeeperProps | undefined> {
        const shopkeeper: ShopkeeperProps[] = await this.trx('shopkeepers')
            .select('shopkeepers.id_user', 'name', 'cpf_cnpj', 'person_type', 'email')
            .innerJoin('users', 'shopkeepers.id_user', 'users.id_user')
            .where('cpf_cnpj', cpf);
        return shopkeeper[0];
    }

    public async findShopkeeperByCNPJ(cnpj: string): Promise<ShopkeeperProps | undefined> {
        const shopkeeper: ShopkeeperProps[] = await this.trx('shopkeepers')
            .select('shopkeepers.id_user', 'name', 'cpf_cnpj', 'person_type', 'email')
            .innerJoin('users', 'shopkeepers.id_user', 'users.id_user')
            .where('cpf_cnpj', cnpj);
        return shopkeeper[0];
    }

    public async findShopkeeperByEmail(email: string): Promise<ShopkeeperProps | undefined> {
        const shopkeeper: ShopkeeperProps[] = await this.trx('shopkeepers')
            .select('shopkeepers.id_user', 'name', 'cpf_cnpj', 'person_type', 'email')
            .innerJoin('users', 'shopkeepers.id_user', 'users.id_user')
            .where('email', email);
        return shopkeeper[0];
    }

    public async createShopkeeper(props: ShopkeeperProps): Promise<ShopkeeperProps | undefined> {
        const shopkeeperId: ShopkeeperProps = await this.trx('shopkeepers')
            .insert(props);

        return shopkeeperId;
    }
}