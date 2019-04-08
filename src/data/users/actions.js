import makeActionCreator from 'utils/makeActionCreator'

export const types = {
  LOGOUT_USER: 'LOGOUT_USER',
  FLUSH_STATE: 'FLUSH_STATE',
  TOGGLE_BOOKMARK_SUCCESS: 'TOGGLE_BOOKMARK_SUCCESS',
  LOGIN_USER_SUCCESS: 'LOGIN_USER_SUCCESS',
  UPDATE_CURRENT_USER: 'UPDATE_CURRENT_USER',
  UPDATE_USER_SUCCESS: 'UPDATE_USER_SUCCESS',
  UPDATE_CURRENT_USER_AVATAR: 'UPDATE_CURRENT_USER_AVATAR',
  REMOVE_CURRENT_USER_AVATAR: 'REMOVE_CURRENT_USER_AVATAR',
  CHECK_PIV_USER_SUCCESS: 'CHECK_PIV_USER_SUCCESS',
  ADD_USER: 'ADD_USER',
  UPDATE_USER: 'UPDATE_USER'
}

export default {
  logoutUser: makeActionCreator(types.LOGOUT_USER, 'sessionExpired'),
  closeMenu: makeActionCreator(types.CLOSE_MENU),
  toggleMenu: makeActionCreator(types.TOGGLE_MENU),
  flushState: makeActionCreator(types.FLUSH_STATE),
  addUser: makeActionCreator(types.ADD_USER, 'user')
}
