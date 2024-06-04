import { Request, Response } from "express";
import APIRouter from "./Router.js";
import sendResponse from "../utils/response.js";

import WalletController from "../controllers/WalletController.js";
import UserAuthenticate from "../middleware/UserAuthenticate.js";
import { UserNotAuthorizedError } from "../errors/User.js";

export default class WalletRouter extends APIRouter {
    constructor() {
        super();

        this.controller = new WalletController();
    }

    private async userAuthenticateMiddleware(req: Request) {
        await this.controller.init();
        const userAuthenticate = new UserAuthenticate(this.controller.trx);
        return await userAuthenticate.execute(req)
    }

    protected create(): void {
        this._router.use(async (req, res, next) => {
            const userAuth = await this.userAuthenticateMiddleware(req);
            if (userAuth)
                next()
            else
                sendResponse(req, res, 400, [], 'Usuário não autorizado!', new UserNotAuthorizedError('Usuário não autorizado!'));
        });
        
        this._router.get('/:id', (req: Request, res: Response) => this.controller.show(req, res));
        this._router.get('/user/:id_user', (req: Request, res: Response) => this.controller.show(req, res));
        this._router.put('/edit/:id', (req: Request, res: Response) => this.controller.edit(req, res));
    }
}
