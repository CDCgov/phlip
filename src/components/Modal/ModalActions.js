import React from 'react'
import PropTypes from 'prop-types'
import { DialogActions } from 'material-ui/Dialog'
import Button from 'components/Button'
import { withStyles } from 'material-ui/styles'

const styles = {
  root: {
    margin: '24px'
  }
}

const ModalActions = ({ actions, raised, classes, ...otherProps }) => {
  return (
    <DialogActions classes={{ root: classes.root }} {...otherProps} >
      {actions.map(action => (
        <Button
          key={action.value}
          raised={raised} value={action.value}
          type={action.type}
          color="accent"
          disabled={action.disabled || false}
          onClick={action.onClick}
          {...action.otherProps}
        />
      ))}
    </DialogActions>
  )
}

ModalActions.propTypes = {
  raised: PropTypes.bool,
  actions: PropTypes.array.isRequired,
  classes: PropTypes.object
}

ModalActions.defaultProps = {
  raised: false,
  actions: [],
  classes: {}
}

export default withStyles(styles)(ModalActions)