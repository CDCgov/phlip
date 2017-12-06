import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import reducer from '../reducer'
import logic from '../logic'
import * as types from '../actionTypes'
import apiCalls, { api } from 'services/api'

describe('Home logic', () => {
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

  test('should get project list and dispatch GET_PROJECTS_SUCCESS when done', (done) => {
    mock.onGet('/projects').reply(200, [
      { name: 'Project 1', id: 12345 },
      { name: 'Project 2', id: 54321 }
    ])
    store.dispatch({ type: types.GET_PROJECTS_REQUEST })
    store.whenComplete(() => {
      expect(store.actions).toEqual([
        { type: types.GET_PROJECTS_REQUEST },
        {
          type: types.GET_PROJECTS_SUCCESS,
          payload: [{ name: 'Project 1', id: 12345 }, { name: 'Project 2', id: 54321 }]
        }
      ])
      done()
    })
  })

  test('should transform the bookmarked property of action.project when TOGGLE_BOOKMARK is dispatched', (done) => {
    const project = { id: 12345, name: 'Project 1', bookmarked: false }
    const expectedProject = { ...project, bookmarked: true }
    store.dispatch({ type: types.TOGGLE_BOOKMARK, project })
    store.whenComplete(() => {
      expect(store.actions[0].project).toEqual(expectedProject)
      done()
    })
  })

  test('should put an updated project when TOGGLE_BOOKMARK action is dispatched and dispatch UPDATE_PROJECT_SUCCESS when successful', (done) => {
    const project = { id: 12345, name: 'Project 1', bookmarked: false }
    const expectedProject = { ...project, bookmarked: true }
    mock.onPut('/projects/12345').reply(200, expectedProject)
    store.dispatch({ type: types.TOGGLE_BOOKMARK, project })
    store.whenComplete(() => {
      expect(store.actions).toEqual([
        { type: types.TOGGLE_BOOKMARK, project: expectedProject },
        { type: types.UPDATE_PROJECT_SUCCESS, payload: expectedProject }
      ])
      done()
    })
  })

  test('should put an updated project and dispatch UPDATE_PROJECT_SUCCESS when successful', (done) => {
    let project = {
      id: 12345,
      name: 'Updated Project'
    }
    mock.onPut('/projects/12345').reply(200, project)
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