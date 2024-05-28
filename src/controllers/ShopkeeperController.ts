import { Request, Response, response } from "express";
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
import ListShopkeeperById from "../usecases/ListShopkeeperById.js";
import CreateShopkeeper from "../usecases/CreateShopkeeper.js";
import EditWallet from "../usecases/EditWallet.js";

import { UserNotFoundError, UserIncorrectPatternError, UserMissingDataError } from "../errors/User.js";
import { ShopkeeperMissingDataError, ShopkeeperNotFoundError } from '../errors/Shopkeeper.js';

dotenv.config();

export default class ShopkeeperController extends Controller {
    repository: IShopkeeperRepo;

    constructor() {
        super();

        this.repository = new ShopkeeperRepositoryImpl();
    }

    public async index(req: Request, res: Response): Promise<Response> {
        const listShopkeeper = new ListShopkeeper(this.repository);
        const { page, limit } = req.query;

        return await listShopkeeper.execute(Number(page ?? 1), Number(limit ?? 10))
            .then(({ data, message }) => {
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
    }

    public async store(req: Request, res: Response): Promise<Response> {
        const userRepository = new UserRepositoryImpl();
        const createUser = new CreateUser(userRepository);

        const walletRepository = new WalletRepositoryImpl();
        const editWallet = new EditWallet(walletRepository);

        const { name, email, password, cpf_cnpj, person_type } = req.body;

        let id_user = Number(req.params.id) ?? 0;

        try {
            if (id_user <= 0)
                id_user = await createUser.execute({ name, email, password, cpf_cnpj, person_type })
                    .then(async ({ data }) => data.id_user)
                    .catch(err => { throw err });

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

                    return sendResponse(req, res, 202, shopkeeperWithHateoas, message)
                })
                .catch(err => { throw err })
        } catch (err: any | Error | UserNotFoundError | UserIncorrectPatternError | UserMissingDataError | ShopkeeperMissingDataError | ShopkeeperNotFoundError) {
            return sendResponse(req, res, 500, [], err.message ?? '', err);
        }
    }

    public async show(req: Request, res: Response): Promise<Response> {
        const listShopkeeperById = new ListShopkeeperById(this.repository);

        const id = Number(req.params?.id);

        return await listShopkeeperById.execute(id)
            .then(({ data, message }) => sendResponse(req, res, 202, data, message))
            .catch(err => sendResponse(req, res, 500, [], err.message, err))
    }

    public async edit(req: Request, res: Response): Promise<Response> {
        return response;
    }

    public async destroy(req: Request, res: Response): Promise<Response> {
        return response;
    }
}