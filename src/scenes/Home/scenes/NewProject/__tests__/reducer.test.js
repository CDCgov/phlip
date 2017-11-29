import * as types from '../../../actionTypes'
import reducer from '../reducer'

describe('Home -- NewProject reducer', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({})
  })
  
  test('should handle ADD_PROJECT_REQUEST', () => {
    const project = { name: 'New Project' }
    expect(reducer({}, {
      type: types.ADD_PROJECT_REQUEST,
      project
    })).toEqual({})
  })
})
