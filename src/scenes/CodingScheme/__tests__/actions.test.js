import actions, { types } from '../actions'

describe('Coding Scheme actions creators', () => {
  test('should create an action to get coding scheme', () => {
    const expectedAction = { type: types.GET_SCHEME_REQUEST, id: 1 }
    expect(actions.getSchemeRequest(1)).toEqual(expectedAction)
  })

  test('should create an action to toggle hovering', () => {
    const expectedAction = { type: types.TOGGLE_HOVER, node: { id: 4 }, path: [1,2,3], hover: true }
    expect(actions.toggleHover({ id: 4 }, [1,2,3], true)).toEqual(expectedAction)
  })

  test('should create an action to handle question tree change', () => {
    const expectedAction = { type: types.HANDLE_QUESTION_TREE_CHANGE, questions: [{ id: 4 }, { id: 5 }] }
    expect(actions.updateQuestionTree([{ id: 4 }, { id: 5 }])).toEqual(expectedAction)
  })

  test('should create an action to disable hover', () => {
    const expectedAction = { type: types.DISABLE_HOVER }
    expect(actions.disableHover()).toEqual(expectedAction)
  })

  test('should create an action to enable hover', () => {
    const expectedAction = { type: types.ENABLE_HOVER }
    expect(actions.enableHover()).toEqual(expectedAction)
  })

  test('should create an action reorder the scheme', () => {
    const expectedAction = { type: types.REORDER_SCHEME_REQUEST, projectId: 1 }
    expect(actions.reorderSchemeRequest(1)).toEqual(expectedAction)
  })

  test('should create an action to request to lock the coding scheme', () => {
    const expectedAction = { type: types.LOCK_SCHEME_REQUEST, id: 1 }
    expect(actions.lockCodingSchemeRequest(1)).toEqual(expectedAction)
  })

  test('should create an action to release lock on coding scheme', () => {
    const expectedAction = { type: types.UNLOCK_SCHEME_REQUEST, id: 1 }
    expect(actions.unlockCodingSchemeRequest(1)).toEqual(expectedAction)
  })

  test('should create an action to clear state', () => {
    const expectedAction = { type: types.CLEAR_STATE }
    expect(actions.clearState()).toEqual(expectedAction)
  })

  test('should create an action to set empty state of coding scheme', () => {
    const expectedAction = { type: types.SET_EMPTY_STATE }
    expect(actions.setEmptyState()).toEqual(expectedAction)
  })

  test('should create an action to reset alert error', () => {
    const expectedAction = { type: types.RESET_ALERT_ERROR }
    expect(actions.resetAlertError()).toEqual(expectedAction)
  })

  test('should create an action to close locked alert', () => {
    const expectedAction = { type: types.CLOSE_CODING_SCHEME_LOCK_ALERT }
    expect(actions.closeLockedAlert()).toEqual(expectedAction)
  })
})
