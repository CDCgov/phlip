import { createLogic } from 'redux-logic'
import { sortQuestions, getQuestionNumbers } from 'utils/treeHelpers'
import { getTreeFromFlatData, getFlatDataFromTree, walk } from 'react-sortable-tree'
import {
  getFinalCodedObject, getNextQuestion, getPreviousQuestion, getQuestionSelectedInNav, initializeAndCheckAnswered,
  initializeUserAnswers
} from 'utils/codingHelpers'
import { createAvatarUrl } from 'utils/urlHelper'
import { checkIfAnswered, checkIfExists } from 'utils/codingSchemeHelpers'
import { normalize } from 'utils'
import sortList from 'utils/sortList'
import * as codingValidationTypes from 'scenes/Validation/actionTypes'
import * as otherActionTypes from 'components/CodingValidation/actionTypes'
const types = { ...codingValidationTypes, ...otherActionTypes }

const addCoderToAnswers = (existingQuestion, question, coder) => {
  let flagComment = {}

  if (question.flag !== null) {
    flagComment = { ...question.flag, raisedBy: { ...coder } }
  }
  if (question.comment !== '') {
    flagComment = { ...flagComment, comment: question.comment, raisedBy: { ...coder } }
  }

  return {
    ...existingQuestion,
    answers: [...existingQuestion.answers, ...question.codedAnswers.map(answer => ({ ...answer, ...coder }))],
    flagsComments: Object.keys(flagComment).length > 0
      ? [...existingQuestion.flagsComments, flagComment]
      : [...existingQuestion.flagsComments]
  }
}

const mergeInUserCodedQuestions = (codedQuestions, codeQuestionsPerUser, coder) => {
  const baseQuestion = { flagsComments: [], answers: [] }
  return codeQuestionsPerUser.reduce((allCodedQuestions, question) => {
    const doesExist = checkIfExists(question, allCodedQuestions, 'schemeQuestionId')
    return {
      ...allCodedQuestions,
      [question.schemeQuestionId]: question.categoryId && question.categoryId !== 0
        ? {
          ...allCodedQuestions[question.schemeQuestionId],
          [question.categoryId]: {
            ...addCoderToAnswers(
              doesExist
                ? checkIfExists(question, allCodedQuestions[question.schemeQuestionId], 'categoryId')
                ? allCodedQuestions[question.schemeQuestionId][question.categoryId]
                : baseQuestion
                : baseQuestion, question, coder)
          }
        }
        : {
          ...addCoderToAnswers(doesExist
            ? allCodedQuestions[question.schemeQuestionId]
            : baseQuestion, question, coder)
        }
    }
  }, codedQuestions)
}

const getCoderInformation = async ({ api, action }) => {
  let codedQuestions = [], updatedCodedQuestions = [], projectCoders = [], codeQuestionsPerUser = [],
    codedQuestionObj = {}

  try {
    /*for (let question of codedQuestions) {
      try {
        let hasAvatarImage = await api.getUserPicture(question.validatedBy.userId)
        let avatarUrl = hasAvatarImage ? createAvatarUrl(question.validatedBy.userId) : null
        let validatedBy = { ...question.validatedBy, avatarUrl }
        updatedCodedQuestions = [...updatedCodedQuestions, { ...question, validatedBy }]
      } catch (e) {
        throw { error: 'failed to get avatar image for validator' }
      }
    }*/
  } catch (e) {
    throw { error: 'failed to get codedQuestions' }
  }

  try {
    projectCoders = await api.getProjectCoders(action.projectId)
  } catch (e) {
    throw { error: 'failed to get project coders' }
  }

  if (projectCoders.length !== 0) {
    for (let coder of projectCoders) {
      try {
        let hasAvatarImage = await api.getUserPicture(coder.userId)
        let avatarUrl = hasAvatarImage ? createAvatarUrl(coder.userId) : null
        coder = { ...coder, avatarUrl }
      } catch (e) {
        throw { error: 'failed to get avatar image' }
      }

      try {
        codeQuestionsPerUser = await api.getUserCodedQuestions(coder.userId, action.projectId, action.jurisdictionId)
        if (codeQuestionsPerUser.length > 0) {
          codedQuestionObj = { ...mergeInUserCodedQuestions(codedQuestionObj, codeQuestionsPerUser, coder) }
        }
      } catch (e) {
        throw { error: 'failed to get codedQuestions for user' }
      }
    }
  }

  return {
    codedQuestionObj,
    updatedCodedQuestions,
    codedQuestions
  }
}

