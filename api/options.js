import { TNAMES } from '../consts'
import _ from 'underscore'

export default (ctx) => {
  const { knex, auth, JSONBodyParser } = ctx
  const app = ctx.express()

  app.get('/:id([0-9]+)', (req, res, next) => {
    knex(TNAMES.OPTIONS).where({ survey_id: req.params.id }).then(info => {
      res.json(info)
      next()
    }).catch(next)
  })

  const editables = ['title', 'desc', 'image', 'link']

  async function _checkEditable (surveyId) {
    const s = await knex(TNAMES.SURVEYS).where({ id: surveyId }).first()
    if (!s) throw new Error(404)
    const now = new Date()
    if (now > s.voting_start) throw new Error('too late, voting in progress')
    return s
  }

  async function createOption (req) {
    await _checkEditable(req.params.id)
    req.body = _.pick(req.body, editables)
    Object.assign(req.body, { survey_id: req.params.id })
    await knex(TNAMES.OPTIONS).returning('id').insert(req.body)
  }

  app.post('/:id([0-9]+)', auth.required, JSONBodyParser, (req, res, next) => {
    createOption(req).then(createdid => (res.json(createdid))).catch(next)
  })

  async function updateOption (req) {
    await _checkEditable(req.params.survey_id)
    req.body = _.pick(req.body, editables)
    await knex(TNAMES.OPTIONS).where({ id: req.params.id }).update(req.body)
  }

  app.put('/:survey_id([0-9]+)/:id([0-9]+)',
    auth.required,
    JSONBodyParser,
    (req, res, next) => {
      updateOption(req).then(val => (res.json(val))).catch(next)
    })

  app.delete('/:id([0-9]+)', auth.required, (req, res, next) => {
    knex(TNAMES.SURVEYS).where({ id: req.params.id }).del().then(r => {
      res.json(r)
    }).catch(next)
  })

  return app
}
