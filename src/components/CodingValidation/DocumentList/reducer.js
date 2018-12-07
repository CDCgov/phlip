import { types } from './actions'
import { arrayToObject } from 'utils/normalize'

export const INITIAL_STATE = {
  documents: {
    byId: {},
    allIds: [],
    ordered: []
  }
}

const mergeName = docObj => ({
  ...docObj,
  uploadedByName: `${docObj.uploadedBy.firstName} ${docObj.uploadedBy.lastName}`
})

const documentListReducer = (state = INITIAL_STATE, action, name) => {
  switch (action.type) {
    case `${types.GET_APPROVED_DOCUMENTS_SUCCESS}_${name}`:
      let docs = action.payload.map(mergeName)
      let obj = arrayToObject(docs, '_id')
      return {
        ...state,
        documents: {
          byId: obj,
          allIds: Object.keys(obj),
          ordered: Object.keys(obj)
        }
      }

    case `${types.GET_APPROVED_DOCUMENTS_REQUEST}_${name}`:
    default:
      return state
  }
}

export default documentListReducer