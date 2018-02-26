import React, { Fragment } from 'react'
import Avatar from 'components/Avatar'
import Popover from 'material-ui/Popover'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
import { getInitials } from 'utils/normalize'

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
});

export const ValidationAvatar = ({ answer, handlePopoverOpen, handleClose, popoverOpen, anchorEl, classes }) => {
  const initials = getInitials(answer.firstName, answer.lastName)
  return (
    <Fragment>
      <Avatar cardAvatar initials={initials} onMouseOver={handlePopoverOpen} onMouseOut={handleClose} />
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
        disableRestoreFocus>
        <Typography>{answer.firstName + ' ' + answer.lastName}</Typography>
        <Typography>{answer.pincite}</Typography>
      </Popover>
    </Fragment>
  )
}

export default withStyles(styles)(ValidationAvatar)