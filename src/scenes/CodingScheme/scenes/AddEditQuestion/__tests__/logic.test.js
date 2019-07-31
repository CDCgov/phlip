import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic from '../logic'
import { types } from '../actions'
import createApiHandler, { projectApiInstance } from 'services/api'
import calls from 'services/api/calls'
import { INITIAL_STATE as USER_INITIAL_STATE } from 'data/users/reducer'
import { INITIAL_STATE as MAIN_INITIAL_STATE } from 'scenes/CodingScheme/reducer'
import { INITIAL_STATE as ADD_EDIT_INITIAL_STATE } from '../reducer'

let history = {}, mock = {}
const api = createApiHandler({ history }, projectApiInstance, calls)
const setupStore = (otherMainState = {}, otherAddEditState = {}) => {
  return createMockStore({
    initialState: {
      data: {
        user: {
          ...USER_INITIAL_STATE,
          currentUser: {
            id: 1, firstName: 'Test', lastName: 'User', avatar: ''
          },
          byId: {
            1: { id: 1 }
          }
        }
      },
      scenes: {
        codingScheme: {
          main: {
            ...MAIN_INITIAL_STATE,
            ...otherMainState
          },
          addEditQuestion: {
            ...ADD_EDIT_INITIAL_STATE,
            ...otherAddEditState
          }
        }
      }
    },
    reducer: state => state,
    logic,
    injectedDeps: { api }
  })
}

describe('CodingScheme - AddEditQuestion logic', () => {
  beforeEach(() => {
    mock = new MockAdapter(projectApiInstance)
  })
})
