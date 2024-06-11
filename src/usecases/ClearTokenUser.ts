import IUserRepo from "../database/repos/UserRepo.js";
import UseCase from "../types/UseCase.js";
import EditUser from "./EditUser.js";

import { UserMissingDataError } from "../errors/User.js";
import ListUserById from "./ListUserById.js";
import UserProps from "../database/domain/user.js";

export default class ClearTokenUser {
    repository: IUserRepo;

    constructor(repository: IUserRepo) {
        this.repository = repository;
    }

    async execute(user: UserProps): Promise<UseCase> {
        if (!user)
            throw new UserMissingDataError(`Há dados faltando para efetuar limpar token do usuário!`);

        let { id_user } = user;

        const editUser = new EditUser(this.repository)
        await editUser.execute({ id_user, token_2fa: '' })
            .then(data => data)
            .catch(err => err);

        return {
            data: [],
            message: 'Token limpo com sucesso!'
        };
    }
}