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
})