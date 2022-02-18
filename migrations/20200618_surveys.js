import { TNAMES, STATES } from '../consts'

exports.up = (knex, Promise) => {
  const builder = process.env.CUSTOM_MIGRATION_SCHEMA
    ? knex.schema.withSchema(process.env.CUSTOM_MIGRATION_SCHEMA)
    : knex.schema

  return builder.createTable(TNAMES.SURVEYS, (table) => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.string('author').notNullable()
    table.string('desc').notNullable()
    table.string('image')
    table.integer('maxpositive').defaultTo(1)
    table.integer('maxnegative').defaultTo(0)
    table.integer('maxperoption').defaultTo(1)
    table.timestamp('voting_start').notNullable()
    table.timestamp('voting_end').notNullable()
    table.string('status', 8).notNullable().defaultTo(STATES.WAITING)
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = (knex, Promise) => {
  const builder = process.env.CUSTOM_MIGRATION_SCHEMA
    ? knex.schema.withSchema(process.env.CUSTOM_MIGRATION_SCHEMA)
    : knex.schema
  return builder.dropTable(TNAMES.SURVEYS)
}
