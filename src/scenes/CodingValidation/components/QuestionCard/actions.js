import makeActionCreator from 'utils/makeActionCreator'

export const types = {
  SET_ALERT: 'SET_ALERT',
  CLOSE_ALERT: 'CLOSE_ALERT'
}

export default {
  setAlert: makeActionCreator(types.SET_ALERT, 'alert'),
  closeAlert: makeActionCreator(types.CLOSE_ALERT)
}
