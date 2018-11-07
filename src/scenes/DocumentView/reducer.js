import { types } from './actions'

const INITIAL_STATE = {
  document: {}
}

const docViewReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.INIT_STATE_WITH_DOC:
      return {
        ...state,
        document: action.doc
      }

    default:
      return state
  }
}

export default docViewReducer