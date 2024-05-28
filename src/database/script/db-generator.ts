import knex from "knex";
import chalk from "chalk";

import createConn from "../conn.js";

async function up(knex: knex.Knex): Promise<void> {
    // Criação da tabela "users"
    const hasUsersTable = await knex.schema.hasTable('users');
    if (!hasUsersTable) {
        await knex.schema.createTable('users', (table) => {
            table.increments('id_user');
            table.string('name', 255).notNullable();
            table.string('cpf_cnpj', 14).notNullable().unique();
            table.string('email', 255).notNullable().unique();
            table.string('password', 255).notNullable();
            table.string('person_type', 1).notNullable().defaultTo('F');
        });
    }

    // Criação da tabela "wallet"
    const hasWalletTable = await knex.schema.hasTable('wallet');
    if (!hasWalletTable) {
        await knex.schema.createTable('wallets', (table) => {
            table.increments('id_wallet');
            table.integer('id_user').unsigned().notNullable();
            table.decimal('balance', 15, 2).notNullable().defaultTo(0.00);
            table.string('shopkeeper', 1).notNullable().defaultTo('N');
            table.foreign('id_user').references('id_user').inTable('users');
        });
    }

    // Criação da tabela "shopkeepers"
    const hasShopkeepersTable = await knex.schema.hasTable('shopkeepers');
    if (!hasShopkeepersTable) {
        await knex.schema.createTable('shopkeepers', (table) => {
            table.increments('id_shopkeeper');
            table.integer('id_user').unsigned().notNullable();
            table.foreign('id_user').references('id_user').inTable('users');
        });
    }

    // Criação da tabela "transferencia"
    const hasTransferenciaTable = await knex.schema.hasTable('transferencias');
    if (!hasTransferenciaTable) {
        await knex.schema.createTable('transferencia', (table) => {
            table.increments('id_transferencia');
            table.integer('id_user').unsigned().notNullable();
            table.integer('id_destinatario').unsigned().notNullable();
            table.decimal('valor', 15, 2).notNullable();
            table.string('entrada_saida', 1).notNullable();
            table.foreign('id_user').references('id_user').inTable('users');
            table.foreign('id_destinatario').references('id_user').inTable('users');
        });
    }
}

async function down(knex: knex.Knex): Promise<void> {
    await knex.schema.dropTableIfExists('transferencia');
    await knex.schema.dropTableIfExists('shopkeepers');
    await knex.schema.dropTableIfExists('wallet');
    await knex.schema.dropTableIfExists('users');
}

(async () => {
    try {
        const conn = createConn();

        await down(conn);
        await up(conn);

        console.log(chalk.bgGreenBright('Database has '), chalk.bgGreen.bold('created!'));
        process.exit(0);
    } catch (error) {
        console.error(error)
        process.exit(1);
    }
})()
