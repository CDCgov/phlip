import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Button from 'components/Button'
import FlexGrid from 'components/FlexGrid'
import Divider from '@material-ui/core/Divider'
import { connect } from 'react-redux'
import Dropdown from 'components/Dropdown'
import { FileDocument, CalendarRange, Account, FormatSection } from 'mdi-material-ui'
import Icon from 'components/Icon'

export class DocumentMeta extends Component {
  constructor(props, context) {
    super(props, context)
  }

  onChangeStatusField = value => {
    // this.props.actions.setFormValues('docStatus', value)
  }

  render() {
    const options = [
      { value: 1, label: 'Draft' },
      { value: 2, label: 'Approved' }
    ]

    const iconColor = '#949494'

    return (
      <>
        <FlexGrid raised container style={{ overflow: 'hidden', minWidth: '30%', marginBottom: 25, height: '33%' }}>
          <Typography variant="body2" style={{ padding: 10, color: 'black' }}>
            Document Information
          </Typography>
          <Divider />
          <FlexGrid container padding={15}>
            <FlexGrid container type="row" align="center" style={{ marginBottom: 15 }}>
              <Icon color={iconColor}><FileDocument /></Icon>
              <Typography variant="body1" style={{ padding: '0 5px' }}>Status:</Typography>
              <Dropdown
                name="docStatus"
                id="docStatus"
                defaultValue={1}
                options={options}
                input={{
                  value: this.props.document.status === 'Draft' ? 1 : 2,
                  onChange: this.onChangeStatusField,
                  id: 'docStatus'
                }}
                formControlStyle={{ minWidth: 180 }}
                meta={{}}
              />
            </FlexGrid>
            <FlexGrid container type="row" align="center" style={{ marginBottom: 15 }}>
              <Icon color={iconColor}><FormatSection /></Icon>
              <Typography variant="body1" style={{ padding: '0 5px' }}>
                Citation: {this.props.document.citation}
              </Typography>
            </FlexGrid>
            <FlexGrid container type="row" align="center" style={{ marginBottom: 15 }}>
              <Icon color={iconColor}><CalendarRange /></Icon>
              <Typography variant="body1" style={{ padding: '0 5px' }}>
                Effective Date: {this.props.document.effectiveDate}
              </Typography>
            </FlexGrid>
            <FlexGrid container type="row" align="center" style={{ marginBottom: 30 }}>
              <Icon color={iconColor}><Account /></Icon>
              <Typography variant="body1" style={{ padding: '0 5px' }}>
                {this.props.document.uploadedByName}
              </Typography>
            </FlexGrid>
            <FlexGrid container type="row" align="center" justify="space-between">
              <Typography style={{ cursor: 'pointer' }} color="secondary">Delete Document</Typography>
              <Button size="small" color="accent" style={{ padding: '0 15px' }}>Update</Button>
            </FlexGrid>
          </FlexGrid>
        </FlexGrid>

        <FlexGrid
          raised
          container
          flex
          style={{ overflow: 'hidden', minWidth: '30%', height: '33%', marginBottom: 25 }}>
          <FlexGrid container type="row" align="center" justify="space-between" padding={10}>
            <Typography variant="body2" style={{ color: 'black' }}>
              Assigned Projects
            </Typography>
            <Button size="small" color="white" style={{ color: 'black' }}>Add</Button>
          </FlexGrid>
          <Divider />
          <FlexGrid type="row" padding={10}>
             {this.props.projectList.map((item, index) => (
               <Typography
                 style={{ padding: 8, backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}
                 key={`project-${index}`}>{item}</Typography>
             ))}
            </FlexGrid>
        </FlexGrid>

        <FlexGrid raised container flex style={{ overflow: 'hidden', minWidth: '30%', height: '33%' }}>
          <FlexGrid container type="row" align="center" justify="space-between" padding={10}>
            <Typography variant="body2" style={{ color: 'black' }}>
              Assigned Jurisdictions
            </Typography>
            <Button size="small" color="white" style={{ color: 'black' }}>Add</Button>
          </FlexGrid>
          <Divider />
          <FlexGrid type="row" padding={10}>
            {this.props.jurisdictionList.map((item, index) => (
              <Typography
                style={{ padding: 8, backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}
                key={`jurisdiction-${index}`}>{item}</Typography>
            ))}
            </FlexGrid>
        </FlexGrid>
      </>
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
    })
  }
}
// const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })
export default connect(mapStateToProps)(DocumentMeta)