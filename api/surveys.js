import { TNAMES } from '../consts'
const conf = {
  tablename: TNAMES.SURVEYS,
  editables: [
    'name', 'desc', 'image',
    'maxpositive', 'maxnegative', 'maxperoption', 
    'voting_start', 'voting_end'
  ]
}

export default (ctx) => {
  const { knex, ErrorClass } = ctx
  const _ = ctx.require('underscore')
  const entityMWBase = ctx.require('entity-api-base').default
  const MW = entityMWBase(conf, knex, ErrorClass)

  return { list, create, update }

  function list (query, schema) {
    query.filter = query.filter || {}
    return MW.list(query, schema)
  }

  function create (body, user, schema) {
    MW.check_data(body)
    Object.assign(body, { author: user.id })
    return MW.create(body, schema)
  }

  async function update(id, body, user, schema) {
    const existing = await MW.get(id, schema)
    if (!existing) throw new ErrorClass(404, 'survey not found')
    const now = new Date()
    if (now > existing.voting_start) {
      throw new ErrorClass(400, 'too late, voting in progress')
    }
    MW.check_data(body)
    return MW.update(id, body, schema)
  }
}
