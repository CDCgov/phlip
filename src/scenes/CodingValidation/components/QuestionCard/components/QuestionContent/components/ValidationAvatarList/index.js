import React from 'react'
import PropTypes from 'prop-types'
import { FlexGrid, Avatar, Icon, Tooltip } from 'components'
import theme from 'services/theme'

export const ValidationAvatarList = props => {
  const {
    answerList, userImages, enabledUserId, enabledAnswerId, handleClickAvatar,
    answerId, isValidatorSelected, showAllAvatar
  } = props

  const avatarStyle = {
    cursor: 'pointer',
    marginLeft: 0,
    backgroundColor: '#e9e9e9',
    color: 'black',
    marginRight: 5,
    border: '3px solid white',
    borderColor: 'white'
  }

  const selectedStyle = {
    ...avatarStyle,
    borderColor: theme.palette.error.main
  }

  return (
    <FlexGrid container type="row" align="center">
      {answerList.map((answer, i) => {
        const user = userImages[answer.userId]
        const userAndAnswerMatch = enabledUserId === answer.userId && enabledAnswerId === answer.schemeAnswerId
        const isSelected = (userAndAnswerMatch &&
          ((!isValidatorSelected && !answer.isValidatorAnswer) || (isValidatorSelected && answer.isValidatorAnswer)))
        const style = isSelected
          ? selectedStyle
          : avatarStyle

        const avatarProps = {
          style,
          avatar: user.avatar,
          initials: user.initials,
          onClick: handleClickAvatar(answer.schemeAnswerId, answer.userId, answer.isValidatorAnswer === true),
          userName: user.username
          //cardAvatar: isSelected
        }

        return (
          <Tooltip text={user.username} key={`user-answer-${answer.schemeAnswerId}-${i}`}>
            {answer.isValidatorAnswer
              ? (
                <FlexGrid container align="flex-end" style={{ position: 'relative' }}>
                  <Avatar {...avatarProps} />
                  <Avatar
                    style={{
                      position: 'absolute',
                      width: 12,
                      height: 12,
                      backgroundColor: '#80d134',
                      border: '2px solid white',
                      top: 18,
                      left: 20
                    }}
                    cardAvatar={true}
                    initials={<Icon size="12px" color="white" style={{ fontWeight: 800 }}>check</Icon>}
                  />
                </FlexGrid>
              )
              : <Avatar {...avatarProps} />
            }
          </Tooltip>
        )
      })}
      {showAllAvatar &&
      <Tooltip text="Show all annotations">
        <Avatar
          style={(enabledUserId === 'All' && answerId === enabledAnswerId) ? selectedStyle : avatarStyle}
          avatar=""
          initials="All"
          key="user-avatar-all-selected"
          onClick={handleClickAvatar(answerId, 'All', false)}
          userName="All"
        />
      </Tooltip>}
    </FlexGrid>
  )
}

ValidationAvatarList.propTypes = {
  answerList: PropTypes.array,
  userImages: PropTypes.object,
  selectedIndex: PropTypes.number,
  handleClickAvatar: PropTypes.func,
  showAllAvatar: PropTypes.bool,
  enabledUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  enabledAnswerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  answerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isValidatorSelected: PropTypes.bool
}

ValidationAvatarList.defaultProps = {
  showAllAvatar: true
}

export default ValidationAvatarList
