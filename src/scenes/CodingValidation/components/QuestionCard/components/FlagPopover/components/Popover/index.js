import React from 'react'
import PropTypes from 'prop-types'
import { Manager, Popper, Reference } from 'react-popper'
import FlexGrid from 'components/FlexGrid'
import Typography from '@material-ui/core/Typography'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Divider from '@material-ui/core/Divider'
import IconButton from 'components/IconButton'
import { Row } from 'components/Layout'

export const Popover = props => {
  const { target, open, title, onOpen, onClose, children } = props

  return (
    <Manager>
      <Reference>
        {({ ref }) => {
          return (
            <div ref={ref}>
              <IconButton
                placement="top"
                tooltipText={target.tooltip}
                aria-label={target.tooltip}
                id={target.id}
                color={target.color}
                style={target.style}
                onClick={onOpen}>
                {target.icon}
              </IconButton>
            </div>
          )
        }}
      </Reference>
      <Popper
        placement="bottom-end"
        eventsEnabled={open}
        style={{ pointerEvents: open ? 'auto' : 'none' }}>
        {({ ref, style, placement }) => (
          open &&
          <ClickAwayListener onClickAway={open ? onClose : () => {}}>
            <div ref={ref} data-placement={placement} style={{ marginTop: 5, ...style, zIndex: 20 }}>
              <FlexGrid raised container displayFlex>
                <Row style={{ padding: 16 }}>
                  <Typography variant="body2">{title}</Typography>
                </Row>
                <Divider />
                {children}
              </FlexGrid>
            </div>
          </ClickAwayListener>
        )}
      </Popper>
    </Manager>
  )
}

Popover.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  target: PropTypes.any,
  children: PropTypes.any
}

export default Popover