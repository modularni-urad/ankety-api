import { TNAMES, getQB } from '../consts'

export default (ctx) => {
  const { knex, ErrorClass } = ctx
  const _ = ctx.require('underscore')
  const editables = ['title', 'desc', 'image', 'link']
  
  return { list, create, update, remove }

  async function _checkEditable (surveyId, schema) {
    const s = await getQB(knex, TNAMES.SURVEYS, schema).where({ id: surveyId }).first()
    if (!s) throw new ErrorClass(404, 'survey not found')
    const now = new Date()
    if (now > s.voting_start) throw new ErrorClass(400, 'too late, voting in progress')
    return s
  }

  function list (surveyId, schema) {
    return getQB(knex, TNAMES.OPTIONS, schema).where({ survey_id: surveyId })
  }

  async function create (surveyId, body, schema) {
    await _checkEditable(surveyId, schema)
    body = _.pick(body, editables)
    Object.assign(body, { survey_id: surveyId })
    try {
      return getQB(knex, TNAMES.OPTIONS, schema).returning('*').insert(body)
    } catch (err) {
      throw new ErrorClass(400, err.toString())
    }
  }

  async function update (surveyId, id, body, schema) {
    await _checkEditable(surveyId, schema)
    body = _.pick(body, editables)
    try {
      return getQB(knex, TNAMES.OPTIONS, schema).returning('*')
        .where({ id }).update(body)
    } catch (err) {
      throw new ErrorClass(400, err.toString())
    }
  }

  async function remove (surveyId, id, schema) {
    await _checkEditable(surveyId, schema)
    try {
      return getQB(knex, TNAMES.OPTIONS, schema).where({ id }).del()
    } catch (err) {
      throw new ErrorClass(400, err.toString())
    }
  }
}
