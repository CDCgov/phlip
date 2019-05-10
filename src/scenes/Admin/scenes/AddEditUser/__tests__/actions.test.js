import actions, { types } from '../actions'

const user = {
  firstName: 'Test',
  lastName: 'User',
  role: 'Admin',
  avatar: '',
  email: 'test@cdc.gov'
}

describe('Admin - AddEditUser action creators', () => {
  test('should create an action to add a user', () => {
    const expected = {
      type: types.ADD_USER_REQUEST,
      user
    }
    
    expect(actions.addUserRequest(user)).toEqual(expected)
  })
  
  test('should create an action to update user', () => {
    const expected = {
      type: types.UPDATE_USER_REQUEST,
      user,
      selfUpdate: false
    }
    
    expect(actions.updateUserRequest(user, false)).toEqual(expected)
  })
  
  test('should create an action to update current user', () => {
    const expected = {
      type: types.UPDATE_CURRENT_USER,
      payload: {
        firstName: 'Tester'
      }
    }
  
    expect(actions.updateCurrentUser({ firstName: 'Tester' })).toEqual(expected)
  })
})
