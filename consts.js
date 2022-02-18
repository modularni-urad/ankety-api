
export const TNAMES = {
  SURVEYS: 'ankety',
  OPTIONS: 'ankety_moznosti',
  VOTES: 'ankety_votes'
}

export const GROUPS = {
  ADMIN: 'anketyadmin'
}

export const STATES = {
  WAITING: 'waiting',
  OPEN: 'open',
  CLOSED: 'closed'
}

export function getQB (knex, tablename, schema) {
  return schema
    ? knex(knex.ref(tablename).withSchema(schema))
    : knex(tablename)
}