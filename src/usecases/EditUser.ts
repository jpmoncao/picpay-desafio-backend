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
        let { id_user, nome, email, senha, cpf_cnpj, tipo_pessoa } = props;

        if (!id_user || id_user == 0)
            throw new UserMissingDataError('O ID do usuário à alterar não foi informado!');

        if (
            !nome || nome.trim() == '' &&
            !email || email?.trim() == '' &&
            !senha || senha?.trim() == '' &&
            !cpf_cnpj || cpf_cnpj?.trim() == '' &&
            !tipo_pessoa || tipo_pessoa?.trim() == ''
        )
            throw new UserMissingDataError('Os dados à alterar não foram passados');

        let usernameAlreadyInUse: UserProps | undefined = undefined;
        if (tipo_pessoa === 'F')
            usernameAlreadyInUse = await this.repository.findUserByCPF(cpf_cnpj ?? '');
        else if (tipo_pessoa === 'J')
            usernameAlreadyInUse = await this.repository.findUserByCNPJ(cpf_cnpj ?? '');

        if (usernameAlreadyInUse !== undefined && usernameAlreadyInUse.id !== id_user)
            if (tipo_pessoa === 'F')
                throw new UserDuplicateCPFError(`O CPF '${cpf_cnpj}' já está sendo usado por outro usuário!`);
            else if (tipo_pessoa === 'J')
                throw new UserDuplicateCNPJError(`O CNPJ '${cpf_cnpj}' já está sendo usado por outro usuário!`);

        usernameAlreadyInUse = await this.repository.findUserByEmail(email ?? '');

        if (usernameAlreadyInUse !== undefined && usernameAlreadyInUse.id !== id_user)
            throw new UserDuplicateEmailError(`O e-mail inserido já está sendo usado por outro usuário!`);

        if (tipo_pessoa === 'F' && !validarCPF(cpf_cnpj ?? ''))
            throw new UserIncorrectPatternError(`O CPF não é válido!`);
        else if (tipo_pessoa === 'J' && !validarCNPJ(cpf_cnpj ?? ''))
            throw new UserIncorrectPatternError(`O CPF não é válido!`);

        let userOldData: UserProps = { id_user, nome, email, senha, cpf_cnpj, tipo_pessoa };
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