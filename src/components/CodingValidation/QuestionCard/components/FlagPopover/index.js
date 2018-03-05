import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Container, { Column, Row } from 'components/Layout'
import RadioGroup from 'components/SelectionControls/RadioGroup'
import SimpleInput from 'components/SimpleInput'
import Button from 'components/Button'
import Icon from 'components/Icon'
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
      questionFlags: [...props.questionFlags]
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
      },
      3: {
        type: 3,
        color: '#d90525',
        text: getFlagText('#d90525', 'Stop coding'),
        disabled: checkForSameType(props.userFlag.type, 3)
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      updatedFlag: { ...nextProps.userFlag },
      questionFlags: [...nextProps.questionFlags]
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

  onOpenOtherPopover = () => {
    this.setState({
      redFlagOpen: false,
      otherFlagOpen: !this.state.otherFlagOpen
    })
  }

  onCloseOtherPopover = () => {
    this.setState({
      otherFlagOpen: false,
      updatedFlag: this.props.userFlag
    })
  }

  onCloseRedPopover = () => {
    this.setState({
      redFlagOpen: false
    })
  }

  onSavePopover = e => {
    e.preventDefault()
    this.props.onSaveFlag(this.state.updatedFlag)
    this.setState({
      otherFlagOpen: false
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
      <Container style={{ width: 'unset' }}>
        {this.props.questionFlags.length > 0 &&
        <Popover
          title="Raised Red Flags"
          open={this.state.redFlagOpen}
          targetIcon="report"
          targetColor={this.userFlagColors[3].color}
          onOpen={this.onOpenRedPopover}
          onClose={this.onCloseRedPopover}
        >
          <Table style={{ width: '90%', alignSelf: 'center', minWidth: 550, margin: '0 16px' }}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">Raised By</TableCell>
                <TableCell padding="checkbox">Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.questionFlags.map((flag, index) => (
                <TableRow key={`red-flag-${index}`}>
                  <TableCell padding="checkbox">{`${flag.raisedBy.firstName} ${flag.raisedBy.lastName}`}</TableCell>
                  <TableCell padding="checkbox">{flag.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Row displayFlex style={{ justifyContent: 'flex-end', padding: 16 }}>
            <Button onClick={this.onCloseRedPopover} raised={false} color="accent" value="Cancel" />
          </Row>
        </Popover>}
        <Popover
          title="Flags"
          open={this.state.otherFlagOpen}
          targetIcon="flag"
          targetColor={this.props.userFlag.type !== 0
            ? this.userFlagColors[this.props.userFlag.type].color
            : '#d7e0e4'}
          onOpen={this.onOpenOtherPopover}
          onClose={this.onCloseOtherPopover}
        >
          <form onSubmit={this.onSavePopover}>
            <Row style={{ padding: 16, minWidth: 450 }}>
              <RadioGroup
                selected={this.state.updatedFlag.type}
                choices={Object.values(this.userFlagColors)}
                onChange={this.onChangeFlagType}
              />
            </Row>
            <Row style={{ padding: 16 }}>
              <SimpleInput
                value={this.state.updatedFlag.notes}
                onChange={this.onChangeFlagNotes}
                shrinkLabel={true}
                id="flag-notes"
                label="Notes"
                placeholder="Enter Notes"
                multiline={false}
                type="text"
              />
            </Row>
            <Row displayFlex style={{ justifyContent: 'flex-end', padding: 16 }}>
              <Button type="button" onClick={this.onCloseOtherPopover} raised={false} color="accent" value="Cancel" />
              <Button type="submit" onClick={this.onSavePopover} raised={false} color="accent" value="Save" />
            </Row>
          </form>
        </Popover>
      </Container>
    )
  }
}

export default FlagPopover