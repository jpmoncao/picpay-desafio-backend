import UseCase from "../types/UseCase.js";

import UserProps from "../database/domain/user.js";
import { TransferMissingDataError } from "../errors/Transfer.js";

import sendMail from "../utils/mailer.js";

export default class SendMailToTransfer {
    constructor() { }

    async execute(transferProps: any, payerProps: UserProps | undefined, payeeProps: UserProps | undefined): Promise<UseCase> {
        try {
            if (!transferProps || !payerProps || !payeeProps) {
                throw new TransferMissingDataError(`Email cancelado pois falta dados para o envio!`);
            }

            await sendMail(payerProps.email ?? '', '<h1>payer</h1>');
            await sendMail(payeeProps.email ?? '', '<h1>payee</h1>');

            return {
                data: [],
                message: 'Email enviado com sucesso!'
            };
        } catch (err) {
            throw err;
        }
    }
}
