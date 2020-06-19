import initSurveyRoutes from './api/surveys'
import initOptionsRoutes from './api/options'
import initVotingRoutes from './api/voting_routes'

export default (ctx) => {
  const app = ctx.express()

  app.use('/surveys', initSurveyRoutes(ctx))
  app.use('/options', initOptionsRoutes(ctx))
  app.use('/votes', initVotingRoutes(ctx))

  return app
}
