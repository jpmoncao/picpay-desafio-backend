import { Request } from "express";
import { verifyToken } from "../utils/auth";
import { Knex } from "knex";

import createConn from "../database/conn";

import UserRepositoryImpl from "../database/repos/implementation/UserRepositoryImpl";
import UserProps from "../database/domain/user";

export default class UserAuthenticate {
    repository: UserRepositoryImpl;
    trx: Knex.Transaction;

    constructor(trx) {
        this.trx = trx;
        this.repository = new UserRepositoryImpl(this.trx)
    }

    public async execute(req: Request, token?: string): Promise<boolean> {
        console.log(req.headers.authorization)
        const jwToken = token ?? req.headers.authorization?.split('Bearer ')[1];
        console.log(jwToken)
        const user: UserProps = verifyToken(jwToken ?? '');

        const UserAuthenticate = await this.repository.findUserById(user.id_user ?? 0)
            .then(user => true)
            .catch(err => false);

        return UserAuthenticate;
    }
}