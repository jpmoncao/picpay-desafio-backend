import { Response } from "express";
import { TRequest } from "../types/TRequest.js";
import APIRouter from "./Router.js";

import UserController from "../controllers/UserController.js";

export default class UserRouter extends APIRouter {
    protected controller: UserController;

    constructor() {
        super();
        this.controller = new UserController();
    }

    protected create(): void {
        this._router.use(async (req, res, next) => await this.initController(req, res, next));

        this._router.get('/login', (req: TRequest, res: Response) => this.controller.login(req, res));
        this._router.post('/', (req: TRequest, res: Response) => this.controller.store(req, res));

        this._router.use(async (req, res, next) => await this.userAuthenticateMiddleware(req, res, next));

        this._router.get('/', (req: TRequest, res: Response) => this.controller.index(req, res));
        this._router.get('/:id', (req: TRequest, res: Response) => this.controller.show(req, res));
        this._router.put('/edit/:id', (req: TRequest, res: Response) => this.controller.edit(req, res));
        this._router.delete('/delete/:id', (req: TRequest, res: Response) => this.controller.destroy(req, res));
    }
}
