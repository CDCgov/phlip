import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import { default as MuiTabs, Tab } from 'material-ui/Tabs'

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing.unit * 3,
    backgroundColor: theme.palette.background.paper,
    paddingLeft: 20,
    paddingRight: 20,
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column'
  }
})

const Tabs = ({ tabs, selectedTab, onChangeTab, children, classes, theme }) => {
  return (
    <div className={classes.root}>
      <AppBar
        position="static"
        style={{
          backgroundColor: theme.palette.secondary.tabs,
          color: theme.palette.secondary.main,
          zIndex: 'unset'
        }}
        elevation={0}>
        <MuiTabs
          value={selectedTab}
          onChange={onChangeTab}
          indicatorColor="accent"
          textColor="accent"
          scrollable
          scrollButtons="on">
          {tabs.map(tab => (
            <Tab key={tab.id} label={tab.text} />
          ))}
        </MuiTabs>
      </AppBar>
      {children}
    </div>
  )
}

Tabs.propTypes = {
  tabs: PropTypes.array,
  selectedTab: PropTypes.number,
  onChangeTab: PropTypes.func,
  classes: PropTypes.object,
  theme: PropTypes.object
}

export default withStyles(styles, { withTheme: true })(Tabs)