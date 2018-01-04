import React from 'react'
import { default as MuiAppBar } from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'

export const AppBar = ({ children, ...otherProps }) => (
  <MuiAppBar position="static" color="default">
    <Toolbar {...otherProps} >
      {children}
    </Toolbar>
  </MuiAppBar>
)

AppBar.defaultProps = {
}

export default AppBar