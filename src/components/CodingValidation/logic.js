import { createLogic } from 'redux-logic'
import * as codingTypes from 'scenes/Coding/actionTypes'
import * as valTypes from 'scenes/Validation/actionTypes'
import * as commonTypes from './actionTypes'
import {
  getFinalCodedObject,
  getNextQuestion,
  getPreviousQuestion,
  getQuestionSelectedInNav
} from 'utils/codingHelpers'

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

const applyAnswerToAllLogic = createLogic({
  type: [codingTypes.ON_APPLY_ANSWER_TO_ALL, valTypes.ON_APPLY_ANSWER_TO_ALL],
  transform({ getState, action, api }, next) {
    const userId = getState().data.user.currentUser.id
    const apiMethods = action.page === 'validation'
      ? { create: api.answerValidatedQuestion, update: api.updateValidatedQuestion }
      : { create: api.answerCodedQuestion, update: api.updateCodedQuestion }

    const answerObject = {
      questionId: action.questionId,
      jurisdictionId: action.jurisdictionId,
      projectId: action.projectId
    }

    next({
      ...action,
      answerObject,
      apiMethods,
      userId
    })
  },
  async process({ getState, action }, dispatch, done) {
    const userId = action.userId
    const state = getState().scenes[action.page]
    const allCategoryObjects = Object.values(state.userAnswers[action.questionId])

    try {
      for (let category of allCategoryObjects) {
        let respCodedQuestion = {}
        const question = getFinalCodedObject(state, action, action.page === 'validation', category.categoryId)

        if (category.id !== undefined) {
          respCodedQuestion = await action.apiMethods.update({ ...action.answerObject, userId, questionObj: question })
        } else {
          const { id, ...questionObj } = question
          respCodedQuestion = await action.apiMethods.create({ ...action.answerObject, userId, questionObj })
        }

        dispatch({
          type: `${commonTypes.SAVE_USER_ANSWER_SUCCESS}_${action.page.toUpperCase()}`,
          payload: { ...respCodedQuestion, questionId: action.questionId, selectedCategoryId: category.categoryId }
        })
      }
      dispatch({
        type: commonTypes.UPDATE_EDITED_FIELDS,
        projectId: action.projectId
      })
    } catch (error) {
      dispatch({
        type: `${commonTypes.SAVE_USER_ANSWER_FAIL}_${action.page.toUpperCase()}`,
        payload: { error: 'Could not update answer', isApplyAll: true }
      })
    }
    done()
  }
})

export default [outlineLogic, getQuestionLogic, applyAnswerToAllLogic]