import dotenv from 'dotenv';
import knex from 'knex';

dotenv.config();

export default function createConn(): knex.Knex {
    const conn = knex({
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST || '127.0.0.1',
            port: Number(process.env.DB_PORT) || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'database',

        },
        log: {
            warn(message) { console.warn(message) },
            error(message) { console.error(message) },
            deprecate(message) { console.error(message) },
            debug(message) { console.log(message) },
        },
    });

    // console.log(JSON.stringify(conn.client.config.connection));
    return conn;
}
