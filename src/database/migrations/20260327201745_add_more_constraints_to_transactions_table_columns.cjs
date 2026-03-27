/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // Drop existing foreign key on initiated_by so that we can alter it and add not nullable contrait
  await knex.schema.alterTable("transactions", (table) => {
    table.dropForeign("initiated_by");
  });

  await knex.schema.alterTable("transactions", (table) => {
    table.integer("initiated_by").unsigned().notNullable().alter();
    table
      .timestamp("created_at")
      .notNullable()
      .defaultTo(knex.fn.now())
      .alter();
  });

  await knex.schema.alterTable("transactions", (table) => {
    table
      .foreign("initiated_by")
      .references("id")
      .inTable("users")
      .onDelete("RESTRICT");
  });

  await knex.raw(`
    ALTER TABLE transactions
    ADD CONSTRAINT check_sender_receiver
    CHECK (
      sender_wallet_id IS NOT NULL
      OR receiver_wallet_id IS NOT NULL
    )
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.raw(`
        ALTER TABLE transactions
        DROP CONSTRAINT check_sender_receiver
    `);

  await knex.schema.alterTable("transactions", (table) => {
    table
      .integer("initiated_by")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL")
      .alter();
    table.timestamp("created_at").nullable().alter();
  });
};
