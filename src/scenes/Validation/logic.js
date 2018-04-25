import { createLogic } from 'redux-logic'
import { sortQuestions, getQuestionNumbers } from 'utils/treeHelpers'
import { getTreeFromFlatData } from 'react-sortable-tree'
import {
  getFinalCodedObject, initializeUserAnswers, getSelectedQuestion, checkIfExists,
  getPreviousQuestion, getQuestionSelectedInNav, getNextQuestion, initializeNextQuestion, initializeValues
} from 'utils/codingHelpers'
import { normalize, sortList } from 'utils'
import * as types from './actionTypes'

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

const getCoderInformation = async ({ api, action, questionId }) => {
  let codedQuestionObj = {}, allCodedQuestions = [], coderErrors = {}

  try {
    allCodedQuestions = await api.getAllCodedQuestionsForQuestion(action.projectId, action.jurisdictionId, questionId)
  } catch (e) {
    coderErrors = { allCodedQuestions: 'Failed to get all the user coded answers for this question.' }
  }

  if (allCodedQuestions.length === 0) {
    codedQuestionObj = { [questionId]: { answers: [], flagsComments: [] } }
  }
  for (let coderUser of allCodedQuestions) {
    if (coderUser.codedQuestions.length > 0) {
      codedQuestionObj = { ...mergeInUserCodedQuestions(codedQuestionObj, coderUser.codedQuestions, coderUser.coder) }
    }
  }

  return { codedQuestionObj, coderErrors }
}

//TODO: const getAvatarForValidatedBy = async ({}) 

/*
  Some of the reusable functions need to know whether we're on the validation screen or not, so that's what this is for
 */
export const updateValidatorLogic = createLogic({
  type: [types.UPDATE_USER_ANSWER, types.ON_APPLY_ANSWER_TO_ALL],
  transform({ action, getState }, next) {
    next({
      ...action,
      otherProps: { validatedBy: { ...getState().data.user.currentUser } },
      isValidation: true
    })
  }
})

/*
  Logic for when the user first opens the validation screen
 */
