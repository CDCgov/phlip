import reducer, { INITIAL_STATE } from '../reducer'
import { types } from '../actions'

const initial = INITIAL_STATE

const getState = (other = {}) => ({
  ...initial,
  ...other
})

describe('DocumentView reducer', () => {
  test('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initial)
  })
})
