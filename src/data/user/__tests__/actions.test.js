import * as actions from '../actions'
import * as types from '../actionTypes'

describe('User action creators', () => {
  test('should create an action to toggle menu', () => {
    const expectedAction = {
      type: types.TOGGLE_MENU
    }
    expect(actions.toggleMenu()).toEqual(expectedAction)
  })

  test('should create an action to close menu', () => {
    const expectedAction = {
      type: types.CLOSE_MENU
    }
    expect(actions.closeMenu()).toEqual(expectedAction)
  })

  test('should create an action to logout user', () => {
    const expectedAction = {
      type: types.LOGOUT_USER,
      sessionExpired: false
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