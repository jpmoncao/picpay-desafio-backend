import { Request, Response, response } from "express";
import sendResponse from "../utils/response.js";

import Controller from "./Controller.js";
import ICarteiraRepo from "../database/repos/CarteiraRepo.js";
import CarteiraRepositoryImpl from "../database/repos/implementation/CarteiraRepositoryImpl.js";

import ListCarteiraById from "../usecases/ListCarteiraById.js";
import ListCarteiraByUserId from "../usecases/ListCarteiraByUserId.js";
import EditCarteira from "../usecases/EditCarteira.js";

export default class CarteiraController extends Controller {
    repository: ICarteiraRepo;

    constructor() {
        super();

        this.repository = new CarteiraRepositoryImpl();
    }

    public async index(req: Request, res: Response): Promise<Response> {
        return response;
    }

    public async show(req: Request, res: Response): Promise<Response> {
        const id_carteira = Number(req.params.id) ?? 0;
        const id_user = Number(req.params.id_user) ?? 0;

        const findCarteiraById = new ListCarteiraById(this.repository);
        const findCarteiraByUserId = new ListCarteiraByUserId(this.repository);

        if (id_carteira > 0)
            return await findCarteiraById.execute(id_carteira)
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
                .catch(err => sendResponse(req, res, 500, [], err.message, err));
        else
            return await findCarteiraByUserId.execute(id_user)
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

    public async store(req: Request, res: Response): Promise<Response> {
        return response;
    }

    public async edit(req: Request, res: Response): Promise<Response> {
        const id_carteira: number | undefined = Number(req.params.id) ?? 0;
        const id_user: number | undefined = Number(req.params.id_user) ?? 0;
        const saldo: number | undefined = parseFloat(req.body.saldo) ?? undefined;

        const editCarteira = new EditCarteira(this.repository);

        if (id_carteira > 0)
            return await editCarteira.execute({ id_user, id_carteira, saldo })
                .then(({ data, message }) => sendResponse(req, res, 202, data, message))
                .catch(err => sendResponse(req, res, 500, [], err.message, err));
        else
            return await editCarteira.execute({ id_user, id_carteira, saldo })
                .then(({ data, message }) => sendResponse(req, res, 202, data, message))
                .catch(err => sendResponse(req, res, 500, [], err.message, err))
    }

    public async destroy(req: Request, res: Response): Promise<Response> {
        return response;
    }
}