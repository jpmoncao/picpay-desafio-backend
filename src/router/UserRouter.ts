import { Response, NextFunction } from "express";
import { TRequest } from "../types/TRequest.js";
import APIRouter from "./Router.js";

import UserController from "../controllers/UserController.js";
import UserAuthenticate from "../middleware/UserAuthenticate.js";

export default class UserRouter extends APIRouter {
    protected controller: UserController;

    constructor() {
        super();
        this.controller = new UserController();
    }

    private async userAuthenticateMiddleware(req: TRequest, res: Response, next: NextFunction) {
        await this.controller.init();
        const userAuthenticate = new UserAuthenticate(this.controller.trx);
        return await userAuthenticate.execute(req, res, next);
    }

    protected create(): void {
        this._router.get('/login', (req: TRequest, res: Response) => this.controller.login(req, res));
        this._router.post('/', (req: TRequest, res: Response) => this.controller.store(req, res));

        this._router.use(async (req, res, next) => await this.userAuthenticateMiddleware(req, res, next));

        this._router.get('/', (req: TRequest, res: Response) => this.controller.index(req, res));
        this._router.get('/:id', (req: TRequest, res: Response) => this.controller.show(req, res));
        this._router.put('/edit/:id', (req: TRequest, res: Response) => this.controller.edit(req, res));
        this._router.delete('/delete/:id', (req: TRequest, res: Response) => this.controller.destroy(req, res));
    }
}
