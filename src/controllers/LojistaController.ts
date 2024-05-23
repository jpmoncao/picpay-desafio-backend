import { Request, Response, response } from "express";
import dotenv from 'dotenv';

import Controller from "./Controller.js";
import LojistaProps from "../database/domain/lojista.js";
import ILojistaRepo from "../database/repos/LojistaRepo.js";
import LojistaRepositoryImpl from "../database/repos/implementation/LojistaRepositoryImpl.js";
import UserRepositoryImpl from "../database/repos/implementation/UserRepositoryImpl.js";

import CreateUser from "../usecases/CreateUser.js";
import ListLojista from "../usecases/ListLojistas.js";
import ListLojistaById from "../usecases/ListLojistaById.js";
import CreateLojista from "../usecases/CreateLojista.js";

import sendResponse from "../utils/response.js";
import UserProps from "../database/domain/user.js";
import { UserNotFoundError, UserIncorrectPatternError, UserMissingDataError } from "../errors/User.js";
import { LojistaMissingDataError, LojistaNotFoundError } from '../errors/Lojista.js';

dotenv.config();

export default class UserController extends Controller {
    repository: ILojistaRepo;

    constructor() {
        super();

        this.repository = new LojistaRepositoryImpl();
    }

    public async index(req: Request, res: Response): Promise<Response> {
        const listLojista = new ListLojista(this.repository);
        const { page, limit } = req.query;

        return await listLojista.execute(Number(page ?? 1), Number(limit ?? 10))
            .then(({ data, message }) => {
                const lojistaWithHateoas = data.map((user: LojistaProps) => {
                    return {
                        ...user, links: [
                            { rel: 'info', href: process.env.API_ADDRESS + '/user/' + user.id_user, method: 'GET' }
                        ]
                    }
                })

                return sendResponse(req, res, 202, lojistaWithHateoas, message)
            })
            .catch(err => sendResponse(req, res, 500, [], err.message, err))
    }

    public async store(req: Request, res: Response): Promise<Response> {
        const userRepository = new UserRepositoryImpl();
        const createUser = new CreateUser(userRepository);

        const { nome, email, senha, cpf_cnpj, tipo_pessoa } = req.body;

        let id_user = 0;

        try {
            await createUser.execute({ nome, email, senha, cpf_cnpj, tipo_pessoa })
                .then(async ({ data }) => data.id_user)
                .catch(err => { throw err });

            const createLojista = new CreateLojista(this.repository);
            return await createLojista.execute({ id_user })
                .then(({ data, message }) => {
                    const lojistaWithHateoas = {
                        ...data, links: [
                            { rel: 'info', href: process.env.API_ADDRESS + '/user/' + id_user, method: 'GET' },
                        ]
                    }

                    return sendResponse(req, res, 202, lojistaWithHateoas, message)
                })
                .catch(err => { throw err })
        } catch (err: any | Error | UserNotFoundError | UserIncorrectPatternError | UserMissingDataError | LojistaMissingDataError | LojistaNotFoundError) {
            return sendResponse(req, res, 500, [], err.message ?? '', err);
        }
    }

    public async show(req: Request, res: Response): Promise<Response> {
        const listLojistaById = new ListLojistaById(this.repository);

        const id = Number(req.params?.id);

        return await listLojistaById.execute(id)
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