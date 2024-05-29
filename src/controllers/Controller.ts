import { Knex } from "knex";
import { Request, Response, response } from "express";
import { Repo } from "../database/repos/Repo.js";
import createConn from '../database/conn.js';

interface IController {
    index?: (req: Request, res: Response) => Promise<Response>;
    show?: (req: Request, res: Response) => Promise<Response>;
    store?: (req: Request, res: Response) => Promise<Response>;
    edit?: (req: Request, res: Response) => Promise<Response>;
    destroy?: (req: Request, res: Response) => Promise<Response>;

    conn: Knex<any, any[]>;
    trx: Knex.Transaction<any, any[]>;
    repository: Repo | undefined;
    _req: Request;
    _res: Response;
}

export default class Controller implements IController {
    _req: Request;
    _res: Response;

    conn: Knex<any, any[]>;
    trx: Knex.Transaction<any, any[]>;
    repository: Repo;

    constructor() {
        this.conn = createConn();
    }

    protected async initTransition(): Promise<Knex.Transaction<any, any[]>> {
        return await this.conn.transaction();
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