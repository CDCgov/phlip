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
        payload: 'We couldn\'t get the project coding scheme.'
      })
    }
    done()
  }
})

const reorderSchemeLogic = createLogic({
  type: types.REORDER_SCHEME_REQUEST,
  latest: true,
  async process({ api, action, getState }, dispatch, done) {
    const outline = { userid: getState().data.user.currentUser.id, outline: getState().scenes.codingScheme.outline }
    try {
      await api.reorderScheme(outline, action.projectId)
      dispatch({
        type: types.REORDER_SCHEME_SUCCESS
      })
    } catch (error) {
      dispatch({
        type: types.REORDER_SCHEME_FAIL,
        payload: 'Uh-oh! We couldn\'t save the scheme reorder. Please try again later.',
        error: true
      })
    }
    done()
  }
})

export default [
  getSchemeLogic,
  reorderSchemeLogic,
  ...addEditQuestionLogic
]