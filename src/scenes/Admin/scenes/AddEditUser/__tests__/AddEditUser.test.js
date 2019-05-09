import React from 'react'
import { AddEditUser } from '../index'
import { shallow } from 'enzyme'

const props = {
  users: [],
  avatar: '',
  currentUser: { id: 1, firstName: 'test', lastName: 'user', avatar: '' },
  actions: {
    loadAddEditAvatar: jest.fn(),
    addUserRequest: jest.fn(),
    updateUserRequest: jest.fn(),
    updateCurrentUser: jest.fn()
  },
  formActions: {},
  location: {
    pathname: '/admin/new/user'
  },
  match: {
    params: {}
  },
  history: {},
  onCloseModal: jest.fn(),
  formError: '',
  isDoneSubmitting: false,
  onSubmitError: jest.fn(),
  selectedUser: {}
}

describe('User Management - AddEditUser scene', () => {
  test('should render correctly', () => {
    expect(shallow(<AddEditUser {...props} />)).toMatchSnapshot()
  })
})
