import makeActionCreator from 'utils/makeActionCreator'

export const types = {
  GET_PROJECTS_SUCCESS: 'GET_PROJECTS_SUCCESS',
  GET_PROJECTS_REQUEST: 'GET_PROJECTS_REQUEST',
  GET_PROJECTS_FAIL: 'GET_PROJECTS_FAIL',
  GET_PROJECT_USERS_REQUEST: 'GET_PROJECT_USERS_REQUEST',
  GET_PROJECT_USERS_FAIL: 'GET_PROJECT_USERS_FAIL',
  GET_PROJECT_USERS_SUCCESS: 'GET_PROJECT_USERS_SUCCESS',
  UPDATE_PROJECT_REQUEST: 'UPDATE_PROJECT_REQUEST',
  UPDATE_PROJECT_SUCCESS: 'UPDATE_PROJECT_SUCCESS',
  UPDATE_PROJECT_FAIL: 'UPDATE_PROJECT_FAIL',
  ADD_PROJECT_SUCCESS: 'ADD_PROJECT_SUCCESS',
  ADD_PROJECT_REQUEST: 'ADD_PROJECT_REQUEST',
  ADD_PROJECT_FAIL: 'ADD_PROJECT_FAIL',
  TOGGLE_BOOKMARK: 'TOGGLE_BOOKMARK',
  TOGGLE_BOOKMARK_SUCCESS: 'TOGGLE_BOOKMARK_SUCCESS',
  SORT_PROJECTS: 'SORT_PROJECTS',
  UPDATE_PAGE: 'UPDATE_PAGE',
  UPDATE_ROWS: 'UPDATE_ROWS',
  UPDATE_SEARCH_VALUE: 'UPDATE_SEARCH_VALUE',
  SORT_BOOKMARKED: 'SORT_BOOKMARKED',
  FLUSH_STATE: 'FLUSH_STATE',
  UPDATE_EDITED_FIELDS: 'UPDATE_EDITED_FIELDS',
  ADD_JURISDICTION_TO_PROJECT: 'ADD_JURISDICTION_TO_PROJECT',
  UPDATE_JURISDICTION_IN_PROJECT: 'UPDATE_JURISDICTION_IN_PROJECT',
  ADD_PRESET_JURISDICTION_TO_PROJECT: 'ADD_PRESET_JURISDICTION_TO_PROJECT',
  DELETE_JURISDICTION_FROM_PROJECT: 'DELETE_JURISDICTION_FROM_PROJECT',
  RESET_FORM_ERROR: 'RESET_FORM_ERROR',
  EXPORT_DATA_REQUEST: 'EXPORT_DATA_REQUEST',
  EXPORT_DATA_SUCCESS: 'EXPORT_DATA_SUCCESS',
  EXPORT_DATA_FAIL: 'EXPORT_DATA_FAIL',
  CLEAR_PROJECT_TO_EXPORT: 'CLEAR_PROJECT_TO_EXPORT',
  DISMISS_API_ERROR: 'DISMISS_API_ERROR'
}

export default {
  getProjectsRequest: makeActionCreator(types.GET_PROJECTS_REQUEST),
  getProjectsFail: payload => ({ type: types.GET_PROJECTS_FAIL, payload: { errorContent: payload, error: true } }),
  updateProjectRequest: makeActionCreator(types.UPDATE_PROJECT_REQUEST, 'project'),
  updateProjectFail: payload => ({ type: types.UPDATE_PROJECT_FAIL, payload: { errorContent: payload, error: true } }),
  toggleBookmark: makeActionCreator(types.TOGGLE_BOOKMARK, 'project'),
  toggleBookmarkSuccess: makeActionCreator(types.TOGGLE_BOOKMARK_SUCCESS, 'payload'),
  sortBookmarked: sortBookmarked => ({ type: types.SORT_BOOKMARKED, payload: { sortBookmarked } }),
  sortProjects: sortBy => ({ type: types.SORT_PROJECTS, payload: { sortBy } }),
  updatePage: page => ({ type: types.UPDATE_PAGE, payload: { page } }),
  updateRows: rowsPerPage => ({ type: types.UPDATE_ROWS, payload: { rowsPerPage } }),
  updateSearchValue: searchValue => ({ type: types.UPDATE_SEARCH_VALUE, payload: { searchValue } }),
  updateEditedFields: makeActionCreator(types.UPDATE_EDITED_FIELDS, 'projectId'),
  exportDataRequest: makeActionCreator(types.EXPORT_DATA_REQUEST, 'project', 'exportType'),
  clearProjectToExport: makeActionCreator(types.CLEAR_PROJECT_TO_EXPORT),
  dismissApiError: makeActionCreator(types.DISMISS_API_ERROR, 'errorName'),
  getProjectUsers: makeActionCreator(types.GET_PROJECT_USERS_REQUEST, 'projectId', 'createdBy'),
  getProjectUsersFail: payload => ({
    type: types.GET_PROJECT_USERS_FAIL,
    payload: { errorContent: payload, error: true }
  })
}
