import { createLogic } from 'redux-logic'
import * as codingTypes from 'scenes/Coding/actionTypes'
import * as valTypes from 'scenes/Validation/actionTypes'

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

export default [outlineLogic]