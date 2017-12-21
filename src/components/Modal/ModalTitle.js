import React from 'react'
import PropTypes from 'prop-types'
import { DialogTitle } from 'material-ui/Dialog'
import Container, { Column } from 'components/Layout'
import IconButton from 'components/IconButton'

const ModalTitle = ({ edit, editButton, onEditForm, onCloseForm, title }) => {
  return (
    <DialogTitle>
      <Container alignItems="center">
        <Column flex>{title}</Column>
        <Column>
          <Container alignItems="center">
            {!edit && editButton && <IconButton onClick={onEditForm} color="secondary">mode_edit</IconButton>}
            {!edit && <IconButton onClick={onCloseForm} color="error" iconSize={25} style={{fontWeight: 'bold'}}>close</IconButton>}
          </Container>
        </Column>
      </Container>
    </DialogTitle>
  )
}

export default ModalTitle