import makeActionCreator from 'utils/makeActionCreator'

export const types = {
  UPDATE_PROJECT_REQUEST: 'UPDATE_PROJECT_REQUEST',
  UPDATE_PROJECT_SUCCESS: 'UPDATE_PROJECT_SUCCESS',
  UPDATE_PROJECT_FAIL: 'UPDATE_PROJECT_FAIL',
  ADD_PROJECT_SUCCESS: 'ADD_PROJECT_SUCCESS',
  ADD_PROJECT_REQUEST: 'ADD_PROJECT_REQUEST',
  ADD_PROJECT_FAIL: 'ADD_PROJECT_FAIL',
  DELETE_PROJECT_SUCCESS: 'DELETE_PROJECT_SUCCESS',
  DELETE_PROJECT_REQUEST: 'DELETE_PROJECT_REQUEST',
  DELETE_PROJECT_FAIL: 'DELETE_PROJECT_FAIL',
  SEARCH_USER_LIST: 'SEARCH_USER_LIST',
  UPDATE_USER_SUGGESTION_VALUE: 'UPDATE_USER_SUGGESTION_VALUE',
  ON_CLEAR_USER_SUGGESTIONS: 'ON_CLEAR_USER_SUGGESTIONS',
  ON_USER_SUGGESTION_SELECTED: 'ON_USER_SUGGESTION_SELECTED'
}

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
  resetFormError: makeActionCreator(types.RESET_FORM_ERROR),
  searchUserList: makeActionCreator(types.SEARCH_USER_LIST, 'value'),
  onSuggestionValueChanged: makeActionCreator(types.UPDATE_USER_SUGGESTION_VALUE, 'suggestionValue'),
  onClearSuggestions: makeActionCreator(types.ON_CLEAR_USER_SUGGESTIONS),
  onUserSelected: makeActionCreator(types.ON_USER_SUGGESTION_SELECTED, 'user')
}
