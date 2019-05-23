import React from 'react'
import PropTypes from 'prop-types'
import { FlexGrid, Avatar, Tooltip } from 'components'
import theme from 'services/theme'
import CodingValidationAvatar from '../CodingValidationAvatar'

export const AvatarList = props => {
  const {
    answerList, userImages, enabledUserId, enabledAnswerId, handleClickAvatar,
    answerId, isUserAnswerSelected, showAllAvatar
  } = props
  
  const avatarStyle = {
    cursor: 'pointer',
    marginLeft: 0,
    backgroundColor: '#e9e9e9',
    color: 'black',
    fontSize: '.8rem'
  }
  
  const selectedStyle = {
    ...avatarStyle,
    border: `2px solid ${theme.palette.error.main}`,
    boxSizing: 'border-box'
  }
  
  return (
    <FlexGrid container type="row" align="center">
      {answerList.map((answer, i) => {
        const user = userImages[answer.userId]
        const userAndAnswerMatch = enabledUserId === answer.userId && enabledAnswerId === answer.schemeAnswerId
        const isSelected = (userAndAnswerMatch &&
          ((!isUserAnswerSelected && !answer.isUserAnswer) || (isUserAnswerSelected && answer.isUserAnswer)))
        
        return (
          <div style={{ marginRight: 2 }} key={`user-answer-${answer.schemeAnswerId}-${i}`}>
            <CodingValidationAvatar
              onClick={handleClickAvatar(answer.schemeAnswerId, answer.userId, answer.isUserAnswer)}
              user={user}
              enabled={isSelected}
              isValidator={answer.isValidatorAnswer}
              key={`user-${user.id}-${answer.pincite}-${answer.schemeAnswerId}`}
            />
          </div>
        )
      })}
      
      {showAllAvatar &&
      <Tooltip text="Show all annotations">
        <Avatar
          style={{
            ...(enabledUserId === 'All' && answerId === enabledAnswerId) ? selectedStyle : {},
            color: 'white',
            backgroundColor: theme.palette.primary.main
          }}
          avatar=""
          initials="ALL"
          key="user-avatar-all-selected"
          onClick={handleClickAvatar(answerId, 'All', false)}
          userName="All"
        />
      </Tooltip>}
    </FlexGrid>
  )
}

AvatarList.propTypes = {
  answerList: PropTypes.array,
  userImages: PropTypes.object,
  selectedIndex: PropTypes.number,
  handleClickAvatar: PropTypes.func,
  showAllAvatar: PropTypes.bool,
  enabledUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  enabledAnswerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  answerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isUserAnswerSelected: PropTypes.bool
}

AvatarList.defaultProps = {
  showAllAvatar: true
}

export default AvatarList

