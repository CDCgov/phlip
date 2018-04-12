import {
  handleUpdateUserCodedQuestion,
  handleUpdateUserCategoryChild,
  generateError
} from 'utils/codingHelpers'
import { sortList } from 'utils'
import * as types from '../actionTypes'

const questionCardReducer = (state = {}, action) => {
  const questionUpdater = state.isCategoryQuestion
    ? handleUpdateUserCategoryChild(state, action)
    : handleUpdateUserCodedQuestion(state, action)

  switch (action.type) {
    case types.UPDATE_USER_ANSWER_REQUEST:
      return {
        ...state
      }

    default:
      return state
  }
}

export default questionCardReducer