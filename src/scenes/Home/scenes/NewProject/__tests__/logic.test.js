import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import reducer from '../reducer'
import logic from '../logic'
import * as types from '../../../actionTypes'
import apiCalls, { api } from 'services/api'

describe('Home -- NewProject logic', () => {
  let store
  let mock
  beforeEach(() => {
    store = createMockStore({
      reducer: reducer,
      logic: logic,
      injectedDeps: {
        api: {...apiCalls}
      }
    })
    mock = new MockAdapter(api)
  })

  test('should post a new project and dispatch ADD_PROJECT_REQUEST when successful', (done) => {
    let project = {
      id: 12345,
      name: 'New Project',
      isCompleted: false
    }
    mock.onPost('/projects').reply(200, project)
    store.dispatch({ type: types.ADD_PROJECT_REQUEST, project })
    store.whenComplete(() => {
      expect(store.actions).toEqual([
        { type: types.ADD_PROJECT_REQUEST, project },
        { type: types.ADD_PROJECT_SUCCESS, payload: project }
      ])
      done()
    })
  })
})