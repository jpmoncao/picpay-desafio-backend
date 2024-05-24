import { Request, Response } from "express";
import APIRouter from "./Router.js";
import LojistaController from "../controllers/LojistaController.js";

export default class LojistaRouter extends APIRouter {
    constructor() {
        super();

        this.controller = new LojistaController();
    }

    protected create(): void {
        this._router.get('/', (req: Request, res: Response) => this.controller.index(req, res));
        this._router.get('/:id', (req: Request, res: Response) => this.controller.show(req, res));
        this._router.post('/', (req: Request, res: Response) => this.controller.store(req, res));
        this._router.post('/:id', (req: Request, res: Response) => this.controller.store(req, res));
        this._router.put('/edit/:id', (req: Request, res: Response) => this.controller.edit(req, res));
    }
}
