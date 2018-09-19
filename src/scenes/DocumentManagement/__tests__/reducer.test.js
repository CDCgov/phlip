import { types } from '../actions'
import { docManagementReducer as reducer } from '../reducer'

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

const getState = other => ({
  ...initial,
  ...other
})

const getReducer = (state, action) => reducer(state, action)

describe('Document Management reducer', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initial)
  })
})
