import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import PropTypes from 'prop-types'
import Select from 'material-ui/Select'
import Input from 'material-ui/Input'
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

export class JurisdictionSelect extends Component {
  constructor(props, context) {
    super(props, context)
    this.jurisdictionRef = undefined
  }

  componentDidMount() {
    this.jurisdictionRef.focus()
  }

  setJurisdictionRef = node => {
    if (node) {
      this.jurisdictionRef = findDOMNode(node).childNodes[0].childNodes[0]
    }
  }

  render() {
    const { value, onChange, options, theme, ...otherProps } = this.props

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
          zIndex: 10000,
          transform: 'translate3d(0, 0, 0)'
        }
      }
    }

    return (
      <Select
        input={<Input id="jurisdiction-select-list" name="jurisdiction" autoFocus />}
        value={value}
        autoFocus={true}
        onChange={onChange}
        children={menuItems}
        MenuProps={MenuProps}
        ref={this.setJurisdictionRef}
        renderValue={value => {
          const option = options.find(option => option.id === value)
          return option.name
        }}
        {...otherProps}
      />
    )
  }
}

JurisdictionSelect.propTypes = {
  id: PropTypes.any,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  options: PropTypes.arrayOf(PropTypes.object)
}

export default withStyles(styles, { withTheme: true })(JurisdictionSelect)