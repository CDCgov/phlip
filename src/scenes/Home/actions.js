import * as types from './actionTypes'

/* Getting projects */
export const getProjectsRequest = () => ({ type: types.GET_PROJECTS_REQUEST })
export const getProjectsFail = payload => ({
  type: types.GET_PROJECTS_FAIL,
  payload: { errorContent: payload, error: true }
})

/* Updating a project */
export const updateProjectRequest = project => ({ type: types.UPDATE_PROJECT_REQUEST, project })
export const updateProjectFail = payload => ({
  type: types.UPDATE_PROJECT_FAIL,
  payload: { errorContent: payload, error: true }
})

/* Bookmarking */
export const toggleBookmark = project => ({ type: types.TOGGLE_BOOKMARK, project })
export const toggleBookmarkSuccess = payload => ({ type: types.TOGGLE_BOOKMARK_SUCCESS, payload })

/* Sorting */
export const sortBookmarked = sortBookmarked => ({ type: types.SORT_BOOKMARKED, payload: { sortBookmarked } })
export const sortProjects = sortBy => ({ type: types.SORT_PROJECTS, payload: { sortBy } })

/* Pagination */
export const updatePage = page => ({ type: types.UPDATE_PAGE, payload: { page } })
export const updateRows = rowsPerPage => ({ type: types.UPDATE_ROWS, payload: { rowsPerPage } })

/* Filtering */
export const updateSearchValue = searchValue => ({ type: types.UPDATE_SEARCH_VALUE, payload: { searchValue } })

/* Updating dateLastEdited and lastEditedBy fields */
export const updateEditedFields = projectId => ({ type: types.UPDATE_EDITED_FIELDS, projectId })

/* Exporting */
export const exportDataRequest = (project, exportType) => ({ type: types.EXPORT_DATA_REQUEST, project, exportType })
export const clearProjectToExport = () => ({ type: types.CLEAR_PROJECT_TO_EXPORT })
export const dismissApiError = errorName => ({ type: types.DISMISS_API_ERROR, errorName })

/* project users */
export const getProjectUsers = (projectId, createdBy) => ({
  type: types.GET_PROJECT_USERS_REQUEST,
  projectId,
  createdBy
})

export const getProjectUsersFail = payload => ({
  type: types.GET_PROJECT_USERS_FAIL,
  payload: { errorContent: payload, error: true }
})

export const resetOpenProject = (whereClicked = { target: {} }) => ({ type: types.RESET_OPEN_PROJECT, whereClicked })
