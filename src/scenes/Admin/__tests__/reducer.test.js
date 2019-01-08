import { types } from '../actions'
import { adminReducer as reducer, INITIAL_STATE } from '../reducer'

const mockUsers = [
  { id: 1, name: 'user1' },
  { id: 2, name: 'user2' }
]

const initial = INITIAL_STATE

const getState = (other = {}) => {
  return {
    ...initial,
    ...other
  }
}

describe('Admin reducer', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initial)
  })

  describe('GET_USERS_SUCCESS', () => {
    const action = {
      type: types.GET_USERS_SUCCESS,
      payload: mockUsers
    }

    const currentState = getState()
    const updatedState = reducer(currentState, action)

    test('should set state.users to action.payload', () => {
      expect(updatedState.users).toEqual(mockUsers)
    })

    test('should set state.visibleUsers to action.payload', () => {
      expect(updatedState.visibleUsers).toEqual(mockUsers)
    })
  })

  describe('ADD_USER_SUCCESS', () => {
    const action = {
      type: types.ADD_USER_SUCCESS,
      payload: { name: 'new user' }
    }

    const currentState = getState({
      users: mockUsers,
      visibleUsers: mockUsers
    })
    const updatedState = reducer(currentState, action)

    test('should add user to state.users list', () => {
      expect(updatedState.users).toEqual([
        { name: 'new user' },
        ...mockUsers
      ])
    })

    test('should add user to state.visibleUsers', () => {
      expect(updatedState.visibleUsers).toEqual([
        { name: 'new user' },
        ...mockUsers
      ])
    })
  })

  describe('UPDATE_USER_SUCCESS', () => {
    const updatedUser = { id: 2, name: 'update user name' }

    const action = {
      type: types.UPDATE_USER_SUCCESS,
      payload: updatedUser
    }

    const currentState = getState({
      users: mockUsers,
      visibleUsers: mockUsers
    })
    const updatedState = reducer(currentState, action)

    test('should update the user in state.users based on action.payload.id', () => {
      expect(updatedState.users[1]).toEqual(updatedUser)
    })

    test('should update the user in state.visibleUsers based on action.payload.id', () => {
      expect(updatedState.visibleUsers[1]).toEqual(updatedUser)
    })
  })
})