import React from 'react'
import PropTypes from 'prop-types'
import { DialogActions } from 'material-ui/Dialog'
import Button from 'components/Button'

const ModalActions = ({ edit, actions, raised }) => {
  return (
    <DialogActions>
      {actions.map(action => (
        <Button
          key={action.value}
          raised={raised} value={action.value}
          type={action.type}
          color="accent"
          disabled={action.disabled || false}
          onClick={action.onClick} />
      ))}
    </DialogActions>
  )
}

ModalActions.defaultProps = {
  raised: false
}

export default ModalActions