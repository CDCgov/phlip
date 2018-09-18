import React from 'react'
import reducer from '../reducer'
import * as types from '../actionTypes'

const initial = {
  currentUser: {}
}

describe('User reducer', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initial)
  })

  xdescribe('TOGGLE_MENU', () => {
    test('should switch menuOpen to true and menuAnchor to anchor action key', () => {
      expect(
        reducer(
          { ...initial },
          { type: types.TOGGLE_MENU }
        )
      ).toEqual({
        ...initial,
        currentUser: {},
        menuOpen: true
      })
    })
  })

  describe('LOGIN_USER_SUCCESS', () => {
    test('should set currentUser to payload object', () => {
      expect(
        reducer(
          { ...initial },
          { type: types.LOGIN_USER_SUCCESS, payload: { firstName: 'user' } }
        )
      ).toEqual({
        ...initial,
        currentUser: { firstName: 'user' }
      })
    })
  })

  xdescribe('FLUSH_STATE', () => {
    test('should set state back to initial state', () => {
      expect(
        reducer(
          { currentUser: { firstName: 'user' } },
          { type: types.FLUSH_STATE }
        )
      ).toEqual(initial)
    })
  })

  describe('TOGGLE_BOOKMARK_SUCCESS', () => {
    test('should set currentUser to user object in action', () => {
      expect(
        reducer(
          { ...initial, currentUser: { firstName: 'user', bookmarks: [5,6] } },
          { type: types.TOGGLE_BOOKMARK_SUCCESS, payload: { user: { firstName: 'user', bookmarks: [5,6,7] } }}
        )
      ).toEqual({
        ...initial,
        currentUser: { firstName: 'user', bookmarks: [5,6,7] }
      })
    })
  })
})