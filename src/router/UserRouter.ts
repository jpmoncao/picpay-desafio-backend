import { Request, Response } from "express";
import APIRouter from "./Router.js";
import UserController from "../controllers/UserController.js";

export default class UserRouter extends APIRouter {
    constructor() {
        super();

        this.controller = new UserController();
    }

    protected create(): void {
        this._router.get('/', (req: Request, res: Response) => this.controller.index(req, res));
        this._router.get('/:id', (req: Request, res: Response) => this.controller.show(req, res));
        this._router.post('/', (req: Request, res: Response) => this.controller.store(req, res));
        this._router.put('/edit/:id', (req: Request, res: Response) => this.controller.edit(req, res));
        this._router.delete('/delete/:id', (req: Request, res: Response) => this.controller.destroy(req, res));
    }
}
