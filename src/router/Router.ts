import { Express, Request, Response, Router } from "express";
import Controller from "../controllers/Controller";

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
}