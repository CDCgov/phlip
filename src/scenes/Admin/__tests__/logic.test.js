import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import reducer from '../reducer'
import logic from '../logic'
import * as types from '../actionTypes'
import apiCalls, { api } from 'services/api'

describe('Admin Logic', () => {
  let store
  let mock
  beforeEach(() => {
    mock = new MockAdapter(api)
    store = createMockStore({
      reducer: reducer,
      logic: logic,
      injectedDeps: {
        api: { ...apiCalls }
      }
    })
  })

  test('should get user list and dispatch GET_USERS_SUCCESS when done', (done) => {
    mock.onGet('/users').reply(200, [
      { id: 1, firstName: 'Test' },
      { id: 2, firstName: 'Michael' }
    ])
    store.dispatch({ type: types.GET_USERS_REQUEST })
    store.whenComplete(() => {
      expect(store.actions).toEqual([
        { type: types.GET_USERS_REQUEST },
        {
          type: types.GET_USERS_SUCCESS,
          payload: [{ id: 1, firstName: 'Test' }, { id: 2, firstName: 'Michael' }]
        }
      ])
      done()
    })
  })
})