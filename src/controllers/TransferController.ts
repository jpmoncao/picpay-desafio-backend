import { Response, response } from "express";
import { TRequest } from "../types/TRequest.js";
import sendResponse from "../utils/response.js";

import UserProps from "../database/domain/user.js";
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
import ListTransfersByUserId from "../usecases/ListTransfersByUserId.js";
import ListTransfersByPayerId from "../usecases/ListTransfersByPayerId.js";
import ListTransfersByPayeeId from "../usecases/ListTransfersByPayeeId.js";
import SendMailToTransfer from "../usecases/SendMailToTransfer.js";

import { UserNotAuthorizedError, UserNotFoundError } from "../errors/User.js";
import { WalletHasInsufficientAmountError, WalletNotFoundError } from "../errors/Wallet.js";
import { TransferNotFoundError, TransferMissingDataError, TransferShopkeeperPayerError, TransferPayerIsEqualPayeeError, TransferAmountIsInvalidError } from '../errors/Transfer.js';
import handleHATEOAS from "../utils/hateoas.js";

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
        const page = Number(req.query?.page ?? 1);
        const limit = Number(req.query?.limit ?? 10);

        const id = Number(req.params.id ?? 0);

        if (!id)
            return sendResponse(req, res, 500, [], '', new TransferMissingDataError('É necessário passar o ID do usuário!'));

        let usecase: (
            ListTransfersByUserId |
            ListTransfersByPayerId |
            ListTransfersByPayeeId |
            undefined
        );

        if (req.url.includes('payer'))
            usecase = new ListTransfersByPayerId(this.repository);
        else if (req.url.includes('payee'))
            usecase = new ListTransfersByPayeeId(this.repository);
        else if (req.url.includes('user'))
            usecase = new ListTransfersByUserId(this.repository);

        let handleRes: Response = res;
        if (usecase)
            handleRes = await usecase.execute(id, page, limit)
                .then(({ data, message }) => {
                    if (id != req.user?.id_user)
                        return sendResponse(req, res, 401, [], '', new UserNotAuthorizedError('Usuário não autorizado para acessar esses dados!'));

                    // Obtém o total de páginas e remove o primeiro indice (total)
                    const totalPages = Math.ceil(data[0].total / limit);
                    data.shift()

                    // Coloca todos as direções possíveis da paginação em um array
                    let linksHATEOAS = [
                        { rel: 'first', route: `?page=1&limit=${limit}` },
                        { rel: 'last', route: `?page=${totalPages}&limit=${limit}` }
                    ];
                    if (page > 1)
                        linksHATEOAS.push({ rel: 'prev', route: `?page=${Math.max(page - 1, 1)}&limit=${limit}` });
                    if (page != totalPages)
                        linksHATEOAS.push({ rel: 'next', route: `?page=${Math.min(page + 1, totalPages)}&limit=${limit}` });

                    // Gera o HATEOAS de paginação
                    const hateoas = handleHATEOAS(`${process.env.API_ADDRESS}${req.baseUrl}/user/${id}`, linksHATEOAS);

                    // Seta o cabeçalho de paginação
                    res.set('X-Pagination', JSON.stringify(hateoas));

                    return sendResponse(req, res, 202, data, message);
                })
                .catch(err => sendResponse(req, res, 500, [], err.message ?? '', err));

        return handleRes;
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

            const userPayer: UserProps = await listUserById.execute(id_payer)
                .then(({ data }) => data)
                .catch(err => undefined);
            const userPayee: UserProps = await listUserById.execute(id_payee)
                .then(({ data }) => data)
                .catch(err => undefined);

            if (!userPayer.id_user && (userPayee?.id_user ?? 0) <= 0)
                throw new UserNotFoundError('O usuário pagador não existe!');
            if (!userPayee.id_user && (userPayee?.id_user ?? 0) <= 0)
                throw new UserNotFoundError('O usuário recebedor não existe!');
            if (userPayer.id_user === (userPayee?.id_user ?? 0))
                throw new TransferPayerIsEqualPayeeError('O usuário pagador e recebedor são iguais!');

            const userPayerIsShopkeeper: boolean = await listShopkeeperByUserId.execute(userPayer.id_user ?? 0)
                .then(({ data }) => data.id_user && data.id_user > 0)
                .catch(err => false);

            if (userPayerIsShopkeeper)
                throw new TransferShopkeeperPayerError('O usuário pagador é cadastrado como lojista, tendo permissão apenas para receber transferências!');

            if (amountValue <= 0)
                throw new TransferAmountIsInvalidError('O valor da transferência é invalido! Deve ser maior que zero.')

            let userPayerWallet: WalletProps | undefined = await listWalletByUserId.execute(userPayer.id_user ?? 0)
                .then(({ data }) => data)
                .catch(err => undefined);

            if (!userPayerWallet)
                throw new WalletNotFoundError('A carteira do pagador não está ativa ou ainda não existe!');

            let userPayeeWallet: WalletProps | undefined = await listWalletByUserId.execute(userPayee.id_user ?? 0)
                .then(({ data }) => data)
                .catch(err => undefined);

            if (!userPayeeWallet)
                throw new WalletNotFoundError('A carteira do recebedor não está ativa ou ainda não existe!');

            if (amountValue > (userPayerWallet.balance ?? 0))
                throw new WalletHasInsufficientAmountError('Não há saldo suficiente na carteira do pagador!');

            const newTransfer: any = await createTransfer.execute({ id_payer: userPayer.id_user ?? 0, id_payee: userPayee.id_user ?? 0, amount: amountValue })
                .then(({ data }) => data)
                .catch(err => []);

            if (userPayerWallet && userPayerWallet.balance !== undefined && userPayerWallet.balance !== null)
                userPayerWallet.balance = Number(userPayerWallet.balance) - amountValue;


            if (userPayeeWallet && userPayeeWallet.balance !== undefined && userPayeeWallet.balance !== null)
                userPayeeWallet.balance = Number(userPayeeWallet.balance) + amountValue;

            await new EditWallet(walletRepository).execute(userPayerWallet);
            await new EditWallet(walletRepository).execute(userPayeeWallet);

            this.trx.commit();

            new SendMailToTransfer().execute(newTransfer, userPayer, userPayee);

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