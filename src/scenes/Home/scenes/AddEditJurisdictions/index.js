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
import Divider from 'material-ui/Divider'
import Typography from 'material-ui/Typography'
import TextLink from 'components/TextLink'
import ApiErrorView from 'components/ApiErrorView'
import { withTheme } from 'material-ui/styles'

export class AddEditJurisdictions extends Component {
  static propTypes = {
    project: PropTypes.object,
    visibleJurisdictions: PropTypes.array,
    searchValue: PropTypes.string,
    history: PropTypes.object,
    actions: PropTypes.object,
    theme: PropTypes.object
  }

  constructor(props, context) {
    super(props, context)
  }

  componentWillMount() {
    this.props.actions.getProjectJurisdictions(this.props.project.id)
  }

  onCloseModal = () => {
    this.props.history.push('/home')
  }

  componentWillUnmount() {
    this.props.actions.clearJurisdictions()
  }

  getButton = () => {
    return (
      <Fragment>
        <div style={{ marginRight: 10 }}>
          <TextLink to={{ pathname: `/project/${this.props.project.id}/jurisdictions/add`, state: { preset: true } }}>
            <Button value="Load Preset" color="accent" aria-label="Load preset" />
          </TextLink>
        </div>
        <div>
          <TextLink to={{ pathname: `/project/${this.props.project.id}/jurisdictions/add`, state: { preset: false } }}>
            <Button value="+ Add Jurisdiction" color="accent" aria-label="Add jurisidiction to project" />
          </TextLink>
        </div>
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
              <span style={{ color: this.props.theme.palette.secondary.main }}>{this.props.project.name}</span>
            </Typography>
          }
          buttons={this.props.error === true ? [] : this.getButton()}
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
                ? <ApiErrorView error={this.props.errorContent} />
                : <JurisdictionList
                  jurisdictions={this.props.visibleJurisdictions}
                  projectId={this.props.project.id} />}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTheme()(AddEditJurisdictions)))