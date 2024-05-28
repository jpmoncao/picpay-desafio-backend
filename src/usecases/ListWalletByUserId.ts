import IWalletRepo from "../database/repos/WalletRepo.js";
import { WalletNotFoundError } from "../errors/Wallet.js";
import UseCase from "../types/UseCase.js";

export default class ListWalletByUserId {
    repository: IWalletRepo;

    constructor(repository: IWalletRepo) {
        this.repository = repository;
    }

    async execute(id: number): Promise<UseCase> {
        const data = await this.repository.findWalletByUserId(id);

        if (data == undefined)
            throw new WalletNotFoundError(`Nenhuma carteira foi encontrada com esse id! (ID: ${id})`)

        return {
            data,
            message: 'Carteira listada com sucesso!'
        };
    }
}