import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FlexGrid, Button, Icon, Avatar } from 'components'
import Modal, { ModalContent, ModalTitle } from 'components/Modal'
import Divider from '@material-ui/core/Divider'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Typography from '@material-ui/core/Typography'
import { capitalizeFirstLetter } from 'utils/formHelpers'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'

export class BulkValidate extends Component {
  static propTypes = {
    open: PropTypes.bool,
    onConfirmValidate: PropTypes.func,
    onClose: PropTypes.func,
    users: PropTypes.array
  }
  
  state = {
    activeStep: 0,
    selections: {
      scope: null,
      user: null,
      confirm: false
    }
  }
  
  /**
   * Choose between question, jurisdiction, or project
   * @param scope
   */
  handleSelectScope = scope => () => {
    const { selections } = this.state
    
    this.setState({
      selections: {
        ...selections,
        scope
      },
      activeStep: selections.scope === null ? 1 : 0
    })
  }
  
  /**
   * For when the user selects the coder to use as the answers
   * @param user
   * @returns {Function}
   */
  handleSelectUser = user => () => {
    const { selections } = this.state
    this.setState({
      selections: {
        ...selections,
        user
      }
    })
  }
  
  /**
   * For when the user is on the last step of the modal and confirms the bulk validate
   */
  handleConfirmValidate = () => {
    const { onConfirmValidate } = this.props
    this.setState({
      selections: {
        confirm: true
      }
    })
    onConfirmValidate()
  }
  
  /**
   * goes back an active step
   */
  handleGoBackStep = () => {
    const { activeStep } = this.state
    this.setState({
      activeStep: activeStep === 0 ? 0 : activeStep - 1
    })
  }
  
  /**
   * goes back an active step
   */
  handleGoForwardStep = () => {
    const { activeStep } = this.state
    this.setState({
      activeStep: activeStep === 2 ? 2 : activeStep + 1
    })
  }
  
  /**
   * Handles clearing information when closing
   */
  handleClose = () => {
    const { onClose } = this.props
    onClose()
    this.setState({
      activeStep: 0,
      selections: {
        user: null,
        scope: null,
        confirm: false
      }
    })
  }
  
  render() {
    const { open, onConfirmValidate, users } = this.props
    const { activeStep, selections } = this.state
    
    const steps = [
      { label: 'Select Scope', completed: selections.scope !== null },
      { label: 'Select User', completed: selections.user !== null },
      { label: 'Confirm', completed: selections.confirm }
    ]
    
    const scopes = [
      {
        text: 'Validate only the current question. This will copy the selected answer choice or text answer, annotations, ' +
          'and pincites from a user of your choosing and save those as the validated answer for just this question. To ' +
          'validate another question, you\'ll need to navigate to that question and repeat these steps.',
        title: 'Question',
        scope: 'question'
      },
      {
        text: 'Validate all questions in the current jurisdiction. This will copy the selected answer choices or text answer, ' +
          'annotations, and pincites from ONE user every question in this jurisdiction and save that coder\'s data as ' +
          'the validated data respectively. To validate another jurisdiction, you\'ll need to navigate to that' +
          ' jurisdiction and repeat these steps.',
        title: 'Jurisdiction',
        scope: 'jurisdiction'
      },
      {
        text: 'Validate the entire project - every question and every jurisdiction. This will copy the selected answer ' +
          'choices or texts answers, annotations and pincites from ONE user for every question in every jurisdiction and ' +
          'save those as the validated data respectively.',
        title: 'Project',
        scope: 'project'
      }
    ]
    
    return (
      <Modal open={true} onClose={this.handleClose} maxWidth="md" hideOverflow>
        <ModalTitle
          title="Validate"
          buttons={<Button raised={false} color="accent" onClick={this.handleClose}>Close</Button>}
        />
        <Divider />
        <ModalContent style={{ display: 'flex' }}>
          <FlexGrid container flex style={{ height: '100%' }}>
            <FlexGrid container flex padding="10px 0">
              {activeStep === 0 && <FlexGrid container flex type="row">
                {scopes.map((scope, i) => {
                  const isScopeSelected = selections.scope === scope.scope
                  return (
                    <FlexGrid
                      container
                      key={`scope-${i}`}
                      flex
                      padding="20px 10px 10px"
                      style={{
                        width: '33%',
                        borderRight: `${i !== 2 ? 1 : 0}px solid rgba(0, 0, 0, 0.12)`,
                        backgroundColor: isScopeSelected ? `rgba(233, 233, 233, 0.48)` : 'white'
                      }}
                      align="center">
                      <Typography variant="display1" style={{ color: 'black' }}>{scope.title}</Typography>
                      <FlexGrid padding="40px 20px 20px" style={{ height: '40%' }}>
                        <Typography variant="body1" align="center">{scope.text}</Typography>
                      </FlexGrid>
                      {!isScopeSelected && <Button onClick={this.handleSelectScope(scope.scope)}>
                        Select
                      </Button>}
                      {isScopeSelected &&
                      <FlexGrid container type="row" align="center">
                        <Icon color="primary" size={25}>check_circle</Icon>
                        <Typography variant="title" style={{ marginLeft: 4 }}>Selected!</Typography>
                      </FlexGrid>}
                    </FlexGrid>
                  )
                })}
              </FlexGrid>}
              {activeStep === 1 && <FlexGrid container flex padding="20px 10px 10px">
                {/*<Typography variant="headline">Scope: {capitalizeFirstLetter(selections.scope)}</Typography>*/}
                <FlexGrid container style={{ marginTop: 10 }}>
                  <FlexGrid container>
                    <Typography variant="display1" style={{ color: 'black' }}>User</Typography>
                    <Typography style={{ paddingTop: 10, paddingBottom: 40 }} variant="body1">
                      Select the user whose coding information you would like to use as the validated codes.
                    </Typography>
                  </FlexGrid>
                  {users.map((user, i) => {
                    return (
                      <FlexGrid key={`select-user-${i}`} container type="row" padding="10px 20px 10px 0" align="center">
                        <Avatar userId={user.userId} {...user} />
                        <Typography
                          variant="subheading"
                          style={{
                            marginLeft: 10,
                            fontSize: '1.2rem',
                            fontWeight: 300,
                            lineHeight: 'normal'
                          }}>
                          {user.firstName}{' '}{user.lastName}
                        </Typography>
                      </FlexGrid>
                    )
                  })}
                </FlexGrid>
              </FlexGrid>}
              {activeStep === 2 && <FlexGrid container flex type="row">
              </FlexGrid>}
            </FlexGrid>
            <FlexGrid>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map(step => {
                  return (
                    <Step key={step.label} completed={step.completed}>
                      <StepLabel optional={false} disabled={!step.completed}>
                        {step.label}
                      </StepLabel>
                    </Step>
                  )
                })}
              </Stepper>
              <FlexGrid
                container
                type="row"
                align="center"
                justify={activeStep === 1
                  ? 'space-between'
                  : activeStep === 0
                    ? 'flex-end'
                    : 'flex-start'}>
                {activeStep !== 0 && <Button onClick={this.handleGoBackStep}>Back</Button>}
                {(activeStep !== 2 && steps[activeStep].completed) &&
                <Button onClick={this.handleGoForwardStep}>Next</Button>}
              </FlexGrid>
            </FlexGrid>
          </FlexGrid>
        </ModalContent>
      </Modal>
    )
  }
}

export default BulkValidate
