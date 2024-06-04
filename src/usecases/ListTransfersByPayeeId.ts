import ITransferRepo from "../database/repos/TransferRepo.js";
import { TransferNotFoundError } from "../errors/Transfer.js";
import UseCase from "../types/UseCase.js";

export default class ListTransfersByPayeeId {
    repository: ITransferRepo;

    constructor(repository: ITransferRepo) {
        this.repository = repository;
    }

    async execute(userId: number, limit: number, page: number): Promise<UseCase> {
        const data = await this.repository.findTransferByPayeeId(userId, limit, page);

        if (data == undefined)
            throw new TransferNotFoundError(`Nenhuma transferência foi encontrado com esse id de usuário recebedor! (ID: ${userId})`)

        return {
            data,
            message: 'Transferências recebidas listadas com sucesso!'
        };
    }
}