import { Knex } from "knex";
import createConn from "../../conn.js";
import TransferProps from "../../domain/transfer.js";
import ITransferRepo from "../TransferRepo.js";
import { maskCpfCnpj } from "../../../utils/mask.js";

export default class TransferRepositoryImpl implements ITransferRepo {
    trx: Knex.Transaction<any, any[]>;

    constructor(trx: Knex.Transaction<any, any[]>) {
        this.trx = trx;
    }

    public async findTransferById(transferId: number): Promise<any | undefined> {

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


    public async findTransferByUserId(userId: number, page: number, limit: number): Promise<any[] | undefined> {
        if (page < 1)
            page = 1;

        if (limit < 1)
            limit = 1;

        const transfers = await this.trx('transfers')
            .select('transfers.id_transfer',
                'transfers.amount',
                'transfers.created_at',
                'transfers.id_payer',
                'user_payer.name as name_payer',
                'user_payer.cpf_cnpj as cpf_cnpj_payer',
                'user_payer.person_type as person_type_payer',
                'transfers.id_payee',
                'user_payee.name as name_payee',
                'user_payee.cpf_cnpj as cpf_cnpj_payee',
                'user_payee.person_type as person_type_payee'
            )
            .innerJoin('users as user_payer', 'user_payer.id_user', 'transfers.id_payer')
            .innerJoin('users as user_payee', 'user_payee.id_user', 'transfers.id_payee')
            .where('user_payer.id_user', userId)
            .orWhere('user_payee.id_user', userId)
            .orderBy('transfers.created_at', 'asc')
            .limit((limit * page))
            .offset((limit * page) - limit);

        const data = transfers.map(transfer => {
            const payer = {
                id_payer: transfer.id_payer,
                name: transfer.name_payer,
                cpf_cnpj: userId != transfer.id_payer ? maskCpfCnpj(transfer.cpf_cnpj_payer) : transfer.cpf_cnpj_payer,
                person_type: transfer.person_type_payer,
            }

            const payee = {
                id_payee: transfer.id_payee,
                name: transfer.name_payee,
                cpf_cnpj: userId != transfer.id_payee ? maskCpfCnpj(transfer.cpf_cnpj_payee) : transfer.cpf_cnpj_payee,
                person_type: transfer.person_type_payee
            }

            return {
                id_transfer: transfer.id_transfer,
                amount: transfer.amount,
                created_at: transfer.created_at,
                payer,
                payee
            }
        });

        return data;
    }

    public async findTransferByPayerId(userId: number, page: number, limit: number): Promise<TransferProps[] | undefined> {
        if (page < 1)
            page = 1;

        if (limit < 1)
            limit = 10;

        const transfers: any[] = await this.trx('transfers')
            .select('transfers.id_transfer',
                'transfers.amount',
                'transfers.created_at',
                'transfers.id_payer',
                'user_payer.name as name_payer',
                'user_payer.cpf_cnpj as cpf_cnpj_payer',
                'user_payer.person_type as person_type_payer',
                'transfers.id_payee',
                'user_payee.name as name_payee',
                'user_payee.cpf_cnpj as cpf_cnpj_payee',
                'user_payee.person_type as person_type_payee'
            )
            .innerJoin('users as user_payer', 'user_payer.id_user', 'transfers.id_payer')
            .innerJoin('users as user_payee', 'user_payee.id_user', 'transfers.id_payee')
            .where('transfers.id_payer', userId)
            .orderBy('transfers.created_at', 'asc')
            .limit((limit * page))
            .offset((limit * page) - page);

        const data = transfers.map(transfer => {
            const payer = {
                id_payer: transfer.id_payer,
                name: transfer.name_payer,
                cpf_cnpj: transfer.cpf_cnpj_payer,
                person_type: transfer.person_type_payer,
            }

            const payee = {
                id_payee: transfer.id_payee,
                name: transfer.name_payee,
                cpf_cnpj: maskCpfCnpj(transfer.cpf_cnpj_payee),
                person_type: transfer.person_type_payee
            }

            return {
                id_transfer: transfer.id_transfer,
                amount: transfer.amount,
                created_at: transfer.created_at,
                payer,
                payee
            }
        });

        return data;
    }

    public async findTransferByPayeeId(userId: number, page: number, limit: number): Promise<any[] | undefined> {

        if (page < 1)
            page = 1;

        if (limit < 1)
            limit = 10;

        const transfers: any[] = await this.trx('transfers')
            .select('transfers.id_transfer',
                'transfers.amount',
                'transfers.created_at',
                'transfers.id_payer',
                'user_payer.name as name_payer',
                'user_payer.cpf_cnpj as cpf_cnpj_payer',
                'user_payer.person_type as person_type_payer',
                'transfers.id_payee',
                'user_payee.name as name_payee',
                'user_payee.cpf_cnpj as cpf_cnpj_payee',
                'user_payee.person_type as person_type_payee'
            )
            .innerJoin('users as user_payer', 'user_payer.id_user', 'transfers.id_payer')
            .innerJoin('users as user_payee', 'user_payee.id_user', 'transfers.id_payee')
            .where('transfers.id_payee', userId)
            .orderBy('transfers.created_at', 'asc')
            .limit((limit * page))
            .offset((limit * page) - page);

        const data = transfers.map(transfer => {
            const payer = {
                id_payer: transfer.id_payer,
                name: transfer.name_payer,
                cpf_cnpj: maskCpfCnpj(transfer.cpf_cnpj_payer),
                person_type: transfer.person_type_payer,
            }

            const payee = {
                id_payee: transfer.id_payee,
                name: transfer.name_payee,
                cpf_cnpj: transfer.cpf_cnpj_payee,
                person_type: transfer.person_type_payee
            }

            return {
                id_transfer: transfer.id_transfer,
                amount: transfer.amount,
                created_at: transfer.created_at,
                payer,
                payee
            }
        });

        return data;
    }

    public async createTransfer(props: TransferProps): Promise<TransferProps | undefined> {
        const transfer: TransferProps = await this.trx('transfers')
            .insert(props);

        return transfer;
    }
}