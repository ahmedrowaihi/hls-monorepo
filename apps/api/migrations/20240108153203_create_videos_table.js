/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("videos", function (table) {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.text("description");
    table.string("file_path").notNullable();
    table.timestamp("uploaded_at").defaultTo(knex.fn.now());
    table.string("status").notNullable().defaultTo("queued"); // e.g., 'queued', 'processing', 'completed', 'failed'
    table.text("error_message"); // For storing error messages if the processing fails
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("videos");
};
