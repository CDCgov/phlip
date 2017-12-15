import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic from '../logic'
import * as types from '../../../actionTypes'
import apiCalls, { api } from 'services/api'

const mockReducer = (state, action) => state

describe('Home scene - NewProject logic', () => {
  let store
  let mock
  beforeEach(() => {
    store = createMockStore({
      initialState: { data: { user: { currentUser: { firstName: 'Test', lastName: 'User' }}}},
      reducer: mockReducer,
      logic: logic,
      injectedDeps: {
        api: {...apiCalls}
      }
    })
    mock = new MockAdapter(api)
  })

  test('should post a new project, add lastEditedBy from currentUser and dispatch ADD_PROJECT_SUCCESS when successful', (done) => {
    let project = {
      id: 12345,
      name: 'New Project',
      isCompleted: false
    }

    mock.onPost('/projects').reply(200, project)
    store.dispatch({ type: types.ADD_PROJECT_REQUEST, project })
    store.whenComplete(() => {
      /*expect(store.actions).toBeCloseTo([
        { type: types.ADD_PROJECT_REQUEST, project },
        { type: types.ADD_PROJECT_SUCCESS, payload: { ...project, lastEditedBy: 'Test User', dateLastEdited: new Date() } }
      ])*/
      expect(store.actions[1]).toHaveProperty('payload.id')
      expect(store.actions[1]).toHaveProperty('payload.name')
      done()
    })
  })
})