import React from 'react'
import Button from 'components/Button/index'
import { Row } from 'components/Layout/index'
import Paper from 'material-ui/Paper'
import { Link } from 'react-router-dom'

export const Footer = ({ onClose }) => (
  <Row component={<Paper />} displayFlex reverse elevation={4}
       style={{ height: 64, alignItems: 'center', padding: '0 24px' }}>
    <Link to="/" style={{ textDecoration: 'none' }}><Button value="Close" onClick={onClose} closeButton>Close</Button></Link>
  </Row>
)

export default Footer