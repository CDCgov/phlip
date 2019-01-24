import { createLogic } from 'redux-logic'
import { types } from './actions'

const getProjectLogic = createLogic({
  type: types.GET_PROJECT_REQUEST,
  async process({ action, api }, dispatch, done) {
    try {
      const project = await api.getProject({}, {}, { projectId: action.projectId })
      dispatch({
        type: types.GET_PROJECT_SUCCESS, payload: { ...project }
      })
    } catch (err) {
      dispatch({ type: types.GET_PROJECT_FAIL })
    }
    done()
  }
})

export default [
  getProjectLogic
]