import * as types from '../../actionTypes'

const INITIAL_STATE = {}

function addEditQuestionReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.ADD_QUESTION_REQUEST:
    case types.ADD_CHILD_QUESTION_REQUEST:
    case types.UPDATE_QUESTION_REQUEST:
    default:
      return state
  }
}

export default addEditQuestionReducer