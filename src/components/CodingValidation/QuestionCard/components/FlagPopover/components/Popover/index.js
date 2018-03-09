import React from 'react'
import PropTypes from 'prop-types'
import { Manager, Popper, Target } from 'react-popper'
import Typography from 'material-ui/Typography'
import ClickAwayListener from 'material-ui/utils/ClickAwayListener'
import Grow from 'material-ui/transitions/Grow'
import Divider from 'material-ui/Divider'
import IconButton from 'components/IconButton'
import Card from 'components/Card'
import { Row } from 'components/Layout'

export const Popover = props => {
  const { target, open, title, onOpen, onClose, children } = props

  return (
    <ClickAwayListener onClickAway={open ? onClose : () => {}}>
      <Manager>
        <Target>
          <IconButton placement="top" tooltipText={target.tooltip} color={open ? 'secondary' : target.color} style={target.style} onClick={onOpen}>
            {target.icon}
          </IconButton>
        </Target>
        <Popper
          placement="bottom-end"
          eventsEnabled={open}
          style={{ zIndex: open ? 1200 : 0, display: open ? 'flex' : 'none' }}>
          <Grow in={open}>
            <Card style={{ display: 'flex', flexDirection: 'column', zIndex: open ? 1200 : 0 }}>
              <Row style={{ padding: 16 }}>
                <Typography type="button">{title}</Typography>
              </Row>
              <Divider />
              {children}
            </Card>
          </Grow>
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