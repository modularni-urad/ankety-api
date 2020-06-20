import { whereFilter } from 'knex-filter-loopback'
import { TNAMES } from '../consts'
import _ from 'underscore'

export default (ctx) => {
  const { knex, auth, JSONBodyParser } = ctx
  const app = ctx.express()

  app.get('/', (req, res, next) => {
    knex(TNAMES.SURVEYS).where(whereFilter(req.query)).then(info => {
      res.json(info)
      next()
    }).catch(next)
  })

  const noteditables = ['id', 'author', 'created']

  async function createProject (req) {
    req.body = _.omit(req.body, noteditables)
    Object.assign(req.body, { author: auth.getUID(req) })
    await knex(TNAMES.SURVEYS).returning('id').insert(req.body)
  }

  app.post('/', auth.required, JSONBodyParser, (req, res, next) => {
    createProject(req).then(createdid => (res.json(createdid))).catch(next)
  })

  async function updateProject (req) {
    const s = await knex(TNAMES.SURVEYS).where({ id: req.params.id }).first()
    if (!s) throw new Error(404)
    const now = new Date()
    if (now > s.voting_start) throw new Error('too late, voting in progress')
    req.body = _.pick(req.body, editables)
    await knex(TNAMES.SURVEYS).where({ id: req.params.id }).update(req.body)
  }

  app.put('/:id([0-9]+)', auth.required, JSONBodyParser, (req, res, next) => {
    updateProject(req).then(val => (res.json(val))).catch(next)
  })

  return app
}
