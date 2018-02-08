import React from 'react'

const trackStyles = {
  height: 5,
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: '#969a9b',
  minWidth: 30,
  maxWidth: 30
}

export const Progress = ({ progress, color, width, ...otherProps }) => {
  const barStyles = {
    position: 'absolute',
    left: 0,
    bottom: 0,
    top: 0,
    width: width ? width : '100%',
    transformOrigin: 'left',
    backgroundColor: color ? color : '#b3e98c'
  }

  return (
    <div style={trackStyles}>
      <div style={{ ...barStyles, transform: `scaleX(${progress / 100})` }} />
    </div>
  )
}

export default Progress