import * as actions from '../actions'
import * as types from '../actionTypes'

describe('User action creators', () => {
  test('should create an action to open menu', () => {
    const expectedAction = {
      type: types.OPEN_MENU,
      anchor: null
    }
    expect(actions.openMenu(null)).toEqual(expectedAction)
  })

  test('should create an action to close menu', () => {
    const expectedAction = {
      type: types.CLOSE_MENU
    }
    expect(actions.closeMenu()).toEqual(expectedAction)
  })

  test('should create an action to logout user', () => {
    const expectedAction = {
      type: types.LOGOUT_USER
    }
    expect(actions.logoutUser()).toEqual(expectedAction)
  })

  test('should create an action to flush state', () => {
    const expectedAction = {
      type: types.FLUSH_STATE
    }
    expect(actions.flushState()).toEqual(expectedAction)
  })
})