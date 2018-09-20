import reducer from '../reducer'
import actions, { types } from '../actions'

const initial = {
  selectedDocs: [],
  requestError: null,
  uploading: false,
  goBack: false,
  verifying: true,
  duplicateFiles: [],
  alertTitle: '',
  alertOpen: false,
  alertText: ''
}

const getState = (other = {}) => ({
  ...initial,
  ...other
})

describe('Document Management - Upload reducer tests', () => {
  test('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initial)
  })

  describe('UPLOAD_DOCUMENTS_REQUEST', () => {
    const action = {
      type: types.UPLOAD_DOCUMENTS_REQUEST,
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

  describe('VERIFY_UPLOAD_REQUEST', () => {
    const action = {
      type: types.VERIFY_UPLOAD_REQUEST,
      selectedDocs: [{ name: 'Doc1', name: 'Doc2' }]
    }

    const currentState = getState()
    const updatedState = reducer(currentState, action)

    test('should set state.verifying to true', () => {
      expect(updatedState.verifying).toEqual(true)
    })
  })

  describe('VERIFY_UPLOAD_FAIL', () => {
    const action = {
      type: types.VERIFY_UPLOAD_FAIL,
      payload: { error: 'This is an error' }
    }

    const currentState = getState({ verifying: true })
    const updatedState = reducer(currentState, action)

    test('should set state.verifying to false', () => {
      expect(updatedState.verifying).toEqual(false)
    })

    test('should set state.requestError to action.payload.error value', () => {
      expect(updatedState.requestError).toEqual('This is an error')
    })
  })

  describe('VERIFY_RETURN_NO_DUPLICATES', () => {
    const action = {
      type: types.VERIFY_RETURN_NO_DUPLICATES
    }

    const currentState = getState({ verifying: true })
    const updatedState = reducer(currentState, action)

    test('should set state.verifying to false', () => {
      expect(updatedState.verifying).toEqual(false)
    })
  })

  describe('VERIFY_RETURN_DUPLICATE_FILES', () => {
    const action = {
      type: types.VERIFY_RETURN_DUPLICATE_FILES,
      payload: { duplicates: [{ name: 'dup1' }] }
    }

    const currentState = getState({ verifying: true })
    const updatedState = reducer(currentState, action)

    test('should set state.verifying to false', () => {
      expect(updatedState.verifying).toEqual(false)
    })

    test('should set state.duplicateFiles to action.payload.duplicates', () => {
      expect(updatedState.duplicateFiles).toEqual([
        { name: 'dup1' }
      ])
    })

    test('should set the proper alert state properties', () => {
      expect(updatedState.alertOpen).toEqual(true)
      expect(updatedState.alertText)
        .toEqual('There are already documents that exist for some of the files you selected.')
      expect(updatedState.alertTitle).toEqual('Duplicates Found')
    })
  })

  describe('UPDATE_DOC_PROPERTY', () => {
    test('should set property for correct document at action.index', () => {
      const action = {
        type: types.UPDATE_DOC_PROPERTY,
        property: 'name',
        value: 'New Name',
        index: 1
      }

      const currentState = getState({
        selectedDocs: [{ name: 'doc1' }, { name: 'doc2' }]
      })
      const updatedState = reducer(currentState, action)
      expect(updatedState.selectedDocs[1].name).toEqual('New Name')
    })
  })

  describe('ADD_SELECTED_DOCS', () => {
    const action = {
      type: types.ADD_SELECTED_DOCS,
      selectedDocs: [{ name: 'Doc 1' }, { name: 'Doc 2' }]
    }

    test('should add action.selectedDocs to state.selectedDocs', () => {
      const currentState = getState()
      const updatedState = reducer(currentState, action)
      expect(updatedState.selectedDocs).toEqual([
        { name: 'Doc 1' }, { name: 'Doc 2' }
      ])
    })

    test('should not overwrite the existing state.selectedDocs and add new docs to the end', () => {
      const currentState = getState({
        selectedDocs: [{ name: 'existing1' }, { name: 'existing2' }]
      })
      const updatedState = reducer(currentState, action)
      expect(updatedState.selectedDocs).toEqual([
        { name: 'existing1' }, { name: 'existing2' }, { name: 'Doc 1' }, { name: 'Doc 2' }
      ])
    })
  })

  describe('ADD_TAG', () => {
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

  describe('REMOVE_TAG', () => {
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
})