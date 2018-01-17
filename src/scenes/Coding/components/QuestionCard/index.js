import React from 'react'
import PropTypes from 'prop-types'
import Divider from 'material-ui/Divider'
import Card from 'components/Card/index'
import { Row } from 'components/Layout'
import IconButton from 'components/IconButton'

export const QuestionCard = ({ question }) => {
  return (
    <Card>
      <Row displayFlex style={{ alignItems: 'center', justifyContent: 'flex-end', height: 42, paddingRight: 15 }}>
        <IconButton color="#d7e0e4">
          flag
        </IconButton>
      </Row>
      <Divider />
      <Row flex>

      </Row>
    </Card>
  )
}

QuestionCard.propTypes = {

}

export default QuestionCard

