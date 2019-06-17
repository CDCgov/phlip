import { createLogic } from 'redux-logic'
import { types } from './actions'

/**
 * Figures out which question to use
 * @param questionId
 * @param state
 * @param isValidation
 * @returns {{coderQuestion, userQuestion}}
 */
const getQuestions = (questionId, state, isValidation) => {
  const codingState = state.scenes.codingValidation.coding
  let coderQuestion = {}, userQuestion = {}
  
  if (codingState.question.isCategoryQuestion) {
    coderQuestion = isValidation
      ? codingState.mergedUserQuestions[questionId][codingState.selectedCategoryId]
      : {}
    userQuestion = codingState.userAnswers[questionId][codingState.selectedCategoryId]
  } else {
    coderQuestion = isValidation
      ? codingState.mergedUserQuestions[questionId]
      : {}
    userQuestion = codingState.userAnswers[questionId]
  }
  
  return { userQuestion, coderQuestion }
}

/**
 * Gets annotations for current user or validator
 * @param question
 * @param answerId
 * @param state
 * @param isValidation
 * @param user
 * @returns {{annotations: Array, users: Array}}
 */
const getUserAnnotations = (question, answerId, state, isValidation, user) => {
  let annotations = [], users = []
  
  if (question.answers.hasOwnProperty(answerId)) {
    let userId = isValidation ? (question.validatedBy.userId || user.id) : user.id
    users.push({ userId, isValidator: isValidation })
    annotations = question.answers[answerId].annotations.map((anno, i) => {
      return {
        ...anno,
        userId,
        isValidatorAnswer: isValidation,
        fullListIndex: i
      }
    })
  }
  
  return { annotations, users }
}

/**
 * Gets coder annotations in validation
 * @param question
 * @param answerId
 */
const getCoderAnnotations = (question, answerId) => {
  let annotations = [], users = []
  question.answers.forEach(answer => {
    if (answer.schemeAnswerId === answerId) {
      answer.annotations.forEach(anno => {
        annotations.push({ ...anno, userId: answer.userId, isValidatorAnswer: false })
        if (users.findIndex(user => user.userId === answer.userId) === -1) {
          users.push({ userId: answer.userId, isValidator: false })
        }
      })
    }
  })
  
  return { annotations, users }
}

/*
 * Adds the document citation string to the action
 */
const addCitationLogic = createLogic({
  type: [types.ON_SAVE_ANNOTATION],
  transform({ action, getState }, next) {
    const state = getState().scenes.codingValidation.documentList
    const doc = state.documents.byId[action.annotation.docId]
    next({
      ...action,
      citation: doc.citation || ''
    })
  }
})

/**
 * Get a list of documents for this project / jurisdiction
 * @type {Logic<object, undefined, undefined, {action?: *, docApi?: *}, undefined, string[]>}
 */
const getApprovedDocumentsLogic = createLogic({
  type: [types.GET_APPROVED_DOCUMENTS_REQUEST],
  async process({ docApi, action }, dispatch, done) {
    try {
      const docs = await docApi.getDocumentsByProjectJurisdiction(
        {},
        {},
        { projectId: action.projectId, jurisdictionId: action.jurisdictionId }
      )
      dispatch({ type: types.GET_APPROVED_DOCUMENTS_SUCCESS, payload: docs })
      done()
    } catch (err) {
      dispatch({ type: types.GET_APPROVED_DOCUMENTS_FAIL })
      done()
    }
  }
})

/**
 * User clicked on a pair of glasses
 * @type {Logic<object, undefined, undefined, {}, undefined, string>}
 */
const toggleViewAnnotations = createLogic({
  type: types.TOGGLE_VIEW_ANNOTATIONS,
  transform({ getState, action }, next) {
    const codingState = getState().scenes.codingValidation.coding
    const isValidation = codingState.page === 'validation'
    const user = getState().data.user.currentUser
    let annotations = [], users = []
    
    const { userQuestion, coderQuestion } = getQuestions(action.questionId, getState(), isValidation)
    const userAnnotations = getUserAnnotations(userQuestion, action.answerId, getState(), isValidation, user)
    const coderAnnotations = isValidation
      ? getCoderAnnotations(coderQuestion, action.answerId)
      : { annotations: [], users: [] }
    
    annotations = [...userAnnotations.annotations, ...coderAnnotations.annotations]
    users = [...userAnnotations.users, ...coderAnnotations.users]
    
    next({
      ...action,
      annotations,
      users
    })
  }
})

/**
 * toggling annotation mode
 */
const toggleAnnoModeLogic = createLogic({
  type: types.TOGGLE_ANNOTATION_MODE,
  transform({ getState, action }, next) {
    let annotations = [], users = []
    
    const codingState = getState().scenes.codingValidation.coding
    const isValidation = codingState.page === 'validation'
    const user = getState().data.user.currentUser
    
    if (action.enabled) {
      const { userQuestion } = getQuestions(action.questionId, getState(), isValidation)
      const userAnnotations = getUserAnnotations(userQuestion, action.answerId, getState(), isValidation, user)
      annotations = [...userAnnotations.annotations]
      users = [...userAnnotations.users]
    }
    
    next({
      ...action,
      annotations,
      users
    })
  }
})

export default [
  toggleViewAnnotations,
  toggleAnnoModeLogic,
  getApprovedDocumentsLogic,
  addCitationLogic
]
