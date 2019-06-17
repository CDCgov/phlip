import { types } from './actions'

export const INITIAL_STATE = {
  alert: {
    open: false,
    title: '',
    text: '',
    type: '',
    data: {}
  }
}

export const cardReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.CLOSE_ALERT:
      return {
        ...state,
        alert: {
          ...state.alert,
          open: false
        }
      }
    
    case types.SET_ALERT:
      return {
        ...state,
        alert: {
          ...state.alert,
          ...action.alert
        }
      }
      
    default:
      return state
  }
}

export default cardReducer
