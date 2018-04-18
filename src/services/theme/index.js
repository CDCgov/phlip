import { createMuiTheme } from 'material-ui/styles'
import { pink, deepPurple, teal } from 'material-ui/colors'

const mainColor = '#048484'

const theme = createMuiTheme({
  palette: {
    primary: {
      ...deepPurple,
      main: '#3d316a',
      light: '#6a5b98',
      dark: '#100b3f',
      500: '#3d316a'
    },
    secondary: {
      ...teal,
      main: mainColor,
      light: '#4fb4b4',
      dark: '#005757',
      pageHeader: '#005757',
      'A100': mainColor,
      'A200': mainColor, // MUI uses this color to determine color of buttons when set to 'secondary' (beta-25)
      'A400': '#005757', // MUI uses this color to determine color of buttons on hover when set to 'secondary' (beta-25)
      tabs: '#ecf7f6'
    },
    error: {
      ...pink,
      500: '#ff3d70',
      main: '#ff3d70'
    }
  },
  buttons: {
    closeButton: '#ff3d70'
  },
  scenes: {
    background: '#f5f5f5'
  },
  overrides: {
    MuiFormLabel: {
      focused: {
        color: '#38a48e'
      }
    },
    MuiInput: {
      inkbar: {
        '&:after': {
          backgroundColor: '#38a48e'
        }
      }
    }
  }
})

export default theme
