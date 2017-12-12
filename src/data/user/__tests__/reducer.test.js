import reducer from '../reducer'
import * as types from '../actionTypes'

const initial = {
  currentUser: {},
  menuOpen: false,
  menuAnchor: null
}

describe('User reducer', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initial)
  })

  describe('OPEN_MENU', () => {
    test('should switch menuOpen to true and menuAnchor to anchor action key', () => {
      expect(
        reducer(
          { ...initial },
          { type: types.OPEN_MENU, anchor: '<div></div>' }
        )
      ).toEqual({
        currentUser: {},
        menuAnchor: '<div></div>',
        menuOpen: true
      })
    })
  })

  describe('CLOSE_MENU', () => {
    test('should set menuOpen to false and menuAnchor to null', () => {
      expect(
        reducer(
          { ...initial, menuOpen: true, menuAnchor: '<div></div>' },
          { type: types.CLOSE_MENU }
        )
      ).toEqual({
        currentUser: {},
        menuAnchor: null,
        menuOpen: false
      })
    })
  })

  describe('LOGIN_USER_SUCCESS', () => {
    test('should set currentUser to payload object', () => {
      expect(
        reducer(
          { ...initial },
          { type: types.LOGIN_USER_SUCCESS, payload: { firstName: 'user' }}
        )
      ).toEqual({
        currentUser: { firstName: 'user' },
        menuOpen: false,
        menuAnchor: null
      })
    })
  })

  describe('FLUSH_STATE', () => {
    test('should set state back to initial state', () => {
      expect(
        reducer(
          { currentUser: { firstName: 'user' }, menuOpen: true, menuAnchor: '<div></div>' },
          { type: types.FLUSH_STATE }
        )
      ).toEqual(initial)
    })
  })
})