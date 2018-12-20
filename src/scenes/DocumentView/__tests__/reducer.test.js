import reducer, { INITIAL_STATE } from '../reducer'
const initial = INITIAL_STATE

describe('DocumentView reducer', () => {
  test('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initial)
  })
})
