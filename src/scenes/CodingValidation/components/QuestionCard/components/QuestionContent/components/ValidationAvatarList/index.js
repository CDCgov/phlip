import React from 'react'
import PropTypes from 'prop-types'
import { FlexGrid, Avatar } from 'components'
import theme from 'services/theme'

export const ValidationAvatarList = props => {
  const { answerList, userImages, enabledUserId, enabledAnswerId, handleClickAvatar, answerId, isValidatorSelected } = props
  console.log(props)

  const avatarStyle = {
    cursor: 'pointer',
    borderColor: 'white'
  }

  const selectedStyle = {
    ...avatarStyle,
    borderColor: theme.palette.secondary.main,
    backgroundColor: 'white',
    color: theme.palette.secondary.main
  }

  const validatorStyle = {
    ...avatarStyle,
    backgroundColor: 'white',
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main
  }

  return (
    <FlexGrid container type="row" padding="5px 0 8px 0">
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
            cardAvatar
            onClick={handleClickAvatar(answer.schemeAnswerId, answer.userId, answer.isValidatorAnswer)}
            userName={user.username}
          />
        )
      })}
      <Avatar
        style={(enabledUserId === 'All' && answerId === enabledAnswerId) ? selectedStyle : avatarStyle}
        avatar=""
        initials="ALL"
        key="user-avatar-all-selected"
        cardAvatar
        onClick={handleClickAvatar(answerId, 'All')}
        userName="All"
      />
    </FlexGrid>
  )
}

ValidationAvatarList.propTypes = {
  answerList: PropTypes.array,
  userImages: PropTypes.object,
  selectedIndex: PropTypes.number,
  handleClickAvatar: PropTypes.func
}

export default ValidationAvatarList
