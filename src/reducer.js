import { combineReducers } from 'redux'
import data from 'data/reducer'
import scenes from 'scenes/reducer'

const rootReducer = combineReducers({
  data,
  scenes
})

export default rootReducer