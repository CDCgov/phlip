import * as types from './actionTypes'

/* Getting projects */
export const getProjectsRequest = () => ({ type: types.GET_PROJECTS_REQUEST })
export const getProjectsFail = payload => ({ type: types.GET_PROJECTS_FAIL, payload: { errorContent: payload, error: true } })

/* Updating a project */
export const updateProjectRequest = project => ({ type: types.UPDATE_PROJECT_REQUEST, project })
export const updateProjectFail = payload => ({ type: types.UPDATE_PROJECT_FAIL, payload: { errorContent: payload, error: true } })

/* Bookmarking */
export const toggleBookmark = project => ({ type: types.TOGGLE_BOOKMARK, project })

/* Sorting */
export const sortBookmarked = sortBookmarked => ({ type: types.SORT_BOOKMARKED, payload: { sortBookmarked } })
export const sortProjects = sortBy => ({ type: types.SORT_PROJECTS, payload: { sortBy } })

/* Pagination */
export const updatePage = page => ({ type: types.UPDATE_PAGE, payload: { page } })
export const updateRows = rowsPerPage => ({ type: types.UPDATE_ROWS, payload: { rowsPerPage } })

/* Filtering */
export const updateSearchValue = searchValue => ({ type: types.UPDATE_SEARCH_VALUE, payload: { searchValue } })

