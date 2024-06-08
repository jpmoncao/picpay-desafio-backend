import { Response } from "express";
import { TRequest } from "../types/TRequest.js";
import APIRouter from "./Router.js";

import WalletController from "../controllers/WalletController.js";

export default class WalletRouter extends APIRouter {
    constructor() {
        super();

        this.controller = new WalletController();
    }

    protected create(): void {
        this._router.use(async (req, res, next) => await this.controller.initTransaction(req, res, next));
        this._router.use(async (req, res, next) => await this.userAuthenticateMiddleware(req, res, next));

        this._router.get('/:id', (req: TRequest, res: Response) => this.controller.show(req, res));
        this._router.get('/user/:id_user', (req: TRequest, res: Response) => this.controller.show(req, res));
        this._router.put('/edit/:id', (req: TRequest, res: Response) => this.controller.edit(req, res));
    }
}
