import { TRequest } from "../types/TRequest.js";
import { Response, NextFunction } from "express";
import { Knex } from "knex";
import { verifyToken } from "../utils/auth.js";

import UserRepositoryImpl from "../database/repos/implementation/UserRepositoryImpl.js";
import UserProps from "../database/domain/user.js";
import { UserNotAuthorizedError } from "../errors/User.js";
import sendResponse from "../utils/response.js";

export default class UserAuthenticate {
    repository: UserRepositoryImpl;
    trx: Knex.Transaction;

    constructor(trx: Knex.Transaction) {
        this.trx = trx;
        this.repository = new UserRepositoryImpl(this.trx)
    }

    public async execute(req: TRequest, res: Response, next: NextFunction, token?: string): Promise<void> {
        try {
            const jwToken = token ?? req.headers.authorization?.split('Bearer ')[1];
            if (!jwToken) throw new UserNotAuthorizedError('Usuário não autorizado!');

            const user: UserProps = verifyToken(jwToken ?? '');

            const userExists = await this.repository.findUserById(user.id_user ?? 0);
            if (!userExists) throw new UserNotAuthorizedError('Usuário não autorizado!');

            req.user = userExists;
            next();
        } catch (error) {
            sendResponse(req, res, 403, [], 'Usuário não autorizado', error);
        }
    }
}
