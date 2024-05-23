import LojistaRepo from "../domain/lojista.js";
import { Repo } from "./Repo.js";

export default interface ILojistaRepo extends Repo {
    findUsers: (page: number, limit: number) => Promise<LojistaRepo[] | undefined>;
    findUserById: (userId: number) => Promise<LojistaRepo | undefined>;
    findUserByCPF: (cpf: string) => Promise<LojistaRepo | undefined>;
    findUserByCNPJ: (cpnj: string) => Promise<LojistaRepo | undefined>;
    findUserByEmail: (email: string) => Promise<LojistaRepo | undefined>;
    createUser: (props: LojistaRepo) => Promise<LojistaRepo | undefined>;
}