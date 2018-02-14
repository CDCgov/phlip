import React from 'react'
import PropTypes from 'prop-types'
import Select from 'material-ui/Select'
import Input, { InputLabel } from 'material-ui/Input'
import { FormControl } from 'material-ui/Form'
import { MenuItem } from 'material-ui/Menu'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
  icon: {
    position: 'absolute',
    right: 0,
    top: 4,
    color: theme.palette.text.secondary,
    'pointer-events': 'none'
  }
})

const JurisdictionSelect = ({ id, value, onChange, options, ...otherProps }) => {
  let menuItems = options.map(option => (
    <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
  ))

  return (
    <FormControl style={{ minWidth: '120px' }}>
      <Select
        input={<Input id={id} name='jurisdiction' />}
        value={value}
        onChange={onChange}
        children={menuItems}
        {...otherProps}
      />
    </FormControl>
  )
}

JurisdictionSelect.propTypes = {
  id: PropTypes.any,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  options: PropTypes.arrayOf(PropTypes.object)
}

export default withStyles(styles)(JurisdictionSelect)