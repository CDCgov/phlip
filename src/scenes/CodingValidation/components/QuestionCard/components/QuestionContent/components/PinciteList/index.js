import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Collapse from '@material-ui/core/Collapse'
import { getInitials } from 'utils/normalize'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Snackbar, FlexGrid, Avatar, Icon } from 'components'
import Button from '@material-ui/core/Button'
import theme from 'services/theme'

/**
 * List of pincites in the validation screen
 */
export class PinciteList extends Component {
  constructor(context, props) {
    super(context, props)

    this.state = {
      expanded: false,
      copied: false
    }
  }

  handleToggle = () => {
    this.setState({
      expanded: !this.state.expanded
    })
  }

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

  render() {
    const { answerList, userImages } = this.props
    const { expanded, copied } = this.state

    return (
      <FlexGrid container padding="0 10px 0 32px" align="flex-start">
        <Snackbar
          open={copied}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          onClose={this.handleCloseSnackbar}
          content={<span>Pincite copied!</span>}
          action={
            <Button
              key="close-snackbar"
              style={{ color: 'white' }}
              size="small"
              onClick={this.handleCloseSnackbar}>
              OK
            </Button>
          }
        />
        <FlexGrid container type="row" align="center" onClick={this.handleToggle} style={{ cursor: 'pointer' }}>
          <Typography variant="body1" color="secondary">
            {expanded ? 'Hide pincites' : 'Show pincites'}
          </Typography>
          <Icon color={theme.palette.secondary.main}>
            {expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
          </Icon>
        </FlexGrid>
        <Collapse in={expanded}>
          <FlexGrid container>
            {answerList.map((answer, i) => {
              const hasPincite = answer.pincite !== null ? answer.pincite.length > 0 : false
              const initials = getInitials(answer.firstName, answer.lastName)
              const username = `${answer.firstName} ${answer.lastName}`
              return (
                <CopyToClipboard
                  text={answer.pincite}
                  onCopy={hasPincite && this.handlePinciteCopy}
                  key={`${username}-pincite`}>
                  <FlexGrid container type="row" align="center" style={{ cursor: 'pointer', marginBottom: 3 }}>
                    <Avatar
                      cardAvatar
                      avatar={userImages[answer.userId].avatar}
                      initials={initials}
                      aria-label={`${username}'s pincite: ${answer.pincite}`}
                      userName={username}
                      small
                      style={{ margin: '0 10px 0 0', fontSize: '.5rem', outline: 0 }}
                    />
                    <Typography
                      align="center"
                      style={{
                        wordBreak: 'break-word',
                        color: theme.palette.greyText
                      }}>
                      {answer.pincite}
                    </Typography>
                  </FlexGrid>
                </CopyToClipboard>
              )
            })}
          </FlexGrid>
        </Collapse>
      </FlexGrid>
    )
  }
}

PinciteList.propTypes = {
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

export default PinciteList
