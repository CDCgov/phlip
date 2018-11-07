import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Grid from 'components/Grid'
import SimpleInput from 'components/SimpleInput'
import DatePicker from 'components/DatePicker'
import Icon from 'components/Icon'
import IconButton from 'components/IconButton'
import Autocomplete from 'components/Autocomplete'
import { convertToLocalDate } from 'utils/normalize'

const fileTypeIcons = {
  'pdf': 'picture_as_pdf',
  'doc.*|rtf': 'library_books',
  'png|jpe?g|tiff': 'insert_photo'
}

/**
 * Determines the file icon to show next to name based on file type (extension)
 * @param extension
 * @returns {string}
 */
const getIconType = extension => {
  let icon = 'library_books'

  for (const type in fileTypeIcons) {
    const regex = new RegExp(type, 'g')
    if (extension.match(regex) !== null) {
      icon = fileTypeIcons[type]
    }
  }
  return icon
}

/**
 * @component
 */
export class FileList extends Component {
  static propTypes = {
    /**
     * Array of documents the user has selected for upload
     */
    selectedDocs: PropTypes.array,

    /**
     * Removes document from selectedDocs array
     */
    handleRemoveDoc: PropTypes.func,

    /**
     * Enables editing on a column and row
     */
    toggleRowEditMode: PropTypes.func,

    /**
     * Gets the list of jurisdiction suggestions for a row
     */
    onGetSuggestions: PropTypes.func,

    /**
     * Clears the list of jurisdiction suggestions for a row
     */
    onClearSuggestions: PropTypes.func
  }

  constructor(props, context) {
    super(props, context)
  }

  /**
   * For when a column property has changed in the file list
   * @param index
   * @param propName
   * @param value
   */
  onDocPropertyChange = (index, propName, value) => {
    this.props.handleDocPropertyChange(index, propName, value)
  }

  /**
   * For getting jurisdiction suggestions
   * @param index
   * @returns {Function}
   */
  getSuggestions = index => searchValue => {
    this.props.onGetSuggestions('jurisdiction', searchValue, index)
  }

  /**
   * For clearing jurisdiction suggestions
   * @param index
   * @returns {Function}
   */
  clearSuggestions = index => () => {
    this.props.onClearSuggestions(index)
  }

  /**
   * Toggle edit mode for a row
   * @returns {*}
   */
  toggleEditMode = (index, property) => () => {
    this.props.toggleRowEditMode(index, property)
  }

  /**
   * When the search field for autocomplete changes
   * @param index
   * @param type
   * @param currentPropValue
   * @returns {Function}
   */
  onAutocompleteChange = (index, type, currentPropValue) => (e, { newValue }) => {
    this.onDocPropertyChange(index, type, {
      ...currentPropValue,
      searchValue: e.target.value
    })
  }

  /**
   * Remove doc
   * @returns {*}
   */
  handleRemoveDoc = index => () => {
    this.props.handleRemoveDoc(index)
  }