export const getValidationOutlineLogic = createLogic({
  type: types.GET_VALIDATION_OUTLINE_REQUEST,
  async process({ action, getState, api }, dispatch, done) {
    let scheme = {}, validatedQuestions = [], errors = {}, payload = action.payload
    const userId = action.userId

    try {
      // Try to get the project coding scheme
      scheme = await api.getScheme(action.projectId)

      // Get user coded questions for currently selected jurisdiction
      if (action.jurisdictionId) {
        if (scheme.schemeQuestions.length === 0) {
          payload = { isSchemeEmpty: true, areJurisdictionsEmpty: false }
        } else {
          try {
            /* this is just here until the api routes are fixed*/
            validatedQuestions = await api.getValidatedQuestions(action.projectId, action.jurisdictionId)
          } catch (e) {
            errors = {
              ...errors,
              codedQuestions: 'We couldn\'t get the validated questions for this project, so you won\'t be able to validate questions.'
            }
          }
          // Create one array with the outline information in the question information
          const merge = scheme.schemeQuestions.reduce((arr, q) => {
            return [...arr, { ...q, ...scheme.outline[q.id] }]
          }, [])

          // Create a sorted question tree with sorted children with question numbering and order
          const { questionsWithNumbers, order, tree } = getQuestionNumbers(sortQuestions(getTreeFromFlatData({ flatData: merge })))
          const questionsById = normalize.arrayToObject(questionsWithNumbers)
          const firstQuestion = questionsWithNumbers[0]

          const userAnswers = initializeUserAnswers(
            [initializeNextQuestion(firstQuestion), ...validatedQuestions], questionsById, userId
          )
          sortList(firstQuestion.possibleAnswers, 'order', 'asc')

          // Get all the coded questions for this question
          const { codedQuestionObj, coderErrors } = await getCoderInformation({
            api,
            action,
            questionId: firstQuestion.id
          })

          let codersForProject = []
          try {
            codersForProject = await api.getCodersForProject(action.projectId)
          } catch (e) {
            throw { error: 'failed to load coders for project' }
          }
          const uniqueUserIds = codersForProject.map(coders => coders.userId)

          const uniqueValidatedUsersIds = validatedQuestions
            .map((validatedQuestion) => validatedQuestion.validatedBy.userId)
            .filter((elem, pos, arr) => arr.indexOf(elem) == pos)

          const combinedUsersOnProject = [...uniqueUserIds, ...uniqueValidatedUsersIds]
          let uniqueUsersWithAvatar = []
          const combinedUniqueUsersOnProject = combinedUsersOnProject.filter((elem, pos, arr) => arr.indexOf(elem) ==
            pos)

          for (let userId of combinedUniqueUsersOnProject) {
            try {
              const avatar = await api.getUserImage(userId)
              let userWithId = { id: userId, avatar }
              uniqueUsersWithAvatar = [...uniqueUsersWithAvatar, { ...userWithId }]
            } catch (e) {
              throw { error: 'failed to get validatedBy avatar image' }
            }
          }

          const userImages = normalize.arrayToObject(uniqueUsersWithAvatar)
          payload = {
            ...payload,
            outline: scheme.outline,
            scheme: { byId: questionsById, tree, order },
            userAnswers,
            question: firstQuestion,
            mergedUserQuestions: codedQuestionObj,
            userImages,
            errors: { ...errors, ...coderErrors }
          }
        }
      } else {
        // Check if the scheme is empty, if it is, there's nothing to do so send back empty status
        if (scheme.schemeQuestions.length === 0) {
          payload = { ...payload, isSchemeEmpty: true, areJurisdictionsEmpty: true }
        } else {
          payload = { ...payload, isSchemeEmpty: false, areJurisdictionsEmpty: true }
        }
      }
      dispatch({
        type: types.GET_VALIDATION_OUTLINE_SUCCESS,
        payload
      })
    } catch (e) {
      dispatch({
        type: types.GET_VALIDATION_OUTLINE_FAIL,
        payload: 'Couldn\'t get outline',
        error: true
      })
    }
    done()
  }
})

/*
  Logic for when the user navigates to a question
 */
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
    const {
      updatedState,
      question,
      currentIndex,
      errors
    } = await getSelectedQuestion(state, action, api, action.userId, action.questionInfo, api.getUserValidatedQuestion)
    const { codedQuestionObj, coderErrors } = await getCoderInformation({ api, action, questionId: question.id })

    return {
      updatedState: { ...updatedState, mergedUserQuestions: { ...state.mergedUserQuestions, ...codedQuestionObj } },
      question,
      currentIndex,
      errors: { ...errors, ...coderErrors }
    }
  }
})

export const applyAllAnswers = createLogic({
  type: types.ON_APPLY_ANSWER_TO_ALL,
  async process({ getState, action, api }, dispatch, done) {
    const validatorId = getState().data.user.currentUser.id
    const validationState = getState().scenes.validation
    const allCategoryObjects = Object.values(validationState.userAnswers[action.questionId])

    const answerObject = {
      questionId: action.questionId,
      jurisdictionId: action.jurisdictionId,
      projectId: action.projectId
    }

    try {
      for (let category of allCategoryObjects) {
        let respCodedQuestion = {}
        const question = {
          ...getFinalCodedObject(validationState, action, category.categoryId),
          validatedBy: validatorId
        }

        if (category.id !== undefined) {
          respCodedQuestion = await api.updateValidatedQuestion({ ...answerObject, questionObj: question })
        } else {
          const { id, ...questionObj } = question
          respCodedQuestion = await api.answerValidatedQuestion({ ...answerObject, questionObj })
        }

        dispatch({
          type: types.SAVE_USER_ANSWER_SUCCESS,
          payload: { ...respCodedQuestion, questionId: action.questionId, selectedCategoryId: category.categoryId }
        })
      }
      dispatch({
        type: types.UPDATE_EDITED_FIELDS,
        projectId: action.projectId
      })
    } catch (error) {
      dispatch({
        type: types.SAVE_USER_ANSWER_FAIL,
        payload: { error: 'Could not update answer', isApplyAll: true }
      })
    }
    done()
  }
})

