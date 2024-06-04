import { Response, response } from "express";
import { TRequest } from "../types/TRequest.js";
import sendResponse from "../utils/response.js";

import WalletProps from "../database/domain/wallet.js";

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
import CreateTransfer from "../usecases/CreateTransfer.js";

import { UserNotFoundError } from "../errors/User.js";
import { WalletHasInsufficientAmountError, WalletNotFoundError } from "../errors/Wallet.js";
import { TransferNotFoundError, TransferMissingDataError, TransferShopkeeperPayerError, TransferPayerIsEqualPayeeError, TransferAmountIsInvalidError } from '../errors/Transfer.js';

export default class TransferController extends Controller {
    repository: ITransferRepo;

    constructor() {
        super();
    }

    public async init() {
        this.trx = await this.initTransition();
        this.repository = new TransferRepositoryImpl(this.trx);
    }

    public async index(req: TRequest, res: Response): Promise<Response> {
        return response;
    }

    public async show(req: TRequest, res: Response): Promise<Response> {
        return response;
    }

    public async store(req: TRequest, res: Response): Promise<Response> {
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
            const createTransfer = new CreateTransfer(this.repository);

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

            const userPayerIsShopkeeper: boolean = await listShopkeeperByUserId.execute(userPayerId)
                .then(({ data }) => data.id_user && data.id_user > 0)
                .catch(err => false);

            if (userPayerIsShopkeeper)
                throw new TransferShopkeeperPayerError('O usuário pagador é cadastrado como lojista, tendo permissão apenas para receber transferências!');

            if (amountValue <= 0)
                throw new TransferAmountIsInvalidError('O valor da transferência é invalido! Deve ser maior que zero.')

            let userPayerWallet: WalletProps | undefined = await listWalletByUserId.execute(userPayerId)
                .then(({ data }) => data)
                .catch(err => undefined);

            if (!userPayerWallet)
                throw new WalletNotFoundError('A carteira do pagador não está ativa ou ainda não existe!');

            let userPayeeWallet: WalletProps | undefined = await listWalletByUserId.execute(userPayeeId)
                .then(({ data }) => data)
                .catch(err => undefined);

            if (!userPayeeWallet)
                throw new WalletNotFoundError('A carteira do recebedor não está ativa ou ainda não existe!');

            if (amountValue > (userPayerWallet.balance ?? 0))
                throw new WalletHasInsufficientAmountError('Não há saldo suficiente na carteira do pagador!');

            const newTransfer = await createTransfer.execute({ id_payer: userPayerId, id_payee: userPayeeId, amount: amountValue })
                .then(({ data }) => data)
                .catch(err => []);

            if (userPayerWallet && userPayerWallet.balance !== undefined && userPayerWallet.balance !== null)
                userPayerWallet.balance = Number(userPayerWallet.balance) - amountValue;


            if (userPayeeWallet && userPayeeWallet.balance !== undefined && userPayeeWallet.balance !== null)
                userPayeeWallet.balance = Number(userPayeeWallet.balance) + amountValue;

            await new EditWallet(walletRepository).execute(userPayerWallet);
            await new EditWallet(walletRepository).execute(userPayeeWallet);

            this.trx.commit();

            const newTransferWithHATEOAS = {
                ...newTransfer,
                payer: {
                    links: [
                        { rel: 'show-payer', href: process.env.API_ADDRESS + '/users/' + userPayerWallet.id_user, method: 'GET' },
                        { rel: 'show-payer-wallet', href: process.env.API_ADDRESS + '/wallets/user/' + userPayerWallet.id_user, method: 'GET' },
                        { rel: 'show-payer-transfer', href: process.env.API_ADDRESS + '/transfers/user/' + userPayerWallet.id_user, method: 'GET' },
                    ]
                },
                payee: {
                    links: [
                        { rel: 'show-payee', href: process.env.API_ADDRESS + '/users/' + userPayeeWallet.id_user, method: 'GET' },
                        { rel: 'show-payee-wallet', href: process.env.API_ADDRESS + '/wallets/user/' + userPayeeWallet.id_user, method: 'GET' },
                        { rel: 'show-payee-transfer', href: process.env.API_ADDRESS + '/transfers/user/' + userPayeeWallet.id_user, method: 'GET' },
                    ]
                },
            }
            return sendResponse(req, res, 202, newTransferWithHATEOAS, 'Transferência efetuada com sucesso!');
        } catch (error:
            any |
            Error |
            TransferNotFoundError |
            TransferMissingDataError |
            TransferShopkeeperPayerError |
            TransferPayerIsEqualPayeeError |
            TransferAmountIsInvalidError
        ) {
            this.trx.rollback(error);
            return sendResponse(req, res, 500, [], error?.message ?? '', error)
        }
    }

    public async edit(req: TRequest, res: Response): Promise<Response> {
        return response;
    }

    public async destroy(req: TRequest, res: Response): Promise<Response> {
        return response;
    }
}