import reducer, { INITIAL_STATE } from '../reducer'
import { types } from '../actions'

const initial = INITIAL_STATE

const getState = (other = {}) => ({
  ...initial,
  ...other
})

describe('Document Management - Upload reducer tests', () => {
  test('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initial)
  })

  describe('UPLOAD_DOCUMENTS_REQUEST', () => {
    const fd = new FormData()
    fd.append('files', [{ name: 'Doc 1' }, { name: 'Doc 2' }])

    const action = {
      type: types.UPLOAD_DOCUMENTS_REQUEST,
      selectedDocs: [{ name: 'Doc 1' }, { name: 'Doc 2' }],
      selectedDocsFormData: fd
    }

    const currentState = getState()
    const updatedState = reducer(currentState, action)

    test('should set state.uploading to true', () => {
      expect(updatedState.uploading).toEqual(true)
    })

    test('should set state.goBack to false', () => {
      expect(updatedState.goBack).toEqual(false)
    })
  })

  describe('UPLOAD_DOCUMENTS_SUCCESS', () => {
    const action = {
      type: types.UPLOAD_DOCUMENTS_SUCCESS
    }

    const currentState = getState({
      selectedDocs: [{ name: 'Doc1' }, { name: 'Doc2' }]
    })

    const updatedState = reducer(currentState, action)

    test('should empty state.selectedDocs', () => {
      expect(updatedState.selectedDocs).toEqual([])
    })

    test('should set state.uploading to false', () => {
      expect(updatedState.uploading).toEqual(false)
    })

    test('should set state.goBack to true', () => {
      expect(updatedState.goBack).toEqual(true)
    })
  })

  describe('UPLOAD_DOCUMENTS_FAIL', () => {
    const action = {
      type: types.UPLOAD_DOCUMENTS_FAIL,
      payload: { error: 'This is an error' }
    }

    const currentState = getState({
      selectedDocs: [{ name: 'Doc1' }, { name: 'Doc2' }]
    })

    const updatedState = reducer(currentState, action)

    test('should NOT empty state.selectedDocs', () => {
      expect(updatedState.selectedDocs).toEqual([
        { name: 'Doc1' },
        { name: 'Doc2' }
      ])
    })

    test('should set state.uploading to false', () => {
      expect(updatedState.uploading).toEqual(false)
    })

    test('should set state.requestError to the error in action.payload', () => {
      expect(updatedState.requestError).toEqual('This is an error')
    })
  })

  describe('VERIFY_RETURN_DUPLICATE_FILES', () => {
    const action = {
      type: types.VERIFY_RETURN_DUPLICATE_FILES,
      payload: [{ name: 'dup1' }]
    }

    const currentState = getState({ uploading: true })
    const updatedState = reducer(currentState, action)

    test('should set state.uploading to false', () => {
      expect(updatedState.uploading).toEqual(false)
    })

    test('should set state.duplicateFiles to action.payload', () => {
      expect(updatedState.duplicateFiles).toEqual([
        { name: 'dup1' }
      ])
    })

    test('should set the proper alert state properties', () => {
      expect(updatedState.alertOpen).toEqual(true)
      expect(updatedState.alertText)
        .toEqual(`The file name, project and jurisdiction properties for one or more of the documents selected for 
        upload match a pre-existing document in the system. These documents have been indicated in the file list. You 
        can choose to remove them or click the 'Upload' button again to proceed with saving them.`)
      expect(updatedState.alertTitle).toEqual('Duplicates Found')
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
      expect(updatedState.infoSheet).toEqual({ name: 'infosheet.xlsx', content: '' })
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
          'filename1': { name: 'filename1', citation: '1' },
          'filename2': { name: 'filename2', citation: '1' }
        },
        merged: [{ name: 'filename1', citation: '1' }, { name: 'filename2', citation: '1' }]
      }
    }

    const currentState = getState({
      infoRequestInProgress: true,
      selectedDocs: [{ name: 'filename1' }, { name: 'filename2' }]
    })

    const updatedState = reducer(currentState, action)

    test('should set state.selectedDocs to action.payload.merged', () => {
      expect(updatedState.selectedDocs)
        .toEqual([{ name: 'filename1', citation: '1' }, { name: 'filename2', citation: '1' }])
    })

    test('should set state.infoRequestInProgress to false', () => {
      expect(updatedState.infoRequestInProgress).toEqual(false)
    })

    test('should set state.extractedInfo to action.payload.info', () => {
      expect(updatedState.extractedInfo).toEqual({
        'filename1': { name: 'filename1', citation: '1' },
        'filename2': { name: 'filename2', citation: '1' }
      })
    })
  })

  describe('MERGE_INFO_WITH_DOCS', () => {
    const action = {
      type: types.MERGE_INFO_WITH_DOCS,
      payload: [{ name: 'filename1', citation: '1' }, { name: 'filename2', citation: '1' }]
    }

    const currentState = getState({
      selectedDocs: [{ name: 'filename1' }, { name: 'filename2' }]
    })

    const updatedState = reducer(currentState, action)

    test('should set state.selectedDocs to action.payload', () => {
      expect(updatedState.selectedDocs)
        .toEqual([{ name: 'filename1', citation: '1' }, { name: 'filename2', citation: '1' }])
    })
  })

  describe('EXTRACT_INFO_SUCCESS_NO_DOCS', () => {
    const action = {
      type: types.EXTRACT_INFO_SUCCESS_NO_DOCS,
      payload: {
        'filename1': { name: 'filename1', citation: '1' },
        'filename2': { name: 'filename2', citation: '1' }
      }
    }

    const currentState = getState({
      infoRequestInProgress: true,
      selectedDocs: [{ name: 'filename1' }, { name: 'filename2' }]
    })

    const updatedState = reducer(currentState, action)

    test('should set state.extractedInfo to action.payload', () => {
      expect(updatedState.extractedInfo).toEqual({
        'filename1': { name: 'filename1', citation: '1' },
        'filename2': { name: 'filename2', citation: '1' }
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
        { name: 'doc2', citation: { value: '', error: 'blep' }, effectiveDate: { value: '' } }
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
      selectedDocs: [{ name: 'Doc 1', citation: '' }, { name: 'Doc 2', citation: '' }]
    }

    test('should add action.selectedDocs to state.selectedDocs with inEditMode, editable and error to each property', () => {
      const currentState = getState()
      const updatedState = reducer(currentState, action)
      expect(updatedState.selectedDocs).toEqual([
        {
          name: { editable: true, inEditMode: false, value: 'Doc 1', error: '' },
          citation: { editable: true, inEditMode: false, value: '', error: '' }
        },
        {
          name: { editable: true, inEditMode: false, value: 'Doc 2', error: '' },
          citation: { editable: true, inEditMode: false, value: '', error: '' }
        }
      ])
    })

    test('should not overwrite the existing state.selectedDocs by adding new docs to the end', () => {
      const currentState = getState({
        selectedDocs: [{ name: 'existing1' }, { name: 'existing2' }]
      })

      const updatedState = reducer(currentState, action)
      expect(updatedState.selectedDocs).toEqual([
        { name: 'existing1' },
        { name: 'existing2' },
        {
          name: { editable: true, inEditMode: false, value: 'Doc 1', error: '' },
          citation: { editable: true, inEditMode: false, value: '', error: '' }
        },
        {
          name: { editable: true, inEditMode: false, value: 'Doc 2', error: '' },
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

  describe('CLOSE_ALERT', () => {
    test('should reset state.alertOpen, state.alertText and state.alertTitle', () => {
      const action = {
        type: types.CLOSE_ALERT
      }

      const currentState = getState({ alertOpen: true, alertText: 'alert text', alertTitle: 'title' })
      const updatedState = reducer(currentState, action)
      expect(updatedState.alertOpen).toEqual(false)
      expect(updatedState.alertTitle).toEqual('')
      expect(updatedState.alertText).toEqual('')
    })
  })

  describe('OPEN_ALERT', () => {
    const action = {
      type: types.OPEN_ALERT,
      title: 'alert title',
      text: 'alert text'
    }

    const currentState = getState()
    const updatedState = reducer(currentState, action)

    test('should set state.alertOpen to true', () => {
      expect(updatedState.alertOpen).toEqual(true)
    })

    test('should set state.alertTitle to action.title', () => {
      expect(updatedState.alertTitle).toEqual('alert title')
    })

    test('should set state.alertText to action.text', () => {
      expect(updatedState.alertText).toEqual('alert text')
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

  describe('REMOVE_DUPLICATE', () => {
    const action = { type: types.REMOVE_DUPLICATE, index: 1, fileName: 'filename.pdf' }
    const currentState = getState({
      selectedDocs: [
        { name: 'filename1.pdf' },
        { name: 'filename.pdf' }
      ],
      duplicateFiles: [
        { name: 'filename.pdf' }
      ]
    })

    const updatedState = reducer(currentState, action)
    test('should remove file from state.duplicateFiles', () => {
      expect(updatedState.duplicateFiles).toEqual([])
    })

    test('should remove file from state.selectedDocs', () => {
      expect(updatedState.selectedDocs).toEqual([
        { name: 'filename1.pdf' }
      ])
    })
  })

  /*describe('ADD_TAG', () => {
  test('should add action.tag to state.selectedDocs[action.index].tags', () => {
    const action = {
      type: types.ADD_TAG,
      index: 1,
      tag: 'cool tag'
    }

    const currentState = getState({
      selectedDocs: [{ name: 'doc1', tags: [] }, { name: 'doc2', tags: [] }]
    })
    const updatedState = reducer(currentState, action)

    expect(updatedState.selectedDocs[1].tags).toEqual(['cool tag'])
  })
})

xdescribe('REMOVE_TAG', () => {
  test('should remove the tag at state.selectedDocs[action.index].tags[action.tagIndex]', () => {
    const action = {
      type: types.REMOVE_TAG,
      index: 0,
      tagIndex: 2
    }

    const currentState = getState({
      selectedDocs: [{ name: 'doc1', tags: ['tag1', 'tag2', 'tag3', 'tag4'] }, { name: 'doc2', tags: [] }]
    })
    const updatedState = reducer(currentState, action)
    expect(updatedState.selectedDocs[0].tags).toEqual(['tag1', 'tag2', 'tag4'])
  })
})*/
})