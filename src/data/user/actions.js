import * as types from './actionTypes'

export const toggleMenu = (anchor) => ({ type: types.TOGGLE_MENU, anchor })
export const logoutUser = () => ({ type: types.LOGOUT_USER })
export const flushState = () => ({ type: types.FLUSH_STATE })
export const closeMenu = () => ({ type: types.CLOSE_MENU })