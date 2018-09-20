import * as types from './actionTypes'

/** Logout a user */
export const logoutUser = (sessionExpired = false) => ({ type: types.LOGOUT_USER, sessionExpired })

export const closeMenu = () => ({ type: types.CLOSE_MENU })
export const toggleMenu = () => ({ type: types.TOGGLE_MENU })
export const flushState = () => ({ type: types.FLUSH_STATE })