/*
  Logic for when a validator does anything to a validation question
 */
export const validateQuestionLogic = createLogic({
  type: types.SAVE_USER_ANSWER_REQUEST,
  debounce: 350,
  validate({ getState, action }, allow, reject) {
    const state = getState().scenes.validation
    const questionObj = getFinalCodedObject(state, action, action.selectedCategoryId)
    const answerObject = {
      questionId: action.questionId,
      jurisdictionId: action.jurisdictionId,
      projectId: action.projectId,
      questionObj: { ...questionObj, validatedBy: getState().data.user.currentUser.id }
    }

    if (state.unsavedChanges === true) {
      if (questionObj.isNewCodedQuestion === true && questionObj.hasMadePost === true &&
        !questionObj.hasOwnProperty('id')) {
        reject({ type: types.ADD_REQUEST_TO_QUEUE, payload: answerObject })
      } else {
        allow({ ...action, payload: { ...answerObject, selectedCategoryId: action.selectedCategoryId } })
      }
    } else {
      reject()
    }
  },
  async process({ getState, action, api }, dispatch, done) {
    let respCodedQuestion = {}

    try {
      if (action.payload.questionObj.hasOwnProperty('id')) {
        respCodedQuestion = await api.updateValidatedQuestion({ ...action.payload })

        // Remove any pending requests from the queue because this is the latest one and has an id
        dispatch({
          type: types.REMOVE_REQUEST_FROM_QUEUE,
          payload: { questionId: action.payload.questionId, categoryId: action.payload.selectedCategoryId }
        })
      } else {
        respCodedQuestion = await api.answerValidatedQuestion({ ...action.payload })
      }

      dispatch({
        type: types.SAVE_USER_ANSWER_SUCCESS,
        payload: {
          ...respCodedQuestion,
          questionId: action.questionId,
          selectedCategoryId: action.selectedCategoryId
        }
      })

      dispatch({
        type: types.SEND_QUEUE_REQUESTS,
        payload: {
          selectedCategoryId: action.payload.selectedCategoryId,
          questionId: action.payload.questionId,
          id: respCodedQuestion.id
        }
      })

      dispatch({
        type: types.UPDATE_EDITED_FIELDS,
        projectId: action.projectId
      })

    } catch (error) {
      if (error.response.status === 303) {
        dispatch({
          type: types.OBJECT_EXISTS,
          payload: {
            selectedCategoryId: action.payload.selectedCategoryId,
            questionId: action.payload.questionId,
            object: initializeValues(error.response.data)
          }
        })
      } else {
        dispatch({
          type: types.SAVE_USER_ANSWER_FAIL,
          payload: {
            error: 'Could not update answer',
            isApplyAll: false,
            selectedCategoryId: action.payload.selectedCategoryId,
            questionId: action.payload.questionId
          }
        })
      }
    }
    done()
  }
})

/*
  Logic for when the validator changes jurisdictions on the validation screen
 */
