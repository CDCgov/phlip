import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Grid from 'components/Grid'
import SimpleInput from 'components/SimpleInput'
import DatePicker from 'components/DatePicker'
import Icon from 'components/Icon'
import IconButton from 'components/IconButton'
import Autocomplete from 'components/Autocomplete'

const fileTypeIcons = {
  'pdf': 'picture_as_pdf',
  'doc.*|rtf': 'library_books',
  'png|jpe?g|tiff': 'insert_photo'
}

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

export class FileList extends Component {
  constructor(props, context) {
    super(props, context)
  }

  onDocPropertyChange = (index, propName, value) => {
    this.props.handleDocPropertyChange(index, propName, value)
  }

  render() {
    const columns = [
      'File Name',
      'Jurisdiction',
      'Citation',
      'Effective Date'
    ]

    const columnSizing = `20px minmax(${350}px, 1fr) 210px 210px 230px 45px`
    const wrapperRowSizing = '1fr'

    const {
      selectedDocs,
      handleRemoveDoc,
      toggleRowEditMode,
      onGetSuggestions,
      onClearSuggestions
    } = this.props

    return (
      <Grid rowSizing="55px 1fr" columnSizing="1fr" style={{ overflow: 'auto', flex: 1 }}>
        <Grid columnSizing={columnSizing} rowSizing={wrapperRowSizing} style={{ padding: '10px 0 0 0' }}>
          <div style={{ borderBottom: '1px solid black' }} />
          {columns.map((column, i) => {
            return <div
              style={{ fontSize: '18px', borderBottom: '1px solid black', padding: '10px 5px' }}
              key={`file-list-col-${i}`}>{column}</div>
          })}
          <div style={{ borderBottom: '1px solid black' }} />
        </Grid>
        <Grid columnSizing="1fr" autoRowSizing="60px" style={{ flex: 1 }}>
          {selectedDocs.map((doc, i) => {
            const pieces = doc.name.value.split('.')
            const extension = pieces[pieces.length - 1]
            const iconName = getIconType(extension)

            const bgColor = i % 2 === 0
              ? '#f9f9f9'
              : '#fff'

            const colStyle = { fontSize: 13, alignSelf: 'center', margin: '0 5px' }

            return (
              <Grid
                key={`file-list-row-${i}`}
                columnSizing={columnSizing}
                rowSizing="1fr"
                style={{ backgroundColor: bgColor, padding: '8px 0' }}>
                <div />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Icon size={20} style={{ alignSelf: 'center', marginRight: 5 }}>{iconName}</Icon>
                  <div style={colStyle}>{doc.name.value}</div>
                </div>
                {doc.jurisdictions.editable === true
                  ? doc.jurisdictions.inEditMode
                    ? <Autocomplete
                      suggestions={doc.jurisdictions.value.suggestions}
                      handleGetSuggestions={val => onGetSuggestions('jurisdiction', val, i)}
                      handleClearSuggestions={() => onClearSuggestions(i)}
                      inputProps={{
                        value: doc.jurisdictions.value.searchValue,
                        onChange: (e, { newValue, method }) => this.onDocPropertyChange(i, 'jurisdictions', {
                          ...doc.jurisdictions.value,
                          searchValue: newValue,
                        }),
                        id: `jurisdiction-name-row-${i}`
                      }}
                      focusInputOnSuggestionClick={false}
                      handleSuggestionSelected={(event, { suggestionValue }) => {
                        this.onDocPropertyChange(i, 'jurisdictions', {
                          ...suggestionValue,
                          searchValue: suggestionValue.name
                        })
                      }}
                      InputProps={{
                        placeholder: 'Search jurisdictions'
                      }}
                    />
                    : <IconButton
                      onClick={() => toggleRowEditMode(i, 'jurisdictions')}
                      color="primary"
                      style={colStyle}>
                      add
                    </IconButton>
                  : <div style={colStyle}>{doc.jurisdictions.value}</div>
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
                    : <IconButton
                      onClick={() => toggleRowEditMode(i, 'citation')}
                      color="primary"
                      style={colStyle}>
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
                    : <IconButton
                      onClick={() => toggleRowEditMode(i, 'effectiveDate')}
                      color="primary"
                      style={colStyle}>
                      add
                    </IconButton>
                  : <div style={colStyle}>{doc.effectiveDate.value}</div>
                }
                <IconButton
                  style={{ justifySelf: 'flex-end', ...colStyle, paddingRight: 20 }}
                  onClick={() => handleRemoveDoc(i)}
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

FileList.propTypes = {
  selectedDocs: PropTypes.array,
  handleRemoveDoc: PropTypes.func,
  toggleRowEditMode: PropTypes.func,
  onGetSuggestions: PropTypes.func,
  onClearSuggestions: PropTypes.func
}

export default FileList