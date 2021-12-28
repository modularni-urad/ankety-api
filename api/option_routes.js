import MWarez from './options'

export default (ctx, app) => {
  const { auth, bodyParser } = ctx
  const MW = MWarez(ctx)

  app.get('/:id([0-9]+)', (req, res, next) => {
    MW.list(req.params.id, req.tenantid).then(info => {
      res.json(info)
    }).catch(next)
  })

  app.post('/:id([0-9]+)', auth.session, auth.required, bodyParser, (req, res, next) => {
    MW.create(req.params.id, req.body, req.tenantid).then(created => {
      res.json(created)
    }).catch(next)
  })

  app.put('/:survid([0-9]+)/:id([0-9]+)', auth.session, auth.required, bodyParser, (req, res, next) => {
    MW.update(req.params.survid, req.params.id, req.body, req.tenantid).then(val => {
      res.json(val)
    }).catch(next)
  })

  app.delete('/:survid([0-9]+)/:id([0-9]+)', auth.session, auth.required, (req, res, next) => {
    MW.remove(req.params.survid, req.params.id, req.tenantid).then(val => {
      res.json(val)
    }).catch(next)
  })

  return app
}
