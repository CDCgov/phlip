import * as types from './actionTypes'

export const getProjectsRequest = () => ({ type: types.GET_PROJECTS_REQUEST })
export const getProjectsSuccess = (payload) => ({ type: types.GET_PROJECTS_SUCCESS, payload })
export const getProjectsFail = (payload) => ({ type: types.GET_PROJECTS_FAIL, errorValue: payload, error: true })

export const toggleBookmark = (project) => ({ type: types.TOGGLE_BOOKMARK, project })
export const toggleBookmarkSuccess = (payload) => ({ type: types.TOGGLE_BOOKMARK_SUCCESS, payload })

export const sortProjects = (sortBy) => ({ type: types.SORT_PROJECTS, sortBy })
export const updatePage = (page) => ({ type: types.UPDATE_PAGE, page })
export const updateRows = (rowsPerPage) => ({ type: types.UPDATE_ROWS, rowsPerPage })

export const updateSearchValue = (searchValue) => ({ type: types.UPDATE_SEARCH_VALUE, searchValue })

export const sortBookmarked = () => ({ type: types.SORT_BOOKMARKED })