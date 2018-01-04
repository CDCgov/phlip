import * as types from './actionTypes'

const INITIAL_STATE = {
  questions: []
}

const codingSchemeReducer = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case types.GET_SCHEME_SUCCESS:
      return {
        ...state,
        questions: action.payload
      }

    default:
      return state
  }
}

export default codingSchemeReducer