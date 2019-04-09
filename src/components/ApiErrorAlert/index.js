import React from 'react'
import PropTypes from 'prop-types'
import Alert from 'components/Alert'
import Icon from 'components/Icon'
import Typography from '@material-ui/core/Typography'
import EmoticonSad from 'mdi-material-ui/EmoticonSad'

/**
 * Popup alert specifically used when there's an API Error to show
 */
export const ApiErrorAlert = ({ content, onCloseAlert, open, actions }) => {
  const title = (
    <>
      <Icon size={30} color="red" style={{ paddingRight: 10 }}>
        <EmoticonSad style={{ height: 30, width: 30 }} />
      </Icon>
      Uh-oh! Something went wrong.
    </>
  )

  return (
    <Alert
      actions={[{ value: 'Dismiss', type: 'button', onClick: onCloseAlert }, ...actions]}
      open={open}
      title={title}>
      <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
        {content} Please try again later.
      </Typography>
    </Alert>
  )
}

ApiErrorAlert.defaultProps = {
  actions: [],
  open: false
}

ApiErrorAlert.propTypes = {
  /**
   * The function you want to call when the user closes the alert
   */
  onCloseAlert: PropTypes.func,

  /**
   * Content of the alert
   */
  content: PropTypes.any,

  /**
   * Whether or not the alert is open (visible)
   */
  open: PropTypes.bool,

  /**
   * Array of actions for the alert
   */
  actions: PropTypes.array
}

export default ApiErrorAlert
