import UserRepositoryImpl from "../database/repos/implementation/UserRepositoryImpl.js";

import ILojistaRepo from "../database/repos/LojistaRepo.js";
import LojistaProps from "../database/domain/lojista.js";
import UseCase from "../types/UseCase.js";

import { LojistaMissingDataError } from "../errors/Lojista.js";

export default class CreateLojista {
    repository: ILojistaRepo;

    constructor(repository: ILojistaRepo) {
        this.repository = repository;
    }

    async execute(props: LojistaProps): Promise<UseCase> {
        let { id_user } = props;

        if (!id_user || id_user <= 0)
            throw new LojistaMissingDataError(`Nenhum ID de usuário foi encontrado para criar o lojista!`);

        const lojistaId = await this.repository.createLojista({ id_user });

        const userRepository = new UserRepositoryImpl();
        const data = await userRepository.findUserById(Number(id_user));

        return {
            data,
            message: 'Lojista criado com sucesso!'
        };
    }
}