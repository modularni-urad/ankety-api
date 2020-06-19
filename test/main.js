/* global describe before after */
// const fs = require('fs')
import chai from 'chai'
import { init } from '../server'
import dbinit from './utils/dbinit'
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const port = process.env.PORT || 3333
const g = {
  baseurl: `http://localhost:${port}`,
  UID: 111,
  gimli: {
    name: 'gimli', id: 1
  },
  gandalf: {
    name: 'gandalf', id: 11
  }
}
// g.gimliToken = `Bearer ${jwt.sign(g.gimli, process.env.SERVER_SECRET)}`
// g.gandalfToken = `Bearer jwt.sign(g.gandalf, process.env.SERVER_SECRET)}`
const mocks = {
  dbinit: dbinit,
  auth: {
    required: (req, res, next) => { return next() },
    getUID: (req) => { return g.UID }
  }
}

describe('app', () => {
  before(done => {
    init(mocks).then(app => {
      g.server = app.listen(port, '127.0.0.1', (err) => {
        if (err) return done(err)
        done()
      })
    }).catch(done)
  })
  after(done => {
    g.server.close(err => {
      return err ? done(err) : done()
    })
  })

  describe('API', () => {
    //
    const submodules = [
      './survey',
      './voting'
    ]
    submodules.map((i) => {
      const subMod = require(i)
      subMod(g)
    })
  })
})
