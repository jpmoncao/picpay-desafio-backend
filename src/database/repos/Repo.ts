import { Knex } from "knex";

export interface Repo {
    trx: Knex.Transaction<any, any[]>;
}