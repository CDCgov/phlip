import * as types from '../actionTypes'
import reducer from '../reducer'

const projects = [
  { id: 1, bookmarked: true, name: 'Project 1', dateLastEdited: new Date(2017, 0, 31), lastEditedBy: 'Kristin Muterspaw' },
  { id: 2, bookmarked: false, name: 'Project 2', dateLastEdited: new Date(2017, 2, 31), lastEditedBy: 'Michael Ta' },
  { id: 3, bookmarked: true, name: 'Project 3', dateLastEdited: new Date(2017, 1, 28), lastEditedBy: 'Sanjith David' },
  { id: 4, bookmarked: true, name: 'Project 4', dateLastEdited: new Date(2017, 5, 30), lastEditedBy: 'Greg Ledbetter' },
  { id: 5, bookmarked: false, name: 'Project 5', dateLastEdited: new Date(2017, 9, 31), lastEditedBy: 'Jason James' }
]

const sortedByUserAndBookmarked  = [
  { id: 3, bookmarked: true, name: 'Project 3', dateLastEdited: new Date(2017, 1, 28), lastEditedBy: 'Sanjith David' },
  { id: 1, bookmarked: true, name: 'Project 1', dateLastEdited: new Date(2017, 0, 31), lastEditedBy: 'Kristin Muterspaw' },
  { id: 4, bookmarked: true, name: 'Project 4', dateLastEdited: new Date(2017, 5, 30), lastEditedBy: 'Greg Ledbetter' },
  { id: 2, bookmarked: false, name: 'Project 2', dateLastEdited: new Date(2017, 2, 31), lastEditedBy: 'Michael Ta' },
  { id: 5, bookmarked: false, name: 'Project 5', dateLastEdited: new Date(2017, 9, 31), lastEditedBy: 'Jason James' }
]

const defaultSortedProjects = [
  { id: 5, bookmarked: false, name: 'Project 5', dateLastEdited: new Date(2017, 9, 31), lastEditedBy: 'Jason James' },
  { id: 4, bookmarked: true, name: 'Project 4', dateLastEdited: new Date(2017, 5, 30), lastEditedBy: 'Greg Ledbetter' },
  { id: 2, bookmarked: false, name: 'Project 2', dateLastEdited: new Date(2017, 2, 31), lastEditedBy: 'Michael Ta' },
  { id: 3, bookmarked: true, name: 'Project 3', dateLastEdited: new Date(2017, 1, 28), lastEditedBy: 'Sanjith David' },
  { id: 1, bookmarked: true, name: 'Project 1', dateLastEdited: new Date(2017, 0, 31), lastEditedBy: 'Kristin Muterspaw' }
]

const sortedByDateAndBookmarked = [
  { id: 4, bookmarked: true, name: 'Project 4', dateLastEdited: new Date(2017, 5, 30), lastEditedBy: 'Greg Ledbetter' },
  { id: 3, bookmarked: true, name: 'Project 3', dateLastEdited: new Date(2017, 1, 28), lastEditedBy: 'Sanjith David' },
  { id: 1, bookmarked: true, name: 'Project 1', dateLastEdited: new Date(2017, 0, 31), lastEditedBy: 'Kristin Muterspaw' },
  { id: 5, bookmarked: false, name: 'Project 5', dateLastEdited: new Date(2017, 9, 31), lastEditedBy: 'Jason James' },
  { id: 2, bookmarked: false, name: 'Project 2', dateLastEdited: new Date(2017, 2, 31), lastEditedBy: 'Michael Ta' }
]

