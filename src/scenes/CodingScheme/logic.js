import { createLogic } from 'redux-logic'
import addEditQuestionLogic from './scenes/AddEditQuestion/logic'
import * as types from './actionTypes'

const getSchemeLogic = createLogic({
  type: types.GET_SCHEME_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.GET_SCHEME_SUCCESS
  },
  async process({ api, action }) {
    return await api.getScheme(action.id)
  }
})

const reorderSchemeLogic = createLogic({
  type: types.REORDER_SCHEME_REQUEST,
  latest: true,
  async process({ api, action, getState }, dispatch, done) {
    const outline = getState().scenes.codingScheme.outline
    await api.reorderScheme(outline, action.projectId)
    done()
  }
})

export default [
  getSchemeLogic,
  reorderSchemeLogic,
  ...addEditQuestionLogic
]