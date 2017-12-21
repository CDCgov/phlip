import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Modal, { ModalTitle, ModalContent, ModalActions } from 'components/Modal'
import { withRouter } from 'react-router'
import SearchBar from 'components/SearchBar'
import Button from 'components/Button'
import Container from 'components/Layout'

export class AddEditJurisdictions extends Component {
  constructor(props, context) {
    super(props, context)
  }

  onCloseModal = () => {
    this.props.history.goBack()
  }

  getButton = () => <Button value="+ Add Jurisdiction" color="accent" />

  render() {
    return (
      <Modal onClose={this.onCloseModal} open={true}>
        <ModalTitle title="Jurisdictions" buttons={this.getButton()} />
        <ModalContent style={{ minWidth: 550, minHeight: 230 }}>
          <SearchBar />
        </ModalContent>
      </Modal>
    )
  }
}

export default withRouter(AddEditJurisdictions)
