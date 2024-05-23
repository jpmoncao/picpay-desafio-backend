import { Knex } from "knex";

export interface Repo {
    conn: Knex<any, any[]>;
}