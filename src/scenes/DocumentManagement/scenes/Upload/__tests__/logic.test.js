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
import { INITIAL_STATE } from '../reducer'
import { INITIAL_STATE as AUTO_INITIAL_STATE } from 'data/autocomplete/reducer'

describe('Document Management - Upload logic', () => {
  let mock

  const mockReducer = (state, action) => state
  const history = {}
  const docApi = createApiHandler({ history }, docApiInstance, calls)
  const api = createApiHandler({ history }, projectApiInstance, apiCalls)

  beforeEach(() => {
    mock = new MockAdapter(docApiInstance)
  })

  const setupStore = (current = {}, projAuto = {}, jurAuto = {}) => {
    return createMockStore({
      initialState: {
        scenes: {
          docManage: {
            upload: {
              list: { ...INITIAL_STATE, ...current },
              projectSuggestions: {
                ...AUTO_INITIAL_STATE,
                ...projAuto
              },
              jurisdictionSuggestions: {
                ...AUTO_INITIAL_STATE,
                ...jurAuto
              }
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

    test('should reject action with type REJECT_NO_PROJECT_SELECTED when no project is selected', (done) => {
      const store = setupStore()
      store.dispatch({
        type: types.UPLOAD_DOCUMENTS_REQUEST,
        selectedDocsFormData,
        selectedDocs
      })

      store.whenComplete(() => {
        expect(store.actions).toEqual([
          {
            type: types.REJECT_NO_PROJECT_SELECTED,
            error: 'You must associate these documents with a project.'
          }
        ])
        done()
      })
    })

    test('should reject action with type REJECT_EMPTY_JURISDICTIONS if one or more documents are missing a jurisdiction', (done) => {
      const store = setupStore(
        {
          selectedDocs: [
            { name: 'doc1', jurisdictions: { value: { name: '' } } },
            { name: 'doc2', jurisdictions: { value: { name: '' } } },
            { name: 'doc3', jurisdictions: { value: { name: 'jur1', id: 3 } } }
          ]
        },
        { selectedSuggestion: { name: 'project', id: 4 } }
      )

      store.dispatch({
        type: types.UPLOAD_DOCUMENTS_REQUEST,
        selectedDocsFormData,
        selectedDocs
      })

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

    test('should send a request to upload documents and dispatch UPLOAD_DOCUMENT_SUCCESS on success', (done) => {
      mock.onPost('/docs/upload').reply(200, {
        files: [
          { name: 'doc1', _id: '1', uploadedBy: { firstName: 'test', lastName: 'user' } },
          { name: 'doc2', _id: '2', uploadedBy: { firstName: 'test', lastName: 'user' } }
        ]
      })

      const store = setupStore(
        {
          hasVerified: true,
          selectedDocs: [
            {
              name: 'doc1',
              jurisdictions: { value: { name: 'jur 1', id: 2 } }
            },
            { name: 'doc2', jurisdictions: { value: { name: 'jur 2', id: 3 } } }
          ]
        },
        { selectedSuggestion: { name: 'project', id: 4 } },
        { selectedSuggestion: { name: 'jurisdiction 10', id: 10 } }
      )

      store.dispatch({
        type: types.UPLOAD_DOCUMENTS_REQUEST,
        selectedDocsFormData,
        selectedDocs
      })

      store.whenComplete(() => {
        expect(store.actions).toEqual([
          {
            type: types.UPLOAD_DOCUMENTS_REQUEST,
            selectedDocs,
            jurisdictions: [{ id: 10, name: 'jurisdiction 10' }],
            selectedDocsFormData
          },
          {
            type: 'ADD_JURISDICTION',
            payload: {
              id: 10,
              name: 'jurisdiction 10'
            }
          },
          {
            type: 'ADD_PROJECT',
            payload: {
              id: 4,
              name: 'project'
            }
          },
          {
            type: types.UPLOAD_DOCUMENTS_SUCCESS,
            payload: {
              docs: [
                {
                  name: 'doc1',
                  _id: '1',
                  uploadedBy: { firstName: 'test', lastName: 'user' }
                },
                {
                  name: 'doc2',
                  _id: '2',
                  uploadedBy: { firstName: 'test', lastName: 'user' }
                }
              ]
            }
          }
        ])
        done()
      })
    })

    test('should send a request to upload docs and dispatch UPLOAD_DOCUMENT_FAIL on failure', (done) => {
      mock.onPost('/docs/upload').reply(500)

      const store = setupStore(
        {},
        { selectedSuggestion: { name: 'project', id: 4 } },
        { selectedSuggestion: { name: 'jurisdiction 10', id: 10 } }
      )

      store.dispatch({
        type: types.UPLOAD_DOCUMENTS_REQUEST,
        selectedDocs: [{ name: 'dup 1' }]
      })

      store.whenComplete(() => {
        expect(store.actions).toEqual([
          {
            type: types.UPLOAD_DOCUMENTS_REQUEST,
            jurisdictions: [{ id: 10, name: 'jurisdiction 10' }],
            selectedDocs: [{ name: 'dup 1' }]
          },
          {
            type: types.UPLOAD_DOCUMENTS_FAIL,
            payload: { error: 'Failed to upload documents, please try again.' }
          }
        ])
        done()
      })
    })
  })
})
