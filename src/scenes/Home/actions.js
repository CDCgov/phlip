import * as types from './actionTypes'

export const getProjectsRequest = () => ({ type: types.GET_PROJECTS_REQUEST })
export const getProjectsSuccess = (payload) => ({ type: types.GET_PROJECTS_SUCCESS, payload })
export const getProjectsFail = (payload) => ({ type: types.GET_PROJECTS_FAIL, errorValue: payload, error: true })

export const updateProjectRequest = (project) => ({ type: types.UPDATE_PROJECT_REQUEST, project })
export const updateProjectSuccess = (payload) => ({ type: types.UPDATE_PROJECT_SUCCESS, payload })
export const updateProjectFail = (payload) => ({ type: types.UPDATE_PROJECT_FAIL, errorValue: payload, error: true })

export const toggleBookmark = (project) => ({ type: types.TOGGLE_BOOKMARK, project })

export const sortProjects = (sortBy) => ({ type: types.SORT_PROJECTS, sortBy })
export const updatePage = (page) => ({ type: types.UPDATE_PAGE, page })
export const updateRows = (rowsPerPage) => ({ type: types.UPDATE_ROWS, rowsPerPage })

export const sortBookmarked = () => ({ type: types.SORT_BOOKMARKED })
