import * as types from './actionTypes'

export const logoutUser = (sessionExpired = false) => ({ type: types.LOGOUT_USER, sessionExpired })
export const flushState = () => ({ type: types.FLUSH_STATE })
export const closeMenu = () => ({ type: types.CLOSE_MENU })
export const toggleMenu = () => ({ type: types.TOGGLE_MENU })