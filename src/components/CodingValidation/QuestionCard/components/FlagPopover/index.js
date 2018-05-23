import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Container, { Row } from 'components/Layout'
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
import { Flag, AlertOctagon } from 'mdi-material-ui'
import styles from '../../card-styles.scss'
import classNames from 'classnames'

const getFlagText = (color, text, disabled) => (
  <Row displayFlex style={{ alignItems: 'center' }}>
    <Icon color={disabled ? '#bdbdbd' : color} style={{ paddingRight: 5 }}>flag</Icon>
    <span style={{ color: disabled ? '#bdbdbd' : 'black' }}>{text}</span>
  </Row>
)

const checkForRedFlag = (questionFlags, user) => questionFlags.filter(flag => flag.raisedBy.userId === user.id)
const redFlagColor = '#D50000'

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
      userRedFlag: checkForRedFlag(props.questionFlags, props.user)[0] || { notes: '', type: 3 },
      inEditMode: props.questionFlags.length === 0,
      helperText: '',
      choiceHelperText: ''
    }

    this.userFlagColors = {
      1: {
        type: 1,
        color: '#2E7D32',
        label: 'Flag for analysis',
        text: getFlagText('#2E7D32', 'Flag for analysis', this.state.questionFlags.length > 0),
        disabled: this.state.questionFlags.length > 0 || this.props.disableAll
      },
      2: {
        type: 2,
        color: '#CE4A00',
        label: 'Notify Coordinator',
        text: getFlagText('#CE4A00', 'Notify coordinator', this.state.questionFlags.length > 0),
        disabled: this.state.questionFlags.length > 0 || this.props.disableAll
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      updatedFlag: { ...nextProps.userFlag },
      questionFlags: [...nextProps.questionFlags],
      userRedFlag: checkForRedFlag(nextProps.questionFlags, nextProps.user)[0] || { notes: '', type: 3 },
      inEditMode: nextProps.questionFlags.length === 0
    })

    for (let type in this.userFlagColors) {
      this.userFlagColors[type] = {
        ...this.userFlagColors[type],
        text: getFlagText(this.userFlagColors[type].color, this.userFlagColors[type].label, nextProps.questionFlags.length >
          0),
        disabled: nextProps.questionFlags.length > 0 || this.props.disableAll
      }
    }
  }

  onOpenRedPopover = () => {
    this.setState({
      redFlagOpen: !this.state.redFlagOpen,
      otherFlagOpen: false,
      helperText: '',
      inEditMode: this.state.questionFlags.length === 0,
      userRedFlag: checkForRedFlag(this.props.questionFlags, this.props.user)[0] || { notes: '', type: 3 }
    })
  }

  onCloseRedPopover = () => {
    this.setState({
      redFlagOpen: false,
      helperText: ''
    })
  }

  onSaveRedPopover = e => {
    e.preventDefault()
    if (this.state.userRedFlag.notes.length === 0) {
      this.setState({
        helperText: 'Required'
      })
    } else {
      this.props.onSaveFlag(this.state.userRedFlag)
      this.setState({
        inEditMode: false,
        helperText: ''
      })
    }
  }

  checkNotes = e => {
    if (e.target.value === '') {
      this.setState({
        helperText: 'Required'
      })
    } else {
      this.setState({
        helperText: ''
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
      helperText: '',
      choiceHelperText: ''
    })
  }

  onSaveOtherPopover = e => {
    e.preventDefault()
    if (this.state.updatedFlag.type === 0 || this.state.updatedFlag.notes === '') {
      this.setState({
        helperText: this.state.updatedFlag.notes === '' ? 'Required' : '',
        choiceHelperText: this.state.updatedFlag.type === 0 ? 'Required' : ''
      })
    } else {
      this.props.onSaveFlag(this.state.updatedFlag)
      this.setState({
        otherFlagOpen: false,
        helperText: '',
        choiceHelperText: ''
      })
    }
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
          title="Stop Coding This Question"
          open={this.state.redFlagOpen}
          target={{
            icon: <AlertOctagon
              className={
                classNames({
                  [styles.icon]: this.props.questionFlags.length === 0,
                  [styles.stopIconFlag]: this.props.questionFlags.length > 0
                })
              } />,
            style: { paddingRight: 15, paddingLeft: 15, maxHeight: 500 },
            tooltip: 'Stop coding this question',
            id: 'stop-coding-question'
          }}
          onOpen={this.onOpenRedPopover}
          onClose={this.onCloseRedPopover}>
          <Container
            column
            style={{
              minWidth: 450,
              minHeight: 200,
              maxHeight: 500,
              alignItems: 'center',
              flexWrap: 'nowrap',
              paddingTop: 10,
            }}>
            {(this.props.questionFlags.length > 0 && !this.state.inEditMode) &&
            <div style={{ overflow: 'auto' }}>
              <Table style={{ width: '90%', maxWidth: 500, margin: '10px 16px' }}>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox" style={{ maxWidth: 150, width: 150 }}>Raised By</TableCell>
                    <TableCell
                      padding="checkbox">Notes</TableCell>
                    {this.state.questionFlags[0].raisedBy.userId === this.props.user.id &&
                    <TableCell padding="checkbox" style={{ width: 48, paddingRight: 12 }}>Edit</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.questionFlags.map((flag, index) => (
                    <TableRow key={`red-flag-${index}`}>
                      <TableCell
                        padding="checkbox" style={{
                        maxWidth: 150,
                        width: 150
                      }}>{`${flag.raisedBy.firstName} ${flag.raisedBy.lastName}`}</TableCell>
                      <TableCell
                        padding="checkbox"
                        style={{ maxWidth: 300, wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                        {flag.notes}
                      </TableCell>
                      {flag.raisedBy.userId === this.props.user.id &&
                      <TableCell padding="checkbox" style={{ width: 48, paddingRight: 12 }}>
                        <IconButton onClick={this.toggleEditMode} color="#5f6060">edit</IconButton></TableCell>}
                    </TableRow>
                  ))}
                </TableBody>
              </Table></div>}
            {this.state.inEditMode &&
            <form onSubmit={this.onSaveRedPopover} style={{ alignSelf: 'stretch', flex: 1, width: 580 }}>
              <Row style={{ padding: 16 }}>
                <SimpleInput
                  value={this.state.userRedFlag.notes}
                  onChange={this.onUpdateRedFlagNotes}
                  shrinkLabel={true}
                  id="flag-notes"
                  onBlur={this.checkNotes}
                  error={this.state.helperText !== ''}
                  label="Notes"
                  required
                  helperText={this.state.helperText}
                  placeholder="Enter Notes"
                  multiline={false}
                  type="text" />
              </Row>
            </form>}
            <Row displayFlex style={{ alignSelf: 'flex-end', padding: 16 }}>
              <Button
                onClick={this.onCloseRedPopover}
                raised={false}
                color="accent"
                value={this.state.inEditMode ? 'Cancel' : 'Close'} />
              {this.state.inEditMode &&
              <Button
                type="submit"
                onClick={this.onSaveRedPopover}
                raised={false}
                color="accent"
                value="Save" />}
            </Row>
          </Container>
        </Popover>
        <Popover
          title="Flags"
          open={this.state.otherFlagOpen}
          target={{
            icon: <Flag
              className={classNames({
                [styles.icon]: this.props.userFlag.type === 0,
                [styles.greenFlagIcon]: this.props.userFlag.type === 1,
                [styles.yellowFlagIcon]: this.props.userFlag.type === 2
              })} />,
            color: this.props.userFlag.type !== 0 ? this.userFlagColors[this.props.userFlag.type].color : '#757575',
            tooltip: 'Flag this question',
            id: 'flag-question'
          }}
          onOpen={this.onOpenOtherPopover}
          onClose={this.onCloseOtherPopover}>
          <form onSubmit={this.onSaveOtherPopover}>
            <Row style={{ padding: 16, minWidth: 450 }}>
              <RadioGroup
                selected={this.state.updatedFlag.type}
                choices={Object.values(this.userFlagColors)}
                onChange={this.onChangeFlagType}
                error={this.state.choiceHelperText !== ''}
                label="Flag Type"
                required
                helperText={this.state.choiceHelperText} />
            </Row>
            <Row style={{ padding: 16 }}>
              <SimpleInput
                value={this.state.updatedFlag.notes}
                onChange={this.onChangeFlagNotes}
                shrinkLabel={true}
                id="flag-notes"
                label="Notes"
                disabled={this.state.questionFlags.length > 0 || this.props.disableAll}
                error={this.state.helperText !== ''}
                onBlur={this.checkNotes}
                helperText={this.state.helperText}
                placeholder="Enter Notes"
                multiline={false}
                required
                type="text" />
            </Row>
            <Row displayFlex style={{ justifyContent: 'flex-end', padding: 16 }}>
              <Button type="button" onClick={this.onCloseOtherPopover} raised={false} color="accent" value="Cancel" />
              <Button
                type="submit"
                onClick={this.onSaveOtherPopover}
                raised={false}
                color="accent"
                disabled={this.state.questionFlags.length > 0 || this.props.disableAll}
                value="Save" />
            </Row>
          </form>
        </Popover>
      </Container>
    )
  }
}

export default FlagPopover