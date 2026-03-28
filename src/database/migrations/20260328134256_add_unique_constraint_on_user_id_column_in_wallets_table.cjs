/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable("wallets", (table) => {
    table.unique("user_id", {
      indexName: "wallets_user_id_unique",
    });
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable("wallets", (table) => {
    table.dropUnique("user_id", "wallets_user_id_unique");
  });
};
