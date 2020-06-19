import { TNAMES } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TNAMES.OPTIONS, (table) => {
    table.increments('id').primary()
    table.integer('survey_id').notNullable()
      .references('id').inTable(TNAMES.SURVEYS)
    table.string('title').notNullable()
    table.string('image')
    table.string('desc')
    table.string('link')
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TNAMES.OPTIONS)
}
