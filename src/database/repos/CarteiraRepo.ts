import CarteiraProps from "../domain/carteira.js";
import { Repo } from "./Repo.js";

export default interface ICarteiraRepo extends Repo {
    createCarteira: (props: CarteiraProps) => Promise<CarteiraProps | undefined>;
    updateBalanceCarteira: (props: CarteiraProps) => Promise<CarteiraProps | undefined>;
    updateTypeCarteira: (props: CarteiraProps) => Promise<CarteiraProps | undefined>;
    findCarteiraById: (carteiraId: number) => Promise<CarteiraProps | undefined>;
    findCarteiraByUserId: (userId: number) => Promise<CarteiraProps | undefined>;
}