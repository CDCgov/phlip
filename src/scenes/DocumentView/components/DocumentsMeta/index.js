import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Button from 'components/Button'
import FlexGrid from 'components/FlexGrid'
import Divider from '@material-ui/core/Divider'
import { connect } from 'react-redux'
import Dropdown from 'components/Dropdown'
import Container, { Row } from 'components/Layout'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Grid from 'components/Grid'
import * as actions from '../../actions'



export class DocumentMeta extends Component {
  constructor(props, context) {
    super(props, context)
  }



    onChangeStatusField = value => {
       // this.props.actions.setFormValues('docStatus', value)
    };

  render() {
      const options = [
          { value: 1, label: 'Draft' },
          { value: 2, label: 'Approved' }
      ];

      console.log('from meta ',this.props);
     //  this.document = this.props.document;
     //  this.projects = this.props.document.projects || [];
     //  this.jurisdictions = this.props.document.jurisdictions || [];
     //
     //  this.projectList =  this.projects.map(proj => {
     //      return state.data.projects.byId[proj] === undefined ? '' : state.data.projects.byId[proj].name
     //  });
     //  this.jurisdictionList = this.jurisdictions.map(jur => {
     //      return state.data.jurisdictions.byId[jur] === undefined ? '' : state.data.jurisdictions.byId[jur].name
     //  });
     // console.log(this.projects);
    return (
        <FlexGrid>
                <FlexGrid raised container style={{ overflow: 'hidden', padding:20, minWidth:'30%'}}>
                    <Typography variant="display1" style={{fontSize: '1.2em', color: '#000000', marginBottom: 2 }}>
                        Document Information
                    </Typography>
                    <Divider/>
                    <Container>
                    <FlexGrid container type='row' style={{flexBasis:'100%'}}>
                        <FlexGrid type='row' style={{flexBasis:'45%', position:'relative'}}>
                            <label style={{position:'absolute', bottom:'0'}}>Document Status:</label>
                        </FlexGrid>
                        <FlexGrid>
                            <Dropdown
                                name="docStatus"
                                id="docStatus"
                                defaultValue="Draft"
                                // label="Status"
                                options={options}
                                input={{
                                    value: this.props.docStatus,
                                    onChange: this.onChangeStatusField
                                }}
                                meta={{}}
                            />
                        </FlexGrid>
                    </FlexGrid>
                    <FlexGrid style={{padding:'5px'}}/>
                    <FlexGrid container type='row' style={{flexBasis:'100%'}}>
                        <FlexGrid type='column' style={{flexBasis:'45%'}}>
                            <label>Effective Date:</label>
                        </FlexGrid>
                        <FlexGrid type='column' style={{flexBasis:'25%'}}>
                            <Typography id='fromDate'>Date 1</Typography>
                        </FlexGrid>
                        <FlexGrid type='column' style={{flexBasis:'25%'}}>
                            <Typography id='toDate'>Date 2</Typography>
                        </FlexGrid>
                        <FlexGrid>
                            <i/>
                        </FlexGrid>
                        {/*<DatePicker id='fromDate' />*/}
                        {/*<DatePicker id='toDate'/>*/}
                    </FlexGrid>
                    <FlexGrid style={{padding:'5px'}}/>
                    <FlexGrid container type='row' style={{flexBasis:'100%'}}>
                        <FlexGrid type='row' style={{width:'45%'}}>
                            <label>Created By:</label>
                        </FlexGrid>
                        <FlexGrid type='column'>
                            <Typography>{this.props.document.uploadedByName}</Typography>
                        </FlexGrid>
                    </FlexGrid>
                    <FlexGrid style={{padding:'5px'}}/>
                    <FlexGrid container type='row' style={{flexBasis:'100%'}}>
                            <FlexGrid type='row' style={{width:'75%'}}>
                                <Typography style={{ cursor: 'pointer' }}>Delete Document</Typography>
                            </FlexGrid>
                            <FlexGrid style={{ flexBasis: '2%' }} />
                            <FlexGrid type='row'>
                                 <Button size='small' color='green'>Update</Button>
                            </FlexGrid>
                    </FlexGrid>
                    </Container>
                </FlexGrid>
                <br/>
            <FlexGrid raised container flex style={{ overflow: 'hidden', flexBasis: '30%', padding:20, minWidth:'30%'}}>
                <FlexGrid container flex type='row'>
                    <FlexGrid flex type='row' style={{flexBasis:'80%', position:'relative'}}>
                        <Typography variant="display1" style={{position:'absolute', fontSize: '1.2em', color: '#000000', bottom: 5 }}>
                        Assigned Jurisdictions
                        </Typography>
                    </FlexGrid>
                    <FlexGrid >
                        <Button size="small" style={{bottom:10}}>Add</Button>
                    </FlexGrid>
                </FlexGrid>
                <Divider/>
                {/*<FlexGrid>*/}
                    {/*<TableRow>*/}
                        {/*/!*<TableCell padding="checkbox">{this.jurisdictionList}</TableCell>*!/*/}
                    {/*</TableRow>*/}
                {/*</FlexGrid>*/}
            </FlexGrid>
            <FlexGrid style={{padding:10}}/>
            <FlexGrid raised container flex style={{ overflow: 'hidden', flexBasis: '30%', padding:20, minWidth:'30%'}}>
                <FlexGrid container flex type='row'>
                    <FlexGrid flex type='row' style={{flexBasis:'80%', position:'relative'}}>
                        <Typography variant="display1" style={{position:'absolute', fontSize: '1.2em', color: '#000000', bottom: 5 }}>
                            Assigned Projects
                        </Typography>
                    </FlexGrid>
                    <FlexGrid >
                        <Button size="small" style={{bottom:10}}>Add</Button>
                    </FlexGrid>
                </FlexGrid>
                <Divider/>
                {/*<TableRow>*/}
                        {/*/!*<TableCell padding="checkbox">{this.projectList}</TableCell>*!/*/}
                    {/*</TableRow>*/}
            </FlexGrid>


        </FlexGrid>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
    const document = ownProps.document || { jurisdictions: [], projects: [] }

    return {
        projectList: document.projects.map(proj => {
            return state.data.projects.byId[proj] === undefined ? '' : state.data.projects.byId[proj].name
        }),
        jurisdictionList: document.jurisdictions.map(jur => {
            return state.data.jurisdictions.byId[jur] === undefined ? '' : state.data.jurisdictions.byId[jur].name
        }),
    }
}
// const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })
export default connect(mapStateToProps)(DocumentMeta)