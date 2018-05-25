import React from 'react'
import PropTypes from 'prop-types'
import Styled from 'react-styleguidist/lib/rsg-components/Styled'
import DefaultSections from 'react-styleguidist/lib/rsg-components/Sections/SectionsRenderer'

const styles = ({ fontFamily, color, space }) => ({
  headingSpacer: {
    marginBottom: 10
  },
  descriptionText: {
    marginTop: space[0],
    fontFamily: fontFamily.base
  }
})

export function SectionsRenderer({ classes, children }) {
  return (
    <div>
      <DefaultSections>{children}</DefaultSections>
    </div>
  )
}

SectionsRenderer.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node
}

export default Styled(styles)(SectionsRenderer)