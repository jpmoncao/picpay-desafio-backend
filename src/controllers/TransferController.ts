import { Request, Response, response } from "express";
import sendResponse from "../utils/response.js";

import Controller from "./Controller.js";
import ITransferRepo from "../database/repos/TransferRepo.js";

import TransferRepositoryImpl from "../database/repos/implementation/TransferRepositoryImpl.js";
import UserRepositoryImpl from "../database/repos/implementation/UserRepositoryImpl.js";
import WalletRepositoryImpl from "../database/repos/implementation/WalletRepositoryImpl.js";
import ShopkeeperRepositoryImpl from "../database/repos/implementation/ShopkeeperRepositoryImpl.js";

import ListUserById from "../usecases/ListUserById.js";
import ListShopkeeperByUserId from "../usecases/ListShopkeeperByUserId.js";
import ListWalletByUserId from "../usecases/ListWalletByUserId.js";
import EditWallet from "../usecases/EditWallet.js";

import { TransferNotFoundError, TransferMissingDataError, TransferShopkeeperPayerError, TransferPayerIsEqualPayeeError, TransferAmountIsInvalidError } from '../errors/Transfer.js';
import { UserNotFoundError } from "../errors/User.js";

export default class TransferController extends Controller {
    repository: ITransferRepo;

    constructor() {
        super();
    }

    public async init() {
        this.trx = await this.initTransition();
        this.repository = new TransferRepositoryImpl(this.trx);
    }

    public async index(req: Request, res: Response): Promise<Response> {
        return response;
    }

    public async show(req: Request, res: Response): Promise<Response> {
        return response;
    }

    public async store(req: Request, res: Response): Promise<Response> {
        await this.init();

        const { id_payer, id_payee, amount } = req.body;
        const amountValue = Number(amount ?? 0);

        try {
            const userRepository = new UserRepositoryImpl(this.repository.trx);
            const walletRepository = new WalletRepositoryImpl(this.repository.trx);
            const shopkeeperRepository = new ShopkeeperRepositoryImpl(this.repository.trx);

            const listUserById = new ListUserById(userRepository);
            const listShopkeeperByUserId = new ListShopkeeperByUserId(shopkeeperRepository);
            const listWalletByUserId = new ListWalletByUserId(walletRepository);
            const editWallet = new EditWallet(walletRepository);
            // const createTransfer = new CreateTransfer(this.repository);

            const userPayerId: number = await listUserById.execute(id_payer)
                .then(({ data }) => data.id_user)
                .catch(err => 0);
            const userPayeeId: number = await listUserById.execute(id_payee)
                .then(({ data }) => data.id_user)
                .catch(err => 0);

            if (!userPayerId && userPayeeId <= 0)
                throw new UserNotFoundError('O usuário pagador não existe!');
            if (!userPayeeId && userPayeeId <= 0)
                throw new UserNotFoundError('O usuário recebedor não existe!');
            if (userPayerId === userPayeeId)
                throw new TransferPayerIsEqualPayeeError('O usuário pagador e recebedor são iguais!');

            const userPayerIsShopkeeper: boolean = await listShopkeeperByUserId.execute(userPayeeId)
                .then(({ data }) => data.id_user && data.id_user > 0)
                .catch(err => false);

            if (userPayerIsShopkeeper)
                throw new TransferShopkeeperPayerError('O usuário pagador é cadastrado como lojista, tendo permissão apenas para receber transferências!');

            if (amountValue <= 0)
                throw new TransferAmountIsInvalidError('O valor da transferência é invalido! Deve ser maior que zero.')


            this.trx.commit();
            return sendResponse(req, res, 202, [], 'Transferência efetuada com sucesso!');
        } catch (error:
            any |
            Error |
            TransferNotFoundError |
            TransferMissingDataError |
            TransferShopkeeperPayerError |
            TransferPayerIsEqualPayeeError |
            TransferAmountIsInvalidError
        ) {
            this.trx.rollback();
            return sendResponse(req, res, 500, [], error?.message ?? '', error)
        }
    }

    public async edit(req: Request, res: Response): Promise<Response> {
        return response;
    }

    public async destroy(req: Request, res: Response): Promise<Response> {
        return response;
    }
}