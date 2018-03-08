import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import { Route } from 'react-router-dom'
import Modal, { ModalTitle, ModalContent, ModalActions } from 'components/Modal'
import Button from 'components/Button'
import Container, { Column } from 'components/Layout'
import JurisdictionList from './components/JurisdictionList'
import * as actions from './actions'
import JurisdictionForm from './components/JurisdictionForm'
import { normalize } from 'utils'
import Divider from 'material-ui/Divider'
import Typography from 'material-ui/Typography'
import TextLink from 'components/TextLink'

export class AddEditJurisdictions extends Component {
  static propTypes = {
    project: PropTypes.object,
    visibleJurisdictions: PropTypes.array,
    searchValue: PropTypes.string,
    history: PropTypes.object,
    actions: PropTypes.object
  }

  constructor(props, context) {
    super(props, context)
  }

  componentWillMount() {
    this.props.actions.getProjectJurisdictions(this.props.project.id)
  }

  onCloseModal = () => {
    this.props.actions.clearJurisdictions()
    this.props.history.push('/')
  }

  getButton = () => {
    return (
      <TextLink to={`/project/${this.props.project.id}/jurisdictions/add`} state={{}}>
        <Button value="+ Add Jurisdiction" color="accent" />
      </TextLink>
    )
  }

  render() {
    return (
      <Modal onClose={this.onCloseModal} open={true} maxWidth="md" hideOverflow>
        <ModalTitle
          title={
            <Typography type="title">
              <span style={{ paddingRight: 10 }}>Jurisdictions</span>
              <span style={{ color: '#0faee6' }}>{this.props.project.name}</span>
            </Typography>
          }
          buttons={this.getButton()}
          editButton={false}
          closeButton={false}
          onCloseForm={this.onCloseModal}
          search
          SearchBarProps={{
            searchValue: this.props.searchValue,
            handleSearchValueChange: (event) => this.props.actions.updateSearchValue(event.target.value),
            placeholder: 'Search',
            style: { paddingRight: 10 }
          }}
        />
        <Divider />
        <ModalContent style={{ display: 'flex', flexDirection: 'column' }}>
          <Container flex style={{ marginTop: 20 }}>
            <Column flex displayFlex style={{ overflowX: 'auto' }}>
              <JurisdictionList jurisdictions={this.props.visibleJurisdictions} projectId={this.props.project.id} />
            </Column>
          </Container>
        </ModalContent>
        <ModalActions actions={[{ value: 'Close', onClick: this.onCloseModal, type: 'button' }]} />
        <Route path="/project/:id/jurisdictions/add" component={JurisdictionForm} />
        <Route path="/project/:id/jurisdictions/:jid/edit" component={JurisdictionForm} />
      </Modal>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  project: state.scenes.home.main.projects.byId[ownProps.match.params.id],
  visibleJurisdictions: state.scenes.home.addEditJurisdictions.visibleJurisdictions || []
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddEditJurisdictions))