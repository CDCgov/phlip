import * as types from './actionTypes'

export const logoutUser = () => ({ type: types.LOGOUT_USER })
export const flushState = () => ({ type: 'FLUSH_STATE' })
export const closeMenu = () => ({ type: types.CLOSE_MENU })
export const openMenu = anchor => ({ type: types.OPEN_MENU, anchor })