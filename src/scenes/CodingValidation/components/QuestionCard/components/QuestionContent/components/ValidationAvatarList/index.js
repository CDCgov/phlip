import React from 'react'
import PropTypes from 'prop-types'
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
    <FlexGrid container type="row" padding="5px 0 8px 0">
      {answerList.map((answer, i) => {
        const user = userImages[answer.userId]
        return (
          <Avatar
            style={{ ...selectedIndex === i ? selectedStyle : answer.isValidatorAnswer ? validatorStyle : {} }}
            avatar={user.avatar}
            initials={user.initials}
            key={`user-answer-${i}`}
            cardAvatar
            onClick={handleClickAvatar}
            userName={user.username}
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