  render() {
    const columns = [
      'File Name',
      'Jurisdiction',
      'Citation',
      'Effective Date'
    ]

    const columnSizing = `20px minmax(${300}px, 1fr) 210px 210px 230px 45px`
    const wrapperRowSizing = '1fr'
    const headerStyle = { fontSize: '18px', borderBottom: '1px solid black', padding: '10px 10px' }
    const colStyle = { fontSize: 13, alignSelf: 'center', margin: '0 10px' }
    const { selectedDocs, duplicateFiles } = this.props

    return (
      <Grid rowSizing="55px 1fr" columnSizing="1fr" style={{ overflow: 'auto', flex: 1 }}>
        <Grid columnSizing={columnSizing} rowSizing={wrapperRowSizing} style={{ padding: '10px 0 0 0' }}>
          <div style={{ borderBottom: '1px solid black' }} />
          {columns.map((column, i) => (
            <div style={headerStyle} key={`file-list-col-${i}`}>
              {column}
            </div>
          ))}
          <div style={{ borderBottom: '1px solid black' }} />
        </Grid>
        <Grid columnSizing="1fr" autoRowSizing="60px" style={{ flex: 1 }}>
          {selectedDocs.map((doc, i) => {
            const isDuplicate = duplicateFiles.find(file => file.name === doc.name.value) !== undefined
            const pieces = doc.name.value.split('.')
            const extension = pieces[pieces.length - 1]
            const iconName = getIconType(extension)
            const bgColor = i % 2 === 0
              ? '#f9f9f9'
              : '#fff'

            return (
              <Grid
                key={`file-list-row-${i}`}
                columnSizing={columnSizing}
                rowSizing="44px"
                style={{ backgroundColor: bgColor, padding: '8px 0' }}>
                <div />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {isDuplicate &&
                  <Icon size={25} style={{ alignSelf: 'center', marginRight: 5 }} color="#fc515a">error</Icon>}
                  {!isDuplicate && <Icon size={20} style={{ alignSelf: 'center', marginRight: 5 }}>{iconName}</Icon>}
                  <div style={colStyle}>{doc.name.value}</div>
                </div>
                {doc.jurisdictions.editable === true
                  ? doc.jurisdictions.inEditMode
                    ? (
                      <div style={{ ...colStyle, position: 'relative' }}>
                        <Autocomplete
                          suggestions={doc.jurisdictions.value.suggestions}
                          handleGetSuggestions={this.getSuggestions(i)}
                          handleClearSuggestions={this.clearSuggestions(i)}
                          InputProps={{ placeholder: 'Search jurisdictions', error: !!doc.jurisdictions.error }}
                          focusInputOnSuggestionClick={false}
                          inputProps={{
                            value: doc.jurisdictions.value.searchValue,
                            onChange: this.onAutocompleteChange(i, 'jurisdictions', doc.jurisdictions.value),
                            id: `jurisdiction-name-row-${i}`
                          }}
                          handleSuggestionSelected={(event, { suggestionValue }) => {
                            this.onDocPropertyChange(i, 'jurisdictions', {
                              ...suggestionValue,
                              searchValue: suggestionValue.name
                            })
                          }}
                        />
                      </div>)
                    : <IconButton onClick={this.toggleEditMode(i, 'jurisdictions')} color="primary" style={colStyle}>
                      add
                    </IconButton>
                  : <div style={colStyle}>{doc.jurisdictions.value.name}</div>
                }
                {doc.citation.editable === true
                  ? doc.citation.inEditMode
                    ? <SimpleInput
                      fullWidth={false}
                      multiline={false}
                      style={colStyle}
                      value={doc.citation.value}
                      onChange={e => this.onDocPropertyChange(i, 'citation', e.target.value)}
                    />
                    : <IconButton onClick={this.toggleEditMode(i, 'citation')} color="primary" style={colStyle}>
                      add
                    </IconButton>
                  : <div style={colStyle}>{doc.citation.value}</div>
                }
                {doc.effectiveDate.editable === true
                  ? doc.effectiveDate.inEditMode === true
                    ? <div style={colStyle}>
                      <DatePicker
                        name="effectiveDate"
                        dateFormat="MM/DD/YYYY"
                        onChange={date => this.onDocPropertyChange(i, 'effectiveDate', date)}
                        onInputChange={e => this.onDocPropertyChange(i, 'effectiveDate', e.target.value)}
                        value={doc.effectiveDate.value}
                        autoOk={true}
                        style={{ marginTop: 0 }}
                      />
                    </div>
                    : <IconButton onClick={this.toggleEditMode(i, 'effectiveDate')} color="primary" style={colStyle}>
                      add
                    </IconButton>
                  : <div style={colStyle}>{convertToLocalDate(doc.effectiveDate.value.split('T')[0])}</div>
                }
                <IconButton
                  style={{ justifySelf: 'flex-end', ...colStyle }}
                  onClick={this.handleRemoveDoc(i)}
                  iconSize={24}
                  color="primary">
                  cancel
                </IconButton>
              </Grid>
            )
          })}
        </Grid>
      </Grid>
    )
  }
}

export default FileList