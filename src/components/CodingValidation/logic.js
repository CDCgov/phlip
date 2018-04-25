import { createLogic } from 'redux-logic'
import * as codingTypes from 'scenes/Coding/actionTypes'
import * as valTypes from 'scenes/Validation/actionTypes'
import { getNextQuestion, getPreviousQuestion, getQuestionSelectedInNav } from 'utils/codingHelpers'

const outlineLogic = createLogic({
  type: [codingTypes.GET_CODING_OUTLINE_REQUEST, valTypes.GET_VALIDATION_OUTLINE_REQUEST],
  transform({ getState, action }, next) {
    next({
      ...action,
      payload: {
        scheme: { order: [], byId: {}, tree: [] },
        outline: {},
        question: {},
        userAnswers: {},
        mergedUserQuestions: {},
        categories: undefined,
        areJurisdictionsEmpty: false,
        isSchemeEmpty: false,
        schemeError: null,
        isLoadingPage: false,
        showPageLoader: false,
        errors: {}
      },
      userId: getState().data.user.currentUser.id
    })
  }
})

const getQuestionLogic = createLogic({
  type: [
    codingTypes.GET_PREV_QUESTION, codingTypes.GET_NEXT_QUESTION, codingTypes.ON_QUESTION_SELECTED_IN_NAV,
    valTypes.GET_PREV_QUESTION, valTypes.GET_NEXT_QUESTION, valTypes.ON_QUESTION_SELECTED_IN_NAV
  ],
  transform({ getState, action }, next) {
    const state = getState().scenes[action.page]
    const userId = getState().data.user.currentUser.id
    let questionInfo = {}

    // How did the user navigate to the currently selected question
    switch (action.type) {
      case codingTypes.ON_QUESTION_SELECTED_IN_NAV:
      case valTypes.ON_QUESTION_SELECTED_IN_NAV:
        questionInfo = getQuestionSelectedInNav(state, action)
        break
      case codingTypes.GET_NEXT_QUESTION:
      case valTypes.GET_NEXT_QUESTION:
        questionInfo = getNextQuestion(state, action)
        break
      case codingTypes.GET_PREV_QUESTION:
      case valTypes.GET_PREV_QUESTION:
        questionInfo = getPreviousQuestion(state, action)
        break
    }

    next({
      ...action,
      questionInfo,
      userId
    })
  }
})

export default [outlineLogic, getQuestionLogic]