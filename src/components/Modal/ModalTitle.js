import React from 'react'
import PropTypes from 'prop-types'
import { DialogTitle } from 'material-ui/Dialog'
import Container, { Column, Row } from 'components/Layout'
import IconButton from 'components/IconButton'
import SearchBar from 'components/SearchBar'

const ModalTitle = ({ edit, closeButton, onCloseForm, buttons, title, search, SearchBarProps }) => {
  return (
    <DialogTitle>
      <Container alignItems="center">
        <Column flex>{title}</Column>
        {(buttons || closeButton || search) &&
        <Row displayFlex style={{ alignItems: 'center' }}>
          {search &&
            <Column style={{ paddingRight: 5 }}><SearchBar {...SearchBarProps} /></Column>
          }
          {Boolean(buttons || closeButton) &&
          <Column>
              <Container alignItems="center">
                {!edit && closeButton &&
                <IconButton onClick={onCloseForm} color="error" iconSize={25}
                            style={{ fontWeight: 'bold' }}>close</IconButton>
                }
                {buttons}
                </Container>
              </Column>
          }
        </Row>
        }
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