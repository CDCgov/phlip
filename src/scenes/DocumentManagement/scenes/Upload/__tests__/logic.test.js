import { createMockStore } from 'redux-logic-test'
import MockAdapter from 'axios-mock-adapter'
import logic, { mergeInfoWithDocs } from '../logic'
import {
  selectedDocs,
  excelInfoFull,
  excelInfoWithMissing,
  fullMerged,
  mergedWithMissing,
  excelWithDup,
  excelWithoutState,
  selectedWithDup,
  files
} from 'utils/testData/upload'
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
  let mock, apiMock
  
  const mockReducer = (state, action) => state
  const history = {}
  const docApi = createApiHandler({ history }, docApiInstance, calls)
  const api = createApiHandler({ history }, projectApiInstance, apiCalls)
  
  beforeEach(() => {
    mock = new MockAdapter(docApiInstance)
    apiMock = new MockAdapter(projectApiInstance)
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
    
    test('should reject action with type REJECT_NO_PROJECT_SELECTED when no project is selected', done => {
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
    
    test(
      'should reject action with type REJECT_EMPTY_JURISDICTIONS if one or more documents are missing a jurisdiction',
      done => {
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
      }
    )
    
    test('should send a request to upload documents and dispatch UPLOAD_DOCUMENT_SUCCESS on success', done => {
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
                  uploadedBy: { firstName: 'test', lastName: 'user' },
                  projectList: 'project',
                  jurisdictionList: '|jurisdiction 10'
                },
                {
                  name: 'doc2',
                  _id: '2',
                  uploadedBy: { firstName: 'test', lastName: 'user' },
                  projectList: 'project',
                  jurisdictionList: '|jurisdiction 10'
                }
              ]
            }
          }
        ])
        done()
      })
    })
    
    test('should send a request to upload docs and dispatch UPLOAD_DOCUMENT_FAIL on failure', done => {
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
            payload: { error: 'We couldn\'t upload the documents. Please try again later.' }
          }
        ])
        done()
      })
    })
  })
  
  describe('Upload Excel -- merge info', () => {
    describe('merging info function', () => {
      test('should not query the same jurisdiction more than once', async () => {
        apiMock.onGet('/jurisdictions', { params: { name: 'Washington (state)' } }).reply(200, [
          { name: 'Washington (state)' }
        ])
  
        apiMock.onGet('/jurisdictions', { params: { name: 'North Carolina (state)' } }).reply(200, [
          { name: 'North Carolina (state)' }
        ])
  
        apiMock.onGet('/jurisdictions', { params: { name: 'Washington, DC (federal district)' } }).reply(200, [
          { name: 'Washington, DC (federal district)' }
        ])
  
        apiMock.onGet('/jurisdictions', { params: { name: 'Ohio (state)' } }).reply(200, [{ name: 'Ohio (state)' }])
        
        const spy = jest.spyOn(api, 'searchJurisdictionList')
        await mergeInfoWithDocs(excelWithDup, selectedWithDup, api)
        expect(spy).toHaveBeenCalledTimes(4)
      })
      
      test('should prepopulate jurisdiction value with value from excel is jurisdiction is not a state', async () => {
        apiMock.onGet('/jurisdictions', { params: { name: 'Washington (state)' } }).reply(200, [
          { name: 'Washington (state)' }
        ])
  
        apiMock.onGet('/jurisdictions', { params: { name: 'North Carolina (state)' } }).reply(200, [
          { name: 'North Carolina (state)' }
        ])
  
        apiMock.onGet('/jurisdictions', { params: { name: 'Washington, DC (federal district)' } }).reply(200, [
          { name: 'Washington, DC (federal district)' }
        ])
  
        apiMock.onGet('/jurisdictions', { params: { name: 'Ohio (state)' } }).reply(200, [{ name: 'Ohio (state)' }])
        
        const response = await mergeInfoWithDocs(excelWithoutState, selectedWithDup, api)
        expect(response[response.length - 1].jurisdictions.value.searchValue).toEqual('butler county')
      })
    })
    
    describe('MERGE_INFO', () => {
      test('should create an object of docs to prepare for merging info', done => {
        apiMock.onGet('/jurisdictions', { params: { name: 'Washington (state)' } }).reply(200, [
          { name: 'Washington (state)' }
        ])
  
        apiMock.onGet('/jurisdictions', { params: { name: 'North Carolina (state)' } }).reply(200, [
          { name: 'North Carolina (state)' }
        ])
  
        apiMock.onGet('/jurisdictions', { params: { name: 'Washington, DC (federal district)' } }).reply(200, [
          { name: 'Washington, DC (federal district)' }
        ])
  
        apiMock.onGet('/jurisdictions', { params: { name: 'Ohio (state)' } }).reply(200, [{ name: 'Ohio (state)' }])
  
        mock.onPost('/docs/upload/extractInfo').reply(200, excelInfoFull)
  
        const store = setupStore({
          extractedInfo: excelInfoFull
        })
        
        store.dispatch({
          type: types.MERGE_INFO_WITH_DOCS,
          docs: files
        })
  
        store.whenComplete(() => {
          expect(store.actions[0].payload).toEqual(fullMerged)
          done()
        })
      })
    })
    
    describe('EXTRACT_INFO', () => {
      test('should merge info with already selected docs for upload', done => {
        apiMock.onGet('/jurisdictions', { params: { name: 'Washington (state)' } }).reply(200, [
          { name: 'Washington (state)' }
        ])
    
        apiMock.onGet('/jurisdictions', { params: { name: 'North Carolina (state)' } }).reply(200, [
          { name: 'North Carolina (state)' }
        ])
    
        apiMock.onGet('/jurisdictions', { params: { name: 'Washington, DC (federal district)' } }).reply(200, [
          { name: 'Washington, DC (federal district)' }
        ])
    
        apiMock.onGet('/jurisdictions', { params: { name: 'Ohio (state)' } }).reply(200, [{ name: 'Ohio (state)' }])
    
        mock.onPost('/docs/upload/extractInfo').reply(200, excelInfoFull)
    
        const store = setupStore({ selectedDocs })
    
        store.dispatch({
          type: types.EXTRACT_INFO_REQUEST,
          infoSheetFormData: excelInfoFull
        })
    
        store.whenComplete(() => {
          expect(store.actions[1].payload.merged).toEqual(fullMerged)
          done()
        })
      })
  
      test('should clear out info when there is already info in state', done => {
        apiMock.onGet('/jurisdictions', { params: { name: 'Washington (state)' } }).reply(200, [
          { name: 'Washington (state)' }
        ])
    
        apiMock.onGet('/jurisdictions', { params: { name: 'North Carolina (state)' } }).reply(200, [
          { name: 'North Carolina (state)' }
        ])
    
        apiMock.onGet('/jurisdictions', { params: { name: 'Washington, DC (federal district)' } }).reply(200, [
          { name: 'Washington, DC (federal district)' }
        ])
    
        apiMock.onGet('/jurisdictions', { params: { name: 'Ohio (state)' } }).reply(200, [{ name: 'Ohio (state)' }])
    
        mock.onPost('/docs/upload/extractInfo').reply(200, excelInfoWithMissing)
    
        const store = setupStore({ selectedDocs, extractedInfo: excelInfoFull })
    
        store.dispatch({
          type: types.EXTRACT_INFO_REQUEST,
          infoSheetFormData: excelInfoWithMissing
        })
    
        store.whenComplete(() => {
          expect(store.actions[1].payload.merged).toEqual(mergedWithMissing)
          done()
        })
      })
      
    })
  })
})
