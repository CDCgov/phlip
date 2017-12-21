import React from 'react'
import PropTypes from 'prop-types'
import Dropdown from 'components/Dropdown'
import { Field } from 'redux-form'
import Container, { Row, Column } from 'components/Layout'
import TextInput from 'components/TextInput'

const EditView = ({ validate }) => {
  const options = [
    { value: 1, label: 'Assessment' },
    { value: 2, label: 'Policy Surveillance' },
    { value: 3, label: 'Environmental Scan' }
  ]

  return (
    <Container column style={{ minWidth: 550, minHeight: 230, padding: '30px 15px' }}>
      <Row style={{ paddingBottom: '20px' }}>
        <Field
          name="name"
          component={TextInput}
          label="Project Name"
          placeholder="Enter Project Name"
          validate={validate}
          fullWidth={true}
        />
      </Row>
      <Row>
       <Field
         name="type"
         component={Dropdown}
         label="Type"
         defaultValue={1}
         options={options}
         id="type"
         style={{display: 'flex'}}
       />
      </Row>
    </Container>
  )
}

EditView.propTypes = {}

export default EditView