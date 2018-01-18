import * as types from './actionTypes'

const INITIAL_STATE = {
  question: {},
  outline: {},
  jurisdiction: {},
  questionOrder: [],

}

const codingReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.GET_QUESTION_SUCCESS:
      return {
        ...state,
        question: action.payload
      }

    case types.GET_CODING_OUTLINE_SUCCESS:
      return {
        ...state,
        outline: action.payload.outline,
        question: action.payload.question,
        questionOrder: action.payload.questionOrder
      }

    case types.GET_CODING_OUTLINE_REQUEST:
    case types.GET_QUESTION_REQUEST:
    default:
      return state
  }
}

export default codingReducer