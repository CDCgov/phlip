import { normalize } from 'utils'
import * as questionTypes from 'scenes/CodingScheme/scenes/AddEditQuestion/constants'

/*
  Handles determining whether or not to show the 'next question' button at the bottom of the screen
 */
export const determineShowButton = (state) => {
  if (state.question.questionType === questionTypes.CATEGORY) {
    if (Object.keys(state.userAnswers[state.question.id].answers).length === 0) {
      let subArr = [...state.scheme.order].slice(state.currentIndex + 1)
      let p = subArr.find(id => state.scheme.byId[id].parentId !== state.question.id)
      if (p !== undefined) {
        return true
      } else {
        return false
      }
    } else {
      return true
    }
  } else {
    return state.scheme.order && state.question.id !== state.scheme.order[state.scheme.order.length - 1]
  }
}


export const getNextQuestion = (state, action) => {
  let newQuestion = state.scheme.byId[action.id]
  let newIndex = action.newIndex

  // Check to make sure newQuestion is correct. If the newQuestion is a category child, but the user hasn't selected
  // any categories, then find the next parent question
  if (newQuestion.isCategoryQuestion) {
    if (Object.keys(state.userAnswers[state.scheme.byId[action.id].parentId].answers).length === 0) {
      let subArr = [...state.scheme.order].slice(action.newIndex)
      newQuestion = subArr.find(id => {
        if (state.scheme.byId[id].parentId !== state.question.id) {
          newIndex = state.scheme.order.indexOf(id)
          return true
        }
      })
      newQuestion = state.scheme.byId[newQuestion]
    }
  }

  return handleCheckCategories(newQuestion, newIndex, state, action)
}

export const getPreviousQuestion = (state, action) => {
  let newQuestion = state.scheme.byId[action.id]
  let newIndex = action.newIndex

  if (newQuestion.isCategoryQuestion) {
    if (Object.keys(state.userAnswers[newQuestion.parentId].answers).length === 0) {
      newQuestion = state.scheme.byId[newQuestion.parentId]
      newIndex = state.scheme.order.indexOf(newQuestion.id)
    }
  }

  return handleCheckCategories(newQuestion, newIndex, state, action)
}