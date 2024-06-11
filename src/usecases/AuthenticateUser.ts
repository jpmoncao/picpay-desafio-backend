import IUserRepo from "../database/repos/UserRepo.js";
import UserProps from "../database/domain/shopkeeper.js";
import UseCase from "../types/UseCase.js";
import ListUserByEmail from "./ListUserByEmail.js";
import { UserMissingDataError, UserPasswordIncorrectError } from "../errors/User.js";

import { decrypt } from "../utils/hash.js";
import { signToken } from "../utils/auth.js";

export default class AuthenticateUser {
    repository: IUserRepo;

    constructor(repository: IUserRepo) {
        this.repository = repository;
    }

    async execute(props: UserProps): Promise<UseCase> {
        let { email, password } = props;

        if (!email || !password)
            throw new UserMissingDataError(`Há dados faltando para efetuar login do usuário!`);

        const listUserByEmail = new ListUserByEmail(this.repository)

        const userOwnerEmail = await listUserByEmail.execute(email)
            .then(({ data }) => data)
            .catch(err => undefined);

        if (userOwnerEmail.token_2fa.trim() !== '')
            throw new UserPasswordIncorrectError('O usuário ainda não foi registrado!')

        if (!userOwnerEmail)
            throw new UserMissingDataError('Não foi encontrado um usuário com esse email!');

        const passwordHashDecrypted = decrypt(userOwnerEmail.password ?? '');
        if (passwordHashDecrypted != password)
            throw new UserPasswordIncorrectError('A senha inserida não coincide com a cadastrada!');


        const data = await this.repository.findUserById(userOwnerEmail.id_user);

        const token = signToken({
            id_user: data?.id_user,
            name: data?.name,
            cpf_cnpj: data?.cpf_cnpj,
            person_type: data?.person_type,
            email: data?.email
        });

        return {
            data: { token, ...data },
            message: 'Usuário logado com sucesso!'
        };
    }
}