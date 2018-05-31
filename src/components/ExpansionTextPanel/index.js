import React, { Component } from 'react'
import PropTypes from 'prop-types'
import IconButton from 'components/IconButton'
import Typography from 'material-ui/Typography'
import { Row } from 'components/Layout'
import { withStyles } from 'material-ui/styles'
import Grow from 'material-ui/transitions/Grow'
import Paper from 'material-ui/Paper'
import { Manager, Target, Popper } from 'react-popper'
import ClickAwayListener from 'material-ui/utils/ClickAwayListener'
import MenuDown from 'mdi-material-ui/MenuDown'

const styles = {
  root: {
    flex: 1,
    '&:before': {
      height: 0
    }
  }
}

/**
 * Block of text that is kind of like an Accordion. Displays beginning or all of text depending on length and size
 * available for component. On click of arrow button, all text is displayed in a popover atop of where the dropdown
 * button icon is.
 */
export class ExpansionTextPanel extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      open: false
    }
  }

  /**
   * Closes the popover
   * @public
   */
  onClosePopper = () => {
    this.setState({
      open: false
    })
  }

  /**
   * Opens the popover
   * @public
   */
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
              <IconButton onClick={this.onOpenPopper} color="#768f99" {...this.props.dropdownIconProps}><MenuDown /></IconButton>
            </Target>
            <Popper
              placement="top-end"
              id="text-popper"
              style={{
                width: 450,
                zIndex: this.state.open ? 2 : '',
                display: this.state.open ? 'block' : 'none',
                maxHeight: 500
              }}>
              <Grow in={this.state.open}>
                <Paper elevation={8} style={{ padding: 25, whiteSpace: 'pre-wrap', wordWrap: 'break-word', maxHeight: 500, overflow: 'auto' }}>
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

ExpansionTextPanel.propTypes = {
  /**
   * Text content of the popover
   */
  text: PropTypes.string,

  /**
   * Props for the Typography component
   */
  textProps: PropTypes.object,

  /**
   * Props for the IconButton component for the dropdown arrow
   */
  dropdownIconProps: PropTypes.object
}

export default withStyles(styles)(ExpansionTextPanel)
