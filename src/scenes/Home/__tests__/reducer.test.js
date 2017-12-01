import * as types from '../actionTypes'
import reducer from '../reducer'

const initial = {
  main: {
    projects: [],
    rowsPerPage: 10,
    page: 0,
    visibleProjects: [],
    sortBy: 'dateLastEdited',
    direction: 'desc',
    sortBookmarked: false,
    error: false,
    errorContent: ''
  },
  newProject: {}
}

describe('Home reducer', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initial)
  })

  xtest('should handle GET_PROJECTS_SUCCESS', () => {
    const payload = [{ name: 'Project 1' }, { name: 'Project 2' }]
    expect(
      reducer({}, {
        type: types.GET_PROJECTS_SUCCESS,
        payload
      })
    ).toEqual({
      main: { projects: payload },
      newProject: {}
    })
  })

  test('should handle TOGGLE_BOOKMARK', () => {
    const projects = [{ id: 12345, name: 'lalala' }, { id: 67890, name: 'dodododod' }]
    const updatedProject = { id: 67890, name: 'updated name' }
    const expectedResult = [{ id: 12345, name: 'lalala' }, { id: 67890, name: 'updated name' }]
    expect(
      reducer({ ...initial, main: { ...initial.main, projects, visibleProjects: projects } }, {
        type: types.TOGGLE_BOOKMARK,
        project: updatedProject,
      })
    ).toEqual(
      { ...initial, main: { ...initial.main, projects: expectedResult, visibleProjects: expectedResult } }
    )
  })

  test('should handle UPDATE_PROJECT_SUCCESS', () => {
    const projects = [{ id: 12345, name: 'lalala' }, { id: 67890, name: 'dodododod' }]
    const updatedProject = { id: 67890, name: 'updated name' }
    const expectedResult = [{ id: 12345, name: 'lalala' }, { id: 67890, name: 'updated name' }]
    expect(
      reducer({ ...initial, main: { ...initial.main, projects } }, {
        type: types.UPDATE_PROJECT_SUCCESS,
        payload: updatedProject
      })
    ).toEqual(
      { ...initial, main: { ...initial.main, projects: expectedResult } }
    )
  })

  xtest('should handle ADD_PROJECT_SUCCESS', () => {
    const projects = [{ id: 12345, name: 'lalala' }, { id: 67890, name: 'dodododod' }]
    const payload = { name: 'New Project' }
    const expectedResult = [{ id: 12345, name: 'lalala' }, { id: 67890, name: 'dodododod' }, { name: 'New Project' }]
    expect(
      reducer({ ...initial, main: { ...initial.main, projects } }, { type: types.ADD_PROJECT_SUCCESS, payload })
    ).toEqual(
      { ...initial, main: { ...initial.main, projects: expectedResult } }
    )
  })

  test('should handle UPDATE_PROJECT_FAIL', () => {
    expect(
      reducer({}, { type: types.UPDATE_PROJECT_FAIL, errorValue: 'error' })
    ).toEqual({ ...initial, main: { ...initial.main, errorContent: 'We failed to update that project. Please try again later.', error: true } })
  })

  test('should handle GET_PROJECTS_FAIL', () => {
    expect(
      reducer({}, { type: types.GET_PROJECTS_FAIL, errorValue: 'error' })
    ).toEqual({ ...initial, main: { ...initial.main, errorContent: 'We failed to get the list of projects. Please try again later.', error: true } })
  })

  test('should handle GET_PROJECTS_REQUEST', () => {
    expect(
      reducer({}, { type: types.GET_PROJECTS_REQUEST })
    ).toEqual(initial)
  })

  test('should handle UPDATE_PROJECT_REQUEST', () => {
    expect(
      reducer({}, { type: types.UPDATE_PROJECT_REQUEST })
    ).toEqual(initial)
  })

  test('should handle UPDATE_ROWS', () => {
    const projects = [{ id: 12345, name: 'aaa' }, { id: 67890, name: 'bbb' }]
    const visibleProjects = [...projects]
    expect(
      reducer(
        { ...initial, main: { ...initial.main, projects, visibleProjects, rowsPerPage: 2 } },
        { type: types.UPDATE_ROWS, rowsPerPage: 1 }
      )
    ).toEqual({
      ...initial,
      main: {
        ...initial.main,
        projects,
        visibleProjects: [{ id: 12345, name: 'aaa' }],
        rowsPerPage: 1
      }
    })
  })

  test('should handle UPDATE_PAGE', () => {
    const projects = [{ id: 12345, name: 'aaa' }, { id: 67890, name: 'bbb' }]
    const visibleProjects = [projects[0]]
    expect(
      reducer(
        { ...initial, main: { ...initial.main, projects, visibleProjects, rowsPerPage: 1, page: 0 } },
        { type: types.UPDATE_PAGE, page: 1 }
      )
    ).toEqual({
      ...initial,
      main: {
        ...initial.main,
        projects,
        visibleProjects: [{ id: 67890, name: 'bbb' }],
        rowsPerPage: 1,
        page: 1
      }
    })
  })

  describe('should handle SORT_PROJECTS', () => {
    const projects = [{ id: 12345, name: 'ccc' }, { id: 67890, name: 'bbb' }, { id: 109876, name: 'aaa' }]
    test('it should sort projects by name ascending', () => {
      expect(
        reducer(
          { ...initial, main: { ...initial.main, projects, direction: 'desc', visibleProjects: projects } },
          { type: types.SORT_PROJECTS, sortBy: 'name' }
        )
      ).toEqual({
        ...initial,
        main: {
          ...initial.main,
          projects: projects.reverse(),
          visibleProjects: projects.reverse(),
          direction: 'asc',
          sortBy: 'name'
        }
      })
    })

    test('it should sort projects by name descending', () => {
      expect(
        reducer(
          { ...initial, main: { ...initial.main, direction: 'asc', projects: projects.reverse(), visibleProjects: projects.reverse() } },
          { type: types.SORT_PROJECTS, sortBy: 'name' }
        )
      ).toEqual({
        ...initial,
        main: {
          ...initial.main,
          projects,
          visibleProjects: projects,
          direction: 'desc',
          sortBy: 'name'
        }
      })
    })
  })
})
