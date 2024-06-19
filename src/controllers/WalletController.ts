import { Response, response } from "express";
import { TRequest } from "../types/TRequest.js";
import sendResponse from "../utils/response.js";

import Controller from "./Controller.js";
import IWalletRepo from "../database/repos/WalletRepo.js";
import WalletRepositoryImpl from "../database/repos/implementation/WalletRepositoryImpl.js";

import ListWalletById from "../usecases/ListWalletById.js";
import ListWalletByUserId from "../usecases/ListWalletByUserId.js";
import EditWallet from "../usecases/EditWallet.js";

import { UserNotAuthorizedError } from "../errors/User.js";

export default class WalletController extends Controller {
    repository: IWalletRepo;

    constructor() {
        super();
    }

    public initRepository() {
        this.repository = new WalletRepositoryImpl(this.trx);
    }

    public async index(req: TRequest, res: Response): Promise<Response> {
        return response;
    }

    public async show(req: TRequest, res: Response): Promise<Response> {
        const id_wallet = Number(req.params.id) ?? 0;
        const id_user = Number(req.params.id_user) ?? 0;

        const findWalletById = new ListWalletById(this.repository);
        const findWalletByUserId = new ListWalletByUserId(this.repository);

        if (id_wallet > 0)
            return await findWalletById.execute(id_wallet)
                .then(({ data, message }) => {
                    if (id_user != req.user?.id_user)
                        return sendResponse(req, res, 401, [], 'Usuário não autorizado para acessar esses dados!', new UserNotAuthorizedError('Usuário não autorizado para acessar esses dados!'));

                    const userWithHateoas = {
                        ...data, links: [
                            { rel: 'info', href: process.env.API_ADDRESS + '/user/' + data.id_user, method: 'GET' },
                            { rel: 'edit', href: process.env.API_ADDRESS + '/user/edit/' + data.id_user, method: 'PUT' },
                            { rel: 'delete', href: process.env.API_ADDRESS + '/user/delete/' + data.id_user, method: 'DELETE' },
                        ]
                    }
                    return sendResponse(req, res, 202, userWithHateoas, message)
                })
                .catch(err => sendResponse(req, res, 500, [], err.message, err));
        else
            return await findWalletByUserId.execute(id_user)
                .then(({ data, message }) => {
                    const userWithHateoas = {
                        ...data, links: [
                            { rel: 'info', href: process.env.API_ADDRESS + '/user/' + data.id_user, method: 'GET' },
                            { rel: 'edit', href: process.env.API_ADDRESS + '/user/edit/' + data.id_user, method: 'PUT' },
                            { rel: 'delete', href: process.env.API_ADDRESS + '/user/delete/' + data.id_user, method: 'DELETE' },
                        ]
                    }
                    return sendResponse(req, res, 202, userWithHateoas, message)
                })
                .catch(err => sendResponse(req, res, 500, [], err.message, err))
    }

    public async store(req: TRequest, res: Response): Promise<Response> {
        return response;
    }

    public async edit(req: TRequest, res: Response): Promise<Response> {
        return response;
    }

    public async destroy(req: TRequest, res: Response): Promise<Response> {
        return response;
    }
}