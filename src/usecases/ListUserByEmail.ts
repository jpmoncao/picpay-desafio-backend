import IUserRepo from "../database/repos/UserRepo.js";
import { UserNotFoundError } from "../errors/User.js";
import UseCase from "../types/UseCase.js";

export default class ListUserByEmail {
    repository: IUserRepo;

    constructor(repository: IUserRepo) {
        this.repository = repository;
    }

    async execute(email: string): Promise<UseCase> {
        const data = await this.repository.findUserByEmail(email);

        if (data == undefined)
            throw new UserNotFoundError(`Nenhum usuário foi encontrado com esse email!`)

        return {
            data,
            message: 'Usuário listado com sucesso!'
        };
    }
}