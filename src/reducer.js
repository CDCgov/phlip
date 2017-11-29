import data from 'data/reducer'
import scenes from 'scenes/reducer'
import { reducer as formReducer } from 'redux-form'

const rootReducer = {
  data,
  scenes,
  form: formReducer
}

export default rootReducer