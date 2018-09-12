import { createMuiTheme } from '@material-ui/core/styles'
import { pink, deepPurple, teal } from '@material-ui/core/colors'

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
      500: '#db036e',
      main: '#db036e'
    },
    greyText: '#757575'
  },
  scenes: {
    background: '#f5f5f5'
  },
  shape: {
    borderRadius: 2
  },
  overrides: {
    MuiFormLabel: {
      root: {
        '&$focused': {
          color: mainColor
        },
        '&$disabled': {
          color: 'black'
        }
      },
    },
    MuiInput: {
      underline: {
        '&:after': {
          borderBottom: `2px solid ${mainColor}`
        }
      }
    },
    MuiAvatar: {
      img: {
        width: '100%',
        height: '100%',
        textAlign: 'center',
        maxWidth: '100%'
      }
    }
  }
})

export default theme
