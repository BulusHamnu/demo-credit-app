/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable("wallets", (table) => {
    table.decimal("balance", 14, 2).defaultTo(0).notNullable().alter();
    table
      .timestamp("created_at")
      .notNullable()
      .defaultTo(knex.fn.now())
      .alter();
  });

  await knex.raw(`
    ALTER TABLE wallets ADD CONSTRAINT check_balance CHECK (balance >= 0)
`);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.raw(`
        ALTER TABLE wallets DROP CONSTRAINT check_balance 
    `);

  await knex.schema.alterTable("wallets", (table) => {
    table.decimal("balance", 14, 2).defaultTo(0).nullable.alter();
    table.timestamp("created_at").nullable().alter();
  });
};
