import { Knex } from "knex";
import { Response, response } from "express";
import { TRequest } from "../types/TRequest.js";
import { Repo } from "../database/repos/Repo.js";
import createConn from '../database/conn.js';

interface IController {
    index?: (req: TRequest, res: Response) => Promise<Response>;
    show?: (req: TRequest, res: Response) => Promise<Response>;
    store?: (req: TRequest, res: Response) => Promise<Response>;
    edit?: (req: TRequest, res: Response) => Promise<Response>;
    destroy?: (req: TRequest, res: Response) => Promise<Response>;

    conn: Knex<any, any[]>;
    trx: Knex.Transaction<any, any[]>;
    repository: Repo | undefined;
    _req: TRequest;
    _res: Response;
}

export default class Controller implements IController {
    _req: TRequest;
    _res: Response;

    conn: Knex<any, any[]>;
    trx: Knex.Transaction<any, any[]>;
    repository: Repo;

    constructor() {
        this.conn = createConn();
    }

    public async init() {
        this.trx = await this.initTransition();
    }

    protected async initTransition(): Promise<Knex.Transaction<any, any[]>> {
        return await this.conn.transaction();
    }

    public async index(req: TRequest, res: Response): Promise<Response> {
        return response;
    }

    public async show(req: TRequest, res: Response): Promise<Response> {
        return response;
    }

    public async store(req: TRequest, res: Response): Promise<Response> {
        return response;
    }

    public async edit(req: TRequest, res: Response): Promise<Response> {
        return response;
    }

    public async destroy(req: TRequest, res: Response): Promise<Response> {
        return response;
    }
}