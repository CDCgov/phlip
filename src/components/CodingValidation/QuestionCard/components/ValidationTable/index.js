import React from 'react'
import PropTypes from 'prop-types'
import Container, { Column, Row } from 'components/Layout'
import Card from 'components/Card'


export const ValidationTable = props => {
  const { mergedUserQuestions } = props
  console.log(mergedUserQuestions)

  return (
    <Container style={{ backgroundColor: '#f1f7f8', padding: 8 }}>
      <Row component={<Card />} displayFlex flex>

      </Row>
      <Row></Row>
    </Container>
  )

}

export default ValidationTable