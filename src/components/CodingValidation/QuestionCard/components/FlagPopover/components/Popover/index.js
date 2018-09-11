import React from 'react'
import PropTypes from 'prop-types'
import { Manager, Popper, Reference } from 'react-popper'
import Typography from '@material-ui/core/Typography'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Divider from '@material-ui/core/Divider'
import IconButton from 'components/IconButton'
import Card from 'components/Card'
import { Row } from 'components/Layout'

export const Popover = props => {
  const { target, open, title, onOpen, onClose, children } = props

  return (
    <ClickAwayListener onClickAway={open ? onClose : () => {}}>
      <Manager>
        <Reference>
          {({ ref }) => (
            <IconButton
              placement="top"
              tooltipText={target.tooltip}
              aria-label={target.tooltip}
              id={target.id}
              color={target.color}
              style={target.style}
              onClick={onOpen}
              ref={ref}>
              {target.icon}
            </IconButton>
          )}
        </Reference>
        <Popper
          placement="bottom-end"
          eventsEnabled={open}
          style={{ zIndex: open ? 1200 : 0, display: open ? 'flex' : 'none' }}>
          {({ ref, style, placement, arrowProps }) => (
            <Grow in={open} ref={ref}>
              <Card style={{ display: 'flex', flexDirection: 'column', zIndex: open ? 1200 : 0, ...style }}>
                <Row style={{ padding: 16 }}>
                  <Typography variant="body2">{title}</Typography>
                </Row>
                <Divider />
                {children}
              </Card>
            </Grow>
          )}
        </Popper>
      </Manager>
    </ClickAwayListener>
  )
}

Popover.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  onOpen: PropTypes.func,
  onClose: PropTypes.func
}

export default Popover