import { TRequest } from "../types/TRequest.js";
import { Knex } from "knex";
import { verifyToken } from "../utils/auth.js";

import UserRepositoryImpl from "../database/repos/implementation/UserRepositoryImpl.js";
import UserProps from "../database/domain/user.js";

export default class UserAuthenticate {
    repository: UserRepositoryImpl;
    trx: Knex.Transaction;

    constructor(trx: Knex.Transaction) {
        this.trx = trx;
        this.repository = new UserRepositoryImpl(this.trx)
    }

    public async execute(req: TRequest, token?: string): Promise<boolean> {
        const jwToken = token ?? req.headers.authorization?.split('Bearer ')[1];

        if (!jwToken)
            return false;

        const user: UserProps = verifyToken(jwToken ?? '');

        try {
            const userExists = await this.repository.findUserById(user.id_user ?? 0);
            if (userExists)
                req.user = userExists;
            return !!userExists;
        } catch (error) {
            console.error("Erro ao verificar usuário:", error);
            return false;
        }
    }
}
