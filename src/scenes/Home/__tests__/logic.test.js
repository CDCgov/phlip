import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic from '../logic'
import * as types from '../actionTypes'
import createApiHandler, { projectApiInstance } from 'services/api'
import calls from 'services/api/calls'

describe('Home logic', () => {
  let mock

  const mockReducer = (state, action) => state
  const history = {}
  const api = createApiHandler({ history }, projectApiInstance, calls)

  beforeEach(() => {
    mock = new MockAdapter(projectApiInstance)
  })
  
  const setupStore = initialBookmarks => {
    return createMockStore({
      initialState: { data: { user: { currentUser: { id: 5, bookmarks: initialBookmarks } } } },
      reducer: mockReducer,
      logic,
      injectedDeps: {
        api
      }
    })
  }

  test('should get project list and set bookmarkList and dispatch GET_PROJECTS_SUCCESS when done', (done) => {
    mock.onGet('/projects').reply(200, [
      { name: 'Project 1', id: 1, lastEditedBy: 'Test User   ', dateLastEdited: "1/1/2000", projectJurisdictions: [] },
      { name: 'Project 2', id: 2, lastEditedBy: ' Test User    ', projectJurisdictions: [] }
    ])

    const store = setupStore([1])

    store.dispatch({ type: types.GET_PROJECTS_REQUEST })

    store.whenComplete(() => {
      expect(store.actions).toEqual([
        { type: types.GET_PROJECTS_REQUEST },
        {
          type: types.GET_PROJECTS_SUCCESS,
          payload: {
            projects: [
              { name: 'Project 1', id: 1, lastEditedBy: 'Test User', dateLastEdited: "1/1/2000", projectJurisdictions: [] },
              { name: 'Project 2', id: 2, lastEditedBy: 'Test User', projectJurisdictions: [] }
            ],
            bookmarkList: [1],
            error: false,
            errorContent: '',
            searchValue: ''
          }
        }
      ])
      done()
    })
  })

  test('should add the project id to bookmarkList if the id doesn\'t exist when TOGGLE_BOOKMARK is dispatched', (done) => {
    const project = { id: 1, name: 'Project 1' }
    const store = setupStore([])

    mock.onPost('/users/5/bookmarkedprojects/1').reply(200, [
      { projectId: 1, userId: 5 },
      { projectId: 2, userId: 5 }
    ])

    store.dispatch({ type: types.TOGGLE_BOOKMARK, project })
    store.whenComplete(() => {
      expect(store.actions[1].payload.bookmarkList).toEqual([1])
      done()
    })
  })

  test('should remove the project id from the bookmarkList if the id exists when TOGGLE_BOOKMARK is dispatched', (done) => {
    const project = { id: 2, name: 'Project 2' }
    const store = setupStore([2, 1, 5])

    mock.onDelete('/users/5/bookmarkedprojects/2').reply(200, [
      { projectId: 1, userId: 5 },
      { projectId: 5, userId: 5 }
    ])

    store.dispatch({ type: types.TOGGLE_BOOKMARK, project })
    store.whenComplete(() => {
      expect(store.actions[1].payload.bookmarkList).toEqual([1, 5])
      done()
    })
  })

  test('should return bookmarkList as empty if length is 1 and project id is being un-bookmarked', (done) => {
    const project = { id: 2, name: 'Project 2' }
    mock.onDelete('/users/5/bookmarkedprojects/2').reply(200, [])
    const store = setupStore([2])

    store.dispatch({ type: types.TOGGLE_BOOKMARK, project })
    store.whenComplete(() => {
      expect(store.actions[1].payload.bookmarkList).toEqual([])
      done()
    })
  })
})