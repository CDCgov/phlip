import { types } from '../../actions'
import makeActionCreator from 'utils/makeActionCreator'

export default {
  addProjectRequest: makeActionCreator(types.ADD_PROJECT_REQUEST, 'project'),
  addProjectSuccess: makeActionCreator(types.ADD_PROJECT_SUCCESS, 'payload'),
  addProjectFail: payload => ({ type: types.ADD_PROJECT_FAIL, errorValue: payload, error: true }),
  updateProjectRequest: makeActionCreator(types.UPDATE_PROJECT_REQUEST, 'project'),
  updateProjectSuccess: makeActionCreator(types.UPDATE_PROJECT_SUCCESS, 'payload'),
  updateProjectFail: payload => ({ type: types.UPDATE_PROJECT_FAIL, errorValue: payload, error: true }),
  deleteProjectRequest: makeActionCreator(types.DELETE_PROJECT_REQUEST, 'project'),
  deleteProjectSuccess: makeActionCreator(types.DELETE_PROJECT_SUCCESS, 'payload'),
  deleteProjectFail: payload => ({ type: types.DELETE_PROJECT_FAIL, errorValue: payload, error: true }),
  resetFormError: makeActionCreator(types.RESET_FORM_ERROR)
}
