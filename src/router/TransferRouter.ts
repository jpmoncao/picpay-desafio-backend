import { Request, Response } from "express";
import APIRouter from "./Router.js";
import TransferController from "../controllers/TransferController.js";

export default class TransferRouter extends APIRouter {
    constructor() {
        super();

        this.controller = new TransferController();
    }

    protected create(): void {
        this._router.get('/user/:id', (req: Request, res: Response) => this.controller.index(req, res));
        this._router.get('/:id', (req: Request, res: Response) => this.controller.show(req, res));
        this._router.post('/', (req: Request, res: Response) => this.controller.store(req, res));
    }
}
