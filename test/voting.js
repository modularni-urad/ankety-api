/* global describe it before */
const chai = require('chai')
// const should = chai.should()
// import _ from 'underscore'

module.exports = (g) => {
  //
  const r = chai.request(g.baseurl)
  const data = {}

  return describe('voting', () => {
    //
    before(async () => {
      const surveysRes = await r.get('/surveys')
      surveysRes.should.have.status(200)
      data.s1 = surveysRes.body[0]
      const optionsRes = await r.get(`/options/${data.s1.id}`)
      optionsRes.should.have.status(200)
      data.options = optionsRes.body
    })

    it('must create a new vote', async () => {
      const url = `/votes/${data.s1.id}/${data.options[0].id}`
      let res = await r.post(url).send({ value: 1 })
      res.should.have.status(200)
      res = await r.post(url).send({ value: 1 })
      res.should.have.status(400)
      res = await r.delete(url)
      res.should.have.status(200)
      res = await r.post(url).send({ value: 1 })
      res.should.have.status(200)
    })
  })
}
