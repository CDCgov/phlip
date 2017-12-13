import data from 'data/reducer'
import scenes from 'scenes/reducer'
import { reducer as formReducer } from 'redux-form'
import { combineReducers } from 'redux'

const appReducer = combineReducers({
  data,
  scenes,
  form: formReducer
})

export default appReducer
