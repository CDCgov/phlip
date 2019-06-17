import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import PropTypes from 'prop-types'
import IconButton from 'components/IconButton'
import Typography from '@material-ui/core/Typography'
import { Row } from 'components/Layout'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import { Manager, Reference, Popper } from 'react-popper'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
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

    this.expandButtonRef = null

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
      open: true
    })
  }

  render() {
    const { tooltipText, ...other } = this.props.dropdownIconProps

    return (
      <Row flex displayFlex style={{ alignItems: 'center', overflow: 'hidden' }}>
        <Typography noWrap {...this.props.textProps} style={{ flex: 1, minWidth: 0, color: '#b2b4b4' }}>
          {this.props.text}
        </Typography>
        <Manager>
          <Reference innerRef={node => this.expandButtonRef = findDOMNode(node)}>
            {({ ref }) => {
              return (
                <div ref={ref}>
                  <IconButton
                    onClick={this.state.open === true ? this.onClosePopper : this.onOpenPopper}
                    color="#768f99"
                    tooltipText={this.state.open === true ? '' : tooltipText}
                    {...other}>
                    <MenuDown />
                  </IconButton>
                </div>
              )
            }}
          </Reference>
          <Popper placement="top-end" eventsEnabled={this.state.open === true}>
            {({ ref, placement, style }) => {
              return (
                this.state.open === true &&
                <ClickAwayListener onClickAway={this.onClosePopper}>
                  <div ref={ref} data-placement={placement} style={{ ...style, zIndex: 1 }}>
                    <Paper
                      elevation={8}
                      style={{
                        maxWidth: 450,
                        padding: 25,
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        maxHeight: 500,
                        overflow: 'auto'
                      }}>
                      <Typography {...this.props.textProps}>{this.props.text}</Typography>
                    </Paper>
                  </div>
                </ClickAwayListener>
              )
            }}
          </Popper>
        </Manager>
      </Row>
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
