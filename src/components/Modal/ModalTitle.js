import React from 'react'
import PropTypes from 'prop-types'
import { DialogTitle } from 'material-ui/Dialog'
import Container, { Column } from 'components/Layout'
import IconButton from 'components/IconButton'

const ModalTitle = ({ edit, editButton, closeButton, onEditForm, onCloseForm, buttons, title }) => {
  return (
    <DialogTitle>
      <Container alignItems="center">
        <Column flex>{title}</Column>
        {editButton || buttons || closeButton && <Column>
          <Container alignItems="center">
            {!edit && editButton && <IconButton onClick={onEditForm} color="secondary">mode_edit</IconButton>}
            {!edit && closeButton && <IconButton onClick={onCloseForm} color="error" iconSize={25} style={{fontWeight: 'bold'}}>close</IconButton>}
            {!editButton && buttons}
          </Container>
        </Column>}
      </Container>
    </DialogTitle>
  )
}

ModalTitle.propTypes = {

}

ModalTitle.defaultProps = {
  edit: false,
  editButton: false,
  closeButton: false
}

export default ModalTitle