import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic from '../logic'
import { types } from '../actions'
import createApiHandler, { docApiInstance } from 'services/api'
import calls from 'services/api/docManageCalls'

describe('Document View logic', () => {
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

  test('should get document contents and dispatch GET_DOCUMENT_CONTENTS_SUCCESS when successful', (done) => {
    mock.onGet('/docs/1212/contents').reply(200, { content: {} })
    const store = setupStore()
    store.dispatch({ type: types.GET_DOCUMENT_CONTENTS_REQUEST, id: '1212' })

    store.whenComplete(() => {
      expect(store.actions).toEqual([
        { type: types.GET_DOCUMENT_CONTENTS_REQUEST, id: '1212' },
        {
          type: types.GET_DOCUMENT_CONTENTS_SUCCESS,
          payload: {}
        }
      ])
      done()
    })
  })

  test('should get document contents and dispatch GET_DOCUMENT_CONTENTS_FAIL on failure', (done) => {
    mock.onGet('/docs/1212/contents').reply(500)

    const store = setupStore()

    store.dispatch({ type: types.GET_DOCUMENT_CONTENTS_REQUEST, id: '1212' })

    store.whenComplete(() => {
      expect(store.actions).toEqual([
        { type: types.GET_DOCUMENT_CONTENTS_REQUEST, id: '1212' },
        {
          type: types.GET_DOCUMENT_CONTENTS_FAIL,
          payload: 'Failed to get doc contents'
        }
      ])
      done()
    })
  })
})
