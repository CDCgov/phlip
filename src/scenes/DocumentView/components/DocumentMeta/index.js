import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Button from 'components/Button'
import FlexGrid from 'components/FlexGrid'
import Divider from '@material-ui/core/Divider'
import { connect } from 'react-redux'
import Dropdown from 'components/Dropdown'
import { FileDocument, CalendarRange, Account, FormatSection } from 'mdi-material-ui'
import Icon from 'components/Icon';
import moment from 'moment';
import TextLink from 'components/TextLink';
import { Row } from 'components/Layout'
import DatePicker from 'components/DatePicker'
import Container, { Column } from 'components/Layout'
import { Alert, withFormAlert, CircularLoader, Grid } from 'components'
import Modal, { ModalTitle, ModalContent, ModalActions } from 'components/Modal'
import actions, { projectAutocomplete, jurisdictionAutocomplete } from './actions'
import {bindActionCreators} from 'redux';
import ProJurSearch from './components/ProJurSearch';



export class DocumentMeta extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
          selectedDocStatus : {value : 1},
          isEditMode : false,
          showAddJurisdiction: false,
          showAddProject : false,
          showModal : false
      };
    this.onChangeStatusField = this.onChangeStatusField.bind(this);
    this.handleEditMode = this.handleEditMode.bind(this);
    // this.onCitationPropertyChange = this.onCitationPropertyChange.bind(this);
    console.log('props passed to docMeta ', props)
  }


  showAddProjModal = () => {
    this.setState({
        showAddJurisdiction:false,
        showModal: true
    })
  };

  showAddJurModal = () => {
        this.setState({
            showAddJurisdiction:true,
            showModal: true
        })
    };

  onCloseModal = () => {
        // if (this.props.selectedDocs.length > 0) {
        //     this.setState({
        //         alertActions: [
        //             this.dismissAlertAction,
        //             {
        //                 value: 'Continue',
        //                 type: 'button',
        //                 otherProps: { 'aria-label': 'Continue' },
        //                 onClick: this.goBack
        //             }
        //         ]
        //     }, () => this.props.actions.openAlert('Your unsaved changes will be lost.'))
        // } else {

              this.setState({showModal: false})

        // }
    };

  onChangeStatusField = selectedOption => {
    this.setState({selectedDocStatus:{value:selectedOption}})
  };


  onDocPropertyChange = (index, propName, value) => {
        console.log(propName, value);
        // this.props.handleDocPropertyChange(index, propName, value)
  }


  handleEditMode() {
        this.setState(function(prevState) {
            return {isEditMode: !prevState.isEditMode};
        });
    }

    /**
     * Handles when a user has updated a document property in the file list
     * @param index
     * @param propName
     * @param value
     */
    handleDocPropertyChange = (index, propName, value) => {
        this.props.actions.updateDocumentProperty(index, propName, value)
    }

    /**
     * Get suggestions for some type of autocomplete search
     * @param suggestionType
     * @param searchString
     * @param index
     */
    handleGetSuggestions = (suggestionType, { value: searchString }, index = null) => {
        suggestionType === 'project'
            ? this.props.actions.projectAutocomplete.searchForSuggestionsRequest(searchString, '')
            : this.props.actions.jurisdictionAutocomplete.searchForSuggestionsRequest(searchString, '', index)
    }

    /**
     * When a user has chosen a suggestion from the autocomplete project or jurisdiction list
     */
    handleSuggestionSelected = (suggestionType) => (event, { suggestionValue }) => {
        console.log('selected value ', suggestionValue);
        if (suggestionType === 'project') {
            this.props.actions.projectAutocomplete.onSuggestionSelected(suggestionValue);
            dispatch({ type: projectTypes.ADD_PROJECT, payload: suggestionValue })
            this.props.actions.updateDocumentProperty(this.props.document._id,'projects',suggestionValue)
        }
        else {
            this.props.actions.jurisdictionAutocomplete.onSuggestionSelected(suggestionValue);
            this.props.actions.updateDocumentProperty(this.props.document._id, 'jurisdictions', suggestionValue);
        }
        this.props.actions.updateDocRequest(this.props.document._id);
        this.onCloseModal;
    }

    handleSearchValueChange = (suggestionType, value) => {
        suggestionType === 'jurisdiction'
            ? this.props.actions.jurisdictionAutocomplete.updateSearchValue(value)
            : this.props.actions.projectAutocomplete.updateSearchValue(value)
    }

    handleClearSuggestions = suggestionType => {
        suggestionType === 'jurisdiction'
            ? this.props.actions.jurisdictionAutocomplete.clearSuggestions()
            : this.props.actions.projectAutocomplete.clearSuggestions()
    }

  render() {
    const options = [
      { value: 1, label: 'Draft' },
      { value: 2, label: 'Approved' }
    ];

      const closeButton = {
          value: 'Close',
          type: 'button',
          otherProps: { 'aria-label': 'Close modal' },
          onClick: this.onCloseModal
      }

      const alertActions = [
          {
              value: 'Cancel',
              type: 'button',
              onClick: this.cancelDelete
          },
          {
              value: 'Continue',
              type: 'button',
              onClick: this.continueDelete
          }
      ];


      const colStyle = { fontSize: 14, border:'none',
      borderBottom: '1px solid green' }
    const iconColor = '#949494';
    const dateWithoutTime = this.props.document.hasOwnProperty('effectiveDate')
      ? this.props.document.effectiveDate.split('T')[0]
      : ''

    const date = moment(dateWithoutTime).format('M/D/YYYY')

    const modalActions = [closeButton];

    return (
      <>
        <FlexGrid raised container style={{ overflow: 'hidden', minWidth: '30%', marginBottom: 25 }}>
          <Typography variant="body2" style={{ padding: 10, color: 'black' }}>
            Document Information
          </Typography>
          <Divider />
          <FlexGrid container padding={15}>
            <FlexGrid container type="row" align="center" style={{ marginBottom: 25 }}>
              <Icon color={iconColor}><FileDocument /></Icon>
              <Typography variant="body1" style={{ padding: '0 5px' }}>Status:</Typography>
              <Dropdown disabled={!this.state.isEditMode}
                name="selecteDocStatus"
                id="selectedDocStatus"
                options={options}
                input={{
                  value: this.state.selectedDocStatus.value,
                  onChange: this.onChangeStatusField
                }}
                formControlStyle={{ minWidth: 180 }}
                meta={{}}
              />
            </FlexGrid>
            <FlexGrid container type="row" align="center" style={{ marginBottom: 25 }}>
              <Icon color={iconColor}><FormatSection /></Icon>
              <Typography variant="body1" style={{ padding: '0 5px' }}>
                Citation:
              </Typography>
                {this.state.isEditMode
                    ? (<input
                        style={colStyle}
                        defaultValue={this.props.document.citation}
                        onChange={e => this.onDocPropertyChange(i, 'citation', e.target.value)}
                    />):
                    <Typography>{this.props.document.citation}</Typography>
                }
            </FlexGrid>
            <FlexGrid container type="row" align="center" style={{ marginBottom: 25 }}>
              <Icon color={iconColor}><CalendarRange /></Icon>
              <Typography variant="body1" style={{ padding: '0 5px' }}>
                Effective Date:
              </Typography>
                {this.state.isEditMode
                    ?(
                        <DatePicker
                            name="effectiveDate"
                            dateFormat="MM/DD/YYYY"
                            onChange={date => this.onDocPropertyChange(i, 'effectiveDate', date)}
                            onInputChange={e => this.onDocPropertyChange(i, 'effectiveDate', e.target.value)}
                            value={this.props.document.effectiveDate}
                            autoOk={true}
                            style={{ marginTop: 0 }}
                        />
                    ):
                    <Typography>{date}</Typography>
                }
            </FlexGrid>
            <FlexGrid container type="row" align="center" style={{ marginBottom: 30 }}>
              <Icon color={iconColor}><Account /></Icon>
              <Typography variant="body1" style={{ padding: '0 5px' }}>
                {this.props.document.uploadedByName}
              </Typography>
            </FlexGrid>
            <FlexGrid container type="row" align="center" justify="space-between">
              <Typography style={{ cursor: 'pointer' }} color="secondary">Delete Document</Typography>
              <Button value={this.state.isEditMode ? 'Update' : 'Edit'} size="small" color="accent" style={{ padding: '0 15px' }} onClick={this.handleEditMode} />
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
            <Button onClick={this.showAddProjModal} value="Add" style={{ backgroundColor: 'white', color: 'black' }} aria-label="Add jurisdiction to document" />
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
                <Button onClick={this.showAddJurModal} value="Add" style={{ backgroundColor: 'white', color: 'black' }} aria-label="Add jurisdiction to document" />

          </FlexGrid>
          <Divider />
          <FlexGrid type="row" padding={10}>
            {this.props.jurisdictionList.map((item, index) => (
              <Typography
                style={{ padding: 8, backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}
                key={`jurisdiction-${index}`}>{item}</Typography>
            ))}
            </FlexGrid>
            <Modal onClose={this.onCloseModal} open={this.state.showModal} maxWidth="sm" hideOverflow>
                {this.props.alertOpen &&
                <Alert actions={this.state.alertActions} open={this.props.alertOpen} title={this.props.alertTitle}>
                    {this.props.alertText}
                </Alert>}
                <ModalTitle
                    title="Document Detail"
                />
                <Divider />
                <ModalContent style={{ display: 'flex', flexDirection: 'column', height: '50%' }}>
                    <Grid container type="row" align="center" justify="space-between" padding={10}>
                        <ProJurSearch
                            jurisdictionSuggestions={this.props.jurisdictionSuggestions}
                            projectSuggestions={this.props.projectSuggestions}
                            onClearSuggestions={this.handleClearSuggestions}
                            onGetSuggestions={this.handleGetSuggestions}
                            onSearchValueChange={this.handleSearchValueChange}
                            onSuggestionSelected={this.handleSuggestionSelected}
                            jurisdictionSearchValue={this.props.jurisdictionSearchValue}
                            projectSearchValue={this.props.projectSearchValue}
                            showProjectError={this.props.noProjectError === true}
                            showJurSearch={this.state.showAddJurisdiction === true}
                        />
                    </Grid>
                </ModalContent>
                <Divider />
                <ModalActions actions={modalActions} />
            </Modal>

        </FlexGrid>
      </>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const document = ownProps.document || { jurisdictions: [], projects: [], status: 1 }

  return {
    projectList: document.projects.map(proj => {
      return state.data.projects.byId[proj] === undefined ? '' : state.data.projects.byId[proj].name
    }),
    jurisdictionList: document.jurisdictions.map(jur => {
      return state.data.jurisdictions.byId[jur] === undefined ? '' : state.data.jurisdictions.byId[jur].name
    }),
    projectSuggestions: state.scenes.docManage.upload.projectSuggestions.suggestions,
    jurisdictionSuggestions: state.scenes.docManage.upload.jurisdictionSuggestions.suggestions,
    projectSearchValue: state.scenes.docManage.upload.projectSuggestions.searchValue,
    jurisdictionSearchValue: state.scenes.docManage.upload.jurisdictionSuggestions.searchValue,
    // selectedJurisdiction: {},
    // selectedProject: {},
    // noProjectError: state.scenes.docManage.upload.list.noProjectError,



  }
}

const mapDispatchToProps = dispatch => ({
    actions: {
        ...bindActionCreators(actions, dispatch),
        projectAutocomplete: bindActionCreators(projectAutocomplete, dispatch),
        jurisdictionAutocomplete: bindActionCreators(jurisdictionAutocomplete, dispatch),
        // addJurisdiction: bindActionCreators(addJurisdiction,dispatch)
    }
})


// const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })
export default connect(mapStateToProps, mapDispatchToProps)(DocumentMeta)