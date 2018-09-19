import { types } from '../actions'
import { docManagementReducer as reducer } from '../reducer'

const mockDocuments = {
  byId: {
    '1': { name: 'doc1', _id: '1' },
    '2': { name: 'doc2', _id: '2' },
    '3': { name: 'doc3', _id: '3' },
    '4': { name: 'doc4', _id: '4' },
    '5': { name: 'doc5', _id: '5' },
    '6': { name: 'doc6', _id: '6' },
    '7': { name: 'doc7', _id: '7' }
  },
  allIds: ['1', '2', '3', '4', '5', '6', '7'],
  visible: ['1', '2']
}

const initial = {
  documents: {
    byId: {},
    allIds: [],
    visible: [],
    checked: []
  },
  rowsPerPage: '10',
  page: 0,
  searchValue: '',
  allSelected: false
}

const getState = (other = {}) => ({
  ...initial,
  ...other
})

describe('Document Management reducer', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initial)
  })

  describe('GET_DOCUMENTS_SUCCESS', () => {
    test('should normalize action.payload into the documents object in state', () => {
      const action = {
        type: types.GET_DOCUMENTS_SUCCESS,
        payload: [{ name: 'Doc 1', _id: '12345' }, { name: 'Doc 2', _id: '54321' }]
      }

      const currentState = getState()
      const updatedState = reducer(currentState, action)

      expect(updatedState.documents.byId).toEqual({
        '12345': { name: 'Doc 1', _id: '12345' },
        '54321': { name: 'Doc 2', _id: '54321' }
      })

      expect(updatedState.documents.allIds).toEqual(['12345', '54321'])
    })

    test('should update documents.visible based on the state.rowsPerPage and state.page properties', () => {
      const action = {
        type: types.GET_DOCUMENTS_SUCCESS,
        payload: [{ name: 'Doc 1', _id: '12345' }, { name: 'Doc 2', _id: '54321' }]
      }

      const currentState = getState({ rowsPerPage: '1' })
      const updatedState = reducer(currentState, action)

      expect(updatedState.documents.visible).toEqual(['12345'])
    })

    test('should keep documents.checked property', () => {
      const action = {
        type: types.GET_DOCUMENTS_SUCCESS,
        payload: [{ name: 'Doc 1', _id: '12345' }, { name: 'Doc 2', _id: '54321' }]
      }

      const currentState = getState({ documents: { checked: ['09876'] } })
      const updatedState = reducer(currentState, action)
      expect(updatedState.documents.checked).toEqual(['09876'])
    })
  })

  describe('ON_PAGE_CHANGE', () => {
    test('should update page property in state', () => {
      const action = { type: types.ON_PAGE_CHANGE, page: 1 }

      const currentState = getState()
      const updatedState = reducer(currentState, action)

      expect(updatedState.page).toEqual(1)
    })

    test('should update documents.visible to show selected page of documents', () => {
      const action = { type: types.ON_PAGE_CHANGE, page: 1 }

      const currentState = getState({ documents: mockDocuments, rowsPerPage: '2' })
      const updatedState = reducer(currentState, action)

      expect(updatedState.documents.visible).toEqual(['3', '4'])
    })
  })

  describe('ON_ROWS_CHANGE', () => {
    test('should update rowsPerPage property in state', () => {
      const action = { type: types.ON_ROWS_CHANGE, rowsPerPage: '4' }

      const currentState = getState()
      const updatedState = reducer(currentState, action)

      expect(updatedState.rowsPerPage).toEqual('4')
    })

    test('should update documents.visible to show new # of rows per page', () => {
      const action = { type: types.ON_ROWS_CHANGE, rowsPerPage: '5' }

      const currentState = getState({ documents: mockDocuments })
      const updatedState = reducer(currentState, action)

      expect(updatedState.documents.visible).toEqual(['1', '2', '3', '4', '5'])
    })

    test('should handle All rowsPerPage option', () => {
      const action = { type: types.ON_ROWS_CHANGE, rowsPerPage: 'All' }

      const currentState = getState({ documents: mockDocuments })
      const updatedState = reducer(currentState, action)

      expect(updatedState.documents.visible).toEqual(['1', '2', '3', '4', '5', '6', '7'])
    })
  })

  describe('ON_SELECT_ALL', () => {
    test('should update allSelect property to false if state.allSelected === true', () => {
      const action = { type: types.ON_SELECT_ALL }

      const currentState = getState({ allSelected: true })
      const updatedState = reducer(currentState, action)

      expect(updatedState.allSelected).toEqual(false)
    })

    test('should update allSelect property to true if state.allSelected === false', () => {
      const action = { type: types.ON_SELECT_ALL }

      const currentState = getState()
      const updatedState = reducer(currentState, action)

      expect(updatedState.allSelected).toEqual(true)
    })

    test('should add all document ids to the documents.checked if state.allSelected === false', () => {
      const action = { type: types.ON_SELECT_ALL }

      const currentState = getState({ documents: mockDocuments })
      const updatedState = reducer(currentState, action)

      expect(updatedState.documents.checked).toEqual(['1', '2', '3', '4', '5', '6', '7'])
    })

    test('should remove all document ids from documents.checked if state.allSelected === true', () => {
      const action = { type: types.ON_SELECT_ALL }

      const currentState = getState({ allSelected: true, documents: { checked: ['1', '2', '3', '4', '5', '6', '7'] } })
      const updatedState = reducer(currentState, action)

      expect(updatedState.documents.checked).toEqual([])
    })
  })

  describe('ON_SELECT_ONE_FILE', () => {
    test('should add the action.id to documents.checked if it doesn\'t already exist', () => {
      const action = { type: types.ON_SELECT_ONE_FILE, id: '5' }

      const currentState = getState()
      const updatedState = reducer(currentState, action)

      expect(updatedState.documents.checked).toEqual(['5'])
    })

    test('should remove the id that matches action.id if documents.checked already contains action.id', () => {
      const action = { type: types.ON_SELECT_ONE_FILE, id: '5' }

      const currentState = getState({ documents: { checked: ['4', '5', '6'] } })
      const updatedState = reducer(currentState, action)

      expect(updatedState.documents.checked).toEqual(['4', '6'])
    })
  })

  describe('UPLOAD_DOCUMENTS_SUCCESS', () => {
    test('should add the action.payload.docs to state.documents', () => {
      const action = {
        type: types.UPLOAD_DOCUMENTS_SUCCESS,
        payload: { docs: [{ name: 'new doc 1', _id: '24' }, { name: 'new doc 2', _id: '42' }] }
      }

      const currentState = getState({ documents: mockDocuments })
      const updatedState = reducer(currentState, action)

      expect(updatedState.documents.byId).toEqual({
        ...mockDocuments.byId,
        '24': { name: 'new doc 1', _id: '24' },
        '42': { name: 'new doc 2', _id: '42' }
      })

      expect(updatedState.documents.allIds).toEqual([...mockDocuments.allIds, '24', '42'])
    })
  })
})
