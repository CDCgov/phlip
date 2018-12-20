import { types } from '../actions'
import { docManagementReducer as reducer } from '../reducer'
import { createAutocompleteReducer } from 'data/autocomplete/reducer'
import { types as autocompleteTypes } from 'data/autocomplete/actions'

const mockDocuments = {
  byId: {
    '1': {
      name: 'doc1',
      _id: '1',
      uploadedBy: { firstName: 'test', lastName: 'user' },
      uploadedByName: 'test user',
      jurisdictions: [321],
      projects: [123],
        projectList: 'Project 1',
        jurisdictionList: 'Ohio'
    },
    '2': {
      name: 'doc2',
      _id: '2',
      uploadedBy: { firstName: 'test', lastName: 'user' },
      uploadedByName: 'test user',
      jurisdictions: [],
      projects: [],
      projectList: '',
      jurisdictionList: ''
    },
    '3': {
      name: 'doc3',
      _id: '3',
      uploadedBy: { firstName: 'test', lastName: 'user' },
      uploadedByName: 'test user',
      jurisdictions: [],
      projects: [123],
      projectList: 'Project 1',
      jurisdictionList: ''
    },
    '4': {
      name: 'doc4',
      _id: '4',
      uploadedBy: { firstName: 'test', lastName: 'user' },
      uploadedByName: 'test user',
      jurisdictions: [],
      projects: [],
      projectList: '',
      jurisdictionList: ''
    },
    '5': {
      name: 'doc5',
      _id: '5',
      uploadedBy: { firstName: 'test', lastName: 'user' },
      uploadedByName: 'test user',
      jurisdictions: [],
      projects: [123],
      projectList: 'Project 1',
      jurisdictionList: ''
    },
    '6': {
      name: 'doc6',
      _id: '6',
      uploadedBy: { firstName: 'test', lastName: 'user' },
      uploadedByName: 'test user',
      jurisdictions: [321],
      projects: [],
      projectList: '',
      jurisdictionList: 'Ohio'
    },
    '7': {
      name: 'doc7',
      _id: '7',
      uploadedBy: { firstName: 'test', lastName: 'user' },
      uploadedByName: 'test user',
      jurisdictions: [321],
      projects: [],
      projectList: '',
      jurisdictionList: 'Ohio'
    }
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
  allSelected: false,
  searchByProject: null,
  searchByJurisdiction: null
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

      expect(updatedState.documents.visible).toEqual([
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7'
      ])
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
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7'
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

  describe('ON_SUGGESTION_SELECTED_PROJECT', () => {
    test('should set state.searchByProject to the id of the action.suggestion', () => {
      const action = {
        type: `${autocompleteTypes.ON_SUGGESTION_SELECTED}_PROJECT_MAIN`,
        suggestion: { id: 123, name: 'project' }
      }

      const currentState = getState({ documents: mockDocuments })
      const updatedState = reducer(currentState, action)

      expect(updatedState.searchByProject).toEqual(123)
    })

    test('should filter all documents to show only ones that are for the selected project', () => {
      const action = {
        type: `${autocompleteTypes.ON_SUGGESTION_SELECTED}_PROJECT_MAIN`,
        suggestion: { id: 123, name: 'project' }
      }

      const currentState = getState({ documents: mockDocuments })
      const updatedState = reducer(currentState, action)

      expect(updatedState.documents.visible).toEqual([
        '1', '3', '5'
      ])
    })
  })

  describe('ON_SEARCH_FIELD_CHANGE', () => {
    test('should set state.searchValue to action.searchValue', () => {
      const action = {
        type: types.ON_SEARCH_FIELD_CHANGE,
        searchValue: 'this search'
      }

      const currentState = getState()
      const updateState = reducer(currentState, action)

      expect(updateState.searchValue).toEqual('this search')
    })

    test('should filter all documents to only show ones whose name, upload date or uploaded by match the search string', () => {
      const action = {
        type: types.ON_SEARCH_FIELD_CHANGE,
        searchValue: 'doc7'
      }

      const currentState = getState({ documents: mockDocuments })
      const updatedState = reducer(currentState, action)

      expect(updatedState.documents.visible).toEqual(['7'])
    })
  })

  describe('ON_SUGGESTION_SELECTED_JURISDICTION', () => {
    test('should set state.searchByJurisdiction to the id of the action.suggestion', () => {
      const action = {
        type: `${autocompleteTypes.ON_SUGGESTION_SELECTED}_JURISDICTION_MAIN`,
        suggestion: { id: 321, name: 'ohio' }
      }

      const currentState = getState({ documents: mockDocuments })
      const updatedState = reducer(currentState, action)

      expect(updatedState.searchByJurisdiction).toEqual(321)
    })

    test('should filter all documents to show only ones that are for the selected jurisdiction', () => {
      const action = {
        type: `${autocompleteTypes.ON_SUGGESTION_SELECTED}_JURISDICTION_MAIN`,
        suggestion: { id: 321, name: 'ohio' }
      }

      const currentState = getState({ documents: mockDocuments })
      const updatedState = reducer(currentState, action)

      expect(updatedState.documents.visible).toEqual([
        '1', '6', '7'
      ])
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
})
