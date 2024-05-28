import IShopkeeperRepo from "../database/repos/ShopkeeperRepo.js";
import UseCase from "../types/UseCase.js";

export default class ListUsers {
    repository: IShopkeeperRepo;

    constructor(repository: IShopkeeperRepo) {
        this.repository = repository;
    }

    async execute(page: number, limit: number): Promise<UseCase> {
        try {
            const data = await this.repository.findShopkeepers(page, limit);

            return {
                data,
                message: 'Shopkeepers listados com sucesso!'
            };
        } catch (error) {
            throw error;
        }

    }
}