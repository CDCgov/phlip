import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic from '../logic'
import * as types from '../actionTypes'
import apiCalls, { api } from 'services/api'

describe('CodingScheme logic', () => {
  let mock

  const mockReducer = (state, action) => state

  beforeEach(() => {
    mock = new MockAdapter(api)
  })

  const setupStore = other => {
    return createMockStore({
      initialState: { questions: [] },
      reducer: mockReducer,
      logic: logic,
      injectedDeps: {
        api: { ...apiCalls }
      }
    })
  }

  xtest('should call the api to get the coding scheme and dispatch GET_SCHEME_SUCCESS when successful', (done) => {
    mock.onGet('/projects/1/codingscheme').reply(200, {
      codingSchemeQuestions: [{ id: 1, text: 'question 1' }],
      outline: { 1: { parentId: 0, positionInParent: 0 } }
    })

    const store = setupStore()
    store.dispatch({ type: types.GET_SCHEME_REQUEST, id: 1 })

    store.whenComplete(() => {
      expect(store.actions).toEqual([
        { type: types.GET_SCHEME_REQUEST, id: 1 },
        {
          type: types.GET_SCHEME_SUCCESS,
          payload: {
            codingSchemeQuestions: [{ id: 1, text: 'question 1' }],
            outline: { 1: { parentId: 0, positionInParent: 0 } }
          }
        }
      ])
      done()
    })
  })
})