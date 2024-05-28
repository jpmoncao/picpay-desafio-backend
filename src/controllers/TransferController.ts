import { Request, Response, response } from "express";
import sendResponse from "../utils/response.js";

import Controller from "./Controller.js";
import ITransferRepo from "../database/repos/TransferRepo.js";
import TransferRepositoryImpl from "../database/repos/implementation/TransferRepositoryImpl.js";

export default class TransferController extends Controller {
    repository: ITransferRepo;

    constructor() {
        super();

        this.repository = new TransferRepositoryImpl();
    }

    public async index(req: Request, res: Response): Promise<Response> {
        return response;
    }

    public async show(req: Request, res: Response): Promise<Response> {
        return response;
    }

    public async store(req: Request, res: Response): Promise<Response> {
        return response;
    }

    public async edit(req: Request, res: Response): Promise<Response> {
        return response;
    }

    public async destroy(req: Request, res: Response): Promise<Response> {
        return response;
    }
}