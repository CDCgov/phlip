import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Card from 'components/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Button from 'components/Button'
import FlexGrid from 'components/FlexGrid'
import Divider from '@material-ui/core/Divider'
import { connect } from 'react-redux'
import Form from 'components/Form'
import Dropdown from 'components/Dropdown'
import Container, { Row } from 'components/Layout'
import DetailRow from 'components/DetailRow'
import TextInput from 'components/TextInput'
import * as actions from '../../actions'


export class DocumentMeta extends Component {
  constructor(props, context) {
    super(props, context)
      this.defaultDocStatus = 1;
      this.documentDefined = true;
      // this.documentDefined = this.props.match.url === '/docs/view' ? null : this.props.location.state.projectDefined
      this.state = {
          edit: !this.documentDefined,
          submitting: false
      }
  }

    onChangeStatusField = value => {
        this.props.actions.setFormValues('docStatus', value)
    };
  render() {
      const options = [
          { value: 1, label: 'Draft' },
          { value: 2, label: 'Approved' }
          //{ value: 3, label: 'Environmental Scan' }
      ];


    return (
        <div>
            {/*<FlexGrid raised container flex style={{  overflow: 'hidden', flexBasis: '30%', padding: 30, minWidth: '30%' }}>*/}
                <FlexGrid raised container flex style={{ overflow: 'hidden', flexBasis: '30%', padding:20, minWidth:'30%'}}>
                    <Typography variant="display1" style={{fontSize: '1.2em', color: '#000000', marginBottom: 2 }}>
                        Document Information
                    </Typography><Divider />
                    <Container column style={{padding: '30px 15px 0 15px' }}>
                        <Form form='document-info' onSubmit={this.handleSubmit}>
                            <Dropdown
                                name="docStatus"
                                id="docStatus"
                                defaultValue="Draft"
                                label="Status"
                                options={options}
                                required
                                input={{
                                    value: this.props.form.values.docStatus,
                                    onChange: this.onChangeStatusField
                                }}
                                meta={{}}
                            />
                        <DetailRow
                            component={TextInput}
                            disabled={true}
                            label="Effective Date"
                            name="effectiveDate"
                            format={this.formatDate}
                            style={{ paddingBottom: 0 }}
                        />
                        <DetailRow
                            component={TextInput}
                            disabled={true}
                            label="Created By"
                            name="createdBy"
                        />
                        </Form>
                    </Container>

                    <div>
                        <Button size='small' color='green'>Update</Button>
                    </div>
                </FlexGrid>
                <br/>
            <FlexGrid raised container flex style={{ overflow: 'hidden', flexBasis: '30%', padding:20, minWidth:'30%'}}>
                <div>
                    <Typography variant="display1" style={{fontSize: '1.2em', color: '#000000', marginBottom: 2 }}>
                        Assigned Jurisdictions
                    </Typography>
                    <Button size="small">Add</Button>
                </div>
                    <Divider/>
                </FlexGrid>
                <br/>
            <FlexGrid raised container flex style={{ overflow: 'hidden', flexBasis: '30%', padding:30, minWidth:'30%'}}>
                <Typography variant="display1" style={{fontSize: '1.2em', color: '#000000', marginBottom: 2 }}>
                        Assigned Projects
                    </Typography><Divider/>
                </FlexGrid>
            {/*</FlexGrid>*/}
        {/*<Card>*/}
            {/*<CardContent>*/}
                {/*<Typography component="h3">*/}
                    {/*Card content 1*/}
                {/*</Typography>*/}
            {/*</CardContent>*/}
            {/*<CardActions>*/}
                {/*<Button size="small">Learn More</Button>*/}
            {/*</CardActions>*/}
        {/*</Card>*/}
            {/*<br/>*/}
            {/*<Card>*/}
                {/*<CardContent>*/}
                    {/*<Typography component="h3">*/}
                        {/*Card content 2*/}
                    {/*</Typography>*/}
                {/*</CardContent>*/}
                {/*<CardActions>*/}
                    {/*<Button size="small">Learn More</Button>*/}
                {/*</CardActions>*/}
            {/*</Card>*/}
            {/*<br/>*/}
            {/*<Card>*/}
                {/*<CardContent>*/}
                    {/*<Typography component="h3">*/}
                        {/*Card content 3*/}
                    {/*</Typography>*/}
                {/*</CardContent>*/}
                {/*<CardActions>*/}
                    {/*<Button size="small">Learn Again</Button>*/}
                {/*</CardActions>*/}
            {/*</Card>*/}
        </div>
    )
  }
}


export default (DocumentMeta)