import React, { Fragment, Component } from 'react'
import Avatar from 'components/Avatar'
import Popover from 'material-ui/Popover'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
import { getInitials } from 'utils/normalize'

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit
  },
  popover: {
    pointerEvents: 'none'
  },
  popperClose: {
    pointerEvents: 'none'
  }
})

export class ValidationAvatar extends Component {
  constructor(context, props) {
    super(context, props)

    this.state = {
      open: false,
      anchorEl: null,
      initials: getInitials(this.props.answer.firstName, this.props.answer.lastName)
    }
  }

  handleOpen = event => {
    this.setState({
      anchorEl: event.target,
      open: true
    })
  }

  handleClose = () => {
    this.setState({
      anchorEl: null,
      open: false
    })
  }

  render() {
    return (
      <Fragment>
        <Avatar cardAvatar initials={this.state.initials} onMouseOver={this.handleOpen} onMouseOut={this.handleClose} />
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          onClose={this.handleClose}
          className={this.props.classes.popover}
          PaperProps={{
            style: { backgroundColor: '#f7f7f2', border: '1px solid #d7d6ca', padding: '6px 12px', minWidth: 150 }
          }}
          classes={{
            paper: this.props.classes.paper
          }}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          disableRestoreFocus
        >
          <Typography align="center" style={{ color: '#adac9f', fontWeight: '400', paddingBottom: 8 }}>
            {`${this.props.answer.firstName} ${this.props.answer.lastName}`}
          </Typography>
          <Typography align="center">{this.props.answer.pincite}</Typography>
        </Popover>
      </Fragment>
    )
  }
}

/*export const ValidationAvatar = ({ answer, handlePopoverOpen, handleClose, popoverOpen, anchorEl, classes }) => {
  const initials = getInitials(answer.firstName, answer.lastName)
  console.log(answer)
  return (
    <Fragment>
      <Avatar cardAvatar initials={initials} onMouseOver={handlePopoverOpen} onMouseOut={handleClose} />
      <Popover
        open={popoverOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        disableRestoreFocus>
        <Typography>{answer.firstName + ' ' + answer.lastName}</Typography>
        <Typography>{answer.pincite}</Typography>
      </Popover>
    </Fragment>
  )
}*/

export default withStyles(styles)(ValidationAvatar)