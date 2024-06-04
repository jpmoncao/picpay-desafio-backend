import { Knex } from "knex";
import createConn from "../../conn.js";
import TransferProps from "../../domain/transfer.js";
import ITransferRepo from "../TransferRepo.js";

export default class TransferRepositoryImpl implements ITransferRepo {
    trx: Knex.Transaction<any, any[]>;

    constructor(trx: Knex.Transaction<any, any[]>) {
        this.trx = trx;
    }

    public async findTransferById(transferId: number): Promise<TransferProps | undefined> {

        const transfer = await this.trx('transfers')
            .select(
                'transfers.id_transfer',
                'transfers.amount',
                'transfers.created_at'
            )
            .where('transfers.id_transfer', transferId)
            .first();

        if (!transfer) return undefined;

        return transfer;
    }


    public async findTransferByUserId(userId: number, page: number, limit: number): Promise<TransferProps[] | undefined> {
        if (page < 1)
            page = 1;

        if (limit < 1)
            limit = 1;

        const transfers: TransferProps[] = await this.trx('transfers')
            .select('transfers.id_transfer', 'transfers.amount', 'transfers.created_at',
                'transfers.id_payer', 'user_payer.name', 'user_payer.cpf_cnpj', 'user_payer.person_type',
                'transfers.id_payee', 'user_payee.name', 'user_payee.cpf_cnpj', 'user_payee.person_type')
            .limit((limit * page))
            .offset((limit * page) - limit)
            .orderBy('transfers.created_at', 'asc')
            .where('id_payer', userId)
            .orWhere('id_payee', userId)
            .innerJoin('users as user_payer', 'user_payer.id_user', 'transfers.id_payer')
            .innerJoin('users as user_payee', 'user_payee.id_user', 'transfers.id_payee');
        return transfers;
    }

    public async findTransferByPayerId(userId: number, page: number, limit: number): Promise<TransferProps[] | undefined> {
        if (page < 1)
            page = 1;

        if (limit < 1)
            limit = 1;

        const transfers: TransferProps[] = await this.trx('transfers')
            .select('transfers.id_transfer', 'transfers.amount', 'transfers.created_at',
                'transfers.id_payer', 'user_payer.name', 'user_payer.cpf_cnpj', 'user_payer.person_type',
                'transfers.id_payee', 'user_payee.name', 'user_payee.cpf_cnpj', 'user_payee.person_type')
            .limit((limit * page))
            .offset((limit * page) - limit)
            .orderBy('transfers.created_at', 'asc')
            .where('id_payer', userId)
            .innerJoin('users as user_payer', 'user_payer.id_user', 'transfers.id_payer')
            .innerJoin('users as user_payee', 'user_payee.id_user', 'transfers.id_payee');
        return transfers;
    }

    public async findTransferByPayeeId(userId: number, page: number, limit: number): Promise<TransferProps[] | undefined> {
        if (page < 1)
            page = 1;

        if (limit < 1)
            limit = 1;

        const transfers: TransferProps[] = await this.trx('transfers')
            .select('transfers.id_transfer', 'transfers.amount', 'transfers.created_at',
                'transfers.id_payer', 'user_payer.name', 'user_payer.cpf_cnpj', 'user_payer.person_type',
                'transfers.id_payee', 'user_payee.name', 'user_payee.cpf_cnpj', 'user_payee.person_type')
            .limit((limit * page))
            .offset((limit * page) - limit)
            .orderBy('transfers.created_at', 'asc')
            .where('id_payee', userId)
            .innerJoin('users as user_payer', 'user_payer.id_user', 'transfers.id_payer')
            .innerJoin('users as user_payee', 'user_payee.id_user', 'transfers.id_payee');
        return transfers;
    }

    public async createTransfer(props: TransferProps): Promise<TransferProps | undefined> {
        const userId: TransferProps = await this.trx('transfers')
            .insert(props);

        return userId;
    }
}