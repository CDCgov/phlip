import { types } from './actions'
import { arrayToObject } from 'utils/normalize'
import { sortListOfObjects } from 'utils/commonHelpers'
import { types as questionTypes } from '../../actions'

export const INITIAL_STATE = {
  documents: {
    byId: {},
    allIds: [],
    ordered: [],
    annotated: {}
  },
  docSelected: false,
  openedDoc: {
    _id: '',
    content: {}
  }
}

const mergeName = docObj => ({
  ...docObj,
  uploadedByName: `${docObj.uploadedBy.firstName} ${docObj.uploadedBy.lastName}`
})

const sortAnnotations = (userAnswers, newQuestion = {}) => {
  let byQuestion = {
    [newQuestion.id]: {
      byAnswer: {},
      all: []
    }
  }

  Object.values(userAnswers).map(question => {
    let answers = Object.values(question.answers)
    byQuestion[question.schemeQuestionId] = {
      byAnswer: {},
      all: []
    }

    answers.forEach(answer => {
      let annotations
      byQuestion[question.schemeQuestionId].byAnswer[answer.schemeAnswerId] = []
      try {
        annotations = JSON.parse(answer.annotations)
        annotations.map(annotation => {
          byQuestion[question.schemeQuestionId].byAnswer[answer.schemeAnswerId].push(annotation.docId)
          if (!byQuestion[question.schemeQuestionId].all.includes(annotation.docId))
            byQuestion[question.schemeQuestionId].all.push(annotation.docId)
        })
      } catch (err) {

      }
    })
  })
  return byQuestion
}

const documentListReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.GET_APPROVED_DOCUMENTS_SUCCESS:
      let docs = action.payload.map(mergeName)
      let obj = arrayToObject(docs, '_id')
      return {
        ...state,
        documents: {
          ...state.documents,
          byId: obj,
          allIds: Object.keys(obj),
          ordered: sortListOfObjects(Object.values(obj), 'uploadedDate', 'desc').map(obj => obj._id)
        },
        ...state.docSelected
          ? Object.keys(obj).includes(state.openedDoc._id)
            ? {}
            : { docSelected: false, openedDoc: {} }
          : {}
      }

    case questionTypes.GET_VALIDATION_OUTLINE_SUCCESS:
    case questionTypes.GET_CODING_OUTLINE_SUCCESS:
    case questionTypes.GET_USER_CODED_QUESTIONS_SUCCESS:
    case questionTypes.GET_USER_VALIDATED_QUESTIONS_SUCCESS:
      let byQuestion = sortAnnotations(action.payload.userAnswers, action.payload.question)
      return {
        ...state,
        documents: {
          ...state.documents,
          annotated: byQuestion
        }
      }

    case questionTypes.GET_QUESTION_SUCCESS:
      byQuestion = sortAnnotations(action.payload.updatedState.userAnswers, action.payload.question)
      return {
        ...state,
        documents: {
          ...state.documents,
          annotated: byQuestion
        }
      }

    case types.GET_DOC_CONTENTS_REQUEST:
      return {
        ...state,
        openedDoc: {
          _id: action.id,
          name: state.documents.byId[action.id].name
        }
      }

    case types.GET_DOC_CONTENTS_SUCCESS:
      return {
        ...state,
        docSelected: true,
        openedDoc: {
          ...state.openedDoc,
          content: action.payload
        }
      }

    case types.CLEAR_DOC_SELECTED:
      return {
        ...state,
        docSelected: false,
        openedDoc: {}
      }

    case types.GET_APPROVED_DOCUMENTS_REQUEST:
    default:
      return state
  }
}

export default documentListReducer