export const getUserValidatedQuestionsLogic = createLogic({
  type: types.GET_USER_VALIDATED_QUESTIONS_REQUEST,
  async process({ action, api, getState }, dispatch, done) {
    let validatedQuestions = []
    const userId = getState().data.user.currentUser.id
    const state = getState().scenes.validation
    let question = { ...state.question }
    let otherUpdates = {}, errors = {}, payload = {}, updatedSchemeQuestion = {}

    // Get user coded questions for a project and jurisdiction
    try {
      validatedQuestions = await api.getValidatedQuestions(action.projectId, action.jurisdictionId)
    } catch (e) {
      errors = { codedQuestions: 'We couldn\'t get the validated questions for this project, so you won\'t be able to validate questions.' }
    }

    // If the current question is a category question, then change the current question to parent
    if (state.question.isCategoryQuestion) {
      question = state.scheme.byId[question.parentId]
      otherUpdates = {
        currentIndex: state.scheme.order.findIndex(id => id === question.id),
        categories: undefined,
        selectedCategory: 0,
        selectedCategoryId: null
      }
    }

    // Get scheme question in case there are changes
    try {
      updatedSchemeQuestion = await api.getSchemeQuestion(question.id, action.projectId)
    } catch (error) {
      updatedSchemeQuestion = { ...question }
      errors = {
        ...errors,
        updatedSchemeQuestion: 'We couldn\'t get retrieve this scheme question. You still have access to the previous scheme question content, but any updates that have been made since the time you started coding are not available.'
      }
    }

    // Update scheme with new scheme question
    const updatedScheme = {
      ...state.scheme,
      byId: {
        ...state.scheme.byId,
        [updatedSchemeQuestion.id]: { ...state.scheme.byId[updatedSchemeQuestion.id], ...updatedSchemeQuestion }
      }
    }

    const userAnswers = initializeUserAnswers(
      [initializeNextQuestion(updatedSchemeQuestion), ...validatedQuestions], updatedScheme.byId, userId
    )

    const { codedQuestionObj, coderErrors } = await getCoderInformation({
      api,
      action,
      questionId: updatedSchemeQuestion.id
    })

    let codersForProject = []
    //Get validatedByImages
    try {
      codersForProject = await api.getCodersForProject(action.projectId)
    } catch (e) {
      throw { error: 'failed to load coders for project' }
    }

    const uniqueUserIds = codersForProject.map((coders) => {
      return coders.userId
    })

    const uniqueValidatedUsersIds = validatedQuestions.map((validatedQuestion) => {
      return validatedQuestion.validatedBy.userId
    }).filter((elem, pos, arr) => {
      return arr.indexOf(elem) == pos
    })

    const combinedUsersOnProject = [...uniqueUserIds, ...uniqueValidatedUsersIds]

    let uniqueUsersWithAvatar = []
    const combinedUniqueUsersOnProject = combinedUsersOnProject.filter((elem, pos, arr) => {
      return arr.indexOf(elem) == pos
    })

    for (let userId of combinedUniqueUsersOnProject) {
      try {
        const avatar = await api.getUserImage(userId)
        let userWithId = { id: userId, avatar }
        uniqueUsersWithAvatar = [...uniqueUsersWithAvatar, { ...userWithId }]

      } catch (e) {
        throw { error: 'failed to get validatedBy avatar image' }
      }
    }
    const userImages = normalize.arrayToObject(uniqueUsersWithAvatar)

    payload = {
      userAnswers,
      question: { ...state.scheme.byId[updatedSchemeQuestion.id], ...updatedSchemeQuestion },
      scheme: updatedScheme,
      otherUpdates,
      mergedUserQuestions: codedQuestionObj,
      errors: { ...errors, ...coderErrors },
      userImages
    }

    dispatch({
      type: types.GET_USER_VALIDATED_QUESTIONS_SUCCESS,
      payload
    })
    done()
  }
})

/*
  Calls an api route to clear the flag based on the action.flagId, type 1 === red, type 2 === other
 */
export const clearFlagLogic = createLogic({
  type: [types.CLEAR_RED_FLAG, types.CLEAR_FLAG],
  async process({ action, api }, dispatch, done) {
    try {
      const out = await api.clearFlag(action.flagId)
      dispatch({
        type: types.CLEAR_FLAG_SUCCESS,
        payload: {
          ...out, flagId: action.flagId, type: action.type === types.CLEAR_RED_FLAG ? 1 : 2
        }
      })
      dispatch({ type: types.UPDATE_EDITED_FIELDS, projectId: action.projectId })
    } catch (error) {
      dispatch({
        type: types.CLEAR_FLAG_FAIL,
        payload: 'We couldn\'t clear this flag.'
      })
    }
    done()
  }
})

export default [
  updateValidatorLogic,
  getUserValidatedQuestionsLogic,
  validateQuestionLogic,
  getQuestionLogicValidation,
  getValidationOutlineLogic,
  applyAllAnswers,
  clearFlagLogic
]