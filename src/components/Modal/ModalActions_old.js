import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import DialogActions from '@material-ui/core/DialogActions'
import Button from 'components/Button'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  root: {
    margin: '20px'
  },
  referred : {
    background: 'blue'
  }
}

const methods = {
  componentDidMount(props) {
    this.preferred = React.createRef()
  }
}
/**
 * Wrapper for @material-ui/core's DialogActions component. These actions will be displayed as buttons at the bottom of the modal
 */
export const ModalActions = ({ actions, raised, classes, ...otherProps }) => {

  methods.componentDidMount(actions)
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
          ref = {i===0?this.preferred:undefined}
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
    preferred: PropTypes.bool,
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