/*
  Some of the reusable functions need to know whether we're on the validation screen or not, so that's what this is for
 */
export const updateValidatorLogic = createLogic({
  type: [types.UPDATE_USER_ANSWER_REQUEST, types.ON_APPLY_ANSWER_TO_ALL],
  transform({ action, getState }, next) {
    if (action.reducerName === 'validation') {
      next({
        ...action,
        otherProps: { validatedBy: { ...getState().data.user.currentUser } },
        isValidation: true
      })
    } else {
      next({
        ...action,
        isValidation: false
      })
    }
  }
})

/*
  Logic for when the user first opens the validation screen
 */
export const getValidationOutlineLogic = createLogic({
  type: types.GET_VALIDATION_OUTLINE_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.GET_VALIDATION_OUTLINE_SUCCESS,
    failType: types.GET_VALIDATION_OUTLINE_FAIL
  },
  async process({ action, getState, api }) {
    let scheme = {}, validatedQuestions = []
    const userId = getState().data.user.currentUser.id

    // Try to get the project coding scheme
    try {
      scheme = await api.getScheme(action.projectId)
    } catch (e) {
      throw { error: 'failed to get outline' }
    }

    // Get user coded questions for currently selected jurisdiction
    if (action.jurisdictionId) {
      try {
        validatedQuestions = await api.getValidatedQuestions(action.projectId, action.jurisdictionId)
      } catch (e) {
        throw { error: 'failed to get validated questions' }
      }
    }
    
    // Check if the scheme is empty, if it is, there's nothing to do so send back empty status
    if (scheme.schemeQuestions.length === 0) {
      return { isSchemeEmpty: true }
    } else {
      // Create one array with the outline information in the question information
      const merge = scheme.schemeQuestions.reduce((arr, q) => {
        return [...arr, { ...q, ...scheme.outline[q.id] }]
      }, [])

      // Create a sorted question tree with sorted children with question numbering and order
      const { questionsWithNumbers, order, tree } = getQuestionNumbers(sortQuestions(getTreeFromFlatData({ flatData: merge })))
      const questionsById = normalize.arrayToObject(questionsWithNumbers)
      const firstQuestion = questionsWithNumbers[0]

      // Check if the first question has answers, if it doesn't send a request to create an empty coded question
      const { userAnswers } = await initializeAndCheckAnswered(
        firstQuestion, validatedQuestions, questionsById, userId, action, api.createEmptyValidatedQuestion
      )

      // Get all the coded questions for this question
      const { codedQuestionObj, updatedCodedQuestions } = await getCoderInformation({ api, action })

      return {
        outline: scheme.outline,
        scheme: { byId: questionsById, tree, order },
        userAnswers,
        question: firstQuestion,
        validatedQuestions,
        isSchemeEmpty: false,
        userId,
        mergedUserQuestions: {}
      }
    }
  }
})

/*
  Logic for when the user navigates to a question
 */
