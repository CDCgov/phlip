import makeActionCreator from 'utils/makeActionCreator'
import { makeAutocompleteActionCreators } from 'data/autocomplete/actions'

export const types = {

  CLOSE_ALERT: 'CLOSE_ALERT',
  OPEN_ALERT: 'OPEN_ALERT',
  UPDATE_DOC_PROPERTY: 'UPDATE_DOC_PROPERTY',
  UPDATE_DOC_FAIL: 'UPDATE_DOC_FAIL',
  UPDATE_DOC_REQUEST: 'UPDATE_DOC_REQUEST',



}

export default {
  updateDocumentProperty: makeActionCreator(types.UPDATE_DOC_PROPERTY, 'index', 'property', 'value'),
  updateDocRequest : makeActionCreator(types.UPDATE_DOC_REQUEST,'doc'),
}

export const projectAutocomplete = {
  ...makeAutocompleteActionCreators('PROJECT', '')
}

export const jurisdictionAutocomplete = {
  ...makeAutocompleteActionCreators('JURISDICTION', '')
}


