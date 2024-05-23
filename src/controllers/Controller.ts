import { Knex } from "knex";
import { Request, Response, response } from "express";
import createConn from '../database/conn.js';
import { Repo } from "../database/repos/Repo.js";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

interface IController {
    index?: (req: Request, res: Response) => Promise<Response>;
    show?: (req: Request, res: Response) => Promise<Response>;
    store?: (req: Request, res: Response) => Promise<Response>;
    edit?: (req: Request, res: Response) => Promise<Response>;
    destroy?: (req: Request, res: Response) => Promise<Response>;

    conn: Knex<any, any[]>;
    repository: Repo;

    _req: Request;
    _res: Response;
}

export default class Controller implements IController {
    conn: Knex<any, any[]>;

    _req: Request;
    _res: Response;

    repository: Repo;

    constructor() {
        this.conn = createConn();
    }

    public async index(req: Request, res: Response): Promise<Response> {
        return response;
    }

    public async show(req: Request, res: Response): Promise<Response> {
        return response;
    }

    public async store(req: Request, res: Response): Promise<Response> {
        return response;
    }

    public async edit(req: Request, res: Response): Promise<Response> {
        return response;
    }

    public async destroy(req: Request, res: Response): Promise<Response> {
        return response;
    }
}