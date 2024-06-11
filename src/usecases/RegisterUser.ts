import IUserRepo from "../database/repos/UserRepo.js";
import UserProps from "../database/domain/shopkeeper.js";
import UseCase from "../types/UseCase.js";
import ListUserById from "./ListUserById.js";
import { UserMissingDataError, UserPasswordIncorrectError } from "../errors/User.js";

import { decrypt } from "../utils/hash.js";
import { signToken } from "../utils/auth.js";
import ClearTokenUser from "./ClearTokenUser.js";

export default class RegisterUser {
    repository: IUserRepo;

    constructor(repository: IUserRepo) {
        this.repository = repository;
    }

    async execute(id_user: number, code: string): Promise<UseCase> {
        if (!id_user || !code)
            throw new UserMissingDataError(`Há dados faltando para efetuar registro do usuário!`);

        const listUserById = new ListUserById(this.repository)

        const user = await listUserById.execute(id_user)
            .then(({ data }) => data)
            .catch(err => undefined);

        if (!user)
            throw new UserMissingDataError('Não foi encontrado um usuário com esse id!');

        const code_2FA = decrypt(user.token_2fa ?? '');
        if (code_2FA != code)
            throw new UserPasswordIncorrectError('O token inserido não coincide com o cadastrado!');

        await new ClearTokenUser(this.repository).execute(user);

        return {
            data: [],
            message: 'Usuário registrado com sucesso! Prossiga para efetuar o login.'
        };
    }
}