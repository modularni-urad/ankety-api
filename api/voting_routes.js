import Middleware from './voting'

export default (ctx, app) => {
  const { auth, bodyParser } = ctx
  const MW = Middleware(ctx)

  app.get('/votes/:id([0-9]+)', auth.session, auth.required, (req, res, next) => {
    MW.getExisting(auth.getUID(req), req.params.id, req.tenantid)
      .then(found => {
        res.json(found)
      })
      .catch(next)
  })

  app.get('/results/:id([0-9]+)', (req, res, next) => {
    MW.getResults(req.params.id, req.tenantid)
      .then(found => { res.json(found) })
      .catch(next)
  })

  app.post('/votes/:surveyId([0-9]+)/:optid([0-9]+)',
    auth.session, 
    auth.required, bodyParser,
    (req, res, next) => {
      const { optid, surveyId } = req.params
      MW.createVote(auth.getUID(req), surveyId, optid, req.body.value, req.tenantid)
        .then(() => res.json(req.body.value)).catch(next)
    })

  app.delete('/votes/:surveyId([0-9]+)/:optid([0-9]+)',
    auth.session, 
    auth.required, (req, res, next) => {
      const { optid, surveyId } = req.params
      MW.deleteVote(auth.getUID(req), surveyId, optid, req.tenantid)
        .then(info => { res.json(info) }).catch(next)
    })
}
