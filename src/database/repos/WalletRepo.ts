import WalletProps from "../domain/wallet.js";
import { Repo } from "./Repo.js";

export default interface IWalletRepo extends Repo {
    createWallet: (props: WalletProps) => Promise<WalletProps | undefined>;
    updateBalanceWallet: (props: WalletProps) => Promise<WalletProps | undefined>;
    updateTypeWallet: (props: WalletProps) => Promise<WalletProps | undefined>;
    findWalletById: (walletId: number) => Promise<WalletProps | undefined>;
    findWalletByUserId: (userId: number) => Promise<WalletProps | undefined>;
}