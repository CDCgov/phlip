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
const sortedByDateAndBookmarked = [4, 3, 1, 5, 2]

const initial = {
  main: {
    projects: {
      byId: { ...projects },
      allIds: defaultSorted
    },
    rowsPerPage: '10',
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
    searchValue: '',
    exportError: '',
    projectToExport: { text: '' },
    projectUsers: {
      byId: {},
      allIds: [],
      curProjectUsers: [],
      currentProject: null
    }
  },
  addEditProject: { formError: null, goBack: false },
  addEditJurisdictions: {
    jurisdictions: { byId: {}, allIds: [] },
    visibleJurisdictions: [],
    searchValue: '',
    suggestions: [],
    suggestionValue: '',
    jurisdiction: {},
    formError: null,
    goBack: false,
    deleteError: null,
    isLoadingJurisdictions: false,
    showJurisdictionLoader: false,
    form: {
      values: { name: '' }
    }
  }
}

const getState = (other, addEdit) => ({
  ...initial,
  main: { ...initial.main, ...other },
  addEditProject: { ...initial.addEditProject, ...addEdit }
})

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

  describe('TOGGLE_BOOKMARK_SUCCESS', () => {
    test('should set bookmarkList to action.payload.bookmarkList', () => {
      const reducer = getReducer(getState({}), {
        type: types.TOGGLE_BOOKMARK_SUCCESS,
        payload: { bookmarkList: [1, 2, 3] }
      })

      expect(reducer).toEqual(getState({
        projects: {
          byId: { ...projects },
          allIds: [5, 4, 2, 3, 1]
        },
        projectCount: 5,
        bookmarkList: [1, 2, 3],
        visibleProjects: [5, 4, 2, 3, 1]
      }))
    })

    test('should move the bookmarked project to the top half of the list if sort by bookmarks is enabled', () => {
      const reducer = getReducer(getState({
        projects: {
          byId: { ...projects },
          allIds: [4, 3, 5, 2, 1]
        },
        sortBookmarked: true,
        bookmarkList: [4, 3],
        visibleProjects: [4, 3, 5, 2, 1]
      }), { type: types.TOGGLE_BOOKMARK_SUCCESS, payload: { bookmarkList: [4, 3, 2] } })

      expect(reducer).toEqual(getState({
        projects: {
          byId: { ...projects },
          allIds: [4, 2, 3, 5, 1]
        },
        visibleProjects: [4, 2, 3, 5, 1],
        sortBookmarked: true,
        bookmarkList: [4, 3, 2],
        projectCount: 5
      }))
    })

    test('should move the un-bookmarked project from the top of the list if sort by bookmarks is enabled', () => {
      const reducer = getReducer(getState({
        projects: {
          byId: { ...projects },
          allIds: [4, 2, 3, 5, 1]
        },
        sortBookmarked: true,
        bookmarkList: [4, 2, 3],
        visibleProjects: [4, 2, 3, 5, 1]
      }), { type: types.TOGGLE_BOOKMARK_SUCCESS, payload: { bookmarkList: [4, 3] } })

      expect(reducer).toEqual(getState({
        projects: {
          byId: { ...projects },
          allIds: [4, 3, 5, 2, 1]
        },
        visibleProjects: [4, 3, 5, 2, 1],
        sortBookmarked: true,
        bookmarkList: [4, 3],
        projectCount: 5
      }))
    })

    test('should not move the project in the list if sort by bookmarked is not enabled', () => {
      const reducer = getReducer(getState({
        projects: {
          byId: { ...projects },
          allIds: [5, 4, 2, 3, 1]
        },
        bookmarkList: [4, 3],
        visibleProjects: [5, 4, 2, 3, 1]
      }), { type: types.TOGGLE_BOOKMARK_SUCCESS, payload: { bookmarkList: [4, 3, 2] } })

      expect(reducer).toEqual(getState({
        projects: {
          byId: { ...projects },
          allIds: [5, 4, 2, 3, 1]
        },
        visibleProjects: [5, 4, 2, 3, 1],
        bookmarkList: [4, 3, 2],
        projectCount: 5
      }))

    })
  })

  test('should handle UPDATE_PROJECT_SUCCESS', () => {
    const reducer = getReducer(getState({
      projects: {
        byId: { ...projects },
        allIds: [5, 4, 2, 3, 1]
      }
    }), {
      type: types.UPDATE_PROJECT_SUCCESS,
      payload: { id: 3, name: 'Updated Project', lastEditedBy: 'Last User', dateLastEdited: new Date(2017, 11, 28) }
    })

    expect(reducer).toEqual(getState({
      projects: {
        byId: {
          ...projects,
          3: { id: 3, name: 'Updated Project', lastEditedBy: 'Last User', dateLastEdited: new Date(2017, 11, 28) }
        },
        allIds: [3, 5, 4, 2, 1]
      },
      projectCount: 5,
      visibleProjects: [3, 5, 4, 2, 1]
    }, { goBack: true }))
  })

  describe('ADD_PROJECT_SUCCESS', () => {
    test('should add the new project to the top of the project list and visible project list', () => {
      const reducer = getReducer(getState({
        projects: {
          byId: { ...projects },
          allIds: [5, 4, 2, 3, 1]
        }
      }), {
        type: types.ADD_PROJECT_SUCCESS,
        payload: { id: 6, name: 'New Project', dateLastEdited: new Date(2017, 11, 28), type: 1 }
      })

      expect(reducer).toEqual(getState({
        projects: {
          byId: {
            6: { id: 6, name: 'New Project', dateLastEdited: new Date(2017, 11, 28), type: 1 },
            ...projects
          },
          allIds: [6, 5, 4, 2, 3, 1]
        },
        projectCount: 6,
        visibleProjects: [6, 5, 4, 2, 3, 1]
      }, { goBack: true }))
    })

    test('should set the sortBy, direction, and sortBookmarked properties back to defaults and sort projects by defaults', () => {
      const reducer = getReducer(getState({
        projects: {
          byId: { ...projects },
          allIds: [1, 3, 4, 2, 5]
        },
        visibleProjects: [1, 3, 4, 2, 5],
        direction: 'asc',
        bookmarkList: [4, 3, 1],
        projectCount: 5,
        sortBookmarked: true,
        sortBy: 'dateLastEdited'
      }), {
        type: types.ADD_PROJECT_SUCCESS,
        payload: { id: 6, name: 'New Project', dateLastEdited: new Date(2017, 11, 28), type: 1 }
      })

      expect(reducer).toEqual(getState({
        projects: {
          byId: {
            6: { id: 6, name: 'New Project', dateLastEdited: new Date(2017, 11, 28), type: 1 },
            ...projects
          },
          allIds: [6, 5, 4, 2, 3, 1]
        },
        projectCount: 6,
        visibleProjects: [6, 5, 4, 2, 3, 1],
        sortBookmarked: false,
        direction: 'desc',
        bookmarkList: [4, 3, 1]
      }, { goBack: true }))
    })
  })

  test('should handle UPDATE_PROJECT_FAIL', () => {
    const reducer = getReducer(getState({}), { type: types.UPDATE_PROJECT_FAIL })
    expect(reducer).toEqual(getState({
      projectCount: 5,
      visibleProjects: [5, 4, 2, 3, 1]
    }, { formError: undefined }))
  })

  test('should handle GET_PROJECTS_FAIL', () => {
    const reducer = getReducer(getState({}), { type: types.GET_PROJECTS_FAIL })
    expect(reducer).toEqual(getState({
      errorContent: 'We failed to get the list of projects. Please try again later.',
      error: true,
      projectCount: 5,
      visibleProjects: [5, 4, 2, 3, 1]
    }))
  })

  test('should handle GET_PROJECTS_REQUEST', () => {
    const reducer = getReducer(getState(), { type: types.GET_PROJECTS_REQUEST })
    expect(reducer).toEqual(getState({
      projectCount: 5,
      visibleProjects: [5, 4, 2, 3, 1]
    }))
  })

  test('should handle UPDATE_ROWS', () => {
    const reducer = getReducer(getState({
      projects: {
        byId: { ...projects },
        allIds: [5, 4, 2, 3, 1]
      },
      visibleProjects: [5, 4, 2, 3, 1],
      projectCount: 5,
      rowsPerPage: 5,
      page: 0
    }), { type: types.UPDATE_ROWS, payload: { rowsPerPage: 3 } })

    expect(reducer).toEqual(getState({
      projects: {
        byId: { ...projects },
        allIds: [5, 4, 2, 3, 1]
      },
      visibleProjects: [5, 4, 2],
      page: 0,
      rowsPerPage: 3,
      projectCount: 5
    }))
  })

  test('should handle UPDATE_PAGE', () => {
    const reducer = getReducer(
      getState({
        visibleProjects: [5, 4],
        projects: {
          byId: { ...projects }, allIds: [5, 4, 2, 3, 1]
        },
        projectCount: 5,
        rowsPerPage: 2,
        page: 0
      }),
      { type: types.UPDATE_PAGE, payload: { page: 1 } }
    )

    expect(reducer).toEqual(getState({
      projects: {
        byId: { ...projects },
        allIds: [5, 4, 2, 3, 1]
      },
      projectCount: 5,
      rowsPerPage: 2,
      page: 1,
      visibleProjects: [2, 3]
    }))
  })

  describe('SORT_PROJECTS', () => {
    test('should sort projects by name ascending', () => {
      const reducer = getReducer(getState({ visibleProjects: defaultSorted }), {
        type: types.SORT_PROJECTS,
        payload: { sortBy: 'name' }
      })
      expect(reducer).toEqual(getState({
        projects: {
          byId: { ...projects },
          allIds: [1, 2, 3, 4, 5]
        },
        visibleProjects: [1, 2, 3, 4, 5],
        direction: 'asc',
        sortBy: 'name',
        projectCount: 5
      }))
    })

    test('should sort projects by name descending', () => {
      const reducer = getReducer(getState({
        visibleProjects: defaultSorted,
        direction: 'asc'
      }), { type: types.SORT_PROJECTS, payload: { sortBy: 'name' } })
      expect(reducer).toEqual(getState({
        projects: {
          byId: { ...projects },
          allIds: [5, 4, 3, 2, 1]
        },
        visibleProjects: [5, 4, 3, 2, 1],
        direction: 'desc',
        sortBy: 'name',
        projectCount: 5
      }))
    })

    test('should sort projects by dateLastEdited ascending', () => {
      const reducer = getReducer(getState({ visibleProjects: defaultSorted }), {
        type: types.SORT_PROJECTS,
        payload: { sortBy: 'dateLastEdited' }
      })
      expect(reducer).toEqual(getState({
        direction: 'asc',
        sortBy: 'dateLastEdited',
        projects: {
          byId: { ...projects },
          allIds: [1, 3, 2, 4, 5]
        },
        visibleProjects: [1, 3, 2, 4, 5],
        projectCount: 5
      }))
    })

    test('should sort projects by dateLastEdited descending', () => {
      const reducer = getReducer(getState({
        visibleProjects: defaultSorted,
        direction: 'asc'
      }), { type: types.SORT_PROJECTS, payload: { sortBy: 'dateLastEdited' } })
      expect(reducer).toEqual(getState({
        projects: {
          byId: { ...projects },
          allIds: [5, 4, 2, 3, 1]
        },
        visibleProjects: [5, 4, 2, 3, 1],
        direction: 'desc',
        sortBy: 'dateLastEdited',
        projectCount: 5
      }))
    })

    test('should sort projects by lastEditedBy ascending', () => {
      const reducer = getReducer(getState({ visibleProjects: defaultSorted }), {
        type: types.SORT_PROJECTS,
        payload: { sortBy: 'lastEditedBy' }
      })
      expect(reducer).toEqual(getState({
        projects: {
          byId: { ...projects },
          allIds: [4, 5, 1, 2, 3]
        },
        visibleProjects: [4, 5, 1, 2, 3],
        sortBy: 'lastEditedBy',
        direction: 'asc',
        projectCount: 5
      }))
    })

    test('should sort projects by lastEditedBy descending', () => {
      const reducer = getReducer(getState({
        visibleProjects: defaultSorted,
        direction: 'asc'
      }), { type: types.SORT_PROJECTS, payload: { sortBy: 'lastEditedBy' } })
      expect(reducer).toEqual(getState({
        projects: {
          byId: { ...projects },
          allIds: [3, 2, 1, 5, 4]
        },
        visibleProjects: [3, 2, 1, 5, 4],
        sortBy: 'lastEditedBy',
        direction: 'desc',
        projectCount: 5
      }))
    })
  })

  describe('SORT_BOOKMARKED', () => {
    test('should move bookmarked projects to the top and sort those depending on the sort label selected', () => {
      const reducer = getReducer(getState({ bookmarkList: [1, 3, 4] }), {
        type: types.SORT_BOOKMARKED,
        payload: { sortBookmarked: true }
      })
      expect(reducer).toEqual(getState({
        visibleProjects: [...sortedByDateAndBookmarked],
        projectCount: 5,
        sortBookmarked: true,
        bookmarkList: [1, 3, 4],
        projects: { allIds: [...sortedByDateAndBookmarked], byId: { ...projects } }
      }))
    })

    test('should not change the order of the projects if no projects are bookmarked', () => {
      const reducer = getReducer(getState(), { type: types.SORT_BOOKMARKED, payload: { sortBookmarked: true } })
      expect(reducer).toEqual(getState({ sortBookmarked: true, projectCount: 5, visibleProjects: defaultSorted }))
    })

    test('should move bookmarked projects back to their original order by sort label if sorting by bookmarked is disabled', () => {
      const reducer = getReducer(getState({
        sortBookmarked: true, bookmarkList: [4, 3, 1],
        projects: { byId: { ...projects }, allIds: [...sortedByDateAndBookmarked] },
        projectCount: 5,
        visibleProjects: sortedByDateAndBookmarked
      }), { type: types.SORT_BOOKMARKED, payload: { sortBookmarked: false } })

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
      expect(reducer).toEqual(getState({
        matches: [4],
        visibleProjects: [4],
        projectCount: 1,
        searchValue: 'Led'
      }))
    })

    test('should update visible projects to be 0 if there are no matches', () => {
      const reducer = getReducer(getState(), { type: types.UPDATE_SEARCH_VALUE, payload: { searchValue: 'xxx' } })

      expect(reducer).toEqual(getState({
        matches: [],
        visibleProjects: [],
        projectCount: 0,
        searchValue: 'xxx'
      }))
    })

    test('should set the projects back to previous state if searchValue is cleared', () => {
      const reducer = getReducer(
        getState({ searchValue: 'Led', visibleProjects: [4], matches: [4] }),
        { type: types.UPDATE_SEARCH_VALUE, payload: { searchValue: '' } }
      )

      expect(reducer).toEqual(getState({
        visibleProjects: defaultSorted,
        searchValue: '',
        projectCount: 5
      }))
    })
  })

  describe('FLUSH_STATE', () => {
    test('should set state to initial state, expect for rowsPerPage', () => {
      const reducer = getReducer(getState({ rowsPerPage: 5 }), { type: types.FLUSH_STATE })
      expect(reducer).toEqual(getState({ rowsPerPage: 5, projects: { byId: {}, allIds: [] } }))
    })
  })
})
