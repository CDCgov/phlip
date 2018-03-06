import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Container, { Column, Row } from 'components/Layout'
import RadioGroup from 'components/SelectionControls/RadioGroup'
import SimpleInput from 'components/SimpleInput'
import Button from 'components/Button'
import Icon from 'components/Icon'
import IconButton from 'components/IconButton'
import { TableBody, TableHead } from 'material-ui/Table'
import Table from 'components/Table'
import TableRow from 'components/TableRow'
import TableCell from 'components/TableCell'
import Popover from './components/Popover'
import { updater } from 'utils'

const getFlagText = (color, text) => (
  <Row displayFlex style={{ alignItems: 'center' }}>
    <Icon color={color} style={{ paddingRight: 5 }}>flag</Icon>
    <span>{text}</span>
  </Row>
)

const checkForSameType = (userType, choiceType) => userType !== 0 ? userType !== choiceType : false

const checkForRedFlag = (questionFlags, user) => questionFlags.filter(flag => flag.raisedBy.userId === user.id)

const redFlagColor = '#d90525'

export class FlagPopover extends Component {
  static defaultProps = {
    userFlag: {
      notes: '',
      type: 0
    },
    questionFlags: []
  }

  static propTypes = {
    userFlag: PropTypes.object,
    questionFlags: PropTypes.array,
    onSaveFlag: PropTypes.func
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      redFlagOpen: false,
      otherFlagOpen: false,
      updatedFlag: { ...props.userFlag },
      questionFlags: [...props.questionFlags],
      userRedFlag: checkForRedFlag(props.questionFlags, props.user)[0] || { notes: null, type: 3 },
      inEditMode: false,
      helperText: ''
    }

    this.userFlagColors = {
      1: {
        type: 1,
        color: '#2cad73',
        text: getFlagText('#2cad73', 'Flag for analysis'),
        disabled: checkForSameType(props.userFlag.type, 1)
      },
      2: {
        type: 2,
        color: '#fca63a',
        text: getFlagText('#fca63a', 'Notify coordinator'),
        disabled: checkForSameType(props.userFlag.type, 2)
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      updatedFlag: { ...nextProps.userFlag },
      questionFlags: [...nextProps.questionFlags],
      userRedFlag: checkForRedFlag(nextProps.questionFlags, nextProps.user)[0] || { notes: null, type: 3 }
    })

