import * as types from '../actionTypes'
import reducer from '../reducer'

const projects = {
  1: { id: 1, name: 'Project 1', dateLastEdited: new Date(2017, 0, 31), lastEditedBy: 'Kristin Muterspaw' },
  2: { id: 2, name: 'Project 2', dateLastEdited: new Date(2017, 2, 31), lastEditedBy: 'Michael Ta' },
  3: { id: 3, name: 'Project 3', dateLastEdited: new Date(2017, 1, 28), lastEditedBy: 'Sanjith David' },
  4: { id: 4, name: 'Project 4', dateLastEdited: new Date(2017, 5, 30), lastEditedBy: 'Greg Ledbetter' },
  5: { id: 5, name: 'Project 5', dateLastEdited: new Date(2017, 9, 31), lastEditedBy: 'Jason James' }
}

const projectsPayload = [
  { id: 1, name: 'Project 1', dateLastEdited: new Date(2017, 0, 31), lastEditedBy: 'Kristin Muterspaw' },
  { id: 2, name: 'Project 2', dateLastEdited: new Date(2017, 2, 31), lastEditedBy: 'Michael Ta' },
  { id: 3, name: 'Project 3', dateLastEdited: new Date(2017, 1, 28), lastEditedBy: 'Sanjith David' },
  { id: 4, name: 'Project 4', dateLastEdited: new Date(2017, 5, 30), lastEditedBy: 'Greg Ledbetter' },
  { id: 5, name: 'Project 5', dateLastEdited: new Date(2017, 9, 31), lastEditedBy: 'Jason James' }
]

const defaultSorted = [5, 4, 2, 3, 1]
const userAndBookmarked = [3, 1, 4, 2, 5]
const sortedByUser = [3, 2, 1, 5, 4]
const sortedByDateAndBookmarked = [4, 3, 1, 5, 2]

const initial = {
  main: {
    projects: {
      byId: { ...projects },
      allIds: defaultSorted
    },
    rowsPerPage: 10,
    page: 0,
    projectCount: 0,
    matches: [],
    visibleProjects: [],
    bookmarkList: [],
    sortBy: 'dateLastEdited',
    direction: 'desc',
    sortBookmarked: false,
    error: false,
    errorContent: '',
    searchValue: ''
  },
  newProject: {}
}

const getState = other => ({ ...initial, main: { ...initial.main, ...other } })

const getReducer = (state, action) => reducer(state, action)

