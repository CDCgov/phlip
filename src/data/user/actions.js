import * as types from './actionTypes'

export const toggleMenu = (anchor) => ({ type: types.TOGGLE_MENU, anchor })
export const logoutUser = () => ({ type: types.LOGOUT_USER })
export const closeMenu = () => ({ type: types.CLOSE_MENU })