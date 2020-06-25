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

    it('must cast a new vote', async () => {
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

    async function _cast (optId, value, UID) {
      g.UID = UID
      const url = `/votes/${data.s1.id}/${data.options[0].id}`
      const res = await r.post(url).send({ value: value })
      res.should.have.status(200)
    }

    it('must cast another votes and then get results', async () => {
      await _cast(data.options[0].id, 1, 400)
      await _cast(data.options[0].id, 1, 401)
      await _cast(data.options[0].id, 1, 402)
      await _cast(data.options[0].id, -1, 405)
      const url = `/votes/results/${data.s1.id}`
      const res = await r.get(url)
      res.should.have.status(200)
      res.body.pos[0].option_id.should.equal(data.options[0].id)
      res.body.pos[0].sum.should.equal(4)
    })
  })
}
