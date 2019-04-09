import reducer from '../reducer'
import { types } from '../actions'

const initial = {
  currentUser: {},
  byId: {}
}

const getState = (other = {}) => ({
  ...initial,
  ...other
})

describe('User reducer', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initial)
  })

  describe('LOGIN_USER_SUCCESS', () => {
    const currentState = getState()
    const state = reducer(currentState, {
      type: types.LOGIN_USER_SUCCESS,
      payload: { firstName: 'test', lastName: 'user', id: 1 }
    })

    test('should set currentUser to payload object', () => {
      expect(state.currentUser).toEqual({
        firstName: 'test', lastName: 'user', id: 1
      })
    })

    test('should add user to state.byId', () => {
      expect(state.byId[1]).toEqual({
        firstName: 'test', lastName: 'user', initials: 'tu', username: 'test user', id: 1
      })
    })
  })

  describe('FLUSH_STATE', () => {
    test('should set state back to initial state', () => {
      const currentState = getState({ currentUser: { firstName: 'test' }})
      expect(reducer(
        currentState,
        { type: types.FLUSH_STATE }
      )).toEqual(initial)
    })
  })

  describe('TOGGLE_BOOKMARK_SUCCESS', () => {
    test('should set currentUser to user object in action', () => {
      expect(reducer(
        { ...initial, currentUser: { firstName: 'user', bookmarks: [5, 6] } },
        { type: types.TOGGLE_BOOKMARK_SUCCESS, payload: { user: { firstName: 'user', bookmarks: [5, 6, 7] } } }
      )).toEqual({
        ...initial,
        currentUser: { firstName: 'user', bookmarks: [5, 6, 7] }
      })
    })
  })
})
