import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic from '../logic'
import { types } from '../actions'
import createApiHandler, { docApiInstance } from 'services/api'
import calls from 'services/api/docManageCalls'
import { docListPayload } from 'utils/testData'

describe('CodingValidation - DocumentList logic', () => {
  let mock

  const mockReducer = (state, action) => state
  const history = {}
  const docApi = createApiHandler({ history }, docApiInstance, calls)

  beforeEach(() => {
    mock = new MockAdapter(docApiInstance)
  })

  const setupStore = () => {
    return createMockStore({
      initialState: {},
      reducer: mockReducer,
      logic,
      injectedDeps: {
        docApi
      }
    })
  }

  test('should get approved documents and dispatch GET_APPROVED_DOCUMENTS_SUCCESS when successful', done => {
    mock.onGet('/docs/projects/1/jurisdictions/32').reply(200, docListPayload)

    const store = setupStore()
    store.dispatch({ type: types.GET_APPROVED_DOCUMENTS_REQUEST, projectId: 1, jurisdictionId: 32, page: 'coding' })

    store.whenComplete(() => {
      expect(store.actions).toEqual([
        { type: types.GET_APPROVED_DOCUMENTS_REQUEST, projectId: 1, jurisdictionId: 32, page: 'coding' },
        {
          type: types.GET_APPROVED_DOCUMENTS_SUCCESS,
          payload: docListPayload
        }
      ])
      done()
    })
  })

  test('should get approved documents and dispatch GET_APPROVED_DOCUMENTS_FAIL on failure', done => {
    mock.onGet('/docs/projects/1/jurisdictions/32').reply(500)

    const store = setupStore()
    store.dispatch({ type: types.GET_APPROVED_DOCUMENTS_REQUEST, projectId: 1, jurisdictionId: 32, page: 'coding' })

    store.whenComplete(() => {
      expect(store.actions).toEqual([
        { type: types.GET_APPROVED_DOCUMENTS_REQUEST, projectId: 1, jurisdictionId: 32, page: 'coding' },
        { type: types.GET_APPROVED_DOCUMENTS_FAIL }
      ])
      done()
    })
  })
})