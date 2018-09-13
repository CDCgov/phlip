import React from 'react'
import PropTypes from 'prop-types'
import Grid from 'components/Grid'
import Icon from 'components/Icon'
import theme from 'services/theme'
import Typography from '@material-ui/core/Typography'

const HeaderTabs = props => {
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
    <Grid container align="center" type="row">
      {tabs.map((tab, i) => {
        return (
          <Grid
            align="center"
            key={`tab-${i}`}
            container
            type="row"
            padding="15px 15px 11px 15px"
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