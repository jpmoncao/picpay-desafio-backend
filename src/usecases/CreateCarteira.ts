import ICarteiraRepo from "../database/repos/CarteiraRepo.js";
import CarteiraProps from "../database/domain/carteira.js";
import UseCase from "../types/UseCase.js";

import { CarteiraMissingDataError } from "../errors/Carteira.js";

export default class CreateCarteira {
    repository: ICarteiraRepo;

    constructor(repository: ICarteiraRepo) {
        this.repository = repository;
    }

    async execute(props: CarteiraProps): Promise<UseCase> {
        let { id_user } = props;

        if (!id_user || id_user <= 0)
            throw new CarteiraMissingDataError(`Nenhum ID de usuário foi encontrado para criar a carteira!`);

        const carteiraId = await this.repository.createCarteira({ id_user });

        const data = await this.repository.findCarteiraById(Number(carteiraId));

        return {
            data,
            message: 'Carteira criada com sucesso!'
        };
    }
}