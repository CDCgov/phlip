import React from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Button from 'components/Button'
import Container, { Column, Row } from 'components/Layout'
import IconButton from 'components/IconButton'
import { withRouter } from 'react-router-dom'
import styles from 'components/CodingValidation/Header/header-styles.scss'

export const Header = ({ projectName, onEnableEdit, onSaveProtocol, editEnabled, projectId, history }) => (
  <Container alignItems="center" style={{ height: '80px' }}>
    <Column style={{ paddingRight: 5 }}>
      <IconButton iconSize={30} color="black" onClick={() => history.goBack()}>arrow_back</IconButton>
    </Column>
    <Row displayFlex flex>
      <Typography type="title" style={{ alignSelf: 'center' }}>Protocol</Typography>
      <span className={styles.header} />
      <Typography type="title" style={{ alignSelf: 'center' }}><span style={{ color: '#0faee6' }}>{projectName}</span></Typography>
    </Row>
    <Column>
      <Button value={editEnabled ? 'Save' : 'Edit'} onClick={editEnabled ? onSaveProtocol : onEnableEdit} color="accent" />
    </Column>
  </Container>
)

Header.propTypes = {
  projectName: PropTypes.string,
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default withRouter(Header)