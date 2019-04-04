import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Collapse from '@material-ui/core/Collapse'
import { getInitials } from 'utils/normalize'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Snackbar, FlexGrid, Avatar, Icon } from 'components'
import PinciteTextField from '../PinciteTextField'
import Button from '@material-ui/core/Button'
import theme from 'services/theme'

const PinciteAvatar = ({ answerObj, userImages }) => {
  const initials = getInitials(answerObj.firstName, answerObj.lastName)
  const username = `${answerObj.firstName} ${answerObj.lastName}`
  return (
    <Avatar
      cardAvatar
      avatar={userImages[answerObj.userId].avatar}
      initials={initials}
      aria-label={`${username}'s pincite: ${answerObj.pincite}`}
      userName={username}
      small
      style={{ margin: '0 10px 0 0', fontSize: '.5rem', outline: 0 }}
    />
  )
}

PinciteAvatar.propTypes = {
  answerObj: PropTypes.object,
  userImages: PropTypes.object
}

/**
 * List of pincites in the validation screen
 */
export class PinciteList extends Component {
  static propTypes = {
    answerList: PropTypes.array,
    userImages: PropTypes.object,
    validatorObj: PropTypes.object,
    isAnswered: PropTypes.bool,
    handleChangePincite: PropTypes.func
  }

  state = {
    expanded: false,
    copied: false
  }

  /**
   * Hides or closes the list of pincites
   * @public
   */
  handleToggle = () => {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  /**
   * Sets a timeout to show the snackbar to let user know pincite has been copied
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

  render() {
    const { answerList, userImages, handleChangePincite, validatorObj, isAnswered } = this.props
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
        <Collapse in={expanded} style={{ alignSelf: 'stretch' }}>
          <FlexGrid container align="flex-start">
            {answerList.map((answer, i) => {
              const hasPincite = answer.pincite !== null ? answer.pincite.length > 0 : false
              const username = `${answer.firstName} ${answer.lastName}`
              return (
                <CopyToClipboard
                  text={answer.pincite}
                  onCopy={hasPincite && this.handlePinciteCopy}
                  key={`${username}-pincite`}>
                  <FlexGrid container type="row" align="center" style={{ cursor: 'pointer', marginBottom: 3 }}>
                    <PinciteAvatar answerObj={answer} userImages={userImages} />
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
            {isAnswered &&
            <FlexGrid container type="row" style={{ alignSelf: 'stretch' }}>
              <PinciteAvatar answerObj={validatorObj} userImages={userImages} />
              <PinciteTextField
                handleChangePincite={handleChangePincite}
                pinciteValue={validatorObj.pincite}
                schemeAnswerId={validatorObj.schemeAnswerId}
                style={{ padding: 0 }}
              />
            </FlexGrid>}
          </FlexGrid>
        </Collapse>
      </FlexGrid>
    )
  }
}

export default PinciteList
