import { types } from './actions'

export const INITIAL_STATE = {
  document: {
    content: {},
    projects: [],
    jurisdictions: []
  },
  documentRequestInProgress: false,
  documentUpdatingInProgress: false
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

    case types.UPDATE_DOC_PROPERTY:
      let selectedDoc = { ...state.document }
      let value = action.value
      switch (action.property) {
        case 'jurisdictions':
        case 'projects':
          let foundIdx = selectedDoc[action.property].findIndex(el => el == value.id)
          if (foundIdx == -1) {
            selectedDoc[action.property] = [
              ...selectedDoc[action.property], value.id
            ]
          }
          break
        case 'effectiveDate':
          selectedDoc[action.property] = action.value.toISOString()
          break

        default:
          selectedDoc[action.property] = action.value
          break
      }
      return {
        ...state,
        document: selectedDoc
      }

    case types.UPDATE_DOC_REQUEST:
      return {
        ...state,
        documentUpdatingInProgress: true
      }

    case types.UPDATE_DOC_SUCCESS:
      return {
        ...state,
        documentUpdatingInProgress: false
      }

    default:
      return state
  }
}

export default docViewReducer

// export default combineReducers({
//     docView: docViewReducer,
//     projectSuggestions: createAutocompleteReducer('PROJECT'),
//     jurisdictionSuggestions: createAutocompleteReducer('JURISDICTION')
// })