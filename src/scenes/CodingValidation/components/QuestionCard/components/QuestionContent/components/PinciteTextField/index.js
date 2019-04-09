import React from 'react'
import PropTypes from 'prop-types'
import { SimpleInput } from 'components'

export const PinciteTextField = props => {
  const { schemeAnswerId, pinciteValue, handleChangePincite, style, disabled } = props

  return (
    <SimpleInput
      key={`${schemeAnswerId}-pincite`}
      placeholder="Enter pincite"
      value={pinciteValue}
      multiline={false}
      InputProps={{ inputProps: { 'aria-label': 'Pincite', style: { paddingBottom: 2 } } }}
      style={{ paddingTop: 10, ...style }}
      disabled={disabled}
      onChange={handleChangePincite(schemeAnswerId, 'pincite')}
    />
  )
}

PinciteTextField.propTypes = {
  schemeAnswerId: PropTypes.number,
  pinciteValue: PropTypes.string,
  handleChangePincite: PropTypes.func,
  style: PropTypes.object,
  disabled: PropTypes.bool
}

export default PinciteTextField
