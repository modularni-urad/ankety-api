import MWarez from './surveys'
import OptionRoutes from './option_routes'
import VotingRoutes from './voting_routes'
import { trustedAuth } from './utils'

export default (ctx) => {
  const { auth, bodyParser } = ctx
  const app = ctx.express()
  const MW = MWarez(ctx)

  app.get('/', (req, res, next) => {
    MW.list(req.query, req.tenantid).then(found => res.json(found)).catch(next)
  })

  app.post('/', auth.session, trustedAuth, auth.required, bodyParser, (req, res, next) => {
    MW.create(req.body, req.user, req.tenantid).then(created => {
      res.json(created)
    }).catch(next)
  })

  app.put('/:id([0-9]+)', auth.session, auth.required, bodyParser, (req, res, next) => {
    MW.update(req.params.id, req.body, req.user, req.tenantid).then(val => {
      res.json(val)
    }).catch(next)
  })

  OptionRoutes(ctx, app)
  VotingRoutes(ctx, app)

  return app
}
