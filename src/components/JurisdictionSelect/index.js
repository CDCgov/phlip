import React from 'react'
import PropTypes from 'prop-types'
import Select from 'material-ui/Select'
import Input from 'material-ui/Input'
import { FormControl } from 'material-ui/Form'
import { MenuItem } from 'material-ui/Menu'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'

const styles = theme => ({
  icon: {
    position: 'absolute',
    right: 0,
    top: 4,
    color: theme.palette.text.secondary,
    'pointer-events': 'none'
  }
})

const JurisdictionSelect = ({ id, value, onChange, options, theme, ...otherProps }) => {
  const menuItems = options.map(option => {
    return (
      <MenuItem key={option.id} value={option.id}>
        {option.name}
        <Typography type="caption" style={{ paddingLeft: 10, color: theme.palette.greyText }}>
          ({new Date(option.startDate).toLocaleDateString()} - {new Date(option.endDate).toLocaleDateString()})
        </Typography>
      </MenuItem>
    )
  })

  const MenuProps = {
    PaperProps: {
      style: {
        zIndex: 10000
      }
    },
    onEnter: () => {
      setTimeout(() => {
        if (document.activeElement) {
          document.activeElement.blur()
        }
      }, 500)
    }
  }

  return (
    <FormControl style={{ minWidth: '120px' }}>
      <Select
        input={<Input id={id} name="jurisdiction" />}
        value={value}
        onChange={onChange}
        children={menuItems}
        MenuProps={MenuProps}
        renderValue={(value) => {
          const option = options.find(option => option.id === value)
          return option.name
        }}
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

export default withStyles(styles, { withTheme: true })(JurisdictionSelect)