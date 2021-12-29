import { TNAMES } from '../consts'

function tableName (tname) {
  return process.env.CUSTOM_MIGRATION_SCHEMA 
    ? `${process.env.CUSTOM_MIGRATION_SCHEMA}.${tname}`
    : tname
}

exports.up = (knex, Promise) => {
  const builder = process.env.CUSTOM_MIGRATION_SCHEMA
    ? knex.schema.withSchema(process.env.CUSTOM_MIGRATION_SCHEMA)
    : knex.schema

  return builder.createTable(TNAMES.VOTES, (table) => {
    table.integer('survey_id').notNullable()
      .references('id').inTable(tableName(TNAMES.SURVEYS))
    table.integer('option_id').notNullable()
      .references('id').inTable(tableName(TNAMES.OPTIONS))
    table.string('author').notNullable()
    table.integer('value').notNullable()
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
    table.primary(['author', 'survey_id', 'option_id'])
  })
}

exports.down = (knex, Promise) => {
  const builder = process.env.CUSTOM_MIGRATION_SCHEMA
    ? knex.schema.withSchema(process.env.CUSTOM_MIGRATION_SCHEMA)
    : knex.schema

  return builder.dropTable(TNAMES.VOTES)
}
