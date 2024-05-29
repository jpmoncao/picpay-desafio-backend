import { Request, Response } from "express";
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

import sendResponse from "../utils/response.js";

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

    public async index(req: Request, res: Response): Promise<Response> {
        await this.init();

        const listUser = new ListUser(this.repository);
        const { page, limit } = req.query;

        return await listUser.execute(Number(page ?? 1), Number(limit ?? 10))
            .then(({ data, message }) => {
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

    public async store(req: Request, res: Response): Promise<Response> {
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

    public async edit(req: Request, res: Response): Promise<Response> {
        await this.init();

        const editUser = new EditUser(this.repository);

        const id_user = Number(req.params.id);
        const { name, email, password, cpf_cnpj, person_type } = req.body;

        return await editUser.execute({ id_user, name, email, password, cpf_cnpj, person_type })
            .then(({ data, message }) => {
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

    public async destroy(req: Request, res: Response): Promise<Response> {
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

    public async show(req: Request, res: Response): Promise<Response> {
        await this.init();

        const listUserById = new ListUserById(this.repository);

        const id = Number(req.params?.id);

        return await listUserById.execute(id)
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