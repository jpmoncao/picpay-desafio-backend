import ITransferRepo from "../database/repos/TransferRepo.js";
import TransferProps from "../database/domain/shopkeeper.js";
import UseCase from "../types/UseCase.js";

export default class CreateTransfer {
    repository: ITransferRepo;

    constructor(repository: ITransferRepo) {
        this.repository = repository;
    }

    async execute(props: TransferProps): Promise<UseCase> {
        let { id_payer, id_payee, amount } = props;

        const transfer = await this.repository.createTransfer({ id_payer, id_payee, amount });
        const data = await this.repository.findTransferById(Number(transfer ?? 0));

        return {
            data,
            message: 'Transferência criada com sucesso!'
        };
    }
}