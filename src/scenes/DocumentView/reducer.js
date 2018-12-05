import { types } from './actions'
import { combineReducers } from 'redux'
import { createAutocompleteReducer } from 'data/autocomplete/reducer'
import { types as autocompleteTypes } from 'data/autocomplete/actions'
import { updateItemAtIndex } from 'utils/normalize'


export const INITIAL_STATE = {
  document: { content: {}, projects: [], jurisdictions: [] },
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
          console.log('action prop ', action)
          let selectedDoc = { ...state.document }
          let value = action.value
          switch (action.property) {
              case  'jurisdictions' :
              case 'projects' :
                  selectedDoc[action.property] = [
                      ...selectedDoc[action.property],
                      value.id];
                  break;
              default:
          }
          return {
              ...state, document: selectedDoc,
          }
    case types.UPDATE_DOC_REQUEST:
          return {
              ...state, documentUpdatingInProgress : true
          }
          console.log('update doc action ',action)
          break;


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
