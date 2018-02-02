import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Drawer from 'material-ui/Drawer'
import Container, { Row, Column } from 'components/Layout'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import List from 'react-virtualized/dist/commonjs/List'
import styles from './nav-styles.scss'

const navStyles = theme => ({
  codeNav: {
    position: 'relative',
    width: 320,
    backgroundColor: '#4c5456',
    borderRight: 0
  }
})

const rowRenderer = (params) => {
  return (
    <div key={params.key} style={params.style}>{params.index}</div>
  )
}

export const Navigator = ({ open, classes, treeQuestions, userAnswers, questionsById }) => {
  return (
    <Drawer classes={{ paper: classes.codeNav }} type="persistent" anchor="left" open={true}>
      <Container column flex>
        <Row displayFlex style={{ backgroundColor: '#363f41', height: 60, alignItems: 'center', justifyContent: 'center', textTransform: 'uppercase' }}>
          <Typography type="headline"><span style={{ color: 'white' }}>Code Navigator</span></Typography>
        </Row>
        <div className={styles.navContainer}>
          <div style={{ flex: 1, display: 'flex' }}>
            <AutoSizer>
              {({ height, width }) => (
                <List className={styles.navScroll} style={{ height: height }} rowCount={100} rowHeight={20} width={width} rowRenderer={rowRenderer} height={height} overscanRowCount={0} />
              )}
            </AutoSizer>
          </div>
        </div>
      </Container>
    </Drawer>
  )
}


Navigator.propTypes = {
  open: PropTypes.bool
}

Navigator.defaultProps = {
  treeQuestions: []
}

export default withStyles(navStyles)(Navigator)