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

/*export const ExpansionTextPanel = ({ text, classes }) => {
  return (
    <ExpansionPanel elevation={0} classes={{ root: classes.root }}>
      <ExpansionPanelSummary expandIcon={<Icon color="#768f99">expand_more</Icon>}>
        <ExpansionPanelDetails><Typography>{text}</Typography></ExpansionPanelDetails>
      </ExpansionPanelSummary>
    </ExpansionPanel>
  )
}*/

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
      open: true
    })
  }

  render() {
    console.log(this.state)

    return (
      <ClickAwayListener onClickAway={this.onClosePopper}>
        <Row flex displayFlex style={{ overflow: 'hidden', alignItems: 'center' }}>
          <Typography noWrap style={{ flex: 1 }}>{this.props.text}</Typography>
          <Manager>
            <Target>
              <IconButton onClick={this.onOpenPopper} color="#768f99">expand_more</IconButton>
            </Target>
            <Popper placement="bottom-end" id="text-popper" style={{ width: 500, zIndex: this.state.open ? 2 : '' }}>
              <Grow in={this.state.open}>
                <Paper elevation={8} style={{ padding: 25 }}>
                  <Typography>{this.props.text}</Typography>
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
