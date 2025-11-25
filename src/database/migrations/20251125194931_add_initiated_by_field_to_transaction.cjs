/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable("transactions", (table) => {
    table
      .integer("initiated_by")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable("transactions", (table) => {
    table.dropColumn("initiated_by");
  });
};
