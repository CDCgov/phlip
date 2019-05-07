import { types } from '../../../actions'
import reducer from '../reducer'

describe('Home scene - AddEditProject reducer', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({ goBack: false, formError: null })
  })
  
  test('should handle ADD_PROJECT_REQUEST', () => {
    const project = { name: 'New Project' }
    expect(reducer({}, {
      type: types.ADD_PROJECT_REQUEST,
      project
    })).toEqual({ goBack: false })
  })

  test('should handle UPDATE_PROJECT_REQUEST', () => {
    const project = { id: 1, name: 'New Project' }
    expect(reducer({}, {
      type: types.ADD_PROJECT_REQUEST,
      project
    })).toEqual({ goBack: false })
  })
})
