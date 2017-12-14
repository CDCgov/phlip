import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import reducer from '../reducer'
import logic from '../logic'
import * as types from '../actionTypes'
import apiCalls, { api } from 'services/api'

describe('Home logic', () => {
  let store
  let mock

  const mockReducer = (state, action) => state

  beforeEach(() => {
    mock = new MockAdapter(api)
  })

  const setupStore = initialBookmarks => {
    return createMockStore({
      initialState: { data: { user: { currentUser: { bookmarks: initialBookmarks }}}},
      reducer: mockReducer,
      logic: logic,
      injectedDeps: {
        api: { ...apiCalls }
      }
    })
  }

  test('should get project list and set bookmarkList and dispatch GET_PROJECTS_SUCCESS when done', (done) => {
    mock.onGet('/projects').reply(200, [
      { name: 'Project 1', id: 1 },
      { name: 'Project 2', id: 2 }
    ])

    const store = setupStore([1])

    store.dispatch({ type: types.GET_PROJECTS_REQUEST })

    store.whenComplete(() => {
      expect(store.actions).toEqual([
        { type: types.GET_PROJECTS_REQUEST },
        {
          type: types.GET_PROJECTS_SUCCESS,
          payload: {
            projects: [{ name: 'Project 1', id: 1 }, { name: 'Project 2', id: 2 }],
            bookmarkList: [1]
          }
        }
      ])
      done()
    })
  })

  test('should add the project id to bookmarkList if the id doesn\'t exist when TOGGLE_BOOKMARK is dispatched', (done) => {
    const project = { id: 1, name: 'Project 1' }
    const store = setupStore([])

    store.dispatch({ type: types.TOGGLE_BOOKMARK, project })
    store.whenComplete(() => {
      expect(store.actions[0].bookmarkList).toEqual([1])
      done()
    })
  })

  test('should remove the project id from the bookmarkList if the id exists when TOGGLE_BOOKMARK is dispatched', (done) => {
    const project = { id: 2, name: 'Project 2' }
    const store = setupStore([2, 1, 5])

    store.dispatch({ type: types.TOGGLE_BOOKMARK, project })
    store.whenComplete(() => {
      expect(store.actions[0].bookmarkList).toEqual([1,5])
      done()
    })
  })

  test('should return bookmarkList as empty if length is 1 and project id is being un-bookmarked', (done) => {
    const project = { id: 2, name: 'Project 2' }
    const store = setupStore([2])

    store.dispatch({ type: types.TOGGLE_BOOKMARK, project })
    store.whenComplete(() => {
      expect(store.actions[0].bookmarkList).toEqual([])
      done()
    })
  })

  test('should put an updated project and dispatch UPDATE_PROJECT_SUCCESS when successful', (done) => {
    const project = { id: 1, name: 'Updated Project' }
    const store = setupStore([])

    mock.onPut('/projects/1').reply(200, project)
    store.dispatch({ type: types.UPDATE_PROJECT_REQUEST, project })
    store.whenComplete(() => {
      expect(store.actions).toEqual([
        { type: types.UPDATE_PROJECT_REQUEST, project },
        { type: types.UPDATE_PROJECT_SUCCESS, payload: project }
      ])
      done()
    })
  })
})