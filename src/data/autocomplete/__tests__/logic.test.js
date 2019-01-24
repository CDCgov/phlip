import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic from '../logic'
import { types } from '../actions'
import createApiHandler, {
  docApiInstance,
  projectApiInstance
} from 'services/api'
import calls from 'services/api/docManageCalls'
import apiCalls from 'services/api/calls'

describe('Autocomplete logic', () => {
  let apiMock

  const history = {}
  const docApi = createApiHandler({ history }, docApiInstance, calls)
  const api = createApiHandler({ history }, projectApiInstance, apiCalls)

  beforeEach(() => {
    apiMock = new MockAdapter(projectApiInstance)
  })

  const setupStore = () => {
    return createMockStore({
      initialState: {},
      logic,
      injectedDeps: {
        docApi,
        api
      }
    })
  }

  describe('Search Project List Logic', () => {
    test('should send a request to get projects and only return projects matching action.searchString', (done) => {
      apiMock
        .onGet('/projects')
        .reply(200, [
          { name: 'project 1' },
          { name: 'test project' },
          { name: 'testing project' }
        ])

      const store = setupStore()

      store.dispatch({
        type: `${types.SEARCH_FOR_SUGGESTIONS_REQUEST}_PROJECT`,
        searchString: 'test',
        suffix: ''
      })

      store.whenComplete(() => {
        expect(store.actions).toEqual([
          {
            type: `${types.SEARCH_FOR_SUGGESTIONS_REQUEST}_PROJECT`,
            searchString: 'test',
            suffix: ''
          },
          {
            type: `${types.SEARCH_FOR_SUGGESTIONS_SUCCESS}_PROJECT`,
            payload: [{ name: 'test project' }, { name: 'testing project' }]
          }
        ])
        done()
      })
    })
  })

  describe('Search Jurisdiction List Logic', () => {
    test('should send a request to search jurisdictions and dispatch SEARCH_JURISDICTION_LIST_SUCCESS when successful', (done) => {
      apiMock
        .onGet('/jurisdictions', { params: { name: 'Al' } })
        .reply(200, [{ id: 1, name: 'Alaska' }, { id: 2, name: 'Alabama' }])

      const store = setupStore()
      store.dispatch({
        type: `${types.SEARCH_FOR_SUGGESTIONS_REQUEST}_JURISDICTION`,
        searchString: 'Al',
        suffix: ''
      })

      store.whenComplete(() => {
        expect(store.actions).toEqual([
          {
            type: `${types.SEARCH_FOR_SUGGESTIONS_REQUEST}_JURISDICTION`,
            searchString: 'Al',
            suffix: ''
          },
          {
            type: `${types.SEARCH_FOR_SUGGESTIONS_SUCCESS}_JURISDICTION`,
            payload: [{ id: 1, name: 'Alaska' }, { id: 2, name: 'Alabama' }]
          }
        ])
        done()
      })
    })
  })
})
