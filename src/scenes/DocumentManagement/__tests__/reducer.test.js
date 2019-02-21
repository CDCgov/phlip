import { types } from '../actions'
import { docManagementReducer as reducer } from '../reducer'
import { types as searchTypes } from '../components/SearchBox/actions'

const mockDocuments = {
  byId: {
    1: {
      name: 'the elder scrolls: skyrim',
      _id: '1',
      uploadedBy: { firstName: 'test', lastName: 'user' },
      uploadedByName: 'test user',
      jurisdictions: [1],
      projects: [12],
      projectList: 'Project 1',
      jurisdictionList: 'Ohio',
      uploadedDate: new Date('12/20/2018')
    },
    2: {
      name: 'gardenscapes',
      _id: '2',
      uploadedBy: { firstName: 'test', lastName: 'user' },
      uploadedByName: 'test user',
      jurisdictions: [1, 33],
      projects: [12, 11],
      projectList: 'project 1|test project',
      jurisdictionList: 'ohio|florida',
      uploadedDate: new Date('10/10/2005')
    },
    3: {
      name: 'words with friends',
      _id: '3',
      uploadedBy: { firstName: 'test', lastName: 'user' },
      uploadedByName: 'test user',
      jurisdictions: [2, 33],
      projects: [12, 44],
      projectList: 'Project 1|zero dawn',
      jurisdictionList: 'georiga|florida',
      uploadedDate: new Date('02/10/1993')
    },
    4: {
      name: 'legal text document',
      _id: '4',
      uploadedBy: { firstName: 'test', lastName: 'user' },
      uploadedByName: 'test user',
      jurisdictions: [],
      projects: [44, 5],
      projectList: 'zero dawn|overwatch',
      jurisdictionList: '',
      uploadedDate: new Date('01/7/2019')
    },
    5: {
      name: 'document about brooklyn nine nine',
      _id: '5',
      uploadedBy: { firstName: 'test', lastName: 'user' },
      uploadedByName: 'test user',
      jurisdictions: [33, 200, 1],
      projects: [12, 5],
      projectList: 'Project 1|overwatch',
      jurisdictionList: 'florida|puerto rico|ohio',
      uploadedDate: new Date('06/07/1994')
    },
    6: {
      name: 'document about overwatch',
      _id: '6',
      uploadedBy: { firstName: 'test', lastName: 'user' },
      uploadedByName: 'test user',
      jurisdictions: [1],
      projects: [],
      projectList: '',
      jurisdictionList: 'Ohio',
      uploadedDate: new Date('02/14/2015')
    },
    7: {
      name: 'document about bugs',
      _id: '7',
      uploadedBy: { firstName: 'test', lastName: 'user' },
      uploadedByName: 'test user',
      jurisdictions: [2],
      projects: [],
      projectList: '',
      jurisdictionList: 'georgia',
      uploadedDate: new Date('10/10/2010')
    }
  },
  allIds: ['1', '2', '3', '4', '5', '6', '7'],
  visible: ['4', '1']
}

