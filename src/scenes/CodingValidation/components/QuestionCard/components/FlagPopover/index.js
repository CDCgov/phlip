import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TableBody from '@material-ui/core/TableBody'
import TableHead from '@material-ui/core/TableHead'
import { Flag, AlertOctagon } from 'mdi-material-ui'
import classNames from 'classnames'
import Popover from './components/Popover'
import styles from '../../card-styles.scss'
import { TableCell, Table, TableRow, IconButton, Icon, Button, SimpleInput, RadioGroup, FlexGrid } from 'components'

const getFlagText = (color, text, disabled) => (
  <FlexGrid container align="center" type="row">
    <Icon color={disabled ? '#bdbdbd' : color} style={{ paddingRight: 5 }}>flag</Icon>
    <span style={{ color: disabled ? '#bdbdbd' : 'black' }}>{text}</span>
  </FlexGrid>
)

const checkForRedFlag = (questionFlags, user) => questionFlags.filter(flag => flag.raisedBy.userId === user.id)

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
    onSaveFlag: PropTypes.func,
    user: PropTypes.object,
    disableAll: PropTypes.bool
  }
  
  constructor(props, context) {
    super(props, context)
    
    this.state = {
      redFlagOpen: false,
      otherFlagOpen: false,
      updatedFlag: { ...props.userFlag },
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
        text: getFlagText('#2E7D32', 'Flag for analysis', props.questionFlags.length > 0),
        disabled: props.questionFlags.length > 0 || props.disableAll
      },
      2: {
        type: 2,
        color: '#CE4A00',
        label: 'Notify Coordinator',
        text: getFlagText('#CE4A00', 'Notify coordinator', props.questionFlags.length > 0),
        disabled: props.questionFlags.length > 0 || props.disableAll
      }
    }
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.questionFlags.length !== this.props.questionFlags.length) {
      this.setState({
        userRedFlag: checkForRedFlag(this.props.questionFlags, this.props.user)[0] || { notes: '', type: 3 }
      })
    }
    
    if ((prevProps.userFlag.notes !== this.props.userFlag.notes) ||
      (prevProps.userFlag.type !== this.props.userFlag.type)) {
      this.setState({
        updatedFlag: { ...this.props.userFlag }
      })
    }
  }
  
  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('next props', nextProps)
    
    this.setState({
      updatedFlag: { ...nextProps.userFlag },
      userRedFlag: checkForRedFlag(nextProps.questionFlags, nextProps.user)[0] || { notes: '', type: 3 },
      inEditMode: nextProps.questionFlags.length === 0
    })
    
    for (let type in this.userFlagColors) {
      this.userFlagColors[type] = {
        ...this.userFlagColors[type],
        text: getFlagText(
          this.userFlagColors[type].color,
          this.userFlagColors[type].label,
          nextProps.questionFlags.length > 0
        ),
        disabled: nextProps.questionFlags.length > 0 || this.props.disableAll
      }
    }
  }
  
  onOpenRedPopover = () => {
    this.setState({
      redFlagOpen: !this.state.redFlagOpen,
      otherFlagOpen: false,
      helperText: '',
      inEditMode: this.props.questionFlags.length === 0,
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
    this.setState({
      helperText: e.target.value === '' ? 'Required' : ''
    })
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
      redFlagOpen: false, otherFlagOpen: !this.state.otherFlagOpen, helperText: ''
    })
  }
  
  onCloseOtherPopover = () => {
    this.setState({
      otherFlagOpen: false, updatedFlag: this.props.userFlag, helperText: '', choiceHelperText: ''
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
    const { questionFlags, user, disableAll, userFlag } = this.props
    const { redFlagOpen, inEditMode, helperText, choiceHelperText, userRedFlag, otherFlagOpen, updatedFlag } = this.state
    
    console.log(this.props)
    console.log(questionFlags)
    
    return (
      <FlexGrid container type="row" align="center" flex style={{ width: 'unset', height: 24 }}>
        <Popover
          title="Stop Coding This Question"
          open={redFlagOpen}
          target={{
            icon: <AlertOctagon
              className={classNames({
                [styles.icon]: questionFlags.length === 0,
                [styles.stopIconFlag]: questionFlags.length > 0
              })}
            />,
            style: { paddingRight: 15, paddingLeft: 15, maxHeight: 500 },
            tooltip: 'Stop coding this question',
            id: 'stop-coding-question'
          }}
          onOpen={this.onOpenRedPopover}
          onClose={this.onCloseRedPopover}>
          <FlexGrid
            container
            align="center"
            padding="10px 0 0"
            style={{ minWidth: 450, minHeight: 200, maxHeight: 500, flexWrap: 'nowrap' }}>
            {(questionFlags.length > 0 && !inEditMode) &&
            <div style={{ overflow: 'auto', width: '100%' }}>
              <Table style={{ width: '90%', maxWidth: 500, margin: '10px 16px' }}>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox" style={{ maxWidth: 150, width: 150 }}>Raised By</TableCell>
                    <TableCell padding="checkbox">Notes</TableCell>
                    {questionFlags[0].raisedBy.userId === user.id &&
                    <TableCell padding="checkbox" style={{ width: 48, paddingRight: 12 }}>Edit</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {questionFlags.map((flag, index) => (
                    <TableRow key={`red-flag-${index}`}>
                      <TableCell padding="checkbox" style={{ maxWidth: 150, width: 150 }}>
                        {`${flag.raisedBy.firstName} ${flag.raisedBy.lastName}`}
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        style={{ maxWidth: 300, wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                        {flag.notes}
                      </TableCell>
                      {flag.raisedBy.userId === user.id &&
                      <TableCell padding="checkbox" style={{ width: 48, paddingRight: 12 }}>
                        <IconButton onClick={this.toggleEditMode} color="#5f6060">edit</IconButton>
                      </TableCell>}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>}
            {inEditMode && <form onSubmit={this.onSaveRedPopover} style={{ alignSelf: 'stretch', flex: 1, width: 450 }}>
              <FlexGrid padding={16} flex>
                <SimpleInput
                  value={userRedFlag.notes}
                  onChange={this.onUpdateRedFlagNotes}
                  shrinkLabel={true}
                  id="flag-notes"
                  onBlur={this.checkNotes}
                  error={helperText !== ''}
                  label="Notes"
                  required
                  helperText={helperText}
                  placeholder="Enter Notes"
                  multiline={false}
                  type="text"
                />
              </FlexGrid>
            </form>}
            <FlexGrid container type="row" padding={16} style={{ alignSelf: 'flex-end' }}>
              <Button
                onClick={this.onCloseRedPopover}
                raised={false}
                color="accent"
                value={inEditMode ? 'Cancel' : 'Close'}
              />
              {inEditMode && <Button
                type="submit"
                onClick={this.onSaveRedPopover}
                raised={false}
                color="accent"
                value="Save"
              />}
            </FlexGrid>
          </FlexGrid>
        </Popover>
        <Popover
          title="Flags"
          open={otherFlagOpen}
          target={{
            icon: <Flag
              className={classNames({
                [styles.icon]: userFlag.type === 0,
                [styles.greenFlagIcon]: userFlag.type === 1,
                [styles.yellowFlagIcon]: userFlag.type === 2
              })}
            />,
            color: userFlag.type !== 0 ? this.userFlagColors[userFlag.type].color : '#757575',
            tooltip: 'Flag this question',
            id: 'flag-question'
          }}
          onOpen={this.onOpenOtherPopover}
          onClose={this.onCloseOtherPopover}>
          <form onSubmit={this.onSaveOtherPopover}>
            <FlexGrid flex padding={16} style={{ minWidth: 450 }}>
              <RadioGroup
                selected={updatedFlag.type}
                choices={Object.values(this.userFlagColors)}
                onChange={this.onChangeFlagType}
                error={choiceHelperText !== ''}
                label="Flag Type"
                required
                helperText={choiceHelperText}
              />
            </FlexGrid>
            <FlexGrid flex padding={16}>
              <SimpleInput
                value={updatedFlag.notes}
                onChange={this.onChangeFlagNotes}
                shrinkLabel={true}
                id="flag-notes"
                label="Notes"
                disabled={questionFlags.length > 0 || disableAll}
                error={helperText !== ''}
                onBlur={this.checkNotes}
                helperText={helperText}
                placeholder="Enter Notes"
                multiline={false}
                required
                type="text"
              />
            </FlexGrid>
            <FlexGrid container type="row" flex justify="flex-end" padding={16}>
              <Button type="button" onClick={this.onCloseOtherPopover} raised={false} color="accent" value="Cancel" />
              <Button
                type="submit"
                onClick={this.onSaveOtherPopover}
                raised={false}
                color="accent"
                disabled={questionFlags.length > 0 || disableAll}
                value="Save"
              />
            </FlexGrid>
          </form>
        </Popover>
      </FlexGrid>)
  }
}

export default FlagPopover
