import IUserRepo from "../database/repos/UserRepo.js";
import UserProps from "../database/domain/user.js";
import UseCase from "../types/UseCase.js";
import { validarCPF, validarCNPJ } from "../utils/validate.js";

import { UserDuplicateCNPJError, UserDuplicateCPFError, UserDuplicateEmailError, UserIncorrectPatternError, UserMissingDataError } from "../errors/User.js";

export default class CreateUser {
    repository: IUserRepo;

    constructor(repository: IUserRepo) {
        this.repository = repository;
    }

    async execute(props: UserProps): Promise<UseCase> {
        let { name, email, password, cpf_cnpj, person_type } = props;

        if (!name || name.trim() == '' ||
            !email || email.trim() == '' ||
            !password || password.trim() == '' ||
            !cpf_cnpj || cpf_cnpj.trim() == '' ||
            !person_type || person_type.trim() == '')
            throw new UserMissingDataError(`Há dados obrigatórios faltando!`);

        let usernameAlreadyExits: UserProps | undefined = undefined;
        if (person_type === 'F')
            usernameAlreadyExits = await this.repository.findUserByCPF(cpf_cnpj ?? '');
        else if (person_type === 'J')
            usernameAlreadyExits = await this.repository.findUserByCNPJ(cpf_cnpj ?? '');

        if (usernameAlreadyExits !== undefined) {
            if (person_type === 'F')
                throw new UserDuplicateCPFError(`O CPF '${cpf_cnpj}' já está sendo usado por outro usuário!`);
            else if (person_type === 'J')
                throw new UserDuplicateCNPJError(`O CNPJ '${cpf_cnpj}' já está sendo usado por outro usuário!`);
        }

        usernameAlreadyExits = await this.repository.findUserByEmail(email);
        if (usernameAlreadyExits !== undefined)
            throw new UserDuplicateEmailError(`O e-mail inserido já está sendo usado por outro usuário!`);

        if (person_type === 'F' && !validarCPF(cpf_cnpj))
            throw new UserIncorrectPatternError(`O CPF não é válido!`);
        else if (person_type === 'J' && !validarCNPJ(cpf_cnpj))
            throw new UserIncorrectPatternError(`O CPF não é válido!`);

        const userId = await this.repository.createUser({ name, email, password, cpf_cnpj, person_type });
        const data = await this.repository.findUserById(Number(userId));

        return {
            data,
            message: 'Usuários criado com sucesso!'
        };
    }
}