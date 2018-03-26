import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import { Route } from 'react-router-dom'
import Modal, { ModalTitle, ModalContent, ModalActions } from 'components/Modal'
import Button from 'components/Button'
import Container, { Column, Row } from 'components/Layout'
import JurisdictionList from './components/JurisdictionList'
import * as actions from './actions'
import JurisdictionForm from './components/JurisdictionForm'
import Divider from 'material-ui/Divider'
import Typography from 'material-ui/Typography'
import TextLink from 'components/TextLink'
import Icon from 'components/Icon'

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
        <Button value="+ Add Jurisdiction" color="accent" aria-label="Add jurisidiction to project" />
      </TextLink>
    )
  }

  renderError = () => {
    return (
      <Fragment>
        <Row displayFlex style={{ justifyContent: 'center' }}>
          <Icon size={175} color="#757575">
            sentiment_very_dissatisfied
          </Icon>
        </Row>
        <Row displayFlex style={{ justifyContent: 'center' }}>
          <Typography type="display2" style={{ textAlign: 'center' }}>
            {this.props.errorContent}
          </Typography>
        </Row>
      </Fragment>
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
          buttons={this.props.error === true ? [] : this.getButton()}
          onCloseForm={this.onCloseModal}
          search
          SearchBarProps={{
            searchValue: this.props.searchValue,
            handleSearchValueChange: (event) => this.props.actions.updateSearchValue(event.target.value),
            placeholder: 'Search',
            style: { paddingRight: 10 }
          }} />
        <Divider />
        <ModalContent style={{ display: 'flex', flexDirection: 'column' }}>
          <Container flex style={{ marginTop: 20 }}>
            <Column flex displayFlex style={{ overflowX: 'auto' }}>
              {this.props.error === true
                ? this.renderError()
                : <JurisdictionList jurisdictions={this.props.visibleJurisdictions} projectId={this.props.project.id} />}
            </Column>
          </Container>
        </ModalContent>
        <ModalActions
          actions={[
            {
              value: 'Close',
              onClick: this.onCloseModal,
              type: 'button',
              otherProps: { 'aria-label': 'Close modal' }
            }
          ]} />
        <Route path="/project/:id/jurisdictions/add" component={JurisdictionForm} />
        <Route path="/project/:id/jurisdictions/:jid/edit" component={JurisdictionForm} />
      </Modal>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  project: state.scenes.home.main.projects.byId[ownProps.match.params.id],
  visibleJurisdictions: state.scenes.home.addEditJurisdictions.visibleJurisdictions || [],
  error: state.scenes.home.addEditJurisdictions.error || false,
  errorContent: state.scenes.home.addEditJurisdictions.errorContent || ''
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddEditJurisdictions))