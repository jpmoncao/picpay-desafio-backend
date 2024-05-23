import LojistaRepo from "../domain/lojista.js";
import { Repo } from "./Repo.js";

export default interface ILojistaRepo extends Repo {
    findLojistas: (page: number, limit: number) => Promise<LojistaRepo[] | undefined>;
    findLojistaById: (lojistaId: number) => Promise<LojistaRepo | undefined>;
    findLojistaByCPF: (cpf: string) => Promise<LojistaRepo | undefined>;
    findLojistaByCNPJ: (cpnj: string) => Promise<LojistaRepo | undefined>;
    findLojistaByEmail: (email: string) => Promise<LojistaRepo | undefined>;
    createLojista: (props: LojistaRepo) => Promise<LojistaRepo | undefined>;
}