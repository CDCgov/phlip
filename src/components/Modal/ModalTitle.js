import React from 'react'
import PropTypes from 'prop-types'
import { DialogTitle } from 'material-ui/Dialog'
import Container, { Column } from 'components/Layout'
import IconButton from 'components/IconButton'

const ModalTitle = ({ edit, closeButton, onCloseForm, buttons, title }) => {
  return (
    <DialogTitle>
      <Container alignItems="center">
        <Column flex>{title}</Column>
        {(buttons || closeButton) && <Column>
          <Container alignItems="center">
            {!edit
            && closeButton
            && <IconButton onClick={onCloseForm} color="error" iconSize={25}
                           style={{ fontWeight: 'bold' }}>close</IconButton>}
            {buttons}
          </Container>
        </Column>}
      </Container>
    </DialogTitle>
  )
}

ModalTitle.propTypes = {}

ModalTitle.defaultProps = {
  edit: false,
  editButton: false,
  closeButton: false
}

export default ModalTitle