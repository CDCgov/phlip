import React from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import { Row } from 'components/Layout'
import IconButton from 'components/IconButton'
import { withTheme } from 'material-ui/styles'

export const FooterNavigate = ({ currentIndex, getNextQuestion, getPrevQuestion, showNextButton, theme }) => {
  const styles = {
    fontSize: 16,
    color: theme.palette.primary.main
  }

  const rowStyles = {
    height: 50,
    alignItems: 'center',
    paddingTop: 10,
    justifyContent: 'space-between',
    alignSelf: currentIndex === 0 ? 'flex-end' : ''
  }

  return (
    <Row displayFlex style={rowStyles}>
      {currentIndex !== 0 &&
      <Row displayFlex style={{ cursor: 'pointer' }} aria-label="Go to previous question" onClick={() => getPrevQuestion(currentIndex - 1)}>
        <IconButton color="#767676" aria-label="Go to previous question">navigate_before</IconButton>
        <Typography type="body2"><span style={{ ...styles, paddingLeft: 5, userSelect: 'none' }}>Previous question</span></Typography>
      </Row>}
      {showNextButton && <Row displayFlex flex={currentIndex === 0} aria-label="Go to next question" style={{ cursor: 'pointer' }} onClick={() => getNextQuestion(currentIndex + 1)}>
        <Typography type="body2">
          <span style={{ ...styles, paddingRight: 5, userSelect: 'none' }}>Next question</span>
        </Typography>
        <IconButton color="#767676" aria-label="Go to next question">navigate_next</IconButton>
      </Row>}
    </Row>
  )
}

export default withTheme()(FooterNavigate)