import makeActionCreator from 'utils/makeActionCreator'

export const types = {
  SET_ALERT: 'SET_ALERT',
  CLOSE_ALERT: 'CLOSE_ALERT',
  CHANGE_TOUCHED_STATUS: 'CHANGE_TOUCHED_STATUS',
  SET_HEADER_TEXT: 'SET_HEADER_TEXT'
}

export default {
  setAlert: makeActionCreator(types.SET_ALERT, 'alert'),
  closeAlert: makeActionCreator(types.CLOSE_ALERT),
  changeTouchedStatus: makeActionCreator(types.CHANGE_TOUCHED_STATUS, 'touched'),
  setHeaderText: makeActionCreator(types.SET_HEADER_TEXT, 'text')
}
