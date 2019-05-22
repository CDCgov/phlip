export const projects = {
  1: {
    id: 1,
    name: 'Project 1',
    dateLastEdited: new Date(2017, 0, 31),
    lastEditedBy: 'Kristin Muterspaw',
    lastUsersCheck: null
  },
  2: {
    id: 2,
    name: 'Project 2',
    dateLastEdited: new Date(2017, 2, 31),
    lastEditedBy: 'Michael Ta',
    lastUsersCheck: null
  },
  3: {
    id: 3,
    name: 'Project 3',
    dateLastEdited: new Date(2017, 1, 28),
    lastEditedBy: 'Sanjith David',
    lastUsersCheck: null
  },
  4: {
    id: 4,
    name: 'Project 4',
    dateLastEdited: new Date(2017, 5, 30),
    lastEditedBy: 'Greg Ledbetter',
    lastUsersCheck: null
  },
  5: {
    id: 5,
    name: 'Project 5',
    dateLastEdited: new Date(2017, 9, 31),
    lastEditedBy: 'Jason James',
    lastUsersCheck: null
  }
}

export const projectsPayload = [
  {
    id: 1,
    name: 'Project 1',
    dateLastEdited: new Date(2017, 0, 31),
    lastEditedBy: 'Kristin Muterspaw',
    lastUsersCheck: null
  },
  { id: 2, name: 'Project 2', dateLastEdited: new Date(2017, 2, 31), lastEditedBy: 'Michael Ta', lastUsersCheck: null },
  {
    id: 3,
    name: 'Project 3',
    dateLastEdited: new Date(2017, 1, 28),
    lastEditedBy: 'Sanjith David',
    lastUsersCheck: null
  },
  {
    id: 4,
    name: 'Project 4',
    dateLastEdited: new Date(2017, 5, 30),
    lastEditedBy: 'Greg Ledbetter',
    lastUsersCheck: null
  },
  { id: 5, name: 'Project 5', dateLastEdited: new Date(2017, 9, 31), lastEditedBy: 'Jason James', lastUsersCheck: null }
]

export const defaultSorted = [5, 4, 2, 3, 1]
export const sortedByDateAndBookmarked = [4, 3, 1, 5, 2]

export default { projects, projectsPayload, defaultSorted, sortedByDateAndBookmarked }
