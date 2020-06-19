import { TNAMES } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TNAMES.VOTES, (table) => {
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
  return knex.schema.dropTable(TNAMES.VOTES)
}
