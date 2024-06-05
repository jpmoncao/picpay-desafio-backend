import { NextFunction, Response } from "express";
import { TRequest } from "../types/TRequest.js";
import APIRouter from "./Router.js";

import TransferController from "../controllers/TransferController.js";
import UserAuthenticate from "../middleware/UserAuthenticate.js";

export default class TransferRouter extends APIRouter {
    constructor() {
        super();

        this.controller = new TransferController();
    }

    private async userAuthenticateMiddleware(req: TRequest, res: Response, next: NextFunction) {
        await this.controller.init();
        const userAuthenticate = new UserAuthenticate(this.controller.trx);
        return await userAuthenticate.execute(req, res, next)
    }

    protected create(): void {
        this._router.use(async (req, res, next) => await this.userAuthenticateMiddleware(req, res, next));

        this._router.get('/:id', (req: TRequest, res: Response) => this.controller.show(req, res));
        this._router.post('/', (req: TRequest, res: Response) => this.controller.store(req, res));
        this._router.get('/user/:id', (req: TRequest, res: Response) => this.controller.index(req, res));
        this._router.get('/payer/:id', (req: TRequest, res: Response) => this.controller.index(req, res));
        this._router.get('/payee/:id', (req: TRequest, res: Response) => this.controller.index(req, res));
    }
}
