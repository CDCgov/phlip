import data from 'data/reducer'
import scenes from 'scenes/reducer'
import { reducer as formReducer } from 'redux-form'
import { combineReducers } from 'redux'

const appReducer = combineReducers({
  data,
  scenes,
  form: formReducer.plugin({
    login: (state, action) => {   // <----- 'login' is name of form given to reduxForm()
      switch(action.type) {
        case 'LOGIN_USER_FAIL':
          return {
            ...state,
            values: {
              ...state.values
            },
            registeredFields: {
              ...state.registeredFields
            },
            submitSucceeded: false,
            error: 'Login failed. Please check email and password.'
          }
        default:
          return state
      }
    }
  })
})

export default appReducer
