import ShopkeeperRepo from "../domain/shopkeeper.js";
import { Repo } from "./Repo.js";

export default interface IShopkeeperRepo extends Repo {
    findShopkeepers: (page: number, limit: number) => Promise<ShopkeeperRepo[] | undefined>;
    findShopkeeperById: (shopkeeperId: number) => Promise<ShopkeeperRepo | undefined>;
    findShopkeeperByCPF: (cpf: string) => Promise<ShopkeeperRepo | undefined>;
    findShopkeeperByCNPJ: (cpnj: string) => Promise<ShopkeeperRepo | undefined>;
    findShopkeeperByEmail: (email: string) => Promise<ShopkeeperRepo | undefined>;
    createShopkeeper: (props: ShopkeeperRepo) => Promise<ShopkeeperRepo | undefined>;
}