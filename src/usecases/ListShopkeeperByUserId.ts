import IShopkeeperRepo from "../database/repos/ShopkeeperRepo.js";
import { ShopkeeperNotFoundError } from "../errors/Shopkeeper.js";
import UseCase from "../types/UseCase.js";

export default class ListShopkeeperById {
    repository: IShopkeeperRepo;

    constructor(repository: IShopkeeperRepo) {
        this.repository = repository;
    }

    async execute(id: number, throwErr: boolean = true): Promise<UseCase> {
        const data = await this.repository.findShopkeeperByUserId(id);

        if (data == undefined && throwErr)
            throw new ShopkeeperNotFoundError(`Nenhum lojista foi encontrado com esse id! (ID: ${id})`)

        return {
            data,
            message: 'Lojista listado com sucesso!'
        };
    }
}