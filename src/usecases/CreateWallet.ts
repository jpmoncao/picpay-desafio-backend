import IWalletRepo from "../database/repos/WalletRepo.js";
import WalletProps from "../database/domain/wallet.js";
import UseCase from "../types/UseCase.js";

import { WalletMissingDataError } from "../errors/Wallet.js";

export default class CreateWallet {
    repository: IWalletRepo;

    constructor(repository: IWalletRepo) {
        this.repository = repository;
    }

    async execute(props: WalletProps): Promise<UseCase> {
        let { id_user } = props;

        if (!id_user || id_user <= 0)
            throw new WalletMissingDataError(`Nenhum ID de usuário foi encontrado para criar a carteira!`);

        const walletId = await this.repository.createWallet({ id_user });

        const data = await this.repository.findWalletById(Number(walletId));

        return {
            data,
            message: 'Carteira criada com sucesso!'
        };
    }
}