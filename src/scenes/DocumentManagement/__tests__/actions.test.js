import actions, { types } from '../actions'

describe('Document management actions creators', () => {
  test('should create an action to get documents', () => {
    const expectedAction = {
      type: types.GET_DOCUMENTS_REQUEST
    }
    expect(actions.getDocumentsRequest()).toEqual(expectedAction)
  })

  test('should create an action to select all documents', () => {
    const expectedAction = {
      type: types.ON_SELECT_ALL
    }

    expect(actions.handleSelectAll()).toEqual(expectedAction)
  })

  test('should create an action to update search field', () => {
    const expectedAction = {
      type: types.ON_SEARCH_FIELD_CHANGE,
      searchValue: 'hi'
    }
    expect(actions.handleSearchFieldChange('hi')).toEqual(expectedAction)
  })

  test('should create an action to change table page', () => {
    const expectedAction = {
      type: types.ON_PAGE_CHANGE,
      page: 1
    }

    expect(actions.handlePageChange(1)).toEqual(expectedAction)
  })

  test('should create an to change rows per page', () => {
    const expectedAction = {
      type: types.ON_ROWS_CHANGE,
      rowsPerPage: 15
    }

    expect(actions.handleRowsChange(15)).toEqual(expectedAction)
  })

  test('should create an action to select one file', () => {
    const expectedAction = {
      type: types.ON_SELECT_ONE_FILE,
      id: '134354324526'
    }

    expect(actions.handleSelectOneFile('134354324526')).toEqual(expectedAction)
  })
})