import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic from '../logic'
import { types } from '../actions'
import createApiHandler, { docApiInstance, projectApiInstance } from 'services/api'
import calls from 'services/api/docManageCalls'
import apiCalls from 'services/api/calls'

describe('Document Management logic', () => {
  let mock, apiMock

  const mockReducer = (state, action) => state
  const history = {}
  const docApi = createApiHandler({ history }, docApiInstance, calls)
  const api = createApiHandler({ history }, projectApiInstance, apiCalls)

  beforeEach(() => {
    mock = new MockAdapter(docApiInstance)
    apiMock = new MockAdapter(projectApiInstance)
  })

  const setupStore = () => {
    return createMockStore({
      initialState: {},
      reducer: mockReducer,
      logic,
      injectedDeps: {
        docApi,
        api
      }
    })
  }

  test('should get document list and dispatch GET_DOCUMENTS_SUCCESS on success', (done) => {
    mock.onGet('/docs').reply(200, [
      { name: 'Doc 1', uploadedBy: { firstName: 'test', lastName: 'user' }, projects: [1], jurisdictions: [1] },
      { name: 'Doc 2', uploadedBy: { firstName: 'test', lastName: 'user' }, projects: [1], jurisdictions: [1] }
    ])

    apiMock
      .onGet('/projects/1')
      .reply(200, { name: 'Test Project', id: 1 })

    apiMock
      .onGet('/jurisdictions/1')
      .reply(200, { id: 1, name: 'Ohio' })

    const store = setupStore()

    store.dispatch({ type: types.GET_DOCUMENTS_REQUEST })

    store.whenComplete(() => {
      expect(store.actions).toEqual([
        { type: types.GET_DOCUMENTS_REQUEST },
        { type: 'GET_PROJECT_REQUEST', projectId: 1 },
        { type: 'GET_JURISDICTION_REQUEST', jurisdictionId: 1 },
        {
          type: types.GET_DOCUMENTS_SUCCESS,
          payload: [
            {
              name: 'Doc 1',
              uploadedBy: { firstName: 'test', lastName: 'user' },
              uploadedByName: 'test user',
              projects: [1],
              jurisdictions: [1]
            },
            {
              name: 'Doc 2',
              uploadedBy: { firstName: 'test', lastName: 'user' },
              uploadedByName: 'test user',
              projects: [1],
              jurisdictions: [1]
            }
          ]
        }
      ])
      done()
    })
  })

  test('should get document list and dispatch GET_DOCUMENTS_FAIL on failure', (done) => {
    mock.onGet('/docs').reply(500)

    const store = setupStore()

    store.dispatch({ type: types.GET_DOCUMENTS_REQUEST })

    store.whenComplete(() => {
      expect(store.actions).toEqual([
        { type: types.GET_DOCUMENTS_REQUEST },
        {
          type: types.GET_DOCUMENTS_FAIL,
          payload: 'Failed to get documents'
        }
      ])
      done()
    })
  })

})