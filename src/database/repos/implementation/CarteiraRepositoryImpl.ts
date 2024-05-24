import { Knex } from "knex";
import createConn from "../../conn.js";
import CarteiraProps from "../../domain/carteira.js";
import ICarteiraRepo from "../CarteiraRepo.js";

export default class CarteiraRepositoryImpl implements ICarteiraRepo {
    public conn: Knex<any, any[]>;

    constructor() {
        this.conn = createConn();
    }

    public async createCarteira(props: CarteiraProps): Promise<CarteiraProps | undefined> {
        const carteira: CarteiraProps = await this.conn
            .insert(props)
            .into('carteiras')

        return carteira[0];
    }

    public async updateBalanceCarteira(props: CarteiraProps): Promise<CarteiraProps | undefined> {
        const { id_user, id_carteira, saldo, lojista } = props;

        const carteira: CarteiraProps = await this.conn
            .update({ saldo })
            .from('carteiras')
            .where(!id_carteira ? 'id_user' : 'id_carteira',
                !id_carteira ? id_user : id_carteira);

        return carteira[0];
    }

    public async updateTypeCarteira(props: CarteiraProps): Promise<CarteiraProps | undefined> {
        const { id_user, id_carteira, saldo, lojista } = props;

        const carteira: CarteiraProps = await this.conn
            .update({ lojista })
            .from('carteiras')
            .where(!id_carteira ? 'id_user' : 'id_carteira',
                !id_carteira ? id_user : id_carteira);

        return carteira[0];
    }

    public async findCarteiraById(carteiraId: number): Promise<CarteiraProps | undefined> {
        const carteira: CarteiraProps[] = await this.conn
            .select('carteira.id_user', 'users.nome', 'users.cpf_cnpj', 'users.tipo_pessoa', 'carteira.saldo', 'carteira.lojista')
            .from('carteiras')
            .innerJoin('users', 'carteira.id_user', 'users.id_user')
            .where('carteira.id_carteira', carteiraId);
        return carteira[0];

    }

    public async findCarteiraByUserId(userId: number): Promise<CarteiraProps | undefined> {
        const carteira: CarteiraProps[] = await this.conn
            .select('carteira.id_user', 'users.nome', 'users.cpf_cnpj', 'users.tipo_pessoa', 'carteira.saldo', 'carteira.lojista')
            .from('carteiras')
            .innerJoin('users', 'carteira.id_user', 'users.id_user')
            .where('carteira.id_user', userId);
        return carteira[0];
    }
}