import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic from '../logic'
import { types } from '../actions'
import createApiHandler, { docApiInstance } from 'services/api'
import calls from 'services/api/docManageCalls'

describe('Document Management - Upload logic', () => {
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

  describe('Verify Upload', () => {
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
  })

  describe('Upload Documents', () => {
    test('should send a request to upload documents and dispatch UPLOAD_DOCUMENT_SUCCESS on success', (done) => {
      const selectedDocs = [
        { name: 'doc1' },
        { name: 'doc2' }
      ]

      mock.onPost('/docs/upload').reply(200, [
        { name: 'doc1', _id: '1' },
        { name: 'doc2', _id: '2' }
      ])

      const store = setupStore()

      store.dispatch({ type: types.UPLOAD_DOCUMENTS_REQUEST, selectedDocs })

      store.whenComplete(() => {
        expect(store.actions).toEqual([
          { type: types.UPLOAD_DOCUMENTS_REQUEST, selectedDocs },
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

      const store = setupStore()

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
})