import React from 'react'
import PropTypes from 'prop-types'
import DialogActions from '@material-ui/core/DialogActions'
import Button from 'components/Button'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  root: {
    margin: '20px'
  }
}

/**
 * Wrapper for @material-ui/core's DialogActions component. These actions will be displayed as buttons at the bottom of the modal
 */
export const ModalActions = ({ actions, raised, classes, ...otherProps }) => {
  return (
    <DialogActions classes={{ root: classes.root }} {...otherProps} >
      {actions.map((action, i) => (
        <Button
          key={action.value}
          raised={raised}
          value={action.value}
          type={action.type}
          id={`modal-action-${i}`}
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
  /**
   * Should the action buttons be raised
   */
  raised: PropTypes.bool,
  /**
   * The list of actions to render
   */
  actions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.any,
    disabled: PropTypes.bool,
    type: PropTypes.string,
    onClick: PropTypes.func,
    otherProps: PropTypes.object
  })),
  /**
   * Style classes object supplied by @material-ui/core
   */
  classes: PropTypes.object
}

ModalActions.defaultProps = {
  raised: false,
  actions: [],
  classes: {}
}

export default withStyles(styles)(ModalActions)