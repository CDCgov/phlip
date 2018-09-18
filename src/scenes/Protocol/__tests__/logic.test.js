import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic from '../logic'
import * as types from '../actionTypes'
import createApiHandler, { projectApiInstance } from 'services/api'
import calls from 'services/api/calls'

describe('Protocol logic', () => {
  let mock

  const history = {}
  const api = createApiHandler({ history }, projectApiInstance, calls)

  const mockReducer = (state, action) => state

  beforeEach(() => {
    mock = new MockAdapter(projectApiInstance)
  })

  const setupStore = () => {
    return createMockStore({
      initialState: { data: { user: { currentUser: { id: 5 } } } },
      reducer: mockReducer,
      logic,
      injectedDeps: {
        api
      }
    })
  }

  test('should get the protocol for the project id in the action and dispatch GET_PROTOCOL_SUCCESS when done', done => {
    mock.onGet('/projects/1/protocol').reply(200, { text: 'protocol text!' })
    mock.onGet('/locks/protocol/projects/1').reply(200, {})

    const store = setupStore()

    store.dispatch({ type: types.GET_PROTOCOL_REQUEST, projectId: 1})

    store.whenComplete(() => {
      expect(store.actions).toEqual([
        { type: types.GET_PROTOCOL_REQUEST, projectId: 1 },
        {
          type: types.GET_PROTOCOL_SUCCESS,
          payload: {
            protocol: 'protocol text!',
            lockInfo: {},
            lockedByCurrentUser: false,
            error: {}
          }
        }
      ])
      done()
    })
  })

  test('should send a request to update the protocol for a project id and set user id to current user', done => {
    const store = setupStore()

    mock.onPut('/projects/1/protocol').reply(200, {})

    store.dispatch({ type: types.SAVE_PROTOCOL_REQUEST, projectId: 1, protocol: 'this is new protocol content' })
    store.whenComplete(() => {
      expect(store.actions).toEqual([
        { type: types.SAVE_PROTOCOL_REQUEST, projectId: 1, protocol: 'this is new protocol content' },
        { type: types.SAVE_PROTOCOL_SUCCESS, payload: {} }
      ])
      done()
    })
  })
})