import React from 'react'
import PropTypes from 'prop-types'
import FlexGrid from 'components/FlexGrid'
import SearchBar from 'components/SearchBar2'
import Autocomplete from 'components/Autocomplete'
import FormModal from 'components/FormModal'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Icon from 'components/Icon'
import Dropdown from 'components/Dropdown'
import Button from 'components/Button'
import DatePicker from 'components/DatePicker'
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField'
import Form from 'components/Form'

export const SearchBox = props => {

    const {
        onSearchDocs,
        searchValue,
        projectSuggestions,
        jurisdictionSuggestions,
        projectSearchValue,
        jurisdictionSearchValue,
        uploadedDateSearchValue,
        onClearSuggestions,
        onGetSuggestions,
        onSearchValueChange,
        onSuggestionSelected,
        onChangeStatusField,
        handleDocPropertyChange,
        currentUser,
        handleDateChange,
        showSearchBox,
        onShowSearchBox,
        onDocNameSearchChange,
        onSearchDateRangeChange,
        onUploadedDateChange,
        onUploadByChange,
        onSearchSubmit,
        onSearchCancel

    } = props

    const options = [
        { value: 'Draft', label: 'Draft' }, { value: 'Approved', label: 'Approved' }
    ]

    const dateOptions = [
        { value: '1', label: '1 day'},{value:'7', label:'1 week'},{value: '30', label:'1 month'}
    ]
    const colStyle = {
        fontSize: 14, border: 'none', borderBottom: '1px solid green'
    }
    const iconColor = '#949494';

    return (
            <FlexGrid container raised style={{position:'absolute'}}>
                    <FlexGrid style={{display:'flex',width:'100%',border:'1px solid #949494', borderRadius:'5px'}}>
                        <FlexGrid style={{width:'95%', lineHeight: '50px'}} >
                            <SearchBar
                                placeholder="Search"
                                style={{ marginRight: 15, lineHeight:30, verticalAlign:'middle' }}
                                fullWidth
                                searchValue={searchValue}
                                handleSearchValueChange={onSearchDocs}
                                searchIcon = "search"
                            />
                        </FlexGrid>
                        <IconButton style={{background:'transparent', border:'none', alignment:'baseline'}} onClick={onShowSearchBox}>
                            <Icon size={30}>arrow_drop_down</Icon>
                        </IconButton>
                    </FlexGrid>
                {/*<FlexGrid padding="5px 0 0 0"/>*/}
                {showSearchBox?(
                <FlexGrid raised container style={{overflow: 'auto'}}>
                    <Form form='searchForm'>
                    <FlexGrid container padding={15}>
                        <FlexGrid container type="row" align="center" style={{marginBottom: 30}}>
                            <Typography variant="body1" style={{padding: '0 5px'}}>
                                Project:
                            </Typography>
                            {/*<input*/}
                            {/*name="projectSearch"*/}
                            {/*style={colStyle}*/}
                            {/*defaultValue={''}*/}
                            {/*// onChange={e => onUploadByChange(i, 'uploadedBy', e.target.value)}*/}
                            {/*/>*/}
                            <FlexGrid container type="row" align="flex-end" style={{ marginLeft: 15 }}>
                                <Autocomplete
                                    suggestions={projectSuggestions}
                                    handleGetSuggestions={val => onGetSuggestions('project', val)}
                                    handleClearSuggestions={() => onClearSuggestions('project')}
                                    inputProps={{
                                        value: projectSearchValue,
                                        onChange: (e, { newValue }) => {
                                            if (e.target.value === undefined) {
                                                onSearchValueChange('project', newValue.name)
                                            } else {
                                                onSearchValueChange('project', e.target.value)
                                            }
                                        },
                                        id: 'project-name'
                                    }}
                                    style={{ width: '100%', marginRight: 15 }}
                                    InputProps={{
                                    }}
                                    showSearchIcon
                                    handleSuggestionSelected={onSuggestionSelected('project')}
                                />
                            </FlexGrid>
                        </FlexGrid>
                        <FlexGrid container type="row" align="center" style={{marginBottom: 30}}>
                            <Typography variant="body1" style={{padding: '0 5px'}}>
                                Jurisdiction :
                            </Typography>
                            {/*<input*/}
                            {/*name="jurisdictionSearch"*/}
                            {/*style={colStyle}*/}
                            {/*defaultValue={''}*/}
                            {/*// onChange={e => onUploadByChange(i, 'uploadedBy', e.target.value)}*/}
                            {/*/>*/}
                            <FlexGrid container type="row" align="flex-end" style={{ marginLeft: 15 }}>
                                <Autocomplete
                                    suggestions={jurisdictionSuggestions}
                                    handleGetSuggestions={val => onGetSuggestions('jurisdiction', val)}
                                    handleClearSuggestions={() => onClearSuggestions('jurisdiction')}
                                    showSearchIcon
                                    inputProps={{
                                        value: jurisdictionSearchValue,
                                        onChange: (e, { newValue }) => {
                                            if (e.target.value === undefined) {
                                                onSearchValueChange('jurisdiction', newValue.name)
                                            } else {
                                                onSearchValueChange('jurisdiction', e.target.value)
                                            }
                                        },
                                        id: 'jurisdiction-name'
                                    }}
                                    handleSuggestionSelected={onSuggestionSelected('jurisdiction')}
                                    InputProps={{
                                    }}
                                />
                            </FlexGrid>
                        </FlexGrid>
                        <FlexGrid container type="row" align="center" style={{marginBottom: 30}}>
                            {/*<Icon color={iconColor}><Account /></Icon>*/}
                            <Typography variant="body1" style={{padding: '0 5px'}}>
                                Document Name:
                            </Typography>
                            <input
                                name = "docNameSearchValue"
                                style={colStyle}
                            //    value = {docNameSearchValue}
                                onChange={e => onDocNameSearchChange(e.target.value)}
                            />
                        </FlexGrid>
                        <FlexGrid container type="row" align="center" style={{marginBottom: 25}}>
                            {/*<Icon color={iconColor}><CalendarRange /></Icon>*/}
                            <Typography variant="body1" style={{padding: '0 5px'}}>
                                Uploaded date:
                            </Typography>
                            {/*<Dropdown name="uploadDateRange"*/}
                                      {/*id="uploadDateRange"*/}
                                      {/*options={dateOptions}*/}
                                      {/*input={{*/}
                                          {/*value: '1d', onChange: {onSearchDateRangeChange}*/}
                                      {/*}}*/}
                                      {/*formControlStyle={{minWidth: 180}}*/}
                                      {/*meta={{}}/>*/}
                            <DatePicker
                                name="uploadedDateSearch"
                                dateFormat="MM/DD/YYYY"
                                onChange={date => {
                                    onUploadedDateChange(date)
                                }}
                                onInputChange={e => onUploadedDateChange(e.target.value)}
                                value={uploadedDateSearchValue}
                                autoOk={true}
                                style={{marginTop: 0}}
                            />
                        </FlexGrid>
                        <FlexGrid container type="row" align="center" style={{marginBottom: 30}}>
                            {/*<Icon color={iconColor}><Account /></Icon>*/}
                            <Typography variant="body1" style={{padding: '0 5px'}}>
                                Uploaded by:
                            </Typography>
                            <input
                                name='uploadedbySearch'
                                style={colStyle}
                               // value = {uploadedBySearchValue}
                                onChange={e => onUploadByChange(e.target.value)}
                            />
                        </FlexGrid>
                        <FlexGrid container type="row" align="flex-end" justify="space-between" style={{paddingTop:'15px'}}>
                            <Button
                                value={'Cancel'}
                                size="small"
                                color="accent"
                                style={{ padding: '0 15px' }}
                                onClick={onSearchCancel}
                            />
                            <Button
                                value={'Submit'}
                                size="small"
                                color="accent"
                                style={{ padding: '0 15px' }}
                                onClick={onSearchSubmit}
                            />
                        </FlexGrid>
                    </FlexGrid>
                    </Form>
                </FlexGrid>):''}

            </FlexGrid>
    )
}

export default SearchBox