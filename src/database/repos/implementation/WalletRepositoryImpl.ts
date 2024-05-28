import { Knex } from "knex";
import createConn from "../../conn.js";
import WalletProps from "../../domain/wallet.js";
import IWalletRepo from "../WalletRepo.js";

export default class WalletRepositoryImpl implements IWalletRepo {
    public conn: Knex<any, any[]>;

    constructor() {
        this.conn = createConn();
    }

    public async createWallet(props: WalletProps): Promise<WalletProps | undefined> {
        const wallet: WalletProps = await this.conn
            .insert(props)
            .into('wallets')

        return wallet[0];
    }

    public async updateBalanceWallet(props: WalletProps): Promise<WalletProps | undefined> {
        const { id_user, id_wallet, balance, shopkeeper } = props;

        const wallet: WalletProps = await this.conn
            .update({ balance })
            .from('wallets')
            .where(!id_wallet ? 'id_user' : 'id_wallet',
                !id_wallet ? id_user : id_wallet);

        return wallet[0];
    }

    public async updateTypeWallet(props: WalletProps): Promise<WalletProps | undefined> {
        const { id_user, id_wallet, balance, shopkeeper } = props;

        const wallet: WalletProps = await this.conn
            .update({ shopkeeper })
            .from('wallets')
            .where(!id_wallet ? 'id_user' : 'id_wallet',
                !id_wallet ? id_user : id_wallet);

        return wallet[0];
    }

    public async findWalletById(walletId: number): Promise<WalletProps | undefined> {
        const wallet: WalletProps[] = await this.conn
            .select('wallets.id_user', 'users.name', 'users.cpf_cnpj', 'users.person_type', 'wallets.balance', 'wallets.shopkeeper')
            .from('wallets')
            .innerJoin('users', 'wallets.id_user', 'users.id_user')
            .where('wallets.id_wallet', walletId);
        return wallet[0];

    }

    public async findWalletByUserId(userId: number): Promise<WalletProps | undefined> {
        const wallet: WalletProps[] = await this.conn
            .select('wallets.id_user', 'users.name', 'users.cpf_cnpj', 'users.person_type', 'wallets.balance', 'wallets.shopkeeper')
            .from('wallets')
            .innerJoin('users', 'wallets.id_user', 'users.id_user')
            .where('wallets.id_user', userId);
        return wallet[0];
    }
}