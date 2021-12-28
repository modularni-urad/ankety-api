import { TNAMES } from '../consts'

exports.up = (knex, Promise) => {
  const builder = process.env.CUSTOM_MIGRATION_SCHEMA
    ? knex.schema.withSchema(process.env.CUSTOM_MIGRATION_SCHEMA)
    : knex.schema

  return builder.createTable(TNAMES.VOTES, (table) => {
    table.integer('survey_id').notNullable()
      .references('id').inTable(TNAMES.SURVEYS)
    table.integer('option_id').notNullable()
      .references('id').inTable(TNAMES.OPTIONS)
    table.string('author').notNullable()
    table.integer('value').notNullable()
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
    table.unique(['author', 'survey_id', 'option_id'])
  })
}

exports.down = (knex, Promise) => {
  const builder = process.env.CUSTOM_MIGRATION_SCHEMA
    ? knex.schema.withSchema(process.env.CUSTOM_MIGRATION_SCHEMA)
    : knex.schema

  return builder.dropTable(TNAMES.VOTES)
}
