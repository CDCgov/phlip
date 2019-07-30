import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic from '../logic'
import { types } from '../actions'
import createApiHandler, { docApiInstance } from 'services/api'
import calls from 'services/api/docManageCalls'
import { docListPayload } from 'utils/testData/coding'
import { mockDocuments } from 'utils/testData/documents'

describe('CodingValidation - DocumentList logic', () => {
  let mock

  const mockReducer = state => state
  const history = {}
  const docApi = createApiHandler({ history }, docApiInstance, calls)

  beforeEach(() => {
    mock = new MockAdapter(docApiInstance)
  })

  const setupStore = () => {
    return createMockStore({
      initialState: {
        scenes: {
          codingValidation: {
            documentList: {
              documents: {
                byId: mockDocuments.byId
              }
            }
          }
        }
      },
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
  
  describe('Saving annotation', () => {
    test('should add the document citation if it exists to the action', done => {
      const store = setupStore()
      store.dispatch({ type: types.ON_SAVE_ANNOTATION, annotation: { docId: 1 } })
      
      store.whenComplete(() => {
        expect(store.actions[0].citation).toEqual('123-123')
        done()
      })
    })
    
    test('should set the citation as an empty string if it does not exists', done => {
      const store = setupStore()
      store.dispatch({ type: types.ON_SAVE_ANNOTATION, annotation: { docId: 2 } })
  
      store.whenComplete(() => {
        expect(store.actions[0].citation).toEqual('')
        done()
      })
    })
  })
  
  describe('Downloading documents', () => {
    test('should download a zip file if the user clicked the download all button', done => {
      mock.onGet('/docs/download').reply(200)
      const store = setupStore()
      const spy = jest.spyOn(docApi, 'downloadZip')
      store.dispatch({ type: types.DOWNLOAD_DOCUMENTS_REQUEST, docId: 'all' })
      store.whenComplete(() => {
        expect(spy).toHaveBeenCalled()
        done()
      })
    })
    
    test('should download one file if the user clicked to download only one', done => {
      mock.onGet('/docs/1/download').reply(200)
      const store = setupStore()
      const spy = jest.spyOn(docApi, 'download')
      store.dispatch({ type: types.DOWNLOAD_DOCUMENTS_REQUEST, docId: 1 })
      store.whenComplete(() => {
        expect(spy).toHaveBeenCalled()
        done()
      })
    })
    
    test('should show the user the error if the request fails', done => {
      mock.onGet('/docs/1/download').reply(500)
      const store = setupStore()
      store.dispatch({ type: types.DOWNLOAD_DOCUMENTS_REQUEST, docId: 1 })
      store.whenComplete(() => {
        expect(store.actions[1].type).toEqual(types.DOWNLOAD_DOCUMENTS_FAIL)
        done()
      })
    })
  })
})
