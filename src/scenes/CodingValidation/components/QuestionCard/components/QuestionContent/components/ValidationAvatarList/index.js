import React from 'react'
import PropTypes from 'prop-types'
import { getInitials } from 'utils/normalize'
import { FlexGrid, Avatar } from 'components'
import theme from 'services/theme'

export const ValidationAvatarList = props => {
  const { answerList, userImages, selectedIndex, handleClickAvatar } = props

  const selectedStyle = {
    borderColor: theme.palette.secondary.main,
    backgroundColor: 'white',
    color: theme.palette.secondary.main
  }

  const validatorStyle = {
    backgroundColor: 'white',
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main
  }

  return (
    <FlexGrid container type="row" padding="5px 10px 8px 32px">
      {answerList.map((answer, i) => {
        const initials = getInitials(answer.firstName, answer.lastName)
        const username = `${answer.firstName} ${answer.lastName}`
        return (
          <Avatar
            style={{ ...selectedIndex === i ? selectedStyle : answer.isValidatorAnswer ? validatorStyle : {} }}
            avatar={userImages[answer.userId].avatar}
            initials={initials}
            key={`user-answer-${i}`}
            cardAvatar
            onClick={handleClickAvatar}
            userName={username}
          />
        )
      })}
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
