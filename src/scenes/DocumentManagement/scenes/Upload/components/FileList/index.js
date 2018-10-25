import React, { Fragment, Component } from 'react'
import PropTypes from 'prop-types'
import Grid from 'components/Grid'
import SimpleInput from 'components/SimpleInput'
import DatePicker from 'components/DatePicker'
import Icon from 'components/Icon'
import IconButton from 'components/IconButton'

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
      'Jurisdictions',
      'Citation',
      'Effective Date'
    ]

    const columnSizing = `minmax(${350}px, 1fr) 210px 210px 230px 50px`
    const wrapperRowSizing = '1fr'

    const {
      selectedDocs,
      handleRemoveDoc
    } = this.props

    return (
      <>
        <Grid columnSizing={columnSizing} rowSizing={wrapperRowSizing} style={{ padding: '10px 20px' }}>
        {columns.map((column, i) => {
          return <div style={{ fontSize: '18px', margin: '0 5px' }} key={`file-list-col-${i}`}>{column}</div>
        })}
      </Grid>
      <div style={{ borderTop: '1px solid black' }} />
      <Grid columnSizing="1fr" autoRowSizing="50px" style={{ overflow: 'auto' }}>
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
              columnSizing={`30px ${columnSizing}`}
              rowSizing="1fr"
              style={{ backgroundColor: bgColor, padding: '10px 20px' }}>
              <Icon size={20} style={{ alignSelf: 'center' }}>{iconName}</Icon>
              <div style={colStyle}>{doc.name.value}</div>
              {doc.jurisdictions.editable === true
                ? <SimpleInput
                  fullWidth={false}
                  multiline={false}
                  style={colStyle}
                  value={doc.jurisdictions.value}
                  onChange={e => this.onDocPropertyChange(i, 'jurisdictions', e.target.value)}
                />
                : <div style={colStyle}>{doc.jurisdictions.value}</div>
              }
              {doc.citation.editable === true
                ? <SimpleInput
                  fullWidth={false}
                  multiline={false}
                  style={colStyle}
                  value={doc.citation.value}
                  onChange={e => this.onDocPropertyChange(i, 'citation', e.target.value)}
                />
                : <div style={colStyle}>{doc.citation.value}</div>
              }
              {doc.effectiveDate.editable === true
                ? <div style={colStyle}>
                  <DatePicker
                    name="effectiveDate"
                    dateFormat="MM/DD/YYYY"
                    onChange={date => this.onDocPropertyChange(i, 'effectiveDate', date)}
                    value={doc.effectiveDate.value}
                    autoOk={true}
                    style={{ marginTop: 0 }}
                  />
                </div>
                : <div style={colStyle}>{doc.effectiveDate.valie}</div>
              }
              <IconButton style={{ justifySelf: 'flex-end', ...colStyle }} onClick={() => handleRemoveDoc(i)} iconSize={24} color="primary">
                cancel
              </IconButton>
            </Grid>
          )
        })}
      </Grid>
      </>
    )
  }
}

export default FileList