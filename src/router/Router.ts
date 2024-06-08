import { NextFunction, Response, Router } from "express";
import { TRequest } from "../types/TRequest";
import Controller from "../controllers/Controller";

import UserAuthenticate from "../middleware/UserAuthenticate.js";

export default class APIRouter {
    protected _router: Router;
    protected controller: Controller;

    constructor() {
        this._router = Router();
    }

    protected create(): void {
    }


    public get router(): Router {
        this.create();
        return this._router;
    }

    protected async userAuthenticateMiddleware(req: TRequest, res: Response, next: NextFunction) {
        const userAuthenticate = new UserAuthenticate(this.controller.trx);
        return await userAuthenticate.execute(req, res, next)
    }
}