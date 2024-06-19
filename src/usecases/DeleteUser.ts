import IUserRepo from "../database/repos/UserRepo.js";
import UserProps from "../database/domain/user.js";
import UseCase from "../types/UseCase.js";

import { UserMissingDataError, UserNotFoundError } from "../errors/User.js";

export default class CreateUser {
    repository: IUserRepo;

    constructor(repository: IUserRepo) {
        this.repository = repository;
    }

    async execute(props: UserProps): Promise<UseCase> {
        const { id_user, name, username, password } = props;

        if (!id_user || id_user == 0)
            throw new UserMissingDataError('O id do usuário não foi encontrado!');

        const userHasFound = await this.repository.findUserById(id_user);
        if (!userHasFound)
            throw new UserNotFoundError(`O id '${id_user}' não pertence a nenhum usuário!`);

        await this.repository.deleteUserById({ id_user, name, username, password });

        return {
            data: [],
            message: 'Usuário excluído com sucesso!'
        };
    }
}