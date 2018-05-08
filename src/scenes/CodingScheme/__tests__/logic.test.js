import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic from '../logic'
import * as types from '../actionTypes'
import createApiHandler, { instance } from 'services/api'

const history = {}
const api = createApiHandler({ history })

describe('CodingScheme logic', () => {
  let mock

  const mockReducer = (state, action) => state

  beforeEach(() => {
    mock = new MockAdapter(instance)
  })

  const setupStore = other => {
    return createMockStore({
      initialState: { questions: [], data: { user: { currentUser: { id: 5 } } } },
      reducer: mockReducer,
      logic,
      injectedDeps: {
        api
      }
    })
  }

  test('should call the api to get the coding scheme and dispatch GET_SCHEME_SUCCESS when successful', (done) => {
    mock.onGet('/projects/1/scheme').reply(200, {
      schemeQuestions: [{ id: 1, text: 'question 1' }],
      outline: { 1: { parentId: 0, positionInParent: 0 } }
    })

    mock.onGet('/locks/scheme/projects/1').reply(200, {})

    const store = setupStore()
    store.dispatch({ type: types.GET_SCHEME_REQUEST, id: 1 })

    store.whenComplete(() => {
      expect(store.actions).toEqual([
        { type: types.GET_SCHEME_REQUEST, id: 1 },
        {
          type: types.GET_SCHEME_SUCCESS,
          payload: {
            scheme: {
              schemeQuestions: [{ id: 1, text: 'question 1' }],
              outline: { 1: { parentId: 0, positionInParent: 0 } }
            },
            lockInfo: {},
            lockedByCurrentUser: false
          }
        }
      ])
      done()
    })
  })
})