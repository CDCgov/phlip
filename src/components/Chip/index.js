import React from 'react'
import PropTypes from 'prop-types'
import MuiChip from '@material-ui/core/Chip'

const Chip = (props, key) => {
  const { text, isFocused, isDisabled, handleClick, handleDelete, className, ...otherProps } = props
  return (
    <MuiChip
      key={key}
      onDelete={handleDelete}
      onClick={handleClick}
      style={{
        pointerEvents: isDisabled ? 'none' : undefined,
        backgroundColor: props.color
      }}
      label={text}
      className={className}
      {...otherProps}
    />
  )

}

export default Chip