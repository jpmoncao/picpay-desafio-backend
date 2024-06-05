import { Response, response } from "express";
import { TRequest } from "../types/TRequest.js";
import sendResponse from "../utils/response.js";
import dotenv from 'dotenv';

import Controller from "./Controller.js";
import ShopkeeperProps from "../database/domain/shopkeeper.js";
import IShopkeeperRepo from "../database/repos/ShopkeeperRepo.js";
import ShopkeeperRepositoryImpl from "../database/repos/implementation/ShopkeeperRepositoryImpl.js";
import UserRepositoryImpl from "../database/repos/implementation/UserRepositoryImpl.js";
import WalletRepositoryImpl from "../database/repos/implementation/WalletRepositoryImpl.js";

import CreateUser from "../usecases/CreateUser.js";
import ListShopkeeper from "../usecases/ListShopkeepers.js";
import ListShopkeeperById from "../usecases/ListShopkeeperByUserId.js";
import CreateShopkeeper from "../usecases/CreateShopkeeper.js";
import EditWallet from "../usecases/EditWallet.js";

import { UserNotFoundError, UserIncorrectPatternError, UserMissingDataError, UserNotAuthorizedError } from "../errors/User.js";
import { ShopkeeperMissingDataError, ShopkeeperNotFoundError } from '../errors/Shopkeeper.js';
import handleHATEOAS from "../utils/hateoas.js";

dotenv.config();

export default class ShopkeeperController extends Controller {
    repository: IShopkeeperRepo;

    constructor() {
        super();
    }

    public async init() {
        this.trx = await this.initTransition();
        this.repository = new ShopkeeperRepositoryImpl(this.trx);
    }

    public async index(req: TRequest, res: Response): Promise<Response> {
        await this.init();

        const page = Number(req.query.page ?? 10);
        const limit = Number(req.query.limit ?? 10);

        const listShopkeeper = new ListShopkeeper(this.repository);

        const resController: Response = await listShopkeeper.execute(page, limit)
            .then(({ data, message }) => {
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
                const hateoas = handleHATEOAS(`${process.env.API_ADDRESS}${req.baseUrl}`, linksHATEOAS);

                // Seta o cabeçalho de paginação
                res.set('X-Pagination', JSON.stringify(hateoas));
                res.set('X-Pagination-Pages', totalPages.toString());

                const shopkeeperWithHateoas = data.map((user: ShopkeeperProps) => {
                    return {
                        ...user, links: [
                            { rel: 'info', href: process.env.API_ADDRESS + '/user/' + user.id_user, method: 'GET' }
                        ]
                    }
                })

                return sendResponse(req, res, 202, shopkeeperWithHateoas, message)
            })
            .catch(err => sendResponse(req, res, 500, [], err.message, err))

        return resController;
    }

    public async store(req: TRequest, res: Response): Promise<Response> {
        await this.init();

        this.trx = await this.initTransition();
        this.repository = new ShopkeeperRepositoryImpl(this.trx);

        const userRepository = new UserRepositoryImpl(this.trx);
        const walletRepository = new WalletRepositoryImpl(this.trx);

        const createUser = new CreateUser(userRepository);
        const editWallet = new EditWallet(walletRepository);

        let id_user = Number(req.params.id ?? 0);
        const { name, email, password, cpf_cnpj, person_type } = req.body;

        try {
            if (id_user <= 0)
                id_user = await createUser.execute({ name, email, password, cpf_cnpj, person_type })
                    .then(async ({ data }) => data.id_user)
                    .catch(err => { throw err })
            else if (id_user != req.user?.id_user)
                throw new UserNotAuthorizedError('Usuário não autorizado para acessar esses dados!');

            const createShopkeeper = new CreateShopkeeper(this.repository);
            return await createShopkeeper.execute({ id_user })
                .then(({ data, message }) => {
                    const shopkeeperWithHateoas = {
                        ...data, links: [
                            { rel: 'info', href: process.env.API_ADDRESS + '/user/' + id_user, method: 'GET' },
                            { rel: 'wallet', href: process.env.API_ADDRESS + '/wallet/user/' + id_user, method: 'GET' },
                        ]
                    }

                    editWallet.execute({ id_user, shopkeeper: true })

                    this.trx.commit();
                    return sendResponse(req, res, 202, shopkeeperWithHateoas, message)
                })
                .catch(err => { throw err })
        } catch (err: any | Error | UserNotFoundError | UserIncorrectPatternError | UserMissingDataError | ShopkeeperMissingDataError | ShopkeeperNotFoundError) {
            this.trx.rollback();

            return sendResponse(req, res, 500, [], err.message ?? '', err)
        }
    }

    public async show(req: TRequest, res: Response): Promise<Response> {
        await this.init();

        const listShopkeeperById = new ListShopkeeperById(this.repository);

        const id = Number(req.params?.id);

        return await listShopkeeperById.execute(id)
            .then(({ data, message }) => {
                if (data?.id_user != req.user?.id_user)
                    return sendResponse(req, res, 401, [], 'Usuário não autorizado para acessar esses dados!', new UserNotAuthorizedError('Usuário não autorizado para acessar esses dados!'));
                return sendResponse(req, res, 202, data, message)
            })
            .catch(err => sendResponse(req, res, 500, [], err.message, err))
    }

    public async edit(req: TRequest, res: Response): Promise<Response> {
        return response;
    }

    public async destroy(req: TRequest, res: Response): Promise<Response> {
        return response;
    }
}