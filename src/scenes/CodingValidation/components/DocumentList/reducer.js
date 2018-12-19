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

const handleCategories = categories => {
  let obj = {}
  categories.forEach(cat => {
    obj[cat.id] = { byAnswer: {}, all: [] }
  })
  return obj
}

const initializeAnnotationsByAnswer = answers => {
  let q = {
    byAnswer: {},
    all: []
  }

  answers.forEach(answer => {
    let annotations
    q.byAnswer[answer.schemeAnswerId] = []
    try {
      annotations = JSON.parse(answer.annotations)
      annotations.map(annotation => {
        q.byAnswer[answer.schemeAnswerId].push(annotation.docId)
        if (!q.all.includes(annotation.docId))
          q.all.push(annotation.docId)
      })
    } catch (err) {
      console.log(err)
    }
  })

  return q
}

const sortAnnotations = (userAnswers, newQuestion = {}, categories = [], scheme) => {
  let byQuestion = {
    [newQuestion.id]: newQuestion.isCategoryQuestion
      ? handleCategories(categories)
      : { byAnswer: {}, all: [] }
  }

  Object.keys(userAnswers).map(questionId => {
    const question = userAnswers[questionId]
    byQuestion[questionId] = {}

    if (scheme[questionId].isCategoryQuestion) {
      const cats = Object.keys(question)
      cats.forEach(cat => {
        byQuestion[questionId][cat] = initializeAnnotationsByAnswer(Object.values(question[cat].answers))
      })
    } else {
      byQuestion[questionId] = initializeAnnotationsByAnswer(Object.values(question.answers))
    }
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
      let byQuestion = sortAnnotations(
        action.payload.userAnswers,
        action.payload.question,
        [],
        action.payload.scheme.byId
      )

      return {
        ...state,
        documents: {
          ...state.documents,
          annotated: byQuestion
        }
      }

    case questionTypes.GET_QUESTION_SUCCESS:
      byQuestion = sortAnnotations(
        action.payload.updatedState.userAnswers,
        action.payload.question,
        action.payload.updatedState.categories,
        action.payload.updatedState.scheme.byId
      )

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