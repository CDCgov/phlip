import React, { Fragment, Component } from 'react'
import Avatar from 'components/Avatar'
import Popover from 'material-ui/Popover'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
import { getInitials } from 'utils/normalize'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Snackbar from 'components/Snackbar'
import Button from 'material-ui/Button'

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit,
    '&:after': {
      content: '""',
      position: 'absolute',
      left: '44%',
      border: '10px solid transparent',
      borderTopColor: '#f7f7f2',
      top: '99%',
      zIndex: 1
    },
    '&:before': {
      content: '""',
      position: 'absolute',
      left: '44%',
      border: '10px solid transparent',
      borderTopColor: 'rgb(215, 214, 202)',
      top: '104%',
      zIndex: 1
    }
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
      initials: getInitials(this.props.answer.firstName, this.props.answer.lastName),
      copied: false
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

  handlePinciteCopy = () => {
    this.setState({
      copied: true
    })
    setTimeout(this.handleCloseSnackbar, 3500)
  }

  handleCloseSnackbar = () => {
    this.setState({
      copied: false
    })
    clearTimeout()
  }

  render() {
    return (
      <Fragment>
        {this.props.answer.pincite.length > 0 && <Snackbar
          open={this.state.copied}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          onClose={this.handleCloseSnackbar}
          content={<span>Pincite copied!</span>}
          action={<Button key="close-snackbar" color="accent" size="small" onClick={this.handleCloseSnackbar}>OK</Button>}
        />}
        <CopyToClipboard text={this.props.answer.pincite} onCopy={this.props.answer.pincite.length > 0 && this.handlePinciteCopy}>
          <Avatar
            cardAvatar
            avatarUrl={this.props.answer.avatarUrl}
            initials={this.state.initials}
            onMouseOver={this.handleOpen}
            onMouseOut={this.handleClose}
          />
        </CopyToClipboard>
        <Popover
          open={this.state.open && this.props.answer.pincite.length > 0}
          anchorEl={this.state.anchorEl}
          onClose={this.handleClose}
          className={this.props.classes.popover}
          PaperProps={{
            style: {
              backgroundColor: '#f7f7f2',
              border: '2px solid #d7d6ca',
              padding: '6px 12px',
              minWidth: 150,
              borderRadius: 6,
              overflow: 'visible'
            },
            elevation: 0
          }}
          classes={{
            paper: this.props.classes.paper
          }}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 72,
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

export default withStyles(styles)(ValidationAvatar)