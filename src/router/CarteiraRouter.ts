import { Request, Response } from "express";
import APIRouter from "./Router.js";
import CarteiraController from "../controllers/CarteiraController.js";

export default class CarteiraRouter extends APIRouter {
    constructor() {
        super();

        this.controller = new CarteiraController();
    }

    protected create(): void {
        this._router.get('/:id', (req: Request, res: Response) => this.controller.show(req, res));
        this._router.get('/user/:id_user', (req: Request, res: Response) => this.controller.show(req, res));
        this._router.put('/edit/:id', (req: Request, res: Response) => this.controller.edit(req, res));
    }
}
