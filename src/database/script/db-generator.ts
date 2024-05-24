import knex from "knex";
import chalk from "chalk";

import createConn from "../conn.js";

async function up(knex: knex.Knex): Promise<void> {
    // Criação da tabela "users"
    const hasUsersTable = await knex.schema.hasTable('users');
    if (!hasUsersTable) {
        await knex.schema.createTable('users', (table) => {
            table.increments('id_user');
            table.string('nome', 255).notNullable();
            table.string('cpf_cnpj', 14).notNullable().unique();
            table.string('email', 255).notNullable().unique();
            table.string('senha', 255).notNullable();
            table.string('tipo_pessoa', 1).notNullable().defaultTo('F');
        });
    }

    // Criação da tabela "carteira"
    const hasCarteiraTable = await knex.schema.hasTable('carteira');
    if (!hasCarteiraTable) {
        await knex.schema.createTable('carteiras', (table) => {
            table.increments('id_carteira');
            table.integer('id_user').unsigned().notNullable();
            table.decimal('saldo', 15, 2).notNullable().defaultTo(0.00);
            table.string('lojista', 1).notNullable().defaultTo('N');
            table.foreign('id_user').references('id_user').inTable('users');
        });
    }

    // Criação da tabela "lojistas"
    const hasLojistasTable = await knex.schema.hasTable('lojistas');
    if (!hasLojistasTable) {
        await knex.schema.createTable('lojistas', (table) => {
            table.increments('id_lojista');
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
    await knex.schema.dropTableIfExists('lojistas');
    await knex.schema.dropTableIfExists('carteira');
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
