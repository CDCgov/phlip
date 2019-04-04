import React from 'react'
import PropTypes from 'prop-types'
import { SimpleInput } from 'components'

const PinciteTextField = props => {
  const { schemeAnswerId, pinciteValue, handleChangePincite, style } = props

  return (
    <SimpleInput
      key={`${schemeAnswerId}-pincite`}
      placeholder="Enter pincite"
      value={pinciteValue}
      multiline={false}
      InputProps={{ inputProps: { 'aria-label': 'Pincite', style: { paddingBottom: 2 } } }}
      style={{ paddingLeft: 32, paddingTop: 10, width: '90%', ...style }}
      onChange={handleChangePincite(schemeAnswerId, 'pincite')}
    />
  )
}

PinciteTextField.propTypes = {
  schemeAnswerId: PropTypes.number,
  pinciteValue: PropTypes.string,
  handleChangePincite: PropTypes.func,
  style: PropTypes.object
}

export default PinciteTextField
