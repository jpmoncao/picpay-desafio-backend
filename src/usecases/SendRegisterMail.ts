import dotenv from 'dotenv';
import UseCase from "../types/UseCase.js";

import UserProps from "../database/domain/user.js";
import { UserMissingDataError } from "../errors/User.js";

import { mailRegisterUser } from "../assets/mail-register.js";
import sendMail from "../utils/mailer.js";
import { decrypt } from '../utils/hash.js';

dotenv.config();

export default class SendRegisterMail {
    constructor() { }

    async execute(userProps: UserProps): Promise<UseCase> {
        try {
            if (!userProps) {
                throw new UserMissingDataError(`Email cancelado pois falta dados para o envio!`);
            }

            const code = decrypt(userProps.token_2fa ?? '');
            const urlEmailRegister = `${process.env.REGISTER_HREF ?? ''}${(userProps.id_user ?? 0)}?code=${code}`;

            await sendMail(userProps.email ?? '',
                "Confirme seu registro e aproveite o Simulador de Banco!",
                mailRegisterUser({
                    name: userProps.name ?? '',
                    url: urlEmailRegister
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