//TODO: updated merged user questions by getting all of the coders for the selected question
export const getQuestionLogicValidation = createLogic({
  type: [types.ON_QUESTION_SELECTED_IN_NAV, types.GET_NEXT_QUESTION, types.GET_PREV_QUESTION],
  processOptions: {
    dispatchReturn: true,
    successType: types.GET_QUESTION_SUCCESS,
    failType: types.GET_QUESTION_FAIL
  },
  latest: true,
  async process({ getState, action, api }) {
    const state = getState().scenes.validation
    const userId = getState().data.user.currentUser.id
    let questionInfo = {}, answered = false, unanswered = [], updatedAnswers = { ...state.userAnswers }

    // How did the user navigate to the currently selected question
    switch (action.type) {
      case types.ON_QUESTION_SELECTED_IN_NAV:
        questionInfo = getQuestionSelectedInNav(state, action)
        break
      case types.GET_NEXT_QUESTION:
        questionInfo = getNextQuestion(state, action)
        break
      case types.GET_PREV_QUESTION:
        questionInfo = getPreviousQuestion(state, action)
        break
    }

    // Get the scheme question from the db in case it has changed
    const newSchemeQuestion = await api.getSchemeQuestion(questionInfo.question.id, action.projectId)
    sortList(newSchemeQuestion.possibleAnswers, 'order', 'asc')
    const combinedQuestion = { ...state.scheme.byId[questionInfo.question.id], ...newSchemeQuestion }
    const updatedScheme = {
      ...state.scheme,
      byId: {
        ...state.scheme.byId,
        [combinedQuestion.id]: { ...state.scheme.byId[combinedQuestion.id], ...combinedQuestion }
      }
    }

    // Check if question is answered
    if (combinedQuestion.isCategoryQuestion) {
      unanswered = questionInfo.categories.filter(category => {
        return checkIfExists(combinedQuestion, state.userAnswers)
          ? !checkIfExists(category, state.userAnswers[combinedQuestion.id])
          : true
      })
      answered = unanswered.length === 0
    } else {
      answered = checkIfAnswered(state.scheme.byId[combinedQuestion.id], state.userAnswers)
    }

    // If it's not answered create an empty coded question object
    if (!answered) {
      const question = await api.createEmptyValidatedQuestion({
        questionId: combinedQuestion.id,
        projectId: action.projectId,
        jurisdictionId: action.jurisdictionId,
        userId,
        questionObj: {
          categories: questionInfo.selectedCategoryId === null ? [] : [...unanswered.map(cat => cat.id)],
          flag: { notes: '', type: 0 },
          codedAnswers: [],
          comment: '',
          schemeQuestionId: combinedQuestion.id
        }
      })
      updatedAnswers = initializeUserAnswers(combinedQuestion.isCategoryQuestion
        ? [...question] : [question], updatedScheme, userId, updatedAnswers)
    }

    const updatedState = {
      ...state,
      userAnswers: updatedAnswers,
      scheme: updatedScheme,
      selectedCategory: questionInfo.selectedCategory,
      selectedCategoryId: questionInfo.selectedCategoryId,
      categories: questionInfo.categories
    }

    return {
      question: combinedQuestion,
      currentIndex: questionInfo.index,
      updatedState
    }
  }
})

/*
  Logic for when a validator does anything to a validation question
 */
export const validateQuestionLogic = createLogic({
  type: [
    types.UPDATE_USER_ANSWER_REQUEST, types.ON_CHANGE_PINCITE, types.ON_CLEAR_ANSWER,
    types.ON_APPLY_ANSWER_TO_ALL, types.ON_CHANGE_COMMENT
  ],
  processOptions: {
    dispatchReturn: true,
    successType: types.UPDATE_USER_VALIDATION_SUCCESS,
    failType: types.UPDATE_USER_VALIDATION_FAIL
  },
  latest: true,
  async process({ getState, action, api }) {
    const validationState = getState().scenes.validation
    const validatorId = getState().data.user.currentUser.id
    const answerObject = getFinalCodedObject(validationState, action, action.type === types.ON_APPLY_ANSWER_TO_ALL)
    return await api.validateQuestion(action.projectId, action.jurisdictionId, action.questionId, {
      ...answerObject,
      validatedBy: validatorId
    })
  }
})

/*
  Logic for when the validator changes jurisdictions on the validation screen
 */
export const getUserValidatedQuestionsLogic = createLogic({
  type: types.GET_USER_VALIDATED_QUESTIONS_REQUEST,
  processOptions: {
    dispatchReturn: true,
    successType: types.GET_USER_VALIDATED_QUESTIONS_SUCCESS,
    failType: types.GET_USER_VALIDATED_QUESTIONS_FAIL
  },
  async process({ action, api }) {
    const { codedQuestionObj, updatedCodedQuestions } = await getCoderInformation({ api, action })
    return {
      mergedUserQuestions: codedQuestionObj,
      codedQuestions: updatedCodedQuestions
    }
  }
})

/*
  Calls an api route to clear the flag based on the action.flagId
 */
export const clearFlagLogic = createLogic({
  type: [types.CLEAR_RED_FLAG, types.CLEAR_FLAG],
  async process({ action, api }) {
    return await api.clearFlag(action.flagId)
  }
})

export default [
  updateValidatorLogic,
  getUserValidatedQuestionsLogic,
  validateQuestionLogic,
  getQuestionLogicValidation,
  getValidationOutlineLogic,
  clearFlagLogic
]