const orderedByDate = ['4', '1', '6', '7', '2', '5', '3']
const orderedByNameAsc = ['5', '7', '6', '2', '4', '1', '3']
const orderedByNameDesc = ['3','1','4','2','6','7','5']
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
  getDocumentsInProgress: false
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
    test('should update getDocumentsInProgress flag', () =>{
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
          {name: 'Doc 1', _id: '12345', uploadedBy: {firstName: 'test', lastName: 'user'}},
          {name: 'Doc 2', _id: '54321', uploadedBy: {firstName: 'test', lastName: 'user'}}
        ]
      }

      const currentState = getState()
      const updatedState = reducer(currentState, action)

      expect(updatedState.documents.byId).toEqual({
        '12345': {
          name: 'Doc 1',
          _id: '12345',
          uploadedBy: {firstName: 'test', lastName: 'user'},
          uploadedByName: 'test user'
        },
        '54321': {
          name: 'Doc 2',
          _id: '54321',
          uploadedBy: {firstName: 'test', lastName: 'user'},
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
            uploadedBy: {firstName: 'test', lastName: 'user'},
            uploadedByName: 'test user'
          },
          {
            name: 'Doc 2',
            _id: '54321',
            uploadedBy: {firstName: 'test', lastName: 'user'},
            uploadedByName: 'test user'
          }
        ]
      }

      const currentState = getState({rowsPerPage: '1'})
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
            uploadedBy: {firstName: 'test', lastName: 'user'},
            uploadedByName: 'test user'
          },
          {
            name: 'Doc 2',
            _id: '54321',
            uploadedBy: {firstName: 'test', lastName: 'user'},
            uploadedByName: 'test user'
          }
        ]
      }

      const currentState = getState({documents: {checked: ['09876']}})
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
            uploadedBy: {firstName: 'test', lastName: 'user'},
            uploadedByName: 'test user'
          },
          {
            name: 'Doc 2',
            _id: '54321',
            uploadedBy: {firstName: 'test', lastName: 'user'},
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
      const action = {type: types.ON_PAGE_CHANGE, page: 1}

      const currentState = getState()
      const updatedState = reducer(currentState, action)

      expect(updatedState.page).toEqual(1)
    })

    test('should update documents.visible to show selected page of documents', () => {
      const action = {type: types.ON_PAGE_CHANGE, page: 1}

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
      const action = {type: types.ON_ROWS_CHANGE, rowsPerPage: '4'}

      const currentState = getState()
      const updatedState = reducer(currentState, action)

      expect(updatedState.rowsPerPage).toEqual('4')
    })

    test('should update documents.visible to show new # of rows per page', () => {
      const action = {type: types.ON_ROWS_CHANGE, rowsPerPage: '5'}

      const currentState = getState({documents: mockDocuments})
      const updatedState = reducer(currentState, action)
      expect(updatedState.documents.visible).toEqual(['4', '1', '6', '7', '2'])
    })

    test('should handle All rowsPerPage option', () => {
      const action = {type: types.ON_ROWS_CHANGE, rowsPerPage: 'All'}

      const currentState = getState({documents: mockDocuments})
      const updatedState = reducer(currentState, action)

      expect(updatedState.documents.visible).toEqual(orderedByDate)
    })
  })

  describe('ON_SELECT_ALL', () => {
    test('should update allSelect property to false if state.allSelected === true', () => {
      const action = {type: types.ON_SELECT_ALL}

      const currentState = getState({allSelected: true})
      const updatedState = reducer(currentState, action)

      expect(updatedState.allSelected).toEqual(false)
    })

    test('should update allSelect property to true if state.allSelected === false', () => {
      const action = {type: types.ON_SELECT_ALL}

      const currentState = getState()
      const updatedState = reducer(currentState, action)

      expect(updatedState.allSelected).toEqual(true)
    })

    test('should add all document ids to the documents.checked if state.allSelected === false', () => {
      const action = {type: types.ON_SELECT_ALL}

      const currentState = getState({documents: mockDocuments})
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
      const action = {type: types.ON_SELECT_ALL}

      const currentState = getState({
        allSelected: true,
        documents: {checked: ['1', '2', '3', '4', '5', '6', '7']}
      })
      const updatedState = reducer(currentState, action)

      expect(updatedState.documents.checked).toEqual([])
    })
  })

  describe('ON_SELECT_ONE_FILE', () => {
    test('should add the action.id to documents.checked if it doesn\'t already exist', () => {
      const action = {type: types.ON_SELECT_ONE_FILE, id: '5'}

      const currentState = getState()
      const updatedState = reducer(currentState, action)

      expect(updatedState.documents.checked).toEqual(['5'])
    })

    test('should remove the id that matches action.id if documents.checked already contains action.id', () => {
      const action = {type: types.ON_SELECT_ONE_FILE, id: '5'}

      const currentState = getState({documents: {checked: ['4', '5', '6']}})
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
              uploadedBy: {firstName: 'test', lastName: 'user'},
              uploadedByName: 'test user'
            },
            {
              name: 'new doc 2',
              _id: '42',
              uploadedBy: {firstName: 'test', lastName: 'user'},
              uploadedByName: 'test user'
            }
          ]
        }
      }

      const currentState = getState({documents: mockDocuments})
      const updatedState = reducer(currentState, action)

      expect(updatedState.documents.byId).toEqual({
        ...mockDocuments.byId,
        '24': {
          name: 'new doc 1',
          _id: '24',
          uploadedBy: {firstName: 'test', lastName: 'user'},
          uploadedByName: 'test user'
        },
        '42': {
          name: 'new doc 2',
          _id: '42',
          uploadedBy: {firstName: 'test', lastName: 'user'},
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
    test('should handle a basic search string and set state.documents.visible to only matching document ids', () => {
      const action = {
        type: searchTypes.SEARCH_VALUE_CHANGE,
        value: 'ohio',
        form: {
          project: {},
          jurisdiction: {}
        }
      }

      const currentState = getState({documents: mockDocuments})
      const updatedState = reducer(currentState, action)

      expect(updatedState.documents.visible).toEqual(['1', '6', '2', '5'])
    })

    test('should handle a multi-worded string without named filter', () => {
      const action = {
        type: searchTypes.SEARCH_VALUE_CHANGE,
        value: 'document: about',
        form: {
          project: {},
          jurisdiction: {}
        }
      }

      const currentState = getState({documents: mockDocuments})
      const updatedState = reducer(currentState, action)

      expect(updatedState.documents.visible).toEqual([])
    })

    test('should handle multiple words inside parentheses in a named filter', () => {
      const action = {
        type: searchTypes.SEARCH_VALUE_CHANGE,
        value: 'name:(document about bugs)',
        form: {
          project: {},
          jurisdiction: {}
        }
      }

      const currentState = getState({documents: mockDocuments})
      const updatedState = reducer(currentState, action)

      expect(updatedState.documents.visible).toEqual(['7'])
    })

    test('should handle a search string with one named filters', () => {
      const action = {
        type: searchTypes.SEARCH_VALUE_CHANGE,
        value: 'name:(document about)',
        form: {
          project: {},
          jurisdiction: {}
        }
      }

      const currentState = getState({documents: mockDocuments})
      const updatedState = reducer(currentState, action)

      expect(updatedState.documents.visible).toEqual(['6', '7', '5'])
    })

    test('should handle a search string with multiple named filters', () => {
      const date = '10/10/2010'

      const action = {
        type: searchTypes.SEARCH_VALUE_CHANGE,
        value: `name: (document about) | uploadedDate:["${date}","${date}"]`,
        form: {
          project: {},
          jurisdiction: {}
        }
      }

      const currentState = getState({documents: mockDocuments})
      const updatedState = reducer(currentState, action)

      expect(updatedState.documents.visible).toEqual(['7'])
    })

    test('should handle if named filter only has one parentheses', () => {
      const action = {
        type: searchTypes.SEARCH_VALUE_CHANGE,
        value: 'name:(document about',
        form: {
          project: {},
          jurisdiction: {}
        }
      }

      const currentState = getState({documents: mockDocuments})
      const updatedState = reducer(currentState, action)

      expect(updatedState.documents.visible).toEqual([])
    })

    test('should handle if one named filter followed by free text', () => {
      const action = {
        type: searchTypes.SEARCH_VALUE_CHANGE,
        value: 'jurisdiction: florida project',
        form: {
          project: {},
          jurisdiction: {}
        }
      }

      const currentState = getState({documents: mockDocuments})
      const updatedState = reducer(currentState, action)
      expect(updatedState.documents.visible).toEqual(['2', '5', '3'])
    })

    test('should handle if jurisdiction filter is defined', () => {
      const action = {
        type: searchTypes.SEARCH_VALUE_CHANGE,
        value: 'jurisdiction: georgia',
        form: {
          project: {},
          jurisdiction: {
            id: 2
          }
        }
      }

      const currentState = getState({documents: mockDocuments})
      const updatedState = reducer(currentState, action)
      expect(updatedState.documents.visible).toEqual(['7', '3'])
    })

    test('should handle if project filter is defined', () => {
      const action = {
        type: searchTypes.SEARCH_VALUE_CHANGE,
        value: 'project: overwatch',
        form: {
          project: {
            id: 5
          },
          jurisdiction: {}
        }
      }

      const currentState = getState({documents: mockDocuments})
      const updatedState = reducer(currentState, action)
      expect(updatedState.documents.visible).toEqual(['4', '5'])
    })
  })

  describe('FLUSH_STATE', () => {
    test('should reset state to initial', () => {
      const action = {
        type: types.FLUSH_STATE
      }

      const currentState = getState({documents: mockDocuments})
      const updatedState = reducer(currentState, action)

      expect(updatedState).toEqual(initial)
    })
  })

  describe('SORT_DOCUMENTS', () => {
    test('should sort documents by name ascending', () => {
      const action = {
        type: types.SORT_DOCUMENTS, sortBy: 'name', sortDirection:'asc'
      }
      const currentState = getState({documents: mockDocuments})
      const updatedState = reducer(currentState, action)
      expect(updatedState.documents.visible).toEqual(orderedByNameAsc)
    })
    test('should sort documents by name descending', () => {
      const action = {
        type: types.SORT_DOCUMENTS, sortBy: 'name', sortDirection:'desc'
      }
      const currentState = getState({documents: mockDocuments})
      const updatedState = reducer(currentState, action)
      expect(updatedState.documents.visible).toEqual(orderedByNameDesc)
    })
  })
})