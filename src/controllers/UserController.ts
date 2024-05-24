import { Request, Response } from "express";
import dotenv from 'dotenv';

import Controller from "./Controller.js";
import UserProps from "../database/domain/user.js";
import IUserRepo from "../database/repos/UserRepo.js";
import UserRepositoryImpl from "../database/repos/implementation/UserRepositoryImpl.js";
import CarteiraRepositoryImpl from "../database/repos/implementation/CarteiraRepositoryImpl.js";

import ListUser from "../usecases/ListUsers.js";
import ListUserById from "../usecases/ListUserById.js";
import CreateUser from "../usecases/CreateUser.js";
import EditUser from "../usecases/EditUser.js";
import DeleteUser from "../usecases/DeleteUser.js";
import CreateCarteira from "../usecases/CreateCarteira.js";

import sendResponse from "../utils/response.js";

dotenv.config();

export default class UserController extends Controller {
    repository: IUserRepo;

    constructor() {
        super();

        this.repository = new UserRepositoryImpl();
    }

    public async index(req: Request, res: Response): Promise<Response> {
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
        const carteiraRepository = new CarteiraRepositoryImpl();

        const createUser = new CreateUser(this.repository);
        const createCarteira = new CreateCarteira(carteiraRepository);

        const { id_user, nome, email, senha, cpf_cnpj, tipo_pessoa } = req.body;

        return await createUser.execute({ id_user, nome, email, senha, cpf_cnpj, tipo_pessoa })
            .then(async ({ data, message }) => {
                const userWithHateoas = {
                    ...data, links: [
                        { rel: 'info', href: process.env.API_ADDRESS + '/user/' + data.id_user, method: 'GET' },
                        { rel: 'edit', href: process.env.API_ADDRESS + '/user/edit/' + data.id_user, method: 'PUT' },
                        { rel: 'delete', href: process.env.API_ADDRESS + '/user/delete/' + data.id_user, method: 'DELETE' },
                        { rel: 'wallet', href: process.env.API_ADDRESS + '/carteira/user/' + data.id_user, method: 'GET' },
                    ]
                }

                await createCarteira.execute({ id_user: data.id_user });

                return sendResponse(req, res, 202, userWithHateoas, message)
            })
            .catch(err => sendResponse(req, res, 500, [], err.message, err))
    }

    public async edit(req: Request, res: Response): Promise<Response> {
        const editUser = new EditUser(this.repository);

        const id_user = Number(req.params.id);
        const { nome, email, senha, cpf_cnpj, tipo_pessoa } = req.body;

        return await editUser.execute({ id_user, nome, email, senha, cpf_cnpj, tipo_pessoa })
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

    public async destroy(req: Request, res: Response): Promise<Response> {
        const deleteUser = new DeleteUser(this.repository);

        const id = Number(req.params.id);
        const { name, username, password } = req.body;

        return await deleteUser.execute({ id, name, username, password })
            .then(({ data, message }) => sendResponse(req, res, 202, data, message))
            .catch(err => sendResponse(req, res, 500, [], err.message, err))
    }

    public async show(req: Request, res: Response): Promise<Response> {
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