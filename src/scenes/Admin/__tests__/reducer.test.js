import * as types from '../actionTypes'
import reducer from '../reducer'

const initial = {
  main: {
    users: []
  },
  addEditUser: {}
}

describe('Admin reducer', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      main: { users: [] },
      addEditUser: {}
    })
  })

  xtest('should handle GET_USERS_SUCCESS', () => {
    const payload = [{ name: 'user1' }, { name: 'user2' }]
    expect(
      reducer({}, {
        type: types.GET_USERS_SUCCESS,
        payload
      })
    ).toEqual({
      main: { users: payload },
      addEditUser: {}
    })
  })

  xtest('should handle ADD_USER_SUCCESS', () => {
    const users = [{ id: 93831, name: 'user1' }, { id: 32434, name: 'user2' }]
    const payload = { name: 'New User' }
    const expectedResult = [{ id: 93831, name: 'user1' }, { id: 32434, name: 'user2' }, { name: 'New User' }]
    expect(
      reducer({ ...initial, main: { ...initial.main, users } }, { type: types.ADD_USER_SUCCESS, payload })
    ).toEqual(
      { ...initial, main: { ...initial.main, users: expectedResult } }
      )
  })

  test('should handle UPDATE_USER_SUCCESS', () => {
    const users = [{ id: 93831, name: 'user1' }, { id: 32434, name: 'user2' }]
    const updatedUser = { id: 93831, name: 'updated name' }
    const expectedResult = [{ id: 93831, name: 'updated name' }, { id: 32434, name: 'user2' }]
    expect(
      reducer({ ...initial, main: { ...initial.main, users } }, {
        type: types.UPDATE_USER_SUCCESS,
        payload: updatedUser
      })
    ).toEqual(
      { ...initial, main: { ...initial.main, users: expectedResult } }
      )
  })

})