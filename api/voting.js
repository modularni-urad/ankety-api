import { TNAMES } from '../consts'
import _ from 'underscore'

function _checkVotable (survey) {
  const now = new Date()
  if (now < survey.voting_start || now > survey.voting_end) {
    throw new Error('not in voting time window')
  }
}

export function getResults (knex, surveyId) {
  const positives = knex.select(knex.raw('option_id, SUM(option_id) as sum'))
    .from(TNAMES.VOTES)
    .where({ survey_id: surveyId }).where('value', '>', 0).groupBy('option_id')
  const negatives = knex.select(knex.raw('option_id, SUM(option_id) as sum'))
    .from(TNAMES.VOTES)
    .where({ survey_id: surveyId }).where('value', '<', 0).groupBy('option_id')
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

export function getExisting (knex, UID, surveyId) {
  const cond = { author: UID, survey_id: surveyId }
  return knex(TNAMES.VOTES).where(cond)
}

export async function createVote (knex, UID, surveyId, optionID, value) {
  const s = await knex(TNAMES.SURVEYS).where({ id: surveyId }).first()
  _checkVotable(s)
  const existing = await getExisting(knex, UID, surveyId)
  const existingPositives = _.filter(existing, i => i.value > 0).length
  if (value > 0 && existingPositives >= s.maxpositive) {
    throw new Error('maximum positive votes exceeded')
  }
  const existingNegatives = _.filter(existing, i => i.value < 0).length
  if (value < 0 && existingNegatives >= s.maxnegative) {
    throw new Error('maximum negative votes exceeded')
  }
  const data = { author: UID, survey_id: surveyId, option_id: optionID, value }
  return knex(TNAMES.VOTES).insert(data)
}

export async function deleteVote (knex, UID, surveyId, optionID) {
  const s = await knex(TNAMES.SURVEYS).where({ id: surveyId }).first()
  _checkVotable(s)
  const cond = { author: UID, option_id: optionID }
  return knex(TNAMES.VOTES).where(cond).delete()
}
