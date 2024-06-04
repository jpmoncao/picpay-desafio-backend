import ITransferRepo from "../database/repos/TransferRepo.js";
import { TransferNotFoundError } from "../errors/Transfer.js";
import UseCase from "../types/UseCase.js";

export default class ListTransfersByUserId {
    repository: ITransferRepo;

    constructor(repository: ITransferRepo) {
        this.repository = repository;
    }

    async execute(userId: number, limit: number, page: number): Promise<UseCase> {
        const data = await this.repository.findTransferByUserId(userId, limit, page);

        if (data == undefined)
            throw new TransferNotFoundError(`Nenhuma transferência foi encontrado com esse id de usuário! (ID: ${userId})`)

        return {
            data,
            message: 'Transferências listadas com sucesso!'
        };
    }
}