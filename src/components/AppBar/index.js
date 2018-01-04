import React from 'react'
import { default as MuiAppBar } from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'

export const AppBar = ({ children }) => (
  <MuiAppBar position="static" color="default">
    <Toolbar>
      {children}
    </Toolbar>
  </MuiAppBar>
)

AppBar.defaultProps = {
}

export default AppBar