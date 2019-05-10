import reducer, { INITIAL_STATE } from '../reducer'

const getState = (other = {}) => ({
  ...INITIAL_STATE,
  ...other
})

describe('Admin - AddEditUser reducer', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(INITIAL_STATE)
  })
})
