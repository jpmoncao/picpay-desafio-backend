import UserRepositoryImpl from "../database/repos/implementation/UserRepositoryImpl.js";

import IShopkeeperRepo from "../database/repos/ShopkeeperRepo.js";
import ShopkeeperProps from "../database/domain/shopkeeper.js";
import ListShopkeeperById from "./ListShopkeeperByUserId.js";
import UseCase from "../types/UseCase.js";

import { ShopkeeperAlreadyExistsError, ShopkeeperMissingDataError } from "../errors/Shopkeeper.js";

export default class CreateShopkeeper {
    repository: IShopkeeperRepo;

    constructor(repository: IShopkeeperRepo) {
        this.repository = repository;
    }

    async execute(props: ShopkeeperProps): Promise<UseCase> {
        let { id_user } = props;

        if (!id_user || id_user <= 0)
            throw new ShopkeeperMissingDataError(`Nenhum ID de usuário foi encontrado para criar o lojista!`);

        const listShopkeeperById = new ListShopkeeperById(this.repository);
        const shopkeeperAlreadyExists = await listShopkeeperById.execute(id_user, false).then(({ data }) => data);

        if (shopkeeperAlreadyExists)
            throw new ShopkeeperAlreadyExistsError('Esse usuário já é um lojista cadastrado!');

        const shopkeeperId = await this.repository.createShopkeeper({ id_user });

        const userRepository = new UserRepositoryImpl(this.repository.trx);
        const data = await userRepository.findUserById(Number(id_user));

        return {
            data,
            message: 'Lojista criado com sucesso!'
        };
    }
}