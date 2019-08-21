import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import Styled from 'react-styleguidist/lib/rsg-components/Styled'

const colors = {
  secondary: '#04648a',
  sidebar: '#3A4041'
}

const styles = ({ color, fontFamily, fontSize }) => ({
  heading: {
    margin: 0,
    color: color.base,
    fontFamily: fontFamily.base,
    fontWeight: 'normal'
  },
  heading1: {
    display: 'block',
    position: 'relative',
    color: colors.sidebar,
    marginBottom: 10,
    paddingBottom: 5,
    fontSize: fontSize.h1,
    fontWeight: 700,
    '&:before': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      marginTop: 20,
      width: 100,
      left: 0,
      height: '4px',
      backgroundColor: colors.secondary,
      borderRadius: '4px'
    },
    '& > a': {
      fontWeight: '700 !important'
    }
  },
  heading2: {
    fontSize: fontSize.h2,
    fontWeight: 700
  },
  heading3: {
    textTransform: 'uppercase',
    fontWeight: '700',
    fontSize: fontSize.h3,
    paddingBottom: 8,
    paddingTop: 8,
    borderBottom: 'thin solid #b3b7b9'
  },
  heading4: {
    fontSize: fontSize.h4,
    marginBottom: 0
  },
  heading5: {
    fontSize: fontSize.h5
  },
  heading6: {
    fontSize: fontSize.h6
  },
  headingSection: {
    fontSize: fontSize.sectionName,
    '& > a': {
      fontWeight: '100 !important'
    }
  }
})

function HeadingRenderer({ classes, level, children, ...props }) {
  const Tag = level === 'Section' ? 'span' : `h${level}`
  const headingClasses = cx(classes.heading, classes[`heading${level}`])

  return (
    <Tag {...props} className={headingClasses}>
      {children}
    </Tag>
  )
}

HeadingRenderer.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node
}

export default Styled(styles)(HeadingRenderer)