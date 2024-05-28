import TransferProps from "../domain/transfer.js";
import { Repo } from "./Repo.js";

export default interface ITransferRepo extends Repo {
    findTransferByUserId: (userId: number, page: number, limit: number) => Promise<TransferProps[] | undefined>;
    findTransferByPayerId: (userId: number, page: number, limit: number) => Promise<TransferProps[] | undefined>;
    findTransferByPayeeId: (userId: number, page: number, limit: number) => Promise<TransferProps[] | undefined>;
    createTransfer: (props: TransferProps) => Promise<TransferProps | undefined>;
}