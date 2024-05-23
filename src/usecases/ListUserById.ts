import IUserRepo from "../database/repos/UserRepo.js";
import { UserNotFoundError } from "../errors/User.js";
import UseCase from "../types/UseCase.js";

export default class ListUserById {
    repository: IUserRepo;

    constructor(repository: IUserRepo) {
        this.repository = repository;
    }

    async execute(id: number): Promise<UseCase> {
        const data = await this.repository.findUserById(id);

        if (data == undefined)
            throw new UserNotFoundError(`Nenhum usuário foi encontrado com esse id! (ID: ${id})`)

        return {
            data,
            message: 'Usuário listado com sucesso!'
        };
    }
}