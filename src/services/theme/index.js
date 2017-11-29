import { createMuiTheme } from 'material-ui/styles'
import { green, blue, pink } from 'material-ui/colors'

const theme = createMuiTheme({
  palette: {
    primary: {
      ...green,
      500: '#4aac72',
      600: '#4aac72'
    },
    secondary: {
      ...blue,
      500: '#00a9e5',
      'A400': '#0093bc',
      'A200': '#00a9e5'
    },
    error: {
      ...pink,
      500: '#ff3d70'
    }
  },
  buttons: {
    listButtons: '#768f99'
  },
  scenes: {
    background: '#f5f5f5'
  },
  overrides: {
    MuiFormLabel: {
      focused: {
        color: '#00a9e5'
      }
    },
    MuiInput: {
      inkbar: {
        '&:after': {
          backgroundColor: '#00a9e5'
        }
      }
    }
  }
})

export default theme
