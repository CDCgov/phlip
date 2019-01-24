import makeActionCreator from 'utils/makeActionCreator'

export const types = {
  GET_PROJECT_REQUEST: 'GET_PROJECT_REQUEST',
  GET_PROJECT_SUCCESS: 'GET_PROJECT_SUCCESS',
  GET_PROJECT_FAIL: 'GET_PROJECT_FAIL',
  ADD_PROJECT: 'ADD_PROJECT'

}

export default {
  getProjectRequest: makeActionCreator(types.GET_PROJECT_REQUEST, 'projectId'),
  addProject: makeActionCreator(types.ADD_PROJECT, 'payload')
}