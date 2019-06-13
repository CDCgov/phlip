import React from 'react'
import PropTypes from 'prop-types'
import { FlexGrid, IconButton } from 'components'
import Typography from '@material-ui/core/Typography'
import { connect } from 'react-redux'
import CodingValidationAvatar
  from 'scenes/CodingValidation/components/QuestionCard/components/QuestionContent/components/CodingValidationAvatar'

export const AnnotationFinder = props => {
  const { count, current, users, handleScrollAnnotation, handleClickAvatar } = props
  
  const containerStyles = {
    backgroundColor: 'black',
    width: '40%',
    alignSelf: 'flex-end',
    height: 40,
    position: 'absolute',
    zIndex: 200,
    background: '#0000008a',
    right: 20,
    top: 10
  }
  
  const disabledColor = `rgba(0, 0, 0, 0.54)`
  
  return (
    <FlexGrid raised container type="row" align="center" justify="flex-end" padding="0 8px" style={containerStyles}>
      <FlexGrid container type="row" align="center" padding="0 10px 0 0" flex>
        {users.map((user, i) => {
          return (
            <FlexGrid style={{ marginLeft: 5 }} key={`${user.id}-anno-avatar-${i}`}>
              <CodingValidationAvatar
                user={user}
                isValidator={user.isValidator}
                onClick={handleClickAvatar ? handleClickAvatar(user.userId, user.isValidator) : null}
                enabled={user.enabled}
              />
            </FlexGrid>
          )
        })}
      </FlexGrid>
      <FlexGrid style={{ marginRight: 15 }}>
        <Typography style={{ color: 'white' }}>
          {current + 1}/{count}
        </Typography>
      </FlexGrid>
      <FlexGrid style={{ borderLeft: '2px solid white', height: '50%' }} />
      <FlexGrid style={{ marginLeft: 8 }}>
        <IconButton
          onClick={() => handleScrollAnnotation(current - 1)}
          disabled={current === 0}
          color={current === 0 ? disabledColor : 'white'}>
          keyboard_arrow_up
        </IconButton>
        <IconButton
          onClick={() => handleScrollAnnotation(current + 1)}
          disabled={current === count - 1}
          color={current === count - 1 ? disabledColor : 'white'}>
          keyboard_arrow_down
        </IconButton>
      </FlexGrid>
    </FlexGrid>
  )
}

AnnotationFinder.propTypes = {
  count: PropTypes.number,
  current: PropTypes.number,
  users: PropTypes.array,
  handleScrollAnnotation: PropTypes.func,
  handleClickAvatar: PropTypes.func
}

AnnotationFinder.defaultProps = {
  users: [],
  current: 0,
  count: 0
}

/** istanbul ignore next */
const mapStateToProps = (state, ownProps) => {
  return {
    users: ownProps.users.map(user => {
      return {
        ...user,
        ...state.data.user.byId[user.userId]
      }
    })
  }
}

export default connect(mapStateToProps)(AnnotationFinder)