const noBookmarks = [
  { id: 1, bookmarked: false, name: 'Project 1', dateLastEdited: new Date(2017, 0, 31), lastEditedBy: 'Kristin Muterspaw' },
  { id: 2, bookmarked: false, name: 'Project 2', dateLastEdited: new Date(2017, 2, 31), lastEditedBy: 'Michael Ta' },
  { id: 3, bookmarked: false, name: 'Project 3', dateLastEdited: new Date(2017, 1, 28), lastEditedBy: 'Sanjith David' }
]

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

  describe('GET_PROJECTS_SUCCESS', () => {
    xtest('it should sort the projects by the default sort: dateLastEdited and descending', () => {
      expect(
        reducer(
          { ...initial },
          { type: types.GET_PROJECTS_SUCCESS, payload: projects }
        )
      ).toEqual({
        ...initial, main: { ...initial.main, projects: defaultSortedProjects, visibleProjects: defaultSortedProjects }
      })
    })
  })

  describe('TOGGLE_BOOKMARK', () => {
    test('should move the bookmarked project to the top of the list if sort by bookmarks is enabled', () => {
      const updatedProject = { id: 2, bookmarked: true, name: 'Project 2', dateLastEdited: new Date(2017, 2, 31), lastEditedBy: 'Michael Ta' }
      const expectedResults = [
        { id: 4, bookmarked: true, name: 'Project 4', dateLastEdited: new Date(2017, 5, 30), lastEditedBy: 'Greg Ledbetter' },
        updatedProject,
        { id: 3, bookmarked: true, name: 'Project 3', dateLastEdited: new Date(2017, 1, 28), lastEditedBy: 'Sanjith David' },
        { id: 1, bookmarked: true, name: 'Project 1', dateLastEdited: new Date(2017, 0, 31), lastEditedBy: 'Kristin Muterspaw' },
        { id: 5, bookmarked: false, name: 'Project 5', dateLastEdited: new Date(2017, 9, 31), lastEditedBy: 'Jason James' }
      ]

      expect(
        reducer(
          {
            ...initial,
            main: {
              ...initial.main,
              projects: sortedByDateAndBookmarked,
              visibleProjects: sortedByDateAndBookmarked,
              sortBookmarked: true
            }
          }, {
            type: types.TOGGLE_BOOKMARK,
            project: updatedProject
          })
      ).toEqual(
        {
          ...initial,
          main: {
            ...initial.main,
            projects: expectedResults,
            visibleProjects: expectedResults,
            sortBookmarked: true
          }
        }
      )
    })

    test('should move the un-bookmarked project from the top of the list if sort by bookmarks is enabled', () => {
      const updatedProject = { id: 4, bookmarked: false, name: 'Project 4', dateLastEdited: new Date(2017, 5, 30), lastEditedBy: 'Greg Ledbetter' }
      const expectedResults = [
        { id: 3, bookmarked: true, name: 'Project 3', dateLastEdited: new Date(2017, 1, 28), lastEditedBy: 'Sanjith David' },
        { id: 1, bookmarked: true, name: 'Project 1', dateLastEdited: new Date(2017, 0, 31), lastEditedBy: 'Kristin Muterspaw' },
        { id: 5, bookmarked: false, name: 'Project 5', dateLastEdited: new Date(2017, 9, 31), lastEditedBy: 'Jason James' },
        updatedProject,
        { id: 2, bookmarked: false, name: 'Project 2', dateLastEdited: new Date(2017, 2, 31), lastEditedBy: 'Michael Ta' }
      ]

      expect(
        reducer(
          {
            ...initial,
            main: {
              ...initial.main,
              projects: sortedByDateAndBookmarked,
              visibleProjects: sortedByDateAndBookmarked,
              sortBookmarked: true
            }
          }, {
            type: types.TOGGLE_BOOKMARK,
            project: updatedProject
          })
      ).toEqual(
        {
          ...initial,
          main: {
            ...initial.main,
            projects: expectedResults,
            visibleProjects: expectedResults,
            sortBookmarked: true
          }
        }
      )
    })

    test('should not move the project in the list if sort by bookmarked is not enabled', () => {
      const updatedProject = { id: 4, bookmarked: false, name: 'Project 4', dateLastEdited: new Date(2017, 5, 30), lastEditedBy: 'Greg Ledbetter' }
      const expectedResults = [
        { id: 5, bookmarked: false, name: 'Project 5', dateLastEdited: new Date(2017, 9, 31), lastEditedBy: 'Jason James' },
        updatedProject,
        { id: 2, bookmarked: false, name: 'Project 2', dateLastEdited: new Date(2017, 2, 31), lastEditedBy: 'Michael Ta' },
        { id: 3, bookmarked: true, name: 'Project 3', dateLastEdited: new Date(2017, 1, 28), lastEditedBy: 'Sanjith David' },
        { id: 1, bookmarked: true, name: 'Project 1', dateLastEdited: new Date(2017, 0, 31), lastEditedBy: 'Kristin Muterspaw' }
      ]

      expect(
        reducer(
          {
            ...initial,
            main: {
              ...initial.main,
              projects: defaultSortedProjects,
              visibleProjects: defaultSortedProjects
            }
          }, {
            type: types.TOGGLE_BOOKMARK,
            project: updatedProject
          })
      ).toEqual(
        {
          ...initial,
          main: {
            ...initial.main,
            projects: expectedResults,
            visibleProjects: expectedResults
          }
        }
      )
    })
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

  xdescribe('ADD_PROJECT_SUCCESS', () => {
    const payload = { name: 'New Project', type: 'Assessment' }
    test('should add the new project to the top of the project list and visible project list', () => {
      expect(
        reducer(
          {
            ...initial,
            main: { ...initial.main, projects: defaultSortedProjects, visibleProjects: defaultSortedProjects }
          },
          { type: types.ADD_PROJECT_SUCCESS, payload }
        )
      ).toEqual(
        { ...initial,
          main: {
            ...initial.main,
            projects: [payload, ...defaultSortedProjects],
            visibleProjects: [payload, ...defaultSortedProjects]
          }
        }
      )
    })

    test('it should set the sortBy, direction, and sortBookmarked properties back to defaults and sort projects by defaults', () => {
      const payload = { name: 'New Project', type: 'Assessment' }
      expect(
        reducer(
          {
            ...initial,
            main: {
              ...initial.main,
              projects: sortedByUserAndBookmarked,
              visibleProjects: sortedByUserAndBookmarked,
              sortBy: 'name',
              direction: 'desc',
              sortBookmarked: true
            }
          }, { type: types.ADD_PROJECT_SUCCESS, payload }
        )
      ).toEqual(
        {
          ...initial,
          main: {
            ...initial.main,
            projects: [payload, ...defaultSortedProjects],
            visibleProjects: [payload, ...defaultSortedProjects],
            sortBy: 'dateLastEdited',
            direction: 'desc',
            sortBookmarked: false
          }
        }
      )
    })
  })

  test('should handle UPDATE_PROJECT_FAIL', () => {
    expect(
      reducer({}, { type: types.UPDATE_PROJECT_FAIL, errorValue: 'error' })
    ).toEqual({
      ...initial,
      main: { ...initial.main, errorContent: 'We failed to update that project. Please try again later.', error: true }
    })
  })

  test('should handle GET_PROJECTS_FAIL', () => {
    expect(
      reducer({}, { type: types.GET_PROJECTS_FAIL, errorValue: 'error' })
    ).toEqual({
      ...initial,
      main: {
        ...initial.main,
        errorContent: 'We failed to get the list of projects. Please try again later.',
        error: true
      }
    })
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

  describe('SORT_PROJECTS', () => {
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
          {
            ...initial,
            main: {
              ...initial.main,
              direction: 'asc',
              projects: projects.reverse(),
              visibleProjects: projects.reverse()
            }
          },
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

  describe('SORT_BOOKMARKED', () => {
    test('it should move bookmarked projects to the top and sort those depending on the sort label selected', () => {
      expect(
        reducer(
          { ...initial, main: { ...initial.main, projects } },
          { type: types.SORT_BOOKMARKED }
        )
      ).toEqual({
        ...initial,
        main: {
          ...initial.main,
          projects: sortedByDateAndBookmarked,
          visibleProjects: sortedByDateAndBookmarked,
          sortBookmarked: true
        }
      })
    })

    test('it should not change the order of the projects if no projects are bookmarked', () => {
      expect(
        reducer(
          { ...initial, main: { ...initial.main, projects: noBookmarks } },
          { type: types.SORT_BOOKMARKED }
        )
      ).toEqual({
        ...initial,
        main: {
          ...initial.main,
          projects: noBookmarks,
          visibleProjects: noBookmarks,
          sortBookmarked: true
        }
      })
    })

    test('it should move bookmarked projects back to their original order by sort label if sorting by bookmarked is disabled', () => {
      expect(
        reducer(
          { ...initial, main: { ...initial.main, projects: sortedByDateAndBookmarked, sortBookmarked: true } },
          { type: types.SORT_BOOKMARKED }
        )
      ).toEqual({
        ...initial,
        main: {
          ...initial.main,
          projects,
          visibleProjects: projects,
          sortBookmarked: false
        }
      })
    })
  })
})
