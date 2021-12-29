import { TNAMES, getQB } from '../consts'

export default (ctx) => {
  const { knex, ErrorClass } = ctx
  const _ = ctx.require('underscore')
  return { getResults, getExisting, createVote, deleteVote }

  function _checkVotable (survey) {
    const now = new Date()
    if (now < survey.voting_start || now > survey.voting_end) {
      throw new ErrorClass(400, 'not in voting time window')
    }
  }

  function getResults (surveyId, schema) {
    let positives = knex.select(knex.raw('option_id, SUM(option_id) as sum'))
    positives = schema ? positives.withSchema(schema) : positives
    positives = positives.from(TNAMES.VOTES)
      .where({ survey_id: surveyId })
      .where('value', '>', 0)
      .groupBy('option_id')
    let negatives = knex.select(knex.raw('option_id, SUM(option_id) as sum'))
    negatives = schema ? negatives.withSchema(schema) : negatives
    negatives = negatives.from(TNAMES.VOTES)
      .where({ survey_id: surveyId })
      .where('value', '<', 0)
      .groupBy('option_id')
    return Promise.all([positives, negatives]).then(res => {
      function _2obj (acc, i) {
        acc[i.option_id] = i.sum
        return acc
      }
      return {
        pos: _.reduce(res[0], _2obj, {}),
        neg: _.reduce(res[1], _2obj, {})
      }
    })
  }

  function getExisting (UID, surveyId, schema) {
    const cond = { author: UID, survey_id: surveyId }
    return getQB(knex, TNAMES.VOTES, schema).where(cond)
  }

  async function createVote (UID, surveyId, optionID, value, schema) {
    const s = await getQB(knex, TNAMES.SURVEYS, schema).where({ id: surveyId }).first()
    _checkVotable(s)
    const existing = await getExisting(UID, surveyId, schema)
    const existingPositives = _.filter(existing, i => i.value > 0).length
    if (value > 0 && existingPositives >= s.maxpositive) {
      throw new ErrorClass(400, 'maximum positive votes exceeded')
    }
    const existingNegatives = _.filter(existing, i => i.value < 0).length
    if (value < 0 && existingNegatives >= s.maxnegative) {
      throw new ErrorClass(400, 'maximum negative votes exceeded')
    }
    const data = { author: UID, survey_id: surveyId, option_id: optionID, value }
    try {
      return await getQB(knex, TNAMES.VOTES, schema).insert(data)
    } catch (err) {
      throw new ErrorClass(400, err.toString())
    }
  }

  async function deleteVote (UID, surveyId, optionID, schema) {
    const s = await getQB(knex, TNAMES.SURVEYS, schema).where({ id: surveyId }).first()
    _checkVotable(s)
    const cond = { author: UID, option_id: optionID }
    try {
      return await getQB(knex, TNAMES.VOTES, schema).where(cond).delete()
    } catch (err) {
      throw new ErrorClass(400, err.toString())
    }
  }
}