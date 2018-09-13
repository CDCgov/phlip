const INITIAL_STATE = {
  documents: {
    byId: {},
    allIds: [],
    visible: []
  },
  searchValue: ''
}

const docManagementReducer = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    default:
      return state
  }
}

export default docManagementReducer