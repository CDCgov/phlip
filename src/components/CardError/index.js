import React from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Grid from 'material-ui/Grid'
import Card from 'components/Card'
import Icon from 'components/Icon'

/**
 * Used to display errors that should be shown as a part of the page, instead of popup alert
 */
export const CardError = ({ children }) => (
  <Card style={{ display: 'flex' }}>
    <Grid container spacing={0} justify="center" style={{ flex: '1' }} alignItems="center">
      <Grid container direction="column" alignItems="center" spacing={0}>
        <Grid item>
          <Icon size={175} color="#757575">
            sentiment_very_dissatisfied
          </Icon>
        </Grid>
        <Grid item>
          <Typography type="display2" style={{ width: 800, height: 300, textAlign: 'center' }}>
            {children}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  </Card>
)

CardError.propTypes = {
  /**
   * Contents of CardError
   */
  children: PropTypes.any
}

export default CardError