import { types } from './actions'

export const INITIAL_STATE = {
  alert: {
    open: false,
    title: '',
    text: '',
    type: '',
    data: {}
  },
  touched: false,
  header: ''
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
      
    case types.CHANGE_TOUCHED_STATUS:
      return {
        ...state,
        touched: action.touched
      }
      
    case types.SET_HEADER_TEXT:
      return {
        ...state,
        header: action.text
      }
      
    default:
      return state
  }
}

export default cardReducer
