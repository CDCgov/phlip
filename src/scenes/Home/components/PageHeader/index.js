import React from 'react'
import Typography from 'material-ui/Typography'
import PropTypes from 'prop-types'
import Button from 'components/Button'
import CircleIcon from 'components/CircleIcon'
import TextLink from 'components/TextLink'
import Container, { Column } from 'components/Layout'

export const PageHeader = ({ role }) => {
  return (
    <Container alignItems="center" style={{ height: '80px' }}>
      <Column flex>
        <Container alignItems="center" spacing={8}>
          <Column>
            <CircleIcon circleColor="error" iconColor="white" circleSize="30px" iconSize="19px">home</CircleIcon>
          </Column>
          <Column>
            <Typography type="title">Project List</Typography>
          </Column>
        </Container>
      </Column>
      <Column>
        {role !== 'Coder' &&
        <TextLink to={{ pathname: '/project/add', state: { userDefined: null } }} style={{ color: 'white' }}>
          <Button value=" + Create new project" color="accent" />
        </TextLink>
        }
      </Column>
    </Container>
  )
}

PageHeader.propTypes = {
  role: PropTypes.string
}

export default PageHeader