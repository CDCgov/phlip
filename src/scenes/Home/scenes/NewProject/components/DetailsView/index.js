import React from 'react'
import PropTypes from 'prop-types'
import Container, { Row, Column } from 'components/Layout'
import Typography from 'material-ui/Typography'

const DetailsView = ({ project }) => {
  const types = {
    1: 'Assessment',
    2: 'Policy Surveillance',
    3: 'Environmental Scan',
  }

  return (
    <Container column style={{ minWidth: 550, minHeight: 230, padding: '30px 15px' }}>
      <Row style={{ paddingBottom: '20px' }}>
        <Column>
          <Typography type="subheading">Name</Typography>
        </Column>
        <Column>
          <Typography>{ project.name }</Typography>
        </Column>
      </Row>
      <Row>
        <Typography type="subheading">Type</Typography>
        <Typography>{ types[project.type] }</Typography>
      </Row>
    </Container>
  )
}

DetailsView.propTypes = {}

export default DetailsView