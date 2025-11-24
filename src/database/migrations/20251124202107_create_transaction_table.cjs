/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("transactions", (table) => {
    table.increments("id").primary();
    table.decimal("amount", 14, 2).notNullable();
    table
      .integer("receiver_wallet_id")
      .unsigned()
      .references("id")
      .inTable("wallets");
    table
      .integer("sender_wallet_id")
      .unsigned()
      .references("id")
      .inTable("wallets");
    table.string("reference").unique().notNullable().index();
    table.text("notes");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("transactions");
};
