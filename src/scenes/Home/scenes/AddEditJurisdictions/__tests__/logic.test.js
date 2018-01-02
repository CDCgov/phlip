import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic from '../logic'
import * as types from '../actionTypes'
import apiCalls, { api } from 'services/api'

describe('AddEditJurisdiction logic', () => {
  let mock

  const mockReducer = (state, action) => state

  beforeEach(() => {
    mock = new MockAdapter(api)
  })

  const setupStore = () => {
    return createMockStore({
      reducer: mockReducer,
      logic: logic,
      injectedDeps: {
        api: { ...apiCalls }
      }
    })
  }

  test('should call the update jurisdiction api and return the updated jurisdiction', (done) => {
    mock.onPut('/projects/1/jurisdiction/1', {id: 1, name: 'Jurisdiction Updated'}).reply(200, {
      name: 'Jurisdiction Updated',
      id: 1
    })

    const store = setupStore()

    store.dispatch({ type: types.UPDATE_PROJECT_JURISDICTION_REQUEST, jurisdiction: {id: 1, name: 'Jurisdiction Updated'}, projectId: 1})
    store.whenComplete(() => {
      expect(store.actions).toEqual([
        { type: types.UPDATE_PROJECT_JURISDICTION_REQUEST, jurisdiction: {id: 1, name: 'Jurisdiction Updated'}, projectId: 1 },
        { type: types.UPDATE_PROJECT_JURISDICTION_SUCCESS, payload: {id: 1, name: 'Jurisdiction Updated'}}
      ])
      done()
    })
  })

  test('should call the search list api and return a list of matching jurisdictions', (done) => {
    mock.onGet('/jurisdiction', { params: { name: 'Al' } }).reply(200, [
      'Alaska',
      'Alabama'
    ])

    const store = setupStore()

    store.dispatch({ type: types.SEARCH_JURISDICTION_LIST, searchString: 'Al' })
    store.whenComplete(() => {
      expect(store.actions).toEqual([
        { type: types.SEARCH_JURISDICTION_LIST, searchString: 'Al' },
        { type: types.SET_JURISDICTION_SUGGESTIONS, payload: ['Alaska', 'Alabama']}
      ])
      done()
    })
  })
})