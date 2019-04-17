import React from 'react'
import PropTypes from 'prop-types'
import { FlexGrid, Avatar } from 'components'
import theme from 'services/theme'

export const ValidationAvatarList = props => {
  const {
    answerList, userImages, enabledUserId, enabledAnswerId, handleClickAvatar,
    answerId, isValidatorSelected, showAllAvatar, layered
  } = props

  const avatarStyle = {
    cursor: 'pointer',
    marginLeft: 0,
    backgroundColor: '#e9e9e9',
    color: 'black',
    marginRight: 5,
    border: '2px solid white',
    borderColor: 'white'
  }

  const selectedStyle = {
    ...avatarStyle,
    borderColor: theme.palette.error.main
  }

  const validatorStyle = {
    ...avatarStyle
  }

  return (
    <FlexGrid container type="row">
      {answerList.map((answer, i) => {
        const user = userImages[answer.userId]
        const userAndAnswerMatch = enabledUserId === answer.userId && enabledAnswerId === answer.schemeAnswerId
        const isSelected = (userAndAnswerMatch &&
          ((!isValidatorSelected && !answer.isValidatorAnswer) || (isValidatorSelected && answer.isValidatorAnswer)))
        return (
          <Avatar
            style={isSelected
              ? selectedStyle
              : answer.isValidatorAnswer
                ? validatorStyle
                : avatarStyle
            }
            avatar={user.avatar}
            initials={user.initials}
            key={`user-answer-${i}`}
            onClick={handleClickAvatar(answer.schemeAnswerId, answer.userId, answer.isValidatorAnswer === true)}
            userName={user.username}
          />
        )
      })}
      {showAllAvatar && <Avatar
        style={(enabledUserId === 'All' && answerId === enabledAnswerId) ? selectedStyle : avatarStyle}
        avatar=""
        initials="All"
        key="user-avatar-all-selected"
        onClick={handleClickAvatar(answerId, 'All', false)}
        userName="All"
      />}
    </FlexGrid>
  )
}

ValidationAvatarList.propTypes = {
  answerList: PropTypes.array,
  userImages: PropTypes.object,
  selectedIndex: PropTypes.number,
  handleClickAvatar: PropTypes.func,
  showAllAvatar: PropTypes.bool,
  layered: PropTypes.bool,
  enabledUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  enabledAnswerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  answerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isValidatorSelected: PropTypes.bool
}

ValidationAvatarList.defaultProps = {
  showAllAvatar: true,
  layered: true
}

export default ValidationAvatarList
