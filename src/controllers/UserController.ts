import { Response } from "express";
import { TRequest } from "../types/TRequest.js";
import dotenv from 'dotenv';

import Controller from "./Controller.js";
import UserProps from "../database/domain/user.js";
import IUserRepo from "../database/repos/UserRepo.js";
import UserRepositoryImpl from "../database/repos/implementation/UserRepositoryImpl.js";
import WalletRepositoryImpl from "../database/repos/implementation/WalletRepositoryImpl.js";

import ListUser from "../usecases/ListUsers.js";
import ListUserById from "../usecases/ListUserById.js";
import CreateUser from "../usecases/CreateUser.js";
import EditUser from "../usecases/EditUser.js";
import DeleteUser from "../usecases/DeleteUser.js";
import CreateWallet from "../usecases/CreateWallet.js";
import AuthenticateUser from "../usecases/AuthenticateUser.js";

import sendResponse from "../utils/response.js";
import { UserMissingDataError, UserNotAuthorizedError } from "../errors/User.js";
import handleHATEOAS from "../utils/hateoas.js";

dotenv.config();

export default class UserController extends Controller {
    repository: IUserRepo;

    constructor() {
        super();
    }

    public async init() {
        this.trx = await this.initTransition();
        this.repository = new UserRepositoryImpl(this.trx);
    }

    public async index(req: TRequest, res: Response): Promise<Response> {
        await this.init();

        const listUser = new ListUser(this.repository);
        const page = Number(req.query.page ?? 10);
        const limit = Number(req.query.limit ?? 10);

        return await listUser.execute(page, limit)
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

                const userWithHateoas = data.map((user: UserProps) => {
                    return {
                        ...user, links: [
                            { rel: 'info', href: process.env.API_ADDRESS + '/user/' + user.id_user, method: 'GET' },
                            { rel: 'edit', href: process.env.API_ADDRESS + '/user/edit/' + user.id_user, method: 'PUT' },
                            { rel: 'delete', href: process.env.API_ADDRESS + '/user/delete/' + user.id_user, method: 'DELETE' },
                        ]
                    }
                })

                return sendResponse(req, res, 202, userWithHateoas, message)
            })
            .catch(err => sendResponse(req, res, 500, [], err.message, err))
    }

    public async store(req: TRequest, res: Response): Promise<Response> {
        await this.init();

        const walletRepository = new WalletRepositoryImpl(this.trx);

        const createUser = new CreateUser(this.repository);
        const createWallet = new CreateWallet(walletRepository);

        const { id_user, name, email, password, cpf_cnpj, person_type } = req.body;

        return await createUser.execute({ id_user, name, email, password, cpf_cnpj, person_type })
            .then(async ({ data, message }) => {
                const userWithHateoas = {
                    ...data, links: [
                        { rel: 'info', href: process.env.API_ADDRESS + '/user/' + data.id_user, method: 'GET' },
                        { rel: 'edit', href: process.env.API_ADDRESS + '/user/edit/' + data.id_user, method: 'PUT' },
                        { rel: 'delete', href: process.env.API_ADDRESS + '/user/delete/' + data.id_user, method: 'DELETE' },
                        { rel: 'wallet', href: process.env.API_ADDRESS + '/wallet/user/' + data.id_user, method: 'GET' },
                    ]
                }

                await createWallet.execute({ id_user: data.id_user });

                this.trx.commit();
                return sendResponse(req, res, 202, userWithHateoas, message)
            })
            .catch(err => {
                this.trx.rollback();
                return sendResponse(req, res, 500, [], err.message, err)
            })
    }

    public async edit(req: TRequest, res: Response): Promise<Response> {
        await this.init();

        const editUser = new EditUser(this.repository);

        const id_user = Number(req.params.id);
        const { name, email, password, cpf_cnpj, person_type } = req.body;

        return await editUser.execute({ id_user, name, email, password, cpf_cnpj, person_type })
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

                this.trx.commit();
                return sendResponse(req, res, 202, userWithHateoas, message)
            })
            .catch(err => {
                this.trx.rollback();
                return sendResponse(req, res, 500, [], err.message, err)
            })
    }

    public async destroy(req: TRequest, res: Response): Promise<Response> {
        await this.init();

        const deleteUser = new DeleteUser(this.repository);

        const id = Number(req.params.id);
        const { name, username, password } = req.body;

        return await deleteUser.execute({ id, name, username, password })
            .then(({ data, message }) => {
                this.trx.commit();
                return sendResponse(req, res, 202, data, message);
            })
            .catch(err => {
                this.trx.rollback();
                return sendResponse(req, res, 500, [], err.message, err);
            })
    }

    public async show(req: TRequest, res: Response): Promise<Response> {
        await this.init();

        const listUserById = new ListUserById(this.repository);

        const id = Number(req.params?.id);
        if (!id)
            return sendResponse(req, res, 404, [], 'O ID não foi encontrado!', new UserMissingDataError('O ID não foi encontrado!'));

        return await listUserById.execute(id)
            .then(({ data, message }) => {
                if (id != req.user?.id_user)
                    return sendResponse(req, res, 401, [], 'Usuário não autorizado para acessar esses dados!', new UserNotAuthorizedError('Usuário não autorizado para acessar esses dados!'));

                const userWithHateoas = {
                    ...data, links: [
                        { rel: 'edit', href: process.env.API_ADDRESS + '/user/edit/' + data.id_user, method: 'PUT' },
                        { rel: 'delete', href: process.env.API_ADDRESS + '/user/delete/' + data.id_user, method: 'DELETE' },
                    ]
                }

                return sendResponse(req, res, 202, userWithHateoas, message)
            })
            .catch(err => sendResponse(req, res, 500, [], err.message, err))
    }

    public async login(req: TRequest, res: Response): Promise<Response> {
        await this.init();

        const authenticateUser = new AuthenticateUser(this.repository);
        const { email, password } = req.body;

        return await authenticateUser.execute({ email, password })
            .then(({ data, message }) => {
                const userWithHateoas = {
                    ...data, links: [
                        { rel: 'edit', href: process.env.API_ADDRESS + '/user/edit/' + data.id_user, method: 'PUT' },
                        { rel: 'delete', href: process.env.API_ADDRESS + '/user/delete/' + data.id_user, method: 'DELETE' },
                    ]
                }

                return sendResponse(req, res, 202, userWithHateoas, message)
            })
            .catch(err => sendResponse(req, res, 500, [], err.message, err))
    }

}