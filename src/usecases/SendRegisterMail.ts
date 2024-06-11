import UseCase from "../types/UseCase.js";

import UserProps from "../database/domain/user.js";
import { UserMissingDataError } from "../errors/User.js";

import { mailRegisterUser } from "../assets/mail-register.js";
import sendMail from "../utils/mailer.js";

export default class SendRegisterMail {
    constructor() { }

    async execute(userProps: UserProps): Promise<UseCase> {
        try {
            if (!userProps) {
                throw new UserMissingDataError(`Email cancelado pois falta dados para o envio!`);
            }

            await sendMail(userProps.email ?? '',
                "Confirme seu registro e aproveite o Simulador de Banco!",
                mailRegisterUser({
                    name: userProps.name ?? '',
                    id_user: userProps.id_user ?? 0,
                    hash: userProps.token_2fa ?? ''
                })
            );

            return {
                data: [],
                message: 'Email enviado com sucesso!'
            };
        } catch (err) {
            throw err;
        }
    }
}
