import { createLogic } from 'redux-logic'
import addEditQuestionLogic from './scenes/AddEditQuestion/logic'
import * as types from './actionTypes'

const getSchemeLogic = createLogic({
  type: types.GET_SCHEME_REQUEST,
  async process({ api, action }, dispatch, done) {
    try {
      const scheme = await api.getScheme(action.id)
      dispatch({
        type: types.GET_SCHEME_SUCCESS,
        payload: { ...scheme }
      })
    } catch (error) {
      dispatch({
        type: types.GET_SCHEME_FAIL,
        error: true,
        payload: 'We could not get the project coding scheme. Please try again later.'
      })
    }
    done()
  }
})

const reorderSchemeLogic = createLogic({
  type: types.REORDER_SCHEME_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.REORDER_SCHEME_SUCCESS,
    failType: types.REORDER_SCHEME_FAIL
  },
  latest: true,
  async process({ api, action, getState }, dispatch, done) {
    const outline = { userid: getState().data.user.currentUser.id, outline: getState().scenes.codingScheme.outline }
    await api.reorderScheme(outline, action.projectId)
    done()
  }
})

export default [
  getSchemeLogic,
  reorderSchemeLogic,
  ...addEditQuestionLogic
]