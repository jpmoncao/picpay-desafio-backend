import IUserRepo from "../database/repos/UserRepo.js";
import UserProps from "../database/domain/user.js";
import UseCase from "../types/UseCase.js";
import { validarCPF, validarCNPJ } from "../utils/validate.js";

import { UserDuplicateUsernameError, UserIncorrectPatternError, UserMissingDataError } from "../errors/User.js";

export default class CreateUser {
    repository: IUserRepo;

    constructor(repository: IUserRepo) {
        this.repository = repository;
    }

    async execute(props: UserProps): Promise<UseCase> {
        let { nome, email, senha, cpf_cnpj, tipo_pessoa } = props;

        if (!nome || nome.trim() == '' ||
            !email || email.trim() == '' ||
            !senha || senha.trim() == '' ||
            !cpf_cnpj || cpf_cnpj.trim() == '' ||
            !tipo_pessoa || tipo_pessoa.trim() == '')
            throw new UserMissingDataError(`Há dados obrigatórios faltando!`);

        let usernameAlreadyExits: UserProps | undefined = undefined;
        if (tipo_pessoa === 'F')
            usernameAlreadyExits = await this.repository.findUserByCPF(cpf_cnpj ?? '');
        else if (tipo_pessoa === 'J')
            usernameAlreadyExits = await this.repository.findUserByCNPJ(cpf_cnpj ?? '');

        if (usernameAlreadyExits !== undefined)
            throw new UserDuplicateUsernameError(`O ${tipo_pessoa === 'F' ? 'CPF' : 'CNPJ'} '${cpf_cnpj}' já está sendo usado por outro usuário!`);

        usernameAlreadyExits = await this.repository.findUserByEmail(email);

        if (usernameAlreadyExits !== undefined)
            throw new UserDuplicateUsernameError(`O e-mail inserido já está sendo usado por outro usuário!`);

        if (tipo_pessoa === 'F' && !validarCPF(cpf_cnpj))
            throw new UserIncorrectPatternError(`O CPF não é válido!`);
        else if (tipo_pessoa === 'J' && !validarCNPJ(cpf_cnpj))
            throw new UserIncorrectPatternError(`O CPF não é válido!`);

        const userId = await this.repository.createUser({ nome, email, senha, cpf_cnpj, tipo_pessoa });
        const data = await this.repository.findUserById(Number(userId));
        console.log('3: ', data);

        return {
            data,
            message: 'Usuários criado com sucesso!'
        };
    }
}