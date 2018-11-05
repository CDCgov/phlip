import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic from '../logic'
import { types } from '../actions'
import createApiHandler, { docApiInstance, projectApiInstance } from 'services/api'
import calls from 'services/api/docManageCalls'
import apiCalls from 'services/api/calls'
import { INITIAL_STATE } from 'scenes/DocumentManagement/scenes/Upload/reducer'

describe('Document Management - Upload logic', () => {
  let mock, apiMock

  const mockReducer = (state, action) => state
  const history = {}
  const docApi = createApiHandler({ history }, docApiInstance, calls)
  const api = createApiHandler({ history }, projectApiInstance, apiCalls)

  beforeEach(() => {
    mock = new MockAdapter(docApiInstance)
    apiMock = new MockAdapter(projectApiInstance)
  })

  const setupStore = current => {
    return createMockStore({
      initialState: {
        scenes: {
          docManage: {
            upload: {
              ...INITIAL_STATE,
              ...current
            }
          }
        }
      },
      reducer: mockReducer,
      logic,
      injectedDeps: {
        docApi,
        api
      }
    })
  }

  describe('Upload Documents', () => {
    const selectedDocsFormData = [{ name: 'doc 1' }, { name: 'doc 2' }]
    const selectedDocs = [
      { name: 'doc1', jurisdictions: { value: { name: '' } } },
      { name: 'doc2', jurisdictions: { value: { name: '' } } }
    ]

    test('should reject action with type REJECT_NO_PROJECT_SELECTED when no project is selected', done => {
      const store = setupStore()
      store.dispatch({ type: types.UPLOAD_DOCUMENTS_REQUEST, selectedDocsFormData, selectedDocs })

      store.whenComplete(() => {
        expect(store.actions).toEqual([
          { type: types.REJECT_NO_PROJECT_SELECTED, error: 'You must associate these documents with a project.' }
        ])
        done()
      })
    })

    test('should reject action with type REJECT_EMPTY_JURISDICTIONS if one or more documents are missing a jurisdiction', done => {
      const store = setupStore({
        selectedProject: { name: 'project', id: 4 },
        selectedDocs: [
          { name: 'doc1', jurisdictions: { value: { name: '' } } },
          { name: 'doc2', jurisdictions: { value: { name: '' } } },
          { name: 'doc3', jurisdictions: { value: { name: 'jur1', id: 3 } } }
        ]
      })

      store.dispatch({ type: types.UPLOAD_DOCUMENTS_REQUEST, selectedDocsFormData, selectedDocs })

      store.whenComplete(() => {
        expect(store.actions).toEqual([
          {
            type: types.REJECT_EMPTY_JURISDICTIONS,
            error: 'One or more documents are missing a valid jurisdiction.',
            invalidDocs: [
              { name: 'doc1', jurisdictions: { value: { name: '' } } },
              { name: 'doc2', jurisdictions: { value: { name: '' } } }
            ]
          }
        ])
        done()
      })
    })

    test('should send a request to upload documents and dispatch UPLOAD_DOCUMENT_SUCCESS on success', done => {
      mock.onPost('/docs/upload').reply(200, {
        files: [
          { name: 'doc1', _id: '1' },
          { name: 'doc2', _id: '2' }
        ]
      })

      const store = setupStore({
        selectedProject: { name: 'project', id: 4 },
        selectedJurisdiction: { name: 'jurisdiction 10', id: 10 },
        hasVerified: true,
        selectedDocs: [
          { name: 'doc1', jurisdictions: { value: { name: 'jur 1', id: 2 } } },
          { name: 'doc2', jurisdictions: { value: { name: 'jur 2', id: 3 } } }
        ]
      })

      store.dispatch({ type: types.UPLOAD_DOCUMENTS_REQUEST, selectedDocsFormData, selectedDocs })

      store.whenComplete(() => {
        expect(store.actions).toEqual([
          { type: types.UPLOAD_DOCUMENTS_REQUEST, selectedDocs, selectedDocsFormData },
          {
            type: types.UPLOAD_DOCUMENTS_SUCCESS, payload: {
              docs: [
                { name: 'doc1', _id: '1' },
                { name: 'doc2', _id: '2' }
              ]
            }
          }
        ])
        done()
      })
    })

    test('should send a request to upload docs and dispatch UPLOAD_DOCUMENT_FAIL on failure', (done) => {
      mock.onPost('/docs/upload').reply(500)

      const store = setupStore({
        selectedProject: { name: 'project', id: 4 },
        selectedJurisdiction: { name: 'jurisdiction 10', id: 10 }
      })

      store.dispatch({ type: types.UPLOAD_DOCUMENTS_REQUEST, selectedDocs: [{ name: 'dup 1' }] })

      store.whenComplete(() => {
        expect(store.actions).toEqual([
          { type: types.UPLOAD_DOCUMENTS_REQUEST, selectedDocs: [{ name: 'dup 1' }] },
          { type: types.UPLOAD_DOCUMENTS_FAIL, payload: { error: 'Failed to upload documents, please try again.' } }
        ])
        done()
      })
    })
  })

  describe('Search Project List Logic', () => {
    test('should send a request to get projects and only return projects matching action.searchString', done => {
      apiMock.onGet('/projects').reply(200, [
        { name: 'project 1' },
        { name: 'test project' },
        { name: 'testing project' }
      ])

      const store = setupStore()

      store.dispatch({ type: types.SEARCH_PROJECT_LIST_REQUEST, searchString: 'test' })

      store.whenComplete(() => {
        expect(store.actions).toEqual([
          { type: types.SEARCH_PROJECT_LIST_REQUEST, searchString: 'test' },
          { type: types.SEARCH_PROJECT_LIST_SUCCESS, payload: [{ name: 'test project' }, { name: 'testing project' }] }
        ])
        done()
      })
    })
  })

  describe('Search Jurisdiction List Logic', () => {
    test('should send a request to search jurisdictions and dispatch SEARCH_JURISDICTION_LIST_SUCCESS when successful', done => {
      apiMock.onGet('/jurisdictions', { params: { name: 'Al' } }).reply(200, [
        { id: 1, name: 'Alaska' },
        { id: 2, name: 'Alabama' }
      ])

      const store = setupStore()
      store.dispatch({ type: types.SEARCH_JURISDICTION_LIST_REQUEST, searchString: 'Al' })

      store.whenComplete(() => {
        expect(store.actions).toEqual([
          { type: types.SEARCH_JURISDICTION_LIST_REQUEST, searchString: 'Al' },
          {
            type: types.SEARCH_JURISDICTION_LIST_SUCCESS,
            payload: [{ id: 1, name: 'Alaska' }, { id: 2, name: 'Alabama' }]
          }
        ])
        done()
      })
    })
  })
  /*describe('Verify Upload', () => {
  test('should send a request to verify upload and dispatch VERIFY_RETURN_NO_DUPLICATES when no duplicates are found', (done) => {
    mock.onPost('/docs/verifyUpload').reply(200, { duplicates: [] })

    const store = setupStore()

    store.dispatch({ type: types.VERIFY_UPLOAD_REQUEST, selectedDocs: [{ name: 'blah' }] })

    store.whenComplete(() => {
      expect(store.actions).toEqual([
        { type: types.VERIFY_UPLOAD_REQUEST, selectedDocs: [{ name: 'blah' }] },
        { type: types.VERIFY_RETURN_NO_DUPLICATES }
      ])
      done()
    })
  })

  test('should send a request to verify upload and dispatch VERIFY_RETURN_DUPLICATE_FILES when duplicates are found', (done) => {
    mock.onPost('/docs/verifyUpload').reply(200, { duplicates: [{ name: 'dup 1' }] })

    const store = setupStore()

    store.dispatch({ type: types.VERIFY_UPLOAD_REQUEST, selectedDocs: [{ name: 'dup 1' }] })

    store.whenComplete(() => {
      expect(store.actions).toEqual([
        { type: types.VERIFY_UPLOAD_REQUEST, selectedDocs: [{ name: 'dup 1' }] },
        { type: types.VERIFY_RETURN_DUPLICATE_FILES, payload: { duplicates: [{ name: 'dup 1' }] } }
      ])
      done()
    })
  })

  test('should send a request to verify upload and dispatch VERIFY_UPLOAD_FAIL on failure', (done) => {
    mock.onPost('/docs/verifyUpload').reply(500)

    const store = setupStore()

    store.dispatch({ type: types.VERIFY_UPLOAD_REQUEST, selectedDocs: [{ name: 'dup 1' }] })

    store.whenComplete(() => {
      expect(store.actions).toEqual([
        { type: types.VERIFY_UPLOAD_REQUEST, selectedDocs: [{ name: 'dup 1' }] },
        { type: types.VERIFY_UPLOAD_FAIL, payload: { error: 'Failed to verify upload, please try again.' } }
      ])
      done()
    })
  })
})*/
})