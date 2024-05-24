import ILojistaRepo from "../database/repos/LojistaRepo.js";
import { LojistaNotFoundError } from "../errors/Lojista.js";
import UseCase from "../types/UseCase.js";

export default class ListLojistaById {
    repository: ILojistaRepo;

    constructor(repository: ILojistaRepo) {
        this.repository = repository;
    }

    async execute(id: number, throwErr: boolean = true): Promise<UseCase> {
        const data = await this.repository.findLojistaById(id);

        if (data == undefined && throwErr)
            throw new LojistaNotFoundError(`Nenhum lojista foi encontrado com esse id! (ID: ${id})`)

        return {
            data,
            message: 'Lojista listado com sucesso!'
        };
    }
}