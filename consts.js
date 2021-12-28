
export const TNAMES = {
  SURVEYS: 'ankety',
  OPTIONS: 'ankety_moznosti',
  VOTES: 'ankety_votes'
}

export const GROUPS = {
  ADMIN: 'anketyadmin'
}

export function getQB (knex, tablename, schema) {
  return schema
    ? knex(knex.ref(tablename).withSchema(schema))
    : knex(tablename)
}