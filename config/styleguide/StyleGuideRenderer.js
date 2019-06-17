import React from 'react'
import PropTypes from 'prop-types'
import Markdown from 'react-styleguidist/lib/rsg-components/Markdown'
import Styled from 'react-styleguidist/lib/rsg-components/Styled'
import cx from 'classnames'
import Typography from '@material-ui/core/Typography'

const background = '#3A4041'

const styles = ({ color, fontFamily, fontSize, sidebarWidth, mq, space, maxWidth }) => ({
  root: {
    backgroundColor: color.baseBackground,
    display: 'flex',
    flexDirection: 'row',
    height: '100vh'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    padding: [[space[2], space[4]]],
    [mq.small]: {
      padding: space[2]
    },
    overflow: 'auto'
  },
  sidebar: {
    backgroundColor: background,
    border: [[color.border, 'solid']],
    borderWidth: [[0, 1, 0, 0]],
    position: 'relative',
    top: 0,
    left: 0,
    bottom: 0,
    width: 275,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    color: 'white',
    '& li > a': {
      color: 'white !important'
    },
  },
  logo: {
    padding: space[2],
    backgroundColor: background
  },
  footer: {
    display: 'block',
    color: color.light,
    fontFamily: fontFamily.base,
    fontSize: fontSize.small
  }
})

export function StyleGuideRenderer({ classes, title, homepageUrl, children, toc, hasSidebar }) {
  return (
    <div className={cx(classes.root, hasSidebar && classes.hasSidebar)}>
      <div style={{ overflow: 'auto', backgroundColor: background }}>
        <div className={classes.sidebar}>
          <div className={classes.logo}>
            <Typography style={{ color: 'white', fontWeight: 100 }} type="title">PHLIP Docs & Styleguide</Typography>
          </div>
          {toc}
        </div>
      </div>
      <main className={classes.content}>
        {children}
        <footer className={classes.footer}>
          <Markdown text={`Generated with [React Styleguidist](${homepageUrl})`} />
        </footer>
      </main>
    </div>
  )
}

StyleGuideRenderer.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  homepageUrl: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  toc: PropTypes.node.isRequired,
  hasSidebar: PropTypes.bool
}

export default Styled(styles)(StyleGuideRenderer)