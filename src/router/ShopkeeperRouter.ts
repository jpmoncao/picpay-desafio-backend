import { NextFunction, Response } from "express";
import { TRequest } from "../types/TRequest.js";
import APIRouter from "./Router.js";

import ShopkeeperController from "../controllers/ShopkeeperController.js";
import UserAuthenticate from "../middleware/UserAuthenticate.js";

export default class ShopkeeperRouter extends APIRouter {
    constructor() {
        super();

        this.controller = new ShopkeeperController();
    }

    private async userAuthenticateMiddleware(req: TRequest, res: Response, next: NextFunction) {
        await this.controller.init();
        const userAuthenticate = new UserAuthenticate(this.controller.trx);
        return await userAuthenticate.execute(req, res, next)
    }

    protected create(): void {
        this._router.post('/', (req: TRequest, res: Response) => this.controller.store(req, res));

        this._router.use(async (req, res, next) => await this.userAuthenticateMiddleware(req, res, next));

        this._router.post('/:id', (req: TRequest, res: Response) => this.controller.store(req, res));
        this._router.get('/', (req: TRequest, res: Response) => this.controller.index(req, res));
        this._router.get('/:id', (req: TRequest, res: Response) => this.controller.show(req, res));
        this._router.put('/edit/:id', (req: TRequest, res: Response) => this.controller.edit(req, res));
    }
}
