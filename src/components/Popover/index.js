import React from 'react'
import PropTypes from 'prop-types'
import { default as MuiPopover } from 'material-ui/Popover'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit,
  },
  popover: {
    pointerEvents: 'none',
  },
  popperClose: {
    pointerEvents: 'none',
  },
})

export const Popover = ({ answer, handleClose, popoverOpen, anchorEl, classes }) => {

  return (
    <Popover
      open={popoverOpen}
      anchorEl={anchorEl}
      onClose={handleClose}
      className={classes.popover}
      classes={{
        paper: classes.paper,
      }}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      disableRestoreFocus
    >
      <Typography>{answer.firstName + ' ' + answer.lastName}</Typography>
      <Typography>{answer.pincite}</Typography>
    </Popover>
  )
}


export default withStyles(styles)(Popover)