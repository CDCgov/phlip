import { types } from './actions'

export const INITIAL_STATE = {
  document: { content: {} },
  documentRequestInProgress: false
}

const docViewReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.INIT_STATE_WITH_DOC:
      return {
        ...state,
        document: {
          ...action.doc,
          content: {}
        }
      }

    case types.GET_DOCUMENT_CONTENTS_REQUEST:
      return {
        ...state,
        documentRequestInProgress: true
      }

    case types.GET_DOCUMENT_CONTENTS_SUCCESS:
      return {
        ...state,
        document: {
          ...state.document,
          content: action.payload
        },
        documentRequestInProgress: false
      }

    default:
      return state
  }
}

export default docViewReducer
