import React from 'react'
import { default as MuiSnackbar, SnackbarContent } from 'material-ui/Snackbar'
import PropTypes from 'prop-types'

export const Snackbar = ({ anchorOrigin, open, handleClose, content, ...other }) => {
  return (
    <MuiSnackbar
      anchorOrigin={anchorOrigin}
      open={open}
      onClose={handleClose}
      message={content}
      {...other}
    />
  )
}

Snackbar.propTypes = {

}

export default Snackbar