import { searchReducer, INITIAL_STATE } from '../reducer'
import { types } from '../actions'

const getState = (other = {}) => ({
  ...INITIAL_STATE,
  ...other
})

describe('DocumentManagement - SearchBox reducer', () => {
  describe('FORM_VALUE_CHANGE', () => {
    const action = {
      type: types.FORM_VALUE_CHANGE,
      property: 'uploadedBy',
      
    }

  })

})
