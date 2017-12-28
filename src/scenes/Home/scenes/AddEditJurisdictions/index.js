import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import Modal, { ModalTitle, ModalContent, ModalActions } from 'components/Modal'
import SearchBar from 'components/SearchBar'
import Button from 'components/Button'
import Container, { Column } from 'components/Layout'
import Card from 'components/Card'
import JurisdictionList from './components/JurisdictionList'
import * as actions from '../../actions'

export class AddEditJurisdictions extends Component {
  constructor (props, context) {
    super(props, context)
  }

  onCloseModal = () => {
    this.props.history.goBack()
  }

  getButton = () => <Button value="+ Add Jurisdiction" color="accent" />

  render () {
    return (
      <Modal onClose={this.onCloseModal} open={true} maxWidth="md">
        <ModalTitle title="Jurisdictions" buttons={this.getButton()} />
        <ModalContent style={{ minWidth: 550, minHeight: 500, display: 'flex', flexDirection: 'column' }}>
          <Container>
            <SearchBar />
          </Container>
          <Container flex style={{ marginTop: 20 }}>
            <Column flex displayFlex style={{ overflowX: 'auto' }} component={<Card />}>
              <JurisdictionList jurisdictions={this.props.project.jurisdictions} />
            </Column>
          </Container>
        </ModalContent>
      </Modal>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  project: state.scenes.home.main.projects.byId[ownProps.match.params.id]
})

const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })

AddEditJurisdictions.propTypes = {}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddEditJurisdictions))
