import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Manager, Popper, Target } from 'react-popper'
import Typography from 'material-ui/Typography'
import Grow from 'material-ui/transitions/Grow'
import IconButton from 'components/IconButton'
import Card from 'components/Card'
import Divider from 'material-ui/Divider'
import { Column, Row } from 'components/Layout'
import RadioGroup from 'components/SelectionControls/RadioGroup'
import SimpleInput from 'components/SimpleInput'
import Button from 'components/Button'
import Icon from 'components/Icon'

const getFlagText = (color, text) => (
  <Row displayFlex style={{ alignItems: 'center' }}>
    <Icon color={color} style={{ paddingRight: 5 }}>flag</Icon>
    <span>{text}</span>
  </Row>
)

const userFlagColors = {
  1: { type: 1, color: '#2cad73', text: getFlagText('#2cad73', 'Flag for analysis') },
  2: { type: 2, color: '#fca63a', text: getFlagText('#fca63a', 'Notify coordinator') },
  3: { type: 3, color: '#d90525', text: getFlagText('#d90525', 'Stop coding') }
}

export class FlagPopover extends Component {
  static defaultProps = {
    userFlag: {
      notes: '',
      type: 0
    }
  }

  constructor(context, props) {
    super(context, props)

    this.state = {
      flagOpen: false,
      updatedFlag: { ...props.userFlag }
    }
  }

  onOpenPopover = () => {
    this.setState({
      flagOpen: !this.state.flagOpen
    })
  }

  onClosePopover = () => {
    this.setState({
      flagOpen: false
    })
  }

  onSavePopover = () => {
    this.props.onSavePopover()
    this.onClosePopover()
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
    this.setState({
      updatedFlag: {
        ...this.state.updatedFlag,
        notes: event.target.value
      }
    })
  }

  render() {
    return (
      <Manager>
        <Target>
          <IconButton
            color={this.state.flagOpen
              ? 'secondary'
              : this.props.userFlag ? userFlagColors[this.props.userFlag.type].color : '#d7e0e4'}
            onClick={this.onOpenPopover}
          >
            flag
          </IconButton>
        </Target>
        <Popper placement="bottom-end" eventsEnabled={this.state.flagOpen}>
          <Grow in={this.state.flagOpen}>
            <Card style={{ display: 'flex', flexDirection: 'column' }}>
              <Row style={{ padding: 16 }}>
                <Typography type="button">FLAG</Typography>
              </Row>
              <Divider />
              <Row style={{ padding: 16, minWidth: 450 }}>
                <RadioGroup
                  selected={this.state.updatedFlag.type}
                  choices={Object.values(userFlagColors)}
                  onChange={this.onChangeFlagType}
                />
              </Row>
              <Row style={{ padding: 16 }}>
                <SimpleInput
                  value={this.state.updatedFlag.notes}
                  onChange={this.onChangeFlagNotes}
                  shrinkLabel={true}
                  label="Notes"
                  placeholder="Enter Notes"
                  multiline={false}
                />
              </Row>
              <Row displayFlex style={{ justifyContent: 'flex-end', padding: 16 }}>
                <Button onClick={this.onClosePopover} raised={false} color="accent" value="Cancel" />
                <Button onClick={this.onSavePopover} raised={false} color="accent" value="Save" />
              </Row>
            </Card>
          </Grow>
        </Popper>
      </Manager>
    )
  }
}

export default FlagPopover