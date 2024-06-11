import IUserRepo from "../database/repos/UserRepo.js";
import UserProps from "../database/domain/user.js";
import UseCase from "../types/UseCase.js";
import { validarCPF, validarCNPJ } from "../utils/validate.js";

import { UserDuplicateCNPJError, UserDuplicateCPFError, UserDuplicateEmailError, UserIncorrectPatternError, UserMissingDataError } from "../errors/User.js";

export default class EditUser {
    repository: IUserRepo;

    constructor(repository: IUserRepo) {
        this.repository = repository;
    }

    async execute(props: UserProps): Promise<UseCase> {
        let { id_user, name, email, password, cpf_cnpj, person_type, token_2fa } = props;

        if (!id_user || id_user == 0)
            throw new UserMissingDataError('O ID do usuário à alterar não foi informado!');

        let userOldData: UserProps = { id_user, name, email, password, cpf_cnpj, person_type, token_2fa };
        Object.entries(userOldData).forEach(([key, value]) => {
            if (value === null || value === undefined) {
                delete userOldData[key];
            }
        });

        await this.repository.updateUser(userOldData);

        const data = await this.repository.findUserById(id_user);

        return {
            data,
            message: 'Usuário editado com sucesso!'
        };
    }
}