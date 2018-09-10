import React from 'react'
import PropTypes from 'prop-types'
import DialogTitle from '@material-ui/core/DialogTitle'
import Container, { Column, Row } from 'components/Layout'
import SearchBar from 'components/SearchBar'

/**
 * Wrapper for @material-ui/core's DialogTitle component. Will render at the top of the modal
 */
export const ModalTitle = ({ title, search, buttons, SearchBarProps, style }) => {
  return (
    <DialogTitle style={style}>
      <Container alignItems="center">
        <Row flex displayFlex style={{ alignItems: 'center' }}>{title}</Row>
        {(buttons || search) &&
        <Row displayFlex style={{ alignItems: 'center' }}>
          {search && <Column style={{ paddingRight: 5 }}><SearchBar {...SearchBarProps} /></Column>}
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

ModalTitle.propTypes = {
  /**
   * What the actual title should be
   */
  title: PropTypes.any,
  /**
   * Whether or not to include a search bar in the title
   */
  search: PropTypes.bool,
  /**
   * Props to be applied to the SearchBar component, if applicable
   */
  SearchBarProps: PropTypes.object,
  /**
   * Buttons to put in the title
   */
  buttons: PropTypes.any,
  /**
   * Override any default style of modal title
   */
  style: PropTypes.object
}

ModalTitle.defaultProps = {}

export default ModalTitle