import React, { Fragment, Component } from 'react'
import PropTypes from 'prop-types'
import Avatar from 'components/Avatar'
import Popover from '@material-ui/core/Popover'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import { getInitials } from 'utils/normalize'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Snackbar from 'components/Snackbar'
import Button from '@material-ui/core/Button'

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit
    /*'&:after': {
      content: '""',
      height: 0,
      width: 0,
      position: 'absolute',
      left: '48%',
      border: '10px solid transparent',
      borderTopColor: '#f7f7f2',
      top: '99%',
      zIndex: 1
    },
    '&:before': {
      content: '""',
      position: 'absolute',
      left: '48%',
      height: 0,
      width: 0,
      border: '10px solid transparent',
      borderTopColor: 'rgb(215, 214, 202)',
      top: '100%',
      zIndex: 1
    }*/
  },
  popover: {
    pointerEvents: 'none'
  },
  popperClose: {
    pointerEvents: 'none'
  }
})

/**
 * Avatar's that are used on the Validation screen, on hover the pincite is displayed
 */
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

  /**
   * Opens popover with event.target asthe anchor element
   * @public
   * @param event
   */
  handleOpen = event => {
    this.setState({ anchorEl: event.target, open: true, event })
  }

  /**
   * Close the popover and clears the anchor element
   * @public
   */
  handleClose = () => {
    this.setState({
      anchorEl: null,
      open: false
    })
  }

  /**
   * Opens a snackbar to indicate the popover pincite has been copied
   * @public
   */
  handlePinciteCopy = () => {
    this.setState({ copied: true })
    setTimeout(this.handleCloseSnackbar, 3500)
  }

  /**
   * Clears pincite copied snackbar
   * @public
   */
  handleCloseSnackbar = () => {
    this.setState({ copied: false })
    clearTimeout()
  }

  /**
   * Checks if pincite is valid
   * @public
   * @param pincite
   * @returns {boolean}
   */
  hasPincite = pincite => pincite !== null ? pincite.length > 0 : false

  render() {
    const userName = `${this.props.answer.firstName} ${this.props.answer.lastName}`

    return (
      <Fragment>
        {this.hasPincite(this.props.answer.pincite)
          && <Snackbar
            open={this.state.copied}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            onClose={this.handleCloseSnackbar}
            content={<span>Pincite copied!</span>}
            action={
              <Button
                key="close-snackbar"
                style={{ color: 'white' }}
                size="small"
                onClick={this.handleCloseSnackbar}>OK
              </Button>
            }
          />}
        <CopyToClipboard
          text={this.props.answer.pincite}
          onCopy={this.hasPincite(this.props.answer.pincite) && this.handlePinciteCopy}>
          <Avatar
            cardAvatar
            tabIndex={0}
            avatar={this.props.avatar}
            initials={getInitials(this.props.answer.firstName, this.props.answer.lastName)}
            onMouseOver={this.handleOpen}
            onMouseOut={this.handleClose}
            aria-label={`${userName}'s pincite: ${this.props.answer.pincite}`}
            aria-haspopup={true}
            userName={userName}
          />
        </CopyToClipboard>
        <Popover
          open={this.state.open}
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
              overflow: 'visible',
              maxHeight: 400,
              maxWidth: '60%'
            },
            tabIndex: -1,
            elevation: 0
          }}
          classes={{ paper: this.props.classes.paper }}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}>
          <Typography align="center" style={{ color: '#adac9f', fontWeight: '400', paddingBottom: 8 }}>
            {userName}
          </Typography>
          <Typography align="center" style={{ wordBreak: 'break-word' }}>{this.props.answer.pincite}</Typography>
        </Popover>
      </Fragment>
    )
  }
}

ValidationAvatar.propTypes = {
  /**
   * Answer object for the answer associated with the validation avatar
   */
  answer: PropTypes.object,

  /**
   * base64 string for the image to use in the avatar
   */
  avatar: PropTypes.string,

  /**
   * Classes object from @material-ui/core
   */
  classes: PropTypes.object
}

export default withStyles(styles)(ValidationAvatar)