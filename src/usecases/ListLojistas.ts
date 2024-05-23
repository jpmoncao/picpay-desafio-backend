import ILojistaRepo from "../database/repos/LojistaRepo.js";
import UseCase from "../types/UseCase.js";

export default class ListUsers {
    repository: ILojistaRepo;

    constructor(repository: ILojistaRepo) {
        this.repository = repository;
    }

    async execute(page: number, limit: number): Promise<UseCase> {
        try {
            const data = await this.repository.findLojistas(page, limit);

            return {
                data,
                message: 'Lojistas listados com sucesso!'
            };
        } catch (error) {
            throw error;
        }

    }
}