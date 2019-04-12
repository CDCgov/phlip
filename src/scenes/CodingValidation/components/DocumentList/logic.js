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
 * A user's avatar was selected in validation screen to show their annotations for question / answer
 * @type {Logic<object, undefined, undefined, {}, undefined, string>}
 */
const showCoderAnnotations = createLogic({
  type: types.TOGGLE_CODER_ANNOTATIONS,
  transform({ getState, action }, next) {
    const codingState = getState().scenes.codingValidation.coding
    let coderQuestion = {}, valQuestion = {}

    if (codingState.question.isCategoryQuestion) {
      coderQuestion = codingState.mergedUserQuestions[action.questionId][codingState.selectedCategoryId]
      valQuestion = codingState.userAnswers[action.questionId][codingState.selectedCategoryId]
    } else {
      coderQuestion = codingState.mergedUserQuestions[action.questionId]
      valQuestion = codingState.userAnswers[action.questionId]
    }

    const validator = valQuestion.answers.hasOwnProperty(action.answerId) ?
      valQuestion.answers[action.answerId].annotations.map(anno => {
        return {
          ...anno,
          userId: valQuestion.validatedBy.userId || getState().scenes.data.user.currentUser.id
        }
      }) : []

    const coderAnnotations = coderQuestion.answers.filter(codes => {
      return codes.answerId === action.answerId && (action.userId === 'All' ? true : codes.userId === action.userId)
    })

    next({
      ...action,
      annotations: action.userId === 'All'
        ? [...coderAnnotations, ...validator]
        : action.isValidatorSelected
          ? validator
          : coderAnnotations
    })
  }
})

/**
 * The 'All' avatar was selected in validation screen to show all annotations for question / answer
 * @type {Logic<object, undefined, undefined, {}, undefined, string>}
 */
// const showAllAnnotations = createLogic({
//   type: types.TOGGLE_ALL_ANNOTATIONS,
//   transform({ getState, action }, next) {
//     const codingState = getState().scenes.codingValidation.coding
//     let coderQuestion = {}, valQuestion = {}
//
//     if (codingState.question.isCategoryQuestion) {
//       coderQuestion = codingState.mergedUserQuestions[action.questionId][codingState.selectedCategoryId]
//       valQuestion = codingState.userAnswers[action.questionId][codingState.selectedCategoryId]
//     } else {
//       coderQuestion = codingState.mergedUserQuestions[action.questionId]
//       valQuestion = codingState.userAnswers[action.questionId]
//     }
//
//     const validator = valQuestion.answers[action.answerId].annotations.map(anno => {
//       return {
//         ...anno,
//         userId: valQuestion.validatedBy.userId || getState().scenes.data.user.currentUser.id
//       }
//     })
//
//     const coderAnnotations = coderQuestion.answers.filter(codes => {
//       return codes.answerId === action.answerId
//     })
//
//     next({
//       ...action,
//       annotations: [...coderAnnotations, ...validator]
//     })
//   }
// })

export default [
  showCoderAnnotations,
  getApprovedDocumentsLogic
  //showAllAnnotations
]
