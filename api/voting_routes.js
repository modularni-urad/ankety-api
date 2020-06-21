import { getExisting, createVote, deleteVote } from './voting'

export default (ctx) => {
  const { knex, auth, JSONBodyParser } = ctx
  const app = ctx.express()

  app.get('/:id([0-9]+)', auth.required, (req, res, next) => {
    getExisting(knex, auth.getUID(req), req.params.id)
      .then(found => {
        res.json(found)
      })
      .catch(next)
  })

  app.post('/:surveyId([0-9]+)/:id([0-9]+)',
    auth.required,
    JSONBodyParser, (req, res, next) => {
      const { id, surveyId } = req.params
      createVote(knex, auth.getUID(req), surveyId, id, req.body.value)
        .then(() => res.json(req.body.value)).catch(next)
    })

  app.delete('/:surveyId([0-9]+)/:id([0-9]+)',
    auth.required, (req, res, next) => {
      const { id, surveyId } = req.params
      deleteVote(knex, auth.getUID(req), surveyId, id)
        .then(info => { res.json(info) }).catch(next)
    })

  return app
}
