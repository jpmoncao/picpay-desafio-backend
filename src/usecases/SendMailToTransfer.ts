import UseCase from "../types/UseCase.js";

import UserProps from "../database/domain/user.js";
import { TransferMissingDataError } from "../errors/Transfer.js";

import { mailTransferPayee, mailTransferPayer } from "../assets/mails-transfer.js";
import sendMail from "../utils/mailer.js";

export default class SendMailToTransfer {
    constructor() { }

    async execute(transferProps: any, payerProps: UserProps | undefined, payeeProps: UserProps | undefined): Promise<UseCase> {
        try {
            if (!transferProps || !payerProps || !payeeProps) {
                throw new TransferMissingDataError(`Email cancelado pois falta dados para o envio!`);
            }


            await sendMail(payerProps.email ?? '',
                "Uma transferência foi efetuada com sucesso!",
                mailTransferPayer(
                    { name: payerProps.name ?? '', cpf_cnpj: payerProps.cpf_cnpj ?? '' },
                    { name: payeeProps.name ?? '', cpf_cnpj: payeeProps.cpf_cnpj ?? '' },
                    transferProps.amount)
            );
            await sendMail(payeeProps.email ?? '',
                "Uma transferência foi recebida!",
                mailTransferPayee(
                    { name: payerProps.name ?? '', cpf_cnpj: payerProps.cpf_cnpj ?? '' },
                    { name: payeeProps.name ?? '', cpf_cnpj: payeeProps.cpf_cnpj ?? '' },
                    transferProps.amount,
                    false)
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
