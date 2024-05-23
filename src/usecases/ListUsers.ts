import IUserRepo from "../database/repos/UserRepo.js";
import UseCase from "../types/UseCase.js";

export default class ListUsers {
    repository: IUserRepo;

    constructor(repository: IUserRepo) {
        this.repository = repository;
    }

    async execute(page: number, limit: number): Promise<UseCase> {
        try {
            const data = await this.repository.findUsers(page, limit);

            return {
                data,
                message: 'Usuários listados com sucesso!'
            };
        } catch (error) {
            throw error;
        }

    }
}