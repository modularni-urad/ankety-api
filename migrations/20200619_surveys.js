import { TNAMES } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TNAMES.SURVEYS, (table) => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.string('author').notNullable()
    table.string('desc').notNullable()
    table.string('image')
    table.string('vote_sett').notNullable().defaultTo('1,0,1')
    table.timestamp('voting_start').notNullable()
    table.timestamp('voting_end').notNullable()
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TNAMES.SURVEYS)
}
