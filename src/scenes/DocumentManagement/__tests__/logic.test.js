import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic from '../logic'
import { types } from '../actions'
import createApiHandler, { docApiInstance } from 'services/api'
import calls from 'services/api/docManageCalls'

describe('Document Management logic', () => {
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

  test('should get document list and dispatch GET_DOCUMENTS_SUCCESS on success', (done) => {
    mock.onGet('/docs').reply(200, [
      { name: 'Doc 1', uploadedBy: {} },
      { name: 'Doc 2', uploadedBy: {} }
    ])

    const store = setupStore()

    store.dispatch({ type: types.GET_DOCUMENTS_REQUEST })

    store.whenComplete(() => {
      expect(store.actions).toEqual([
        { type: types.GET_DOCUMENTS_REQUEST },
        {
          type: types.GET_DOCUMENTS_SUCCESS,
          payload: [
            { name: 'Doc 1', uploadedBy: {} },
            { name: 'Doc 2', uploadedBy: {} }
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