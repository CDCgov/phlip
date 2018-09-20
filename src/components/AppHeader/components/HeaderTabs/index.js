import React from 'react'
import PropTypes from 'prop-types'
import Grid from 'components/Grid'
import Icon from 'components/Icon'
import theme from 'services/theme'
import Typography from '@material-ui/core/Typography'

export const HeaderTabs = props => {
  const { tabs, onTabChange } = props

  const allStyle = {
    cursor: 'pointer',
    borderBottom: '4px solid transparent'
  }

  const activeStyle = {
    ...allStyle,
    borderBottom: `4px solid ${theme.palette.secondary.main}`,
    color: theme.palette.secondary.main
  }

  return (
    <Grid container align="stretch" type="row" style={{ height: '100%' }}>
      {tabs.map((tab, i) => {
        return (
          <Grid
            align="center"
            key={`tab-${i}`}
            container
            tabIndex={0}
            type="row"
            padding="12px 20px 12px 20px"
            onKeyPress={(e) => e.key === 'Enter' ? onTabChange(i) : null}
            style={tab.active ? activeStyle : allStyle}
            onClick={() => onTabChange(i)}>
            {tab.icon && <Icon style={{ marginRight: 8 }} color="#b1adc2">{tab.icon}</Icon>}
            <Typography style={{ color: 'white' }}>{tab.label}</Typography>
          </Grid>
        )
      })}
    </Grid>
  )
}

HeaderTabs.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    icon: PropTypes.string,
    active: PropTypes.bool
  }))
}

export default HeaderTabs