import { createLogic } from 'redux-logic'
import { types } from './actions'

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
 * A user's avatar was selected in validation screen to show their annotations for question / answer
 * @type {Logic<object, undefined, undefined, {}, undefined, string>}
 */
const showCoderAnnotations = createLogic({
  type: types.TOGGLE_CODER_ANNOTATIONS,
  transform({ getState, action }, next) {
    const codingState = getState().scenes.codingValidation.coding
    const isValidation = codingState.page === 'validation'
    const user = getState().data.user.currentUser
    let coderQuestion = {}, userQuestion = {}
    
    if (codingState.question.isCategoryQuestion) {
      coderQuestion = isValidation
        ? codingState.mergedUserQuestions[action.questionId][codingState.selectedCategoryId]
        : {}
      userQuestion = codingState.userAnswers[action.questionId][codingState.selectedCategoryId]
    } else {
      coderQuestion = isValidation
        ? codingState.mergedUserQuestions[action.questionId]
        : {}
      userQuestion = codingState.userAnswers[action.questionId]
    }
    
    const userAnnos = userQuestion.answers.hasOwnProperty(action.answerId) ?
      userQuestion.answers[action.answerId].annotations.map(anno => {
        return {
          ...anno,
          userId: isValidation ? (userQuestion.validatedBy.userId || user.id) : user.id
        }
      }) : []
    
    let coderAnnotations = []
    if (codingState.page === 'validation') {
      coderQuestion.answers.forEach(answer => {
        if (answer.schemeAnswerId === action.answerId &&
          (action.userId === 'All' ? true : answer.userId === action.userId)) {
          answer.annotations.forEach(anno => {
            coderAnnotations.push({ ...anno, userId: answer.userId })
          })
        }
      })
    }
    
    next({
      ...action,
      annotations: action.userId === 'All'
        ? [...coderAnnotations, ...userAnnos]
        : action.isUserAnswerSelected
          ? userAnnos
          : coderAnnotations
    })
  }
})

export default [
  showCoderAnnotations,
  getApprovedDocumentsLogic,
  addCitationLogic
]
