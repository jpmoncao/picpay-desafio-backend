import IWalletRepo from "../database/repos/WalletRepo.js";
import WalletProps from "../database/domain/wallet.js";
import UseCase from "../types/UseCase.js";

import { WalletMissingDataError, WalletNotFoundError } from "../errors/Wallet.js";

export default class EditWallet {
    repository: IWalletRepo;

    constructor(repository: IWalletRepo) {
        this.repository = repository;
    }

    async execute(props: WalletProps): Promise<UseCase> {
        let { id_user, id_wallet, balance, shopkeeper } = props;

        if (!id_user || id_user == 0 &&
            !id_wallet || id_wallet == 0)
            throw new WalletMissingDataError('O ID da carteira à alterar não foi informado!');

        if (!balance && !shopkeeper && shopkeeper !== false)
            throw new WalletMissingDataError('Os dados à alterar não foram passados');

        let wallet: WalletProps | undefined;
        id_wallet = id_wallet ?? 0;
        id_user = id_user ?? 0;

        if (shopkeeper === true || shopkeeper === false)
            shopkeeper = shopkeeper ? 'S' : 'N';

        if (id_wallet > 0)
            wallet = await this.repository.findWalletById(id_wallet);
        else if (id_user > 0)
            wallet = await this.repository.findWalletByUserId(id_user);

        if (!wallet)
            throw new WalletNotFoundError('A carteira não existe!');

        if (shopkeeper && shopkeeper != wallet.shopkeeper)
            await this.repository.updateTypeWallet({ id_user, id_wallet, shopkeeper });

        if (balance && balance != wallet.balance)
            await this.repository.updateBalanceWallet({ id_user, id_wallet, balance });

        let data: WalletProps | undefined;
        if (id_wallet > 0)
            data = await this.repository.findWalletById(id_wallet);
        else if (id_user > 0)
            data = await this.repository.findWalletByUserId(id_user);

        return {
            data,
            message: 'Carteira editada com sucesso!'
        };
    }
}