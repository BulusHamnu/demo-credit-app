/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable("transactions", (table) => {
    table
      .enu("type", ["deposit", "withdrawal", "transfer"])
      .notNullable()
      .defaultTo("transfer");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable("transactions", (table) => {
    table.dropColumn("type");
  });
};
