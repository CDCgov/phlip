import * as types from './actionTypes'

const INITIAL_STATE = {
  startDate: new Date(),
  endDate: new Date(),
  name: '',
  errors: {}
}

const getErrors = () => {

}

const addEditJurisdictionsReducer = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.ON_CHANGE_FORM:
      return {
        ...state,
        [action.target]: action.value,
      }
    default:
      return state
  }
}

export default addEditJurisdictionsReducer