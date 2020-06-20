/* global describe it */
import moment from 'moment'
const chai = require('chai')
chai.should()

module.exports = (g) => {
  const r = chai.request(g.baseurl)

  const s1 = {
    name: 'name1',
    desc: 'desc1',
    image: 'image1',
    maxpositive: 2,
    voting_start: moment().add(1, 'h'),
    voting_end: moment().add(2, 'h')
  }
  const opt1 = {
    title: 'option1',
    image: 'image.1'
  }
  const opt2 = {
    title: 'option2',
    image: 'image.2'
  }

  return describe('survey', () => {
    //
    it('shall create a new item p1', async () => {
      const res = await r.post('/surveys').send(s1)
      res.status.should.equal(200)
    })

    // it('shall update the item pok1', () => {
    //   const change = {
    //     name: 'pok1changed'
    //   }
    //   return r.put(`/tasks/${p.id}`).send(change)
    //   .set('Authorization', g.gimliToken)
    //   .then(res => {
    //     res.should.have.status(200)
    //   })
    // })

    it('shall get the pok1', async () => {
      const res = await r.get('/surveys')
      res.status.should.equal(200)
      res.body.should.have.lengthOf(1)
      res.body[0].maxpositive.should.equal(s1.maxpositive)
      s1.id = res.body[0].id
    })

    it('shall create a new option', async () => {
      const res = await r.post(`/options/${s1.id}`).send(opt1)
      res.status.should.equal(200)
      const res2 = await r.post(`/options/${s1.id}`).send(opt2)
      res2.status.should.equal(200)
    })
  })
}
