import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Collapse from '@material-ui/core/Collapse'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Snackbar, FlexGrid, Avatar, Icon } from 'components'
import PinciteTextField from '../PinciteTextField'
import Button from '@material-ui/core/Button'
import theme from 'services/theme'

const PinciteAvatar = ({ answerObj, user, size }) => {
  return (
    <Avatar
      cardAvatar
      avatar={user.avatar}
      initials={user.initials}
      aria-label={`${user.username}'s pincite: ${answerObj.pincite}`}
      userName={user.username}
      small={size === 'small'}
      style={{ margin: '0 10px 0 0', fontSize: size === 'big' ? '1rem' : '.5rem', outline: 0 }}
    />
  )
}

PinciteAvatar.propTypes = {
  answerObj: PropTypes.object,
  user: PropTypes.object,
  size: PropTypes.oneOf(['big', 'small'])
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
    handleChangePincite: PropTypes.func,
    alwaysShow: PropTypes.bool,
    avatarSize: PropTypes.oneOf(['big', 'small']),
    textFieldProps: PropTypes.object,
    validatorStyles: PropTypes.object
  }

  static defaultProps = {
    avatarSize: 'small',
    alwaysShow: false,
    answerList: [],
    userImages: {},
    isAnswered: false,
    textFieldProps: {},
    validatorStyles: {}
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
    const {
      answerList, userImages, handleChangePincite, validatorObj, isAnswered,
      alwaysShow, avatarSize, textFieldProps, validatorStyles
    } = this.props
    const { expanded, copied } = this.state

    const pincitesExist = (answerList.filter(answer => answer.pincite ? answer.pincite.length > 0 : false)).length >
      0 || isAnswered || alwaysShow

    return (
      pincitesExist &&
      <FlexGrid container padding="0 10px 0 0" align="flex-start">
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
        {!alwaysShow &&
        <FlexGrid container type="row" align="center" onClick={this.handleToggle} style={{ cursor: 'pointer' }}>
          <Typography variant="body1" color="secondary">
            {expanded ? 'Hide pincites' : 'Show pincites'}
          </Typography>
          <Icon color={theme.palette.secondary.main}>
            {expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
          </Icon>
        </FlexGrid>}
        <Collapse in={alwaysShow ? true : expanded} style={{ alignSelf: 'stretch' }}>
          <FlexGrid container align="flex-start">
            {answerList.map((answer, i) => {
              const hasPincite = alwaysShow ? true : answer.pincite !== null ? answer.pincite.length > 0 : false
              const user = userImages[answer.userId]
              return (
                hasPincite && <CopyToClipboard
                  text={answer.pincite}
                  onCopy={hasPincite && this.handlePinciteCopy}
                  key={`${user.username}-pincite`}>
                  <FlexGrid container type="row" align="center" style={{ cursor: 'pointer', marginBottom: 3 }}>
                    <PinciteAvatar answerObj={answer} user={user} size={avatarSize} />
                    <Typography
                      align="center"
                      style={{
                        textAlign: 'left',
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
            <FlexGrid container type="row" style={{ alignSelf: 'stretch', ...validatorStyles }}>
              <PinciteAvatar answerObj={validatorObj} user={userImages[validatorObj.userId]} size={avatarSize} />
              <PinciteTextField
                handleChangePincite={handleChangePincite}
                pinciteValue={validatorObj.pincite}
                schemeAnswerId={validatorObj.schemeAnswerId}
                style={{ padding: 0, ...textFieldProps }}
              />
            </FlexGrid>}
          </FlexGrid>
        </Collapse>
      </FlexGrid>
    )
  }
}

export default PinciteList