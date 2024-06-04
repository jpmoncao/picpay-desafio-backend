import TransferProps from "../domain/transfer.js";
import { Repo } from "./Repo.js";

export default interface ITransferRepo extends Repo {
    findTransferById: (transferId: number) => Promise<TransferProps | undefined>;
    findTransferByUserId: (userId: number, page: number, limit: number) => Promise<any[] | undefined>;
    findTransferByPayerId: (userId: number, page: number, limit: number) => Promise<any[] | undefined>;
    findTransferByPayeeId: (userId: number, page: number, limit: number) => Promise<any[] | undefined>;
    createTransfer: (props: TransferProps) => Promise<TransferProps | undefined>;
}