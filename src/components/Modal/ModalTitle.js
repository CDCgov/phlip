import React from 'react'
import PropTypes from 'prop-types'
import { DialogTitle } from 'material-ui/Dialog'
import Container, { Column, Row } from 'components/Layout'
import SearchBar from 'components/SearchBar'

const ModalTitle = ({ onCloseForm, title, search, buttons, SearchBarProps, style }) => {
  return (
    <DialogTitle style={style}>
      <Container alignItems="center">
        <Row flex displayFlex style={{ alignItems: 'center' }}>{title}</Row>
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