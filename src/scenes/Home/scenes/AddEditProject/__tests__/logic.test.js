import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic from '../logic'
import * as types from '../../../actionTypes'
import apiCalls, { api } from 'services/api'

const mockReducer = (state, action) => state

describe('Home scene - AddEditProject logic', () => {
  let mock

  beforeEach(() => {
    mock = new MockAdapter(api)
  })

  const setupStore = initialBookmarks => {
    return createMockStore({
      initialState: { data: { user: { currentUser: { id: 5, bookmarks: initialBookmarks, firstName: 'Test', lastName: 'User' }}}},
      reducer: mockReducer,
      logic: logic,
      injectedDeps: {
        api: { ...apiCalls }
      }
    })
  }

  test('should post a new project and dispatch ADD_PROJECT_SUCCESS when successful', (done) => {
    let project = {
      id: 12345,
      name: 'New Project',
      isCompleted: false,
      lastEditedBy: 'Test User'
    }

    mock.onPost('/projects').reply(200, project)
    const store = setupStore()
    store.dispatch({ type: types.ADD_PROJECT_REQUEST, project })
    store.whenComplete(() => {
      expect(store.actions).toEqual([
        { type: types.ADD_PROJECT_REQUEST, project: { ...project, userId: 5} },
        { type: types.ADD_PROJECT_SUCCESS, payload: { ...project } }
      ])
      done()
    })
  })

  test('should put an updated project and dispatch UPDATE_PROJECT_SUCCESS when successful', (done) => {
    const project = { id: 1, name: 'Updated Project', lastEditedBy: 'Test User' }
    const store = setupStore([])

    mock.onPut('/projects/1').reply(200, project)
    store.dispatch({ type: types.UPDATE_PROJECT_REQUEST, project: { ...project, userId: 5} })
    store.whenComplete(() => {
      expect(store.actions[1].type).toEqual('UPDATE_PROJECT_SUCCESS')
      expect(store.actions[1].payload.lastEditedBy).toEqual('Test User')
      expect(store.actions[1].payload.name).toEqual('Updated Project')
      done()
    })
  })
})