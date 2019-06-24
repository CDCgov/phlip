import { INITIAL_STATE, uploadReducer as reducer } from '../reducer'
import { types } from '../actions'
import { types as autocompleteTypes } from 'data/autocomplete/actions'

const initial = INITIAL_STATE

const getState = (other = {}) => ({
  ...initial,
  ...other
})

describe('Document Management - Upload reducer tests', () => {
  test('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initial)
  })
  
  describe('UPLOAD_DOCUMENTS_START', () => {
    const action = {
      type: types.UPLOAD_DOCUMENTS_START,
      selectedDocs: [{ name: 'Doc 1' }, { name: 'Doc 2' }]
    }
    
    const currentState = getState()
    const updatedState = reducer(currentState, action)
    
    test('should set state.uploading to true', () => {
      expect(updatedState.uploading).toEqual(true)
    })
    
    test('should set state.goBack to false', () => {
      expect(updatedState.goBack).toEqual(false)
    })
    
    test('should clear out uploading percentage', () => {
      expect(updatedState.uploadProgress.index).toEqual(0)
    })
    
    test('should set total documents length to length of documents', () => {
      expect(updatedState.uploadProgress.total).toEqual(2)
    })
    
    test('should reset failures', () => {
      expect(updatedState.uploadProgress.failures).toEqual(false)
    })
  })
  
  describe('UPLOAD_ONE_DOC_COMPLETE', () => {
    test('should increase current index by 1', () => {
      const action = {
        type: types.UPLOAD_ONE_DOC_COMPLETE
      }
      
      const currentState = getState({ uploadProgress: { index: 3 } })
      const updatedState = reducer(currentState, action)
      expect(updatedState.uploadProgress.index).toEqual(4)
    })
  })
  
  describe('UPLOAD_DOCUMENTS_FINISH_SUCCESS', () => {
    const action = {
      type: types.UPLOAD_DOCUMENTS_FINISH_SUCCESS
    }
    
    const currentState = getState({
      selectedDocs: [{ name: 'Doc1' }, { name: 'Doc2' }]
    })
    
    const updatedState = reducer(currentState, action)
    
    test('should empty state.selectedDocs', () => {
      expect(updatedState.selectedDocs).toEqual([])
    })
    
    test('should set that there were no upload failures', () => {
      expect(updatedState.uploadProgress.failures).toEqual(false)
    })
  })
  
  describe('UPLOAD_DOCUMENTS_FINISH_WITH_FAILS', () => {
    const action = {
      type: types.UPLOAD_DOCUMENTS_FINISH_WITH_FAILS,
      payload: { error: 'This is an error', failed: ['Doc1', 'Doc3'] }
    }
    
    const currentState = getState({
      selectedDocs: [{ name: { value: 'Doc1' } }, { name: { value: 'Doc2' } }, { name: { value: 'Doc3' } }]
    })
    
    const updatedState = reducer(currentState, action)
    
    test('should set selected docs to only the failed documents', () => {
      expect(updatedState.selectedDocs).toEqual([
        { name: { value: 'Doc1' } },
        { name: { value: 'Doc3' } }
      ])
    })
    
    test('should set state.requestError to the error in action.payload', () => {
      expect(updatedState.requestError).toEqual('This is an error')
    })
    
    test('should set that there were failures', () => {
      expect(updatedState.uploadProgress.failures).toEqual(true)
    })
  })
  
  describe('VERIFY_RETURN_DUPLICATE_FILES', () => {
    const action = {
      type: types.VERIFY_RETURN_DUPLICATE_FILES,
      payload: [{ name: 'dup1' }]
    }
    
    const currentState = getState({
      uploading: true,
      selectedDocs: [{ name: { value: 'dup1' } }, { name: { value: 'file2' } }]
    })
    const updatedState = reducer(currentState, action)
    
    test('should set state.uploading to false', () => {
      expect(updatedState.uploading).toEqual(false)
    })
    
    test('should set isDuplicate on any selected files that match the api payload response', () => {
      expect(updatedState.selectedDocs[0].isDuplicate).toEqual(true)
      expect(updatedState.selectedDocs[1].isDuplicate).toEqual(false)
    })
    
    test('should set the proper alert state properties', () => {
      expect(updatedState.alert.open).toEqual(true)
      expect(updatedState.alert.text)
        .toEqual(`The file name, project and jurisdiction properties for one or more of the documents selected for
        upload match a pre-existing document in the system. These documents have been indicated in the file list. You
        can choose to remove the files or click the 'Upload' button again to proceed with saving them.`)
      expect(updatedState.alert.title).toEqual('Duplicates Found')
    })
  })
  
  describe('EXTRACT_INFO_REQUEST', () => {
    const action = {
      type: types.EXTRACT_INFO_REQUEST,
      infoSheet: { name: 'infosheet.xlsx', content: '' }
    }
    
    const currentState = getState()
    const updatedState = reducer(currentState, action)
    
    test('should set state.infoSheet to action.infoSheet', () => {
      expect(updatedState.infoSheet).toEqual({
        name: 'infosheet.xlsx',
        content: ''
      })
    })
    
    test('should set state.infoRequestInProgress to true', () => {
      expect(updatedState.infoRequestInProgress).toEqual(true)
    })
    
    test('should set state.infoSheetSelected to true', () => {
      expect(updatedState.infoSheetSelected).toEqual(true)
    })
  })
  
  describe('EXTRACT_INFO_SUCCESS', () => {
    const action = {
      type: types.EXTRACT_INFO_SUCCESS,
      payload: {
        info: {
          filename1: { name: 'filename1', citation: '1' },
          filename2: { name: 'filename2', citation: '1' }
        },
        merged: [
          { name: 'filename1', citation: '1' },
          { name: 'filename2', citation: '1' }
        ]
      }
    }
    
    const currentState = getState({
      infoRequestInProgress: true,
      selectedDocs: [{ name: 'filename1' }, { name: 'filename2' }]
    })
    
    const updatedState = reducer(currentState, action)
    
    test('should set state.selectedDocs to action.payload.merged', () => {
      expect(updatedState.selectedDocs).toEqual([
        { name: 'filename1', citation: '1' },
        { name: 'filename2', citation: '1' }
      ])
    })
    
    test('should set state.infoRequestInProgress to false', () => {
      expect(updatedState.infoRequestInProgress).toEqual(false)
    })
    
    test('should set state.extractedInfo to action.payload.info', () => {
      expect(updatedState.extractedInfo).toEqual({
        filename1: { name: 'filename1', citation: '1' },
        filename2: { name: 'filename2', citation: '1' }
      })
    })
  })
  
  describe('SET_INFO_REQUEST_IN_PROGRESS', () => {
    const action = {
      type: types.SET_INFO_REQUEST_IN_PROGRESS
    }
    
    const currentState = getState()
    const state = reducer(currentState, action)
    
    test('should set that an info request in progress', () => {
      expect(state.infoRequestInProgress).toEqual(true)
    })
  })
  
  describe('MERGE_INFO_WITH_DOCS', () => {
    const action = {
      type: types.MERGE_INFO_WITH_DOCS,
      payload: [
        { name: 'filename1', citation: '1' },
        { name: 'filename2', citation: '1' }
      ]
    }
    
    const currentState = getState({
      selectedDocs: [{ name: 'filename3' }, { name: 'filename4' }],
      infoRequestInProgress: true
    })
    
    const updatedState = reducer(currentState, action)
    
    test('should add action.payload to the end of state.selectedDocs', () => {
      expect(updatedState.selectedDocs).toEqual(
        [
          { name: 'filename3' },
          { name: 'filename4' },
          { name: 'filename1', citation: '1' },
          { name: 'filename2', citation: '1' }
        ]
      )
    })
    
    test('should set that there is no longer an info request in progress', () => {
      expect(updatedState.infoRequestInProgress).toEqual(false)
    })
  })
  
  describe('EXTRACT_INFO_SUCCESS_NO_DOCS', () => {
    const action = {
      type: types.EXTRACT_INFO_SUCCESS_NO_DOCS,
      payload: {
        filename1: { name: 'filename1', citation: '1' },
        filename2: { name: 'filename2', citation: '1' }
      }
    }
    
    const currentState = getState({
      infoRequestInProgress: true,
      selectedDocs: [{ name: 'filename1' }, { name: 'filename2' }]
    })
    
    const updatedState = reducer(currentState, action)
    
    test('should set state.extractedInfo to action.payload', () => {
      expect(updatedState.extractedInfo).toEqual({
        filename1: { name: 'filename1', citation: '1' },
        filename2: { name: 'filename2', citation: '1' }
      })
    })
    
    test('should set state.infoRequestInProgress to false', () => {
      expect(updatedState.infoRequestInProgress).toEqual(false)
    })
  })
  
  describe('UPDATE_DOC_PROPERTY', () => {
    const action = {
      type: types.UPDATE_DOC_PROPERTY,
      property: 'citation',
      value: 'New Citation',
      index: 1
    }
    
    const currentState = getState({
      selectedDocs: [
        { name: 'doc1', citation: { value: '' }, effectiveDate: { value: '' } },
        {
          name: 'doc2',
          citation: { value: '', error: 'blep' },
          effectiveDate: { value: '' }
        }
      ]
    })
    
    const updatedState = reducer(currentState, action)
    
    test('should set property for correct document at action.index', () => {
      expect(updatedState.selectedDocs[1].citation.value).toEqual('New Citation')
    })
    
    test('should reset any error for that action.property', () => {
      expect(updatedState.selectedDocs[1].citation.error).toEqual('')
    })
  })
  
  describe('ADD_SELECTED_DOCS', () => {
    const action = {
      type: types.ADD_SELECTED_DOCS,
      selectedDocs: [
        { name: 'Doc 1', citation: '' },
        { name: 'Doc 2', citation: '' }
      ]
    }
    
    test(
      'should add action.selectedDocs to state.selectedDocs with inEditMode, editable and error to each property',
      () => {
        const currentState = getState()
        const updatedState = reducer(currentState, action)
        expect(updatedState.selectedDocs).toEqual([
          {
            name: {
              editable: true,
              inEditMode: false,
              value: 'Doc 1',
              error: ''
            },
            citation: { editable: true, inEditMode: false, value: '', error: '' }
          },
          {
            name: {
              editable: true,
              inEditMode: false,
              value: 'Doc 2',
              error: ''
            },
            citation: { editable: true, inEditMode: false, value: '', error: '' }
          }
        ])
      }
    )
    
    test('should not overwrite the existing state.selectedDocs by adding new docs to the end', () => {
      const currentState = getState({
        selectedDocs: [{ name: 'existing1' }, { name: 'existing2' }]
      })
      
      const updatedState = reducer(currentState, action)
      expect(updatedState.selectedDocs).toEqual([
        { name: 'existing1' },
        { name: 'existing2' },
        {
          name: {
            editable: true,
            inEditMode: false,
            value: 'Doc 1',
            error: ''
          },
          citation: { editable: true, inEditMode: false, value: '', error: '' }
        },
        {
          name: {
            editable: true,
            inEditMode: false,
            value: 'Doc 2',
            error: ''
          },
          citation: { editable: true, inEditMode: false, value: '', error: '' }
        }
      ])
    })
  })
  
  describe('REMOVE_DOC', () => {
    test('should remove the at state.selectedDocs[action.index]', () => {
      const action = {
        type: types.REMOVE_DOC,
        index: 2
      }
      
      const currentState = getState({
        selectedDocs: [
          { name: 'doc1' },
          { name: 'doc2' },
          { name: 'doc3' },
          { name: 'doc4' }
        ]
      })
      
      const updatedState = reducer(currentState, action)
      expect(updatedState.selectedDocs).toEqual([
        { name: 'doc1' },
        { name: 'doc2' },
        { name: 'doc4' }
      ])
    })
  })
  
  describe('TOGGLE_ROW_EDIT_MODE', () => {
    test('should set inEditMode to true for the action.property of selectedDoc at action.index', () => {
      const action = {
        type: types.TOGGLE_ROW_EDIT_MODE,
        index: 0,
        property: 'citation'
      }
      
      const currentState = getState({
        selectedDocs: [
          { name: 'doc1', citation: { value: '', inEditMode: false } },
          { name: 'doc2', citation: { value: '', inEditMode: false } },
          { name: 'doc3', citation: { value: '', inEditMode: false } },
          { name: 'doc4', citation: { value: '', inEditMode: false } }
        ]
      })
      
      const updatedState = reducer(currentState, action)
      expect(updatedState.selectedDocs[0].citation.inEditMode).toEqual(true)
    })
  })
  
  describe('CLOSE_ALERT', () => {
    test('should reset state.alertOpen, state.alertText and state.alertTitle', () => {
      const action = {
        type: types.CLOSE_ALERT
      }
      
      const currentState = getState({
        alert: {
          open: true,
          text: 'alert text',
          title: 'alert title',
          type: 'blerp'
        }
      })
      const updatedState = reducer(currentState, action)
      expect(updatedState.alert.open).toEqual(false)
      expect(updatedState.alert.title).toEqual('')
      expect(updatedState.alert.text).toEqual('')
      expect(updatedState.alert.type).toEqual('basic')
    })
  })
  
  describe('OPEN_ALERT', () => {
    const action = {
      type: types.OPEN_ALERT,
      title: 'alert title',
      text: 'alert text',
      alertType: 'invalidFiles'
    }
    
    const currentState = getState()
    const updatedState = reducer(currentState, action)
    
    test('should set state.alert.open to true', () => {
      expect(updatedState.alert.open).toEqual(true)
    })
    
    test('should set state.alert.title to action.title', () => {
      expect(updatedState.alert.title).toEqual('alert title')
    })
    
    test('should set state.alert.text to action.text', () => {
      expect(updatedState.alert.text).toEqual('alert text')
    })
    
    test('should set state.alert.type to action.alertType', () => {
      expect(updatedState.alert.type).toEqual('invalidFiles')
    })
  })
  
  describe('CLEAR_SELECTED_FILES', () => {
    const action = { type: types.CLEAR_SELECTED_FILES }
    const currentState = getState({
      alertOpen: true,
      selectedDocs: [{ name: 'doc1' }, { name: 'doc2' }],
      alertTitle: 'bloop'
    })
    
    const updatedState = reducer(currentState, action)
    
    test('should reset state', () => {
      expect(updatedState).toEqual(initial)
    })
  })
  
  describe('ROW_SEARCH_JURISDICTION_LIST_SUCCESS', () => {
    test(
      'should set jurisdictions.value.suggestions to action.payload.suggestions for doc at action.payload.index',
      () => {
        const action = {
          type: types.SEARCH_ROW_SUGGESTIONS_SUCCESS_JURISDICTION,
          payload: {
            suggestions: [{ name: 'juris' }, { name: 'jurisdiction' }],
            index: 1
          }
        }
        
        const currentState = getState({
          selectedDocs: [
            { name: 'doc 1', jurisdictions: { value: { suggestions: [] } } },
            { name: 'doc 2', jurisdictions: { value: { suggestions: [] } } }
          ]
        })
        const updatedState = reducer(currentState, action)
        expect(updatedState.selectedDocs[1].jurisdictions.value.suggestions)
          .toEqual([{ name: 'juris' }, { name: 'jurisdiction' }])
      }
    )
  })
  
  describe('CLEAR_ROW_JURISDICTION_SUGGESTIONS', () => {
    test('should set jurisdictions.value.suggestions to [] for doc at action.index', () => {
      const action = {
        type: types.CLEAR_ROW_JURISDICTION_SUGGESTIONS,
        index: 0
      }
      
      const currentState = getState({
        selectedDocs: [
          {
            name: 'doc 1',
            jurisdictions: {
              value: {
                suggestions: [{ name: 'juris' }, { name: 'jurisdictions' }]
              }
            }
          },
          { name: 'doc 2', jurisdictions: { value: { suggestions: [] } } }
        ]
      })
      const updatedState = reducer(currentState, action)
      expect(updatedState.selectedDocs[0].jurisdictions.value.suggestions).toEqual([])
    })
  })
  
  describe('REJECT_NO_PROJECT_SELECTED', () => {
    const action = {
      type: types.REJECT_NO_PROJECT_SELECTED,
      error: 'no project error'
    }
    
    const currentState = getState()
    const updatedState = reducer(currentState, action)
    
    test('should set state.noProjectError to true', () => {
      expect(updatedState.noProjectError).toEqual(true)
    })
    
    test('should set appropriate state alert properties', () => {
      expect(updatedState.alert.open).toEqual(true)
      expect(updatedState.alert.text).toEqual('no project error')
      expect(updatedState.alert.title).toEqual('Invalid Project')
      expect(updatedState.alert.type).toEqual('basic')
    })
  })
  
  describe('RESET_FAILED_UPLOAD_VALIDATION', () => {
    const action = {
      type: types.RESET_FAILED_UPLOAD_VALIDATION
    }
    
    const currentState = getState({ noProjectError: true })
    const updatedState = reducer(currentState, action)
    
    test('should set state.noProjectError to false', () => {
      expect(updatedState.noProjectError).toEqual(false)
    })
  })
  
  describe('REJECT_EMPTY_JURISDICTIONS', () => {
    const action = {
      type: types.REJECT_EMPTY_JURISDICTIONS,
      invalidDocs: [],
      error: 'invalid jurisdictions error'
    }
    
    const currentState = getState({
      selectedDocs: [
        {
          name: 'doc 1',
          jurisdictions: {
            value: { name: 'jur', id: 0 },
            inEditMode: false,
            error: false
          }
        },
        { name: 'doc 2', jurisdictions: { value: { name: '' } } },
        { name: 'doc 3', jurisdictions: { value: { name: 'jur' } } }
      ]
    })
    const updatedState = reducer(currentState, action)
    
    test('should turn on edit mode and set an error for all docs in state.selectedDocs without a jurisdiction', () => {
      expect(updatedState.selectedDocs[1].jurisdictions.inEditMode).toEqual(true)
      expect(updatedState.selectedDocs[1].jurisdictions.error).toEqual(true)
      expect(updatedState.selectedDocs[2].jurisdictions.inEditMode).toEqual(true)
      expect(updatedState.selectedDocs[2].jurisdictions.error).toEqual(true)
    })
    
    test('should not change edit mode or error for docs with a jurisdiction', () => {
      expect(updatedState.selectedDocs[0].jurisdictions.inEditMode).toEqual(false)
      expect(updatedState.selectedDocs[0].jurisdictions.error).toEqual(false)
    })
    
    test('should set appropriate state alert properties', () => {
      expect(updatedState.alert.open).toEqual(true)
      expect(updatedState.alert.text).toEqual('invalid jurisdictions error')
      expect(updatedState.alert.title).toEqual('Invalid Jurisdictions')
      expect(updatedState.alert.type).toEqual('basic')
    })
  })
  
  describe('CLEAR_SELECTED_FILES', () => {
    const action = {
      type: types.CLEAR_SELECTED_FILES
    }
    
    const currentState = getState({
      selectedDocs: [
        { name: 'doc 1', jurisdictions: { value: { name: 'jur', id: 0 } } },
        { name: 'doc 2', jurisdictions: { value: { name: '' } } },
        { name: 'doc 3', jurisdictions: { value: { name: 'jur' } } }
      ]
    })
    const updatedState = reducer(currentState, action)
    
    test('should reset state to initial state', () => {
      expect(updatedState).toEqual(INITIAL_STATE)
    })
  })
  
  describe('FLUSH_STATE', () => {
    const action = {
      type: 'FLUSH_STATE'
    }
    
    const currentState = getState({
      selectedDocs: [
        { name: 'doc 1', jurisdictions: { value: { name: 'jur', id: 0 } } },
        { name: 'doc 2', jurisdictions: { value: { name: '' } } },
        { name: 'doc 3', jurisdictions: { value: { name: 'jur' } } }
      ]
    })
    const updatedState = reducer(currentState, action)
    
    test('should reset state to initial state', () => {
      expect(updatedState).toEqual(INITIAL_STATE)
    })
  })
  
  describe('ON_SUGGESTION_SELECTED_JURISDICTION', () => {
    test(
      'should populate the jurisdiction property for docs in state.selectedDocs with action.suggestion information',
      () => {
        const action = {
          type: `${autocompleteTypes.ON_SUGGESTION_SELECTED}_JURISDICTION`,
          suggestion: { id: 123, name: 'Ohio (state)' }
        }
        
        const currentState = getState({
          selectedDocs: [
            { name: 'doc 1', jurisdictions: { value: {} } },
            { name: 'doc 2', jurisdictions: { value: {} } },
            { name: 'doc 3', jurisdictions: { value: {} } }
          ]
        })
        const updatedState = reducer(currentState, action)
        
        expect(updatedState.selectedDocs[0].jurisdictions.value).toEqual({ name: 'Ohio (state)', id: 123 })
        expect(updatedState.selectedDocs[1].jurisdictions.value).toEqual({ name: 'Ohio (state)', id: 123 })
        expect(updatedState.selectedDocs[2].jurisdictions.value).toEqual({ name: 'Ohio (state)', id: 123 })
      }
    )
    
    test('should turn off editability for the jurisdiction property for docs in state.selectedDocs', () => {
      const action = {
        type: `${autocompleteTypes.ON_SUGGESTION_SELECTED}_JURISDICTION`,
        suggestion: { id: 123, name: 'Ohio (state)' }
      }
      
      const currentState = getState({
        selectedDocs: [
          { name: 'doc 1', jurisdictions: { value: {} } },
          { name: 'doc 2', jurisdictions: { value: {} } }
        ]
      })
      
      const updatedState = reducer(currentState, action)
      expect(updatedState.selectedDocs[0].jurisdictions.editable).toEqual(false)
      expect(updatedState.selectedDocs[1].jurisdictions.editable).toEqual(false)
      expect(updatedState.selectedDocs[0].jurisdictions.inEditMode).toEqual(false)
      expect(updatedState.selectedDocs[1].jurisdictions.inEditMode).toEqual(false)
    })
  })
  
  describe('UPDATE_SEARCH_VALUE_JURISDICTION', () => {
    test(
      'should clear the jurisdiction property for docs in state.selectedDocs if searchValue changed to empty',
      () => {
        const action = {
          type: `${autocompleteTypes.UPDATE_SEARCH_VALUE}_JURISDICTION`,
          value: ''
        }
        
        const currentState = getState({
          selectedDocs: [
            { name: 'doc 1', jurisdictions: { value: { name: 'Ohio (state)', id: 123 } } },
            { name: 'doc 2', jurisdictions: { value: { name: 'Ohio (state)', id: 123 } } }
          ]
        })
        
        const updatedState = reducer(currentState, action)
        
        expect(updatedState.selectedDocs[0].jurisdictions.value).toEqual({ suggestions: [], searchValue: '', name: '' })
        expect(updatedState.selectedDocs[1].jurisdictions.value).toEqual({ suggestions: [], searchValue: '', name: '' })
      }
    )
    
    test(
      'should enable editing on jurisdiction property for docs in state.selectedDocs if search value is empty',
      () => {
        const action = {
          type: `${autocompleteTypes.UPDATE_SEARCH_VALUE}_JURISDICTION`,
          value: ''
        }
        
        const currentState = getState({
          selectedDocs: [
            { name: 'doc 1', jurisdictions: { value: { name: 'Ohio (state)', id: 123 } } },
            { name: 'doc 2', jurisdictions: { value: { name: 'Ohio (state)', id: 123 } } }
          ]
        })
        
        const updatedState = reducer(currentState, action)
        
        expect(updatedState.selectedDocs[0].jurisdictions.editable).toEqual(true)
        expect(updatedState.selectedDocs[1].jurisdictions.editable).toEqual(true)
      }
    )
  })
})