describe('Home reducer', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {}))
    .toEqual({ ...initial, main: { ...initial.main, projects: { byId: {}, allIds: [] } } })
  })

  describe('GET_PROJECTS_SUCCESS', () => {
    test('it should sort the projects by the default sort: dateLastEdited and descending', () => {
      const reducer = getReducer(
        getState(),
        {
          type: types.GET_PROJECTS_SUCCESS,
          payload: {
            projects: projectsPayload,
            bookmarkList: [],
            error: false,
            errorContent: '',
            searchValue: ''
          }
        }
      )
      expect(reducer).toEqual({
        ...getState({
          projects: {
            byId: { ...projects },
            allIds: defaultSorted
          },
          visibleProjects: defaultSorted,
          projectCount: 5
        })
      })
    })
  })

  xdescribe('TOGGLE_BOOKMARK_SUCCESS', () => {
    test('should set bookmarkList to action.payload.bookmarkList', () => {
      expect(
        reducer(
          { ...initial },
          { type: types.TOGGLE_BOOKMARK_SUCCESS, payload: { project: {}, bookmarkList: [1, 2, 3] } }
        )
      ).toEqual({
        ...initial,
        main: { ...initial.main, bookmarkList: [1, 2, 3] }
      })
    })

    test('should move the bookmarked project to the top half of the list if sort by bookmarks is enabled', () => {
      const updatedProject = {
        id: 2,
        name: 'Project 2',
        dateLastEdited: new Date(2017, 2, 31),
        lastEditedBy: 'Michael Ta'
      }
      const expectedResults = [
        { id: 4, name: 'Project 4', dateLastEdited: new Date(2017, 5, 30), lastEditedBy: 'Greg Ledbetter' },
        updatedProject,
        { id: 3, name: 'Project 3', dateLastEdited: new Date(2017, 1, 28), lastEditedBy: 'Sanjith David' },
        { id: 1, name: 'Project 1', dateLastEdited: new Date(2017, 0, 31), lastEditedBy: 'Kristin Muterspaw' },
        { id: 5, name: 'Project 5', dateLastEdited: new Date(2017, 9, 31), lastEditedBy: 'Jason James' }
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
            type: types.TOGGLE_BOOKMARK_SUCCESS,
            payload: {
              project: updatedProject,
              bookmarkList: [4, 3, 1, 2]
            }
          })
      ).toEqual(
        {
          ...initial,
          main: {
            ...initial.main,
            projects: expectedResults,
            visibleProjects: expectedResults,
            sortBookmarked: true,
            projectCount: 5,
            bookmarkList: [4, 3, 1, 2]
          }
        }
      )
    })

    test('should move the un-bookmarked project from the top of the list if sort by bookmarks is enabled', () => {
      const updatedProject = {
        id: 4,
        name: 'Project 4',
        dateLastEdited: new Date(2017, 5, 30),
        lastEditedBy: 'Greg Ledbetter'
      }
      const expectedResults = [
        { id: 3, name: 'Project 3', dateLastEdited: new Date(2017, 1, 28), lastEditedBy: 'Sanjith David' },
        { id: 1, name: 'Project 1', dateLastEdited: new Date(2017, 0, 31), lastEditedBy: 'Kristin Muterspaw' },
        { id: 5, name: 'Project 5', dateLastEdited: new Date(2017, 9, 31), lastEditedBy: 'Jason James' },
        updatedProject,
        { id: 2, name: 'Project 2', dateLastEdited: new Date(2017, 2, 31), lastEditedBy: 'Michael Ta' }
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
            type: types.TOGGLE_BOOKMARK_SUCCESS,
            payload: {
              project: updatedProject,
              bookmarkList: [3, 1]
            }
          })
      ).toEqual(
        {
          ...initial,
          main: {
            ...initial.main,
            projects: expectedResults,
            visibleProjects: expectedResults,
            sortBookmarked: true,
            projectCount: 5,
            bookmarkList: [3, 1]
          }
        }
      )
    })

    test('should not move the project in the list if sort by bookmarked is not enabled', () => {
      const updatedProject = {
        id: 4,
        name: 'Project 4',
        dateLastEdited: new Date(2017, 5, 30),
        lastEditedBy: 'Greg Ledbetter'
      }
      const expectedResults = [
        { id: 5, name: 'Project 5', dateLastEdited: new Date(2017, 9, 31), lastEditedBy: 'Jason James' },
        updatedProject,
        { id: 2, name: 'Project 2', dateLastEdited: new Date(2017, 2, 31), lastEditedBy: 'Michael Ta' },
        { id: 3, name: 'Project 3', dateLastEdited: new Date(2017, 1, 28), lastEditedBy: 'Sanjith David' },
        { id: 1, name: 'Project 1', dateLastEdited: new Date(2017, 0, 31), lastEditedBy: 'Kristin Muterspaw' }
      ]

      const reducer = getReducer(getState({
        projects: {
          byId: { ...projects },
          allIds: defaultSorted
        },
        visibleProjects: defaultSorted
      }), { type })

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
            type: types.TOGGLE_BOOKMARK_SUCCESS,
            payload: {
              project: updatedProject,
              bookmarkList: [3, 1]
            }
          })
      ).toEqual(
        {
          ...initial,
          main: {
            ...initial.main,
            projects: expectedResults,
            visibleProjects: expectedResults,
            projectCount: 5,
            bookmarkList: [3, 1]
          }
        }
      )
    })
  })

  test('should handle UPDATE_PROJECT_SUCCESS', () => {
    const projects = [{ id: 12345, name: 'lalala' }, { id: 67890, name: 'dodododod' }]
    const updatedProject = { id: 67890, name: 'updated name' }
    const expectedResult = [{ id: 12345, name: 'lalala' }, { id: 67890, name: 'updated name' }]

    const reducer = getReducer(
      getState({
        projects: {
          byId: { ...projects },
          allIds: defaultSorted
        }
      })
    )

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
        {
          ...initial,
          main: {
            ...initial.main,
            projects: [payload, ...defaultSortedProjects],
            visibleProjects: [payload, ...defaultSortedProjects]
          }
        }
      )
    })

    test('should set the sortBy, direction, and sortBookmarked properties back to defaults and sort projects by defaults', () => {
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

  xtest('should handle UPDATE_PROJECT_FAIL', () => {
    expect(
      reducer({}, { type: types.UPDATE_PROJECT_FAIL, errorValue: 'error' })
    ).toEqual({
      ...initial,
      main: { ...initial.main, errorContent: 'We failed to update that project. Please try again later.', error: true }
    })
  })

  xtest('should handle GET_PROJECTS_FAIL', () => {
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

  xtest('should handle GET_PROJECTS_REQUEST', () => {
    expect(
      reducer({}, { type: types.GET_PROJECTS_REQUEST })
    ).toEqual(initial)
  })

  xtest('should handle UPDATE_PROJECT_REQUEST', () => {
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
        rowsPerPage: 1,
        projectCount: 2
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
        page: 1,
        projectCount: 2
      }
    })
  })

  describe('SORT_PROJECTS', () => {
    test('should sort projects by name ascending', () => {
      expect(
        reducer(
          {
            ...initial,
            main: {
              ...initial.main,
              projects,
              visibleProjects: projects,
              direction: 'desc'
            }
          },
          { type: types.SORT_PROJECTS, sortBy: 'name' }
        )
      ).toEqual({
        ...initial,
        main: {
          ...initial.main,
          projects: projects.reverse(),
          visibleProjects: projects.reverse(),
          direction: 'asc',
          sortBy: 'name',
          projectCount: 5
        }
      })
    })

    test('should sort projects by name descending', () => {
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
          sortBy: 'name',
          projectCount: 5
        }
      })
    })

    test('should sort projects by dateLastEdited ascending', () => {
      expect(
        reducer(
          {
            ...initial,
            main: {
              ...initial.main,
              direction: 'desc',
              sortBy: 'dateLastEdited',
              projects: defaultSortedProjects,
              visibleProjects: defaultSortedProjects
            }
          },
          { type: types.SORT_PROJECTS, sortBy: 'dateLastEdited' }
        )
      ).toEqual({
        ...initial,
        main: {
          ...initial.main,
          projects: defaultSortedProjects.reverse(),
          visibleProjects: defaultSortedProjects.reverse(),
          direction: 'asc',
          sortBy: 'dateLastEdited',
          projectCount: 5
        }
      })
    })

    test('should sort projects by dateLastEdited descending', () => {
      expect(
        reducer(
          {
            ...initial,
            main: {
              ...initial.main,
              direction: 'asc',
              sortBy: 'dateLastEdited',
              projects: defaultSortedProjects.reverse(),
              visibleProjects: defaultSortedProjects.reverse()
            }
          },
          { type: types.SORT_PROJECTS, sortBy: 'dateLastEdited' }
        )
      ).toEqual({
        ...initial,
        main: {
          ...initial.main,
          projects: defaultSortedProjects,
          visibleProjects: defaultSortedProjects,
          direction: 'desc',
          sortBy: 'dateLastEdited',
          projectCount: 5
        }
      })
    })

    test('should sort projects by lastEditedBy ascending', () => {
      expect(
        reducer(
          {
            ...initial,
            main: {
              ...initial.main,
              direction: 'desc',
              sortBy: 'lastEditedBy',
              projects: sortedByUser,
              visibleProjects: sortedByUser
            }
          },
          { type: types.SORT_PROJECTS, sortBy: 'lastEditedBy' }
        )
      ).toEqual({
        ...initial,
        main: {
          ...initial.main,
          projects: sortedByUser.reverse(),
          visibleProjects: sortedByUser.reverse(),
          direction: 'asc',
          sortBy: 'lastEditedBy',
          projectCount: 5
        }
      })
    })

    test('should sort projects by lastEditedBy descending', () => {
      expect(
        reducer(
          {
            ...initial,
            main: {
              ...initial.main,
              direction: 'asc',
              sortBy: 'lastEditedBy',
              projects: sortedByUser.reverse(),
              visibleProjects: sortedByUser.reverse()
            }
          },
          { type: types.SORT_PROJECTS, sortBy: 'lastEditedBy' }
        )
      ).toEqual({
        ...initial,
        main: {
          ...initial.main,
          projects: sortedByUser,
          visibleProjects: sortedByUser,
          direction: 'desc',
          sortBy: 'lastEditedBy',
          projectCount: 5
        }
      })
    })
  })

  describe('SORT_BOOKMARKED', () => {
    test('should move bookmarked projects to the top and sort those depending on the sort label selected', () => {
      const reducer = getReducer(getState({ bookmarkList: [1,3,4]}), { type: types.SORT_BOOKMARKED, payload: { sortBookmarked: true }})
      expect(reducer).toEqual(
        getState({
          visibleProjects: [...sortedByDateAndBookmarked],
          projectCount: 5,
          sortBookmarked: true,
          bookmarkList: [1,3,4],
          projects: { allIds: [...sortedByDateAndBookmarked], byId: { ...projects } }
        })
      )
    })

    test('should not change the order of the projects if no projects are bookmarked', () => {
      const reducer = getReducer(getState(), { type: types.SORT_BOOKMARKED, payload: { sortBookmarked: true } })
      expect(reducer).toEqual(getState({ sortBookmarked: true, projectCount: 5, visibleProjects: defaultSorted }))
    })

    test('should move bookmarked projects back to their original order by sort label if sorting by bookmarked is disabled', () => {
      const reducer = getReducer(getState({
        sortBookmarked: true, bookmarkList: [4,3,1],
        projects: { byId: { ...projects }, allIds: [ ...sortedByDateAndBookmarked ] },
        projectCount: 5,
        visibleProjects: sortedByDateAndBookmarked
      }), { type: types.SORT_BOOKMARKED, payload: { sortBookmarked: false }})

      expect(reducer).toEqual(getState({
        projects: {
          byId: { ...projects },
          allIds: defaultSorted
        },
        visibleProjects: defaultSorted,
        projectCount: 5,
        sortBookmarked: false,
        bookmarkList: [4, 3, 1]
      }))
    })
  })

  describe('UPDATE_SEARCH_VALUE', () => {
    test('should update visible projects if there are matches for the search value', () => {
      const reducer = getReducer(getState(), { type: types.UPDATE_SEARCH_VALUE, payload: { searchValue: 'Led' } })
      expect(reducer).toEqual({
        ...getState({
          matches: [4],
          visibleProjects: [4],
          projectCount: 1,
          searchValue: 'Led'
        })
      })
    })

    test('should update visible projects to be 0 if there are no matches', () => {
      const reducer = getReducer(getState(), { type: types.UPDATE_SEARCH_VALUE, payload: { searchValue: 'xxx' } })

      expect(reducer).toEqual({
        ...getState({
          matches: [],
          visibleProjects: [],
          projectCount: 0,
          searchValue: 'xxx'
        })
      })
    })

    test('should set the projects back to previous state if searchValue is cleared', () => {
      const reducer = getReducer(getState({ searchValue: 'Led', visibleProjects: [4], matches: [4] }),
        { type: types.UPDATE_SEARCH_VALUE, payload: { searchValue: '' } })

      expect(reducer).toEqual({
        ...getState({
          visibleProjects: defaultSorted,
          searchValue: '',
          projectCount: 5
        })
      })
    })
  })

  describe('FLUSH_STATE', () => {
    test('should set state to initial state, expect for rowsPerPage', () => {
      const reducer = getReducer(getState({ rowsPerPage: 5 }), { type: types.FLUSH_STATE })
      expect(reducer).toEqual(getState({ rowsPerPage: 5, projects: { byId: {}, allIds: [] } }))
    })
  })
})