    for (let type in this.userFlagColors) {
      this.userFlagColors[type] = {
        ...this.userFlagColors[type],
        disabled: checkForSameType(nextProps.userFlag.type, type)
      }
    }
  }

  onOpenRedPopover = () => {
    this.setState({
      redFlagOpen: !this.state.redFlagOpen,
      otherFlagOpen: false
    })
  }

  onCloseRedPopover = () => {
    this.setState({
      redFlagOpen: false,
      inEditMode: false,
      helperText: ''
    })
  }

  onSaveRedPopover = e => {
    e.preventDefault()
    this.props.onSaveFlag(this.state.userRedFlag)
    this.setState({
      inEditMode: false,
      helperText: ''
    })
  }

  checkNotes = e => {
    if (e.target.value === '') {
      this.setState({
        helperText: 'Required'
      })
    }
  }

  onUpdateRedFlagNotes = event => {
    this.setState({
      userRedFlag: {
        ...this.state.userRedFlag,
        notes: event.target.value
      }
    })
  }

  toggleEditMode = () => {
    this.setState({
      inEditMode: !this.state.inEditMode,
      userRedFlag: this.state.userRedFlag.notes === null ? { notes: '', type: 3 } : this.state.userRedFlag,
      helperText: ''
    })
  }

  onOpenOtherPopover = () => {
    this.setState({
      redFlagOpen: false,
      otherFlagOpen: !this.state.otherFlagOpen,
      helperText: ''
    })
  }

  onCloseOtherPopover = () => {
    this.setState({
      otherFlagOpen: false,
      updatedFlag: this.props.userFlag,
      helperText: ''
    })
  }

  onSaveOtherPopover = e => {
    e.preventDefault()
    this.props.onSaveFlag(this.state.updatedFlag)
    this.setState({
      otherFlagOpen: false,
      helperText: ''
    })
  }

  onChangeFlagType = type => value => {
    this.setState({
      updatedFlag: {
        ...this.state.updatedFlag,
        type
      }
    })
  }

  onChangeFlagNotes = event => {
    const currentFlag = { ...this.state.updatedFlag }
    this.setState({
      updatedFlag: {
        ...currentFlag,
        notes: event.target.value
      }
    })
  }

  render() {
    return (
      <Container style={{ width: 'unset', height: 24 }}>
        <Popover
          title="Red Flags"
          open={this.state.redFlagOpen}
          targetIcon="report"
          targetColor={this.props.questionFlags.length > 0 ? redFlagColor : '#d7e0e4'}
          targetStyle={{ paddingRight: 15, paddingLeft: 15 }}
          onOpen={this.onOpenRedPopover}
          onClose={this.onCloseRedPopover}
        >
          <Container column style={{ minWidth: 450, minHeight: 200, alignItems: 'center', paddingTop: 10 }}>
            {(this.props.questionFlags.length > 0 && !this.state.inEditMode) &&
            <Table style={{ width: '90%', width: 580, margin: '10px 16px' }}>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">Raised By</TableCell>
                  <TableCell padding="checkbox">Notes</TableCell>
                  {this.state.userRedFlag.notes !== null && <TableCell padding="checkbox">Edit</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.questionFlags.map((flag, index) => (
                  <TableRow key={`red-flag-${index}`}>
                    <TableCell padding="checkbox">{`${flag.raisedBy.firstName} ${flag.raisedBy.lastName}`}</TableCell>
                    <TableCell padding="checkbox">{flag.notes}</TableCell>
                    {flag.raisedBy.userId === this.props.user.id &&
                    <TableCell padding="checkbox">
                      <IconButton onClick={this.toggleEditMode} color="#5f6060">edit</IconButton></TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>}
            {!this.state.inEditMode && this.state.questionFlags.length === 0 &&
            <Row displayFlex flex style={{ alignItems: 'center' }}><Button
              onClick={this.toggleEditMode}
              color="accent"
              value="+ Add Red Flag"
            /></Row>}
            {this.state.inEditMode &&
            <form onSubmit={this.onSaveRedPopover} style={{ alignSelf: 'stretch', flex: 1, width: 580 }}>
              <Row style={{ padding: 16 }}>
                <SimpleInput
                  value={this.state.userRedFlag.notes}
                  onChange={this.onUpdateRedFlagNotes}
                  shrinkLabel={true}
                  id="flag-notes"
                  onBlur={this.checkNotes}
                  required
                  error={this.state.helperText !== ''}
                  label="Notes"
                  helperText={this.state.helperText}
                  placeholder="Enter Notes"
                  multiline={false}
                  type="text"
                />
              </Row>
            </form>}
            <Row displayFlex style={{ alignSelf: 'flex-end', padding: 16 }}>
              <Button
                onClick={this.state.inEditMode ? this.toggleEditMode : this.onCloseRedPopover}
                raised={false}
                color="accent"
                value="Cancel"
              />
              {this.state.inEditMode &&
              <Button
                type="submit"
                onClick={this.onSaveRedPopover}
                raised={false}
                color="accent"
                value="Save"
                disabled={this.state.userRedFlag.notes === ''}
              />}
            </Row>
          </Container>
        </Popover>
        {this.state.questionFlags.length === 0 && <Popover
          title="Flags"
          open={this.state.otherFlagOpen}
          targetIcon="flag"
          targetColor={this.props.userFlag.type !== 0
            ? this.userFlagColors[this.props.userFlag.type].color
            : '#d7e0e4'}
          onOpen={this.onOpenOtherPopover}
          onClose={this.onCloseOtherPopover}
        >
          <form onSubmit={this.onSaveOtherPopover}>
            <Row style={{ padding: 16, minWidth: 450 }}>
              <RadioGroup
                selected={this.state.updatedFlag.type}
                choices={Object.values(this.userFlagColors)}
                onChange={this.onChangeFlagType}
                required
                error={this.state.touched && this.state.updatedFlag.type === 0}
                helperText="Required"
              />
            </Row>
            <Row style={{ padding: 16 }}>
              <SimpleInput
                value={this.state.updatedFlag.notes}
                onChange={this.onChangeFlagNotes}
                shrinkLabel={true}
                id="flag-notes"
                label="Notes"
                required
                error={this.state.helperText !== ''}
                onBlur={this.checkNotes}
                helperText={this.state.helperText}
                placeholder="Enter Notes"
                multiline={false}
                type="text"
              />
            </Row>
            <Row displayFlex style={{ justifyContent: 'flex-end', padding: 16 }}>
              <Button type="button" onClick={this.onCloseOtherPopover} raised={false} color="accent" value="Cancel" />
              <Button
                type="submit"
                onClick={this.onSaveOtherPopover}
                raised={false}
                color="accent"
                value="Save"
                disabled={this.state.updatedFlag.notes === '' || this.state.updatedFlag.type === 0}
              />
            </Row>
          </form>
        </Popover>}
      </Container>
    )
  }
}

export default FlagPopover