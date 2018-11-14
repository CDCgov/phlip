import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Card from 'components/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Button from 'components/Button'
import { connect } from 'react-redux'

export class DocumentMeta extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    return (
        <div>
        <Card>
            <CardContent>
                <Typography component="h3">
                    Card content 1
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Learn More</Button>
            </CardActions>
        </Card>
            <br/>
            <Card>
                <CardContent>
                    <Typography component="h3">
                        Card content 2
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small">Learn More</Button>
                </CardActions>
            </Card>
            <br/>
            <Card>
                <CardContent>
                    <Typography component="h3">
                        Card content 3
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small">Learn Again</Button>
                </CardActions>
            </Card>
        </div>
    )
  }
}


export default (DocumentMeta)