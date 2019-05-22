import { types } from '../actions'
import { docManagementReducer as reducer } from '../reducer'
import { mockDocuments, orderedByNameDesc, orderedByNameAsc, orderedByDate } from 'utils/testData/documents'
const byId = mockDocuments.byId

const initial = {
  documents: {
    byId: {},
    allIds: [],
    visible: [],
    checked: []
  },
  rowsPerPage: '10',
  page: 0,
  allSelected: false,
  bulkOperationInProgress: false,
  apiErrorOpen: false,
  apiErrorInfo: {
    title: '',
    text: ''
  },
  sortBy: 'uploadedDate',
  sortDirection: 'desc',
  getDocumentsInProgress: false,
  matchedDocs: []
}

const getState = (other = {}) => ({
  ...initial,
  ...other
})

describe('Document Management reducer', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initial)
  })

  describe('GET_DOCUMENTS_REQUEST', () => {
    test('should update getDocumentsInProgress flag', () => {
      const action = {
        type: types.GET_DOCUMENTS_REQUEST
      }
      const currentState = getState()
      const updatedState = reducer(currentState, action)
      expect(updatedState.getDocumentsInProgress).toBeTruthy()
    })
  })
  
  describe('GET_DOCUMENTS_SUCCESS', () => {
    test('should normalize action.payload into the documents object in state', () => {
      const action = {
        type: types.GET_DOCUMENTS_SUCCESS,
        payload: [
          { name: 'Doc 1', _id: '12345', uploadedBy: { firstName: 'test', lastName: 'user' } },
          { name: 'Doc 2', _id: '54321', uploadedBy: { firstName: 'test', lastName: 'user' } }
        ]
      }

      const currentState = getState()
      const updatedState = reducer(currentState, action)

      expect(updatedState.documents.byId).toEqual({
        '12345': {
          name: 'Doc 1',
          _id: '12345',
          uploadedBy: { firstName: 'test', lastName: 'user' },
          uploadedByName: 'test user'
        },
        '54321': {
          name: 'Doc 2',
          _id: '54321',
          uploadedBy: { firstName: 'test', lastName: 'user' },
          uploadedByName: 'test user'
        }
      })

      expect(updatedState.documents.allIds).toEqual(['12345', '54321'])
    })

    test('should update documents.visible based on the state.rowsPerPage and state.page properties', () => {
      const action = {
        type: types.GET_DOCUMENTS_SUCCESS,
        payload: [
          {
            name: 'Doc 1',
            _id: '12345',
            uploadedBy: { firstName: 'test', lastName: 'user' },
            uploadedByName: 'test user'
          },
          {
            name: 'Doc 2',
            _id: '54321',
            uploadedBy: { firstName: 'test', lastName: 'user' },
            uploadedByName: 'test user'
          }
        ]
      }

      const currentState = getState({ rowsPerPage: '1' })
      const updatedState = reducer(currentState, action)

      expect(updatedState.documents.visible).toEqual(['12345'])
    })

    test('should keep documents.checked property', () => {
      const action = {
        type: types.GET_DOCUMENTS_SUCCESS,
        payload: [
          {
            name: 'Doc 1',
            _id: '12345',
            uploadedBy: { firstName: 'test', lastName: 'user' },
            uploadedByName: 'test user'
          },
          {
            name: 'Doc 2',
            _id: '54321',
            uploadedBy: { firstName: 'test', lastName: 'user' },
            uploadedByName: 'test user'
          }
        ]
      }

      const currentState = getState({ documents: { checked: ['09876'] } })
      const updatedState = reducer(currentState, action)
      expect(updatedState.documents.checked).toEqual(['09876'])
    })

    test('should handle if state.rowsPerPage === All', () => {
      const action = {
        type: types.GET_DOCUMENTS_SUCCESS,
        payload: [
          {
            name: 'Doc 1',
            _id: '12345',
            uploadedBy: { firstName: 'test', lastName: 'user' },
            uploadedByName: 'test user'
          },
          {
            name: 'Doc 2',
            _id: '54321',
            uploadedBy: { firstName: 'test', lastName: 'user' },
            uploadedByName: 'test user'
          }
        ]
      }

      const currentState = getState({
        rowsPerPage: 'All'
      })

      const updatedState = reducer(currentState, action)
      expect(updatedState.documents.visible.length).toEqual(2)
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

      const currentState = getState({
        documents: mockDocuments,
        rowsPerPage: '2'
      })

      const updatedState = reducer(currentState, action)
      expect(updatedState.documents.visible).toEqual(['6', '7'])
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
      expect(updatedState.documents.visible).toEqual(['4', '1', '6', '7', '2'])
    })

    test('should handle All rowsPerPage option', () => {
      const action = { type: types.ON_ROWS_CHANGE, rowsPerPage: 'All' }

      const currentState = getState({ documents: mockDocuments })
      const updatedState = reducer(currentState, action)

      expect(updatedState.documents.visible).toEqual(orderedByDate)
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

      expect(updatedState.documents.checked).toEqual([
        '4',
        '1'
      ])
    })

    test('should remove all document ids from documents.checked if state.allSelected === true', () => {
      const action = { type: types.ON_SELECT_ALL }

      const currentState = getState({
        allSelected: true,
        documents: { checked: ['1', '2', '3', '4', '5', '6', '7'] }
      })
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

  describe('ON_DELETE_ONE_FILE', () => {
    test('should remove the action.id from documents.checked if it does exist', () => {
      const action = { type: types.ON_DELETE_ONE_FILE, id: '5' }

      const currentState = getState()
      const updatedState = reducer(currentState, action)

      expect(updatedState.documents.checked).toEqual([])
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
        payload: {
          docs: [
            {
              name: 'new doc 1',
              _id: '24',
              uploadedBy: { firstName: 'test', lastName: 'user' },
              uploadedByName: 'test user'
            },
            {
              name: 'new doc 2',
              _id: '42',
              uploadedBy: { firstName: 'test', lastName: 'user' },
              uploadedByName: 'test user'
            }
          ]
        }
      }

      const currentState = getState({ documents: mockDocuments })
      const updatedState = reducer(currentState, action)

      expect(updatedState.documents.byId).toEqual({
        ...mockDocuments.byId,
        '24': {
          name: 'new doc 1',
          _id: '24',
          uploadedBy: { firstName: 'test', lastName: 'user' },
          uploadedByName: 'test user'
        },
        '42': {
          name: 'new doc 2',
          _id: '42',
          uploadedBy: { firstName: 'test', lastName: 'user' },
          uploadedByName: 'test user'
        }
      })

      expect(updatedState.documents.allIds).toEqual([
        ...mockDocuments.allIds,
        '24',
        '42'
      ])
    })
  })

  describe('SEARCH_VALUE_CHANGE', () => {
    test('should update visible documents based on user preferences (rows, page, etc.)', () => {
      const action = {
        type: types.SEARCH_VALUE_CHANGE,
        payload: [byId[2], byId[3], byId[5], byId[7]]
      }
      
      const currentState = getState({ documents: mockDocuments })
      const updatedState = reducer(currentState, action)
      expect(updatedState.documents.visible).toEqual(['7', '2', '5', '3'])
    })
  })

  describe('FLUSH_STATE', () => {
    test('should reset state to initial', () => {
      const action = {
        type: types.FLUSH_STATE
      }

      const currentState = getState({ documents: mockDocuments })
      const updatedState = reducer(currentState, action)

      expect(updatedState).toEqual(initial)
    })
  })

  describe('SORT_DOCUMENTS', () => {
    test('should sort documents by name ascending', () => {
      const action = {
        type: types.SORT_DOCUMENTS, sortBy: 'name', sortDirection: 'asc'
      }
      const currentState = getState({ documents: mockDocuments })
      const updatedState = reducer(currentState, action)
      expect(updatedState.documents.visible).toEqual(orderedByNameAsc)
    })
    test('should sort documents by name descending', () => {
      const action = {
        type: types.SORT_DOCUMENTS, sortBy: 'name', sortDirection: 'desc'
      }
      const currentState = getState({ documents: mockDocuments })
      const updatedState = reducer(currentState, action)
      expect(updatedState.documents.visible).toEqual(orderedByNameDesc)
    })
  })
})
