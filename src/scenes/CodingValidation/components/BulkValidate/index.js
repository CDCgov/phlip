import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FlexGrid, Button, Icon, Avatar, RadioButtonLabel, CircularLoader } from 'components'
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

export class BulkValidate extends Component {
  static propTypes = {
    open: PropTypes.bool,
    onConfirmValidate: PropTypes.func,
    onClose: PropTypes.func,
    users: PropTypes.array,
    validationInProgress: PropTypes.bool
  }
  
  state = {
    activeStep: 0,
    selections: {
      scope: null,
      user: null,
      confirm: false
    }
  }
  
  componentDidUpdate(prevProps) {
    const { open } = this.props
    if (prevProps.open && !open) {
      this.setState({
        selections: {
          scope: null,
          user: null,
          confirm: false
        },
        activeStep: 0
      })
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
        user: {
          ...user,
          username: `${user.firstName} ${user.lastName}`
        }
      },
      activeStep: selections.user === null ? 2 : 1
    })
  }
  
  /**
   * For when the user is on the last step of the modal and confirms the bulk validate
   */
  handleConfirmValidate = () => {
    const { onConfirmValidate, validationInProgress } = this.props
    const { selections } = this.state
    
    if (!validationInProgress) {
      this.setState({
        selections: {
          ...selections,
          confirm: true
        }
      })
      onConfirmValidate(selections.scope, selections.user)
    }
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
    const { open, users, validationInProgress } = this.props
    const { activeStep, selections } = this.state
    
    const steps = [
      { label: 'Select Scope', completed: selections.scope !== null },
      { label: 'Select User', completed: selections.user !== null },
      { label: 'Confirm', completed: selections.confirm }
    ]
    
    const scopes = [
      {
        text: [
          'Validate only the current question',
          'just this question',
          'To validate another question, you’ll need to navigate to that question and repeat these steps.'
        ],
        title: 'Question',
        scope: 'question'
      },
      {
        text: [
          'Validate all questions in the current jurisdiction.',
          'every question in this jurisdiction',
          'To validate another jurisdiction, you’ll need to navigate to that jurisdiction and repeat these steps.'
        ],
        title: 'Jurisdiction',
        scope: 'jurisdiction'
      },
      {
        text: [
          'Validate every question and jurisdiction in the current project',
          'every question in every jurisdiction'
        ],
        title: 'Project',
        scope: 'project'
      }
    ]
    
    return (
      <Modal open={open} onClose={this.handleClose} maxWidth="md" hideOverflow>
        <ModalTitle
          title="Validate"
          buttons={<Button
            raised={false}
            color="accent"
            disabled={validationInProgress}
            onClick={this.handleClose}>
            Close
          </Button>}
        />
        <Divider />
        <ModalContent style={{ display: 'flex', padding: 0 }}>
          <FlexGrid container flex style={{ height: '100%' }}>
            <FlexGrid container flex padding="10px 24px">
              {activeStep === 0 &&
              <FlexGrid container flex type="column">
                {scopes.map((scope, i) => {
                  const isScopeSelected = selections.scope === scope.scope
                  return (
                    <FlexGrid
                      container
                      type="row"
                      key={`scope-${i}`}
                      flex
                      padding="20px 10px 10px"
                      style={{
                        height: '33%',
                        borderBottom: `${i !== 2 ? 1 : 0}px solid rgba(0, 0, 0, 0.12)`,
                        backgroundColor: isScopeSelected ? `rgba(233, 233, 233, 0.48)` : 'white'
                      }}
                      align="center">
                      <FlexGrid padding="0  20px 20px" container justify="space-evenly" style={{ height: '100%' }}>
                        <Typography variant="display1" style={{ color: 'black' }}>{scope.title}</Typography>
                        <Typography variant="body1">{scope.text[0]}</Typography>
                        <Typography variant="body1">
                          You will select one user. Their answer choices or text answers, annotations, and pincites will
                          be copied and saved as the validated answers for <strong>{scope.text[1]}</strong>.
                        </Typography>
                        {scope.text[2] && <Typography variant="body1">{scope.text[2]}</Typography>}
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
              {activeStep === 1 && <FlexGrid container flex padding="20px 30px 30px">
                <FlexGrid container padding="2px 0 0">
                  <FlexGrid container>
                    <Typography variant="display1" style={{ color: 'black' }}>User</Typography>
                    <Typography style={{ paddingTop: 7, paddingBottom: 15 }} variant="body1">
                      Select the user whose coding data you would like to use as the validated codes.
                    </Typography>
                  </FlexGrid>
                  <List>
                    {users.map((user, i) => {
                      const isUserSelected = selections.user !== null && selections.user.userId === user.userId
                      return (
                        <ListItem
                          button
                          key={`select-user-${i}`}
                          style={{
                            padding: 10,
                            backgroundColor: isUserSelected ? `rgba(233, 233, 233, 0.48)` : ''
                          }}
                          onClick={this.handleSelectUser(user)}>
                          <ListItemAvatar>
                            <Avatar userId={user.userId} />
                          </ListItemAvatar>
                          <ListItemText
                            style={{ padding: 0 }}
                            primaryTypographyProps={{
                              variant: 'subheading',
                              style: {
                                marginLeft: 10,
                                fontSize: '1.2rem',
                                fontWeight: 300,
                                lineHeight: 'normal'
                              }
                            }}
                            primary={`${user.firstName}${' '}${user.lastName}`}
                          />
                          <RadioButtonLabel
                            checked={isUserSelected}
                            onChange={this.handleSelectUser(user)}
                            labelStyle={{
                              width: 24, height: 24
                            }}
                          />
                        </ListItem>
                      )
                    })}
                  </List>
                </FlexGrid>
              </FlexGrid>}
              {activeStep === 2 && <FlexGrid container flex padding="20px 30px 10px">
                <FlexGrid container style={{ marginBottom: 35 }}>
                  <Typography variant="display1" style={{ color: 'black' }}>Confirmation</Typography>
                  <FlexGrid padding="15px 0 0">
                    <Typography variant="headline">Scope: {capitalizeFirstLetter(selections.scope)}</Typography>
                    <Typography variant="headline">
                      User: {selections.user.username}
                    </Typography>
                  </FlexGrid>
                  <Typography variant="body1" style={{ paddingTop: 15, marginBottom: 10 }}>
                    You are going to validate this <strong>{selections.scope}</strong> using the coding data from{' '}
                    <strong>{selections.user.username}</strong>.{' '}
                    {selections.scope === 'question' &&
                    `If ${selections.user.firstName} has not coded this question, the current validated answer will not change.`}
                    {selections.scope !== 'question' &&
                    `${selections.user.firstName}'s coding data will be used to validate every question they have coded within this ${selections.scope}.
                     For questions that ${selections.user.firstName} has not modified or coded, the current validated answers will remain the same.`}
                  </Typography>
                  <Typography variant="body1">
                    If you would like to select a different scope or user, use the 'Back' button at the bottom of this
                    modal to navigate to different steps.
                  </Typography>
                </FlexGrid>
                <FlexGrid
                  padding={15}
                  container
                  style={{ backgroundColor: 'rgba(202, 80, 114, 0.27)', marginBottom: 45 }}>
                  <FlexGrid container type="row" align="center">
                    <Icon color="error" size={25}>warning</Icon>
                    <Typography variant="title" style={{ marginLeft: 4 }}>WARNING</Typography>
                  </FlexGrid>
                  <Typography variant="body1" style={{ paddingTop: 10 }}>
                    This will <strong>overwrite all</strong> current validated answers, annotations, comments, and pincites
                    for questions that {selections.user.username} has coded. There is no ‘UNDO’ option for this action.
                  </Typography>
                </FlexGrid>
                <FlexGrid justify="center" container type="row">
                  <Button
                    disabled={validationInProgress}
                    style={{ color: validationInProgress ? 'rgb(61, 49, 106)' : 'white' }}
                    color="primary"
                    onClick={this.handleConfirmValidate}>
                    <span style={{ marginRight: 4 }}>Validate</span>
                    {validationInProgress && <CircularLoader style={{ height: 15, width: 15 }} />}
                  </Button>
                </FlexGrid>
              </FlexGrid>}
            </FlexGrid>
            <FlexGrid container>
              <Stepper activeStep={activeStep} alternativeLabel style={{ paddingBottom: 15 }}>
                {steps.map((step, i) => {
                  const isActive = activeStep === i
                  return (
                    <Step key={step.label} completed={step.completed && !isActive} active={isActive} disabled={!isActive}>
                      <StepLabel optional={false} disabled={!isActive}>
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
                padding="0px 24px 24px"
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
