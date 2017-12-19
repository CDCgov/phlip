import reducer from '../reducer'
import * as types from '../actionTypes'

const initial = {
  currentUser: { bookmarks: [] },
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
        currentUser: { bookmarks: [] },
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
        currentUser: { bookmarks: [] },
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
        currentUser: { firstName: 'user', bookmarks: [] },
        menuOpen: false,
        menuAnchor: null
      })
    })
  })

  describe('FLUSH_STATE', () => {
    test('should set state back to initial state', () => {
      expect(
        reducer(
          { currentUser: { firstName: 'user', bookmarks: [] }, menuOpen: true, menuAnchor: '<div></div>' },
          { type: types.FLUSH_STATE }
        )
      ).toEqual(initial)
    })
  })

  describe('TOGGLE_BOOKMARK_SUCCESS', () => {
    test('should set currentUser to user object in action', () => {
      expect(
        reducer(
          { currentUser: { firstName: 'user', bookmarks: [5,6] }, menuOpen: false, menuAnchor: null },
          { type: types.TOGGLE_BOOKMARK_SUCCESS, payload: { user: { firstName: 'user', bookmarks: [5,6,7] } }}
        )
      ).toEqual({
        currentUser: { firstName: 'user', bookmarks: [5,6,7] },
        menuOpen: false,
        menuAnchor: null
      })
    })
  })
})