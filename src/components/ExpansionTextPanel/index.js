import React, { Fragment, Component } from 'react'
import PropTypes from 'prop-types'
import IconButton from 'components/IconButton'
import Typography from 'material-ui/Typography'
import Container, { Row, Column } from 'components/Layout'
import { withStyles } from 'material-ui/styles'
import Grow from 'material-ui/transitions/Grow'
import Paper from 'material-ui/Paper'
import { Manager, Target, Popper } from 'react-popper'
import ClickAwayListener from 'material-ui/utils/ClickAwayListener'
import ExpansionPanel, { ExpansionPanelSummary, ExpansionPanelDetails } from 'material-ui/ExpansionPanel'

const styles = {
  root: {
    flex: 1,
    '&:before': {
      height: 0
    }
  }
}

export class ExpansionTextPanel extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      open: false
    }
  }

  onClosePopper = () => {
    this.setState({
      open: false
    })
  }

  onOpenPopper = () => {
    this.setState({
      open: !this.state.open
    })
  }

  render() {
    return (
      <ClickAwayListener onClickAway={this.onClosePopper}>
        <Row flex displayFlex style={{ alignItems: 'center', overflow: 'hidden' }}>
          <Typography noWrap {...this.props.textProps} style={{ flex: 1, minWidth: 0, color: '#b2b4b4' }}>
            {this.props.text}
          </Typography>
          <Manager style={{ height: 24 }}>
            <Target style={{ height: 24 }}>
              <IconButton onClick={this.onOpenPopper} color="#768f99" {...this.props.dropdownIconProps}>arrow_drop_down</IconButton>
            </Target>
            <Popper
              placement="top-end"
              id="text-popper"
              style={{
                width: 450,
                zIndex: this.state.open ? 2 : '',
                display: this.state.open ? 'block' : 'none'
              }}
            >
              <Grow in={this.state.open}>
                <Paper elevation={8} style={{ padding: 25 }}>
                  <Typography {...this.props.textProps}>{this.props.text}</Typography>
                </Paper>
              </Grow>
            </Popper>
          </Manager>
        </Row>
      </ClickAwayListener>
    )
  }
}

export default withStyles(styles)(ExpansionTextPanel)
