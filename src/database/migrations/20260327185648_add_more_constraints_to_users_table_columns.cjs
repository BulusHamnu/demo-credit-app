/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable("users", (table) => {
    table.string("full_name").notNullable().alter();
    table.dropUnique(["token"], "users_token_unique");
    table
      .timestamp("created_at")
      .notNullable()
      .defaultTo(knex.fn.now())
      .alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable("users", (table) => {
    table.string("full_name").nullable().alter();
    table.unique(["token"]);
    table.timestamp("created_at").nullable().alter();
  });
};
