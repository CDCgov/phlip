import { createLogic } from 'redux-logic'
import { types } from './actions'

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
 * Retrieves all annotations for a question / answer for validator or coder
 * @type {Logic<object, undefined, undefined, {}, undefined, string[]>}
 */
const enableAnnotationMode = createLogic({
  type: [types.SHOW_VALIDATOR_ANNOTATIONS],
  transform({ getState, action }, next) {
    const codingState = getState().scenes.codingValidation.coding
    const annotations = codingState.question.isCategoryQuestion
      ? codingState.userAnswers[action.questionId][codingState.selectedCategoryId].answers[action.answerId].annotations
      : codingState.userAnswers[action.questionId].answers[action.answerId].annotations

    next({
      ...action,
      annotations
    })
  }
})

/**
 * A user's avatar was selected in validation screen to show their annotations for question / answer
 * @type {Logic<object, undefined, undefined, {}, undefined, string>}
 */
const showCoderAnnotations = createLogic({
  type: types.SHOW_CODER_ANNOTATIONS,
  transform({ getState, action }, next) {
    const question = getState().scenes.codingValidation.coding.mergedUserQuestions[action.questionId]
    const annotations = question.filter(codes => {
      return codes.answerId === action.answerId && codes.userId === action.userId
    })

    next({
      ...action,
      annotations
    })
  }
})

/**
 * The 'All' avatar was selected in validation screen to show all annotations for question / answer
 * @type {Logic<object, undefined, undefined, {}, undefined, string>}
 */
const showAllAnnotations = createLogic({
  type: types.SHOW_ALL_ANNOTATIONS,
  transform({ getState, action }, next) {
    const codingState= getState().scenes.codingValidation.coding
    const question = codingState.mergedUserQuestions[action.questionId]
    const valAnnotations = codingState.question.isCategoryQuestion
      ? codingState.userAnswers[action.questionId][codingState.selectedCategoryId].answers[action.answerId]
      : codingState.userAnswers[action.questionId].answers[action.answerId]

    const validator = valAnnotations.map(answer => {
      return {
        ...answer.annotations,
        userId: answer.validatedBy.userId || getState().scenes.data.user.currentUser.id
      }
    })

    const coderAnnotations = question.answers.filter(codes => {
      return codes.answerId === action.answerId
    })

    next({
      ...action,
      annotations: [...coderAnnotations, ...validator]
    })
  }
})

export default [
  enableAnnotationMode,
  showCoderAnnotations,
  getApprovedDocumentsLogic,
  showAllAnnotations
]
