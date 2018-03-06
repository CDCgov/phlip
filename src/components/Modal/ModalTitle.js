import React from 'react'
import PropTypes from 'prop-types'
import { DialogTitle } from 'material-ui/Dialog'
import Container, { Column, Row } from 'components/Layout'
import SearchBar from 'components/SearchBar'

const ModalTitle = ({ onCloseForm, title, search, buttons, SearchBarProps }) => {
  return (
    <DialogTitle>
      <Container alignItems="center">
        <Column flex>{title}</Column>
        {(buttons || search) &&
        <Row displayFlex style={{ alignItems: 'center' }}>
          {search &&
          <Column style={{ paddingRight: 5 }}><SearchBar {...SearchBarProps} /></Column>
          }
          {buttons &&
          <Column>
            <Container alignItems="center">
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