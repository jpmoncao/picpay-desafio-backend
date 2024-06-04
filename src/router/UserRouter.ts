import { Response } from "express";
import { TRequest } from "../types/TRequest.js";
import APIRouter from "./Router.js";
import sendResponse from "../utils/response.js";

import UserController from "../controllers/UserController.js";
import UserAuthenticate from "../middleware/UserAuthenticate.js";
import { UserNotAuthorizedError } from "../errors/User.js";

export default class UserRouter extends APIRouter {
    protected controller: UserController;

    constructor() {
        super();

        this.controller = new UserController();
    }

    private async userAuthenticateMiddleware(req: TRequest) {
        await this.controller.init();
        const userAuthenticate = new UserAuthenticate(this.controller.trx);
        return await userAuthenticate.execute(req)
    }

    protected create(): void {
        this._router.get('/login', (req: TRequest, res: Response) => this.controller.login(req, res));
        this._router.post('/', (req: TRequest, res: Response) => this.controller.store(req, res));

        this._router.use(async (req, res, next) => {
            const userAuth = await this.userAuthenticateMiddleware(req);
            if (userAuth)
                next()
            else
                sendResponse(req, res, 401, [], 'Usuário não autorizado!', new UserNotAuthorizedError('Usuário não autorizado!'));
        });

        this._router.get('/', (req: TRequest, res: Response) => this.controller.index(req, res));
        this._router.get('/:id', (req: TRequest, res: Response) => this.controller.show(req, res));
        this._router.put('/edit/:id', (req: TRequest, res: Response) => this.controller.edit(req, res));
        this._router.delete('/delete/:id', (req: TRequest, res: Response) => this.controller.destroy(req, res));
    }
}
