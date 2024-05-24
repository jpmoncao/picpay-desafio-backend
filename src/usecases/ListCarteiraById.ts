import ICarteiraRepo from "../database/repos/CarteiraRepo.js";
import { CarteiraNotFoundError } from "../errors/Carteira.js";
import UseCase from "../types/UseCase.js";

export default class ListCarteiraById {
    repository: ICarteiraRepo;

    constructor(repository: ICarteiraRepo) {
        this.repository = repository;
    }

    async execute(id: number): Promise<UseCase> {
        const data = await this.repository.findCarteiraById(id);

        if (data == undefined)
            throw new CarteiraNotFoundError(`Nenhuma carteira foi encontrada com esse id! (ID: ${id})`)

        return {
            data,
            message: 'Carteira listada com sucesso!'
        };
    }
}