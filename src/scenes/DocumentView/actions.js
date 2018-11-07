import makeActionCreator from 'utils/makeActionCreator'

export const types = {
  INIT_STATE_WITH_DOC: 'INIT_STATE_WITH_DOC'
}

export default {
  initState: makeActionCreator(types.INIT_STATE_WITH_DOC, 'doc')
}