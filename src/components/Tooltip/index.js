import React from 'react'
import PropTypes from 'prop-types'
import { default as MuiTooltip } from 'material-ui/Tooltip'
import { withStyles } from 'material-ui/styles'

const styles = theme => {
  return {
    tooltipLeft: {
      transformOrigin: 'right center',
      margin: `0 ${theme.spacing.unit * 3}px`,
      [theme.breakpoints.up('sm')]: {
        margin: '0 7px'
      }
    },
    tooltipRight: {
      transformOrigin: 'left center',
      margin: `0 ${theme.spacing.unit * 3}px`,
      [theme.breakpoints.up('sm')]: {
        margin: '0 7px'
      }
    },
    tooltipTop: {
      transformOrigin: 'center bottom',
      margin: `${theme.spacing.unit * 3}px 0`,
      [theme.breakpoints.up('sm')]: {
        margin: '7px 0'
      }
    },
    tooltipBottom: {
      transformOrigin: 'center top',
      margin: `${theme.spacing.unit * 3}px 0`,
      [theme.breakpoints.up('sm')]: {
        margin: '7px 0'
      }
    },
    popper: {
      margin: -5
    }
  }
}

/**
 * Wrapper for material-ui's Tooltip component, displays a small popover with text on hover
 */
export const Tooltip = ({ text, placement, children, classes, ...otherProps }) => {
  return (
    <MuiTooltip
      placement={placement}
      title={text}
      enterDelay={700}
      classes={{ ...classes }}
      {...otherProps}
      PopperProps={{
        modifiers: {
          preventOverflow: { enabled: false },
          hide: { enabled: false }
        }
      }}>
      {children}
    </MuiTooltip>
  )
}

Tooltip.defaultProps = {
  placement: 'top'
}

Tooltip.propTypes = {
  /**
   * Tooltip text
   */
  text: PropTypes.string,
  /**
   * Where to place the tooltip, relative to the components children
   */
  placement: PropTypes.string,
  /**
   * Tooltip will show on hover of the children
   */
  children: PropTypes.any,
  /**
   * Style classes object from material-ui
   */
  classes: PropTypes.object
}

export default withStyles(styles)(Tooltip)