import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Grid from 'components/Grid'
import SimpleInput from 'components/SimpleInput'
import FlexGrid from 'components/FlexGrid'
import Icon from 'components/Icon'

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

const FileList = props => {
  const columns = [
    'File Name',
    'Jurisdictions',
    'Citation',
    'Effective Date'
  ]

  const docProps = [
    'name',
    'jurisdictions',
    'citation',
    'effectiveDate'
  ]

  const columnSizing = `minmax(${400}px, 1fr) 210px 210px 210px`
  const wrapperRowSizing = '1fr'

  const {
    selectedDocs,
    handleChangeDocProperty
  } = props

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
          const pieces = doc.name.split('.')
          const extension = pieces[pieces.length - 1]
          const iconName = getIconType(extension)

          const bgColor = i % 2 === 0
            ? '#f9f9f9'
            : '#fff'

          return (
            <Grid
              key={`file-list-row-${i}`}
              columnSizing={`30px ${columnSizing}`}
              rowSizing="1fr"
              style={{ backgroundColor: bgColor, padding: '10px 20px' }}>
              <Icon size={20} style={{ alignSelf: 'center' }}>{iconName}</Icon>
              {docProps.map((prop, x) => {
                return (
                  <Fragment key={`file-list-row-${i}-col-${x}`}>
                  {doc[prop].length === 0
                    ? <SimpleInput fullWidth={false} multiline={false} style={{ margin: '0 5px' }}></SimpleInput>
                    : <div style={{ fontSize: 13, alignSelf: 'center', margin: '0 5px' }}>
                      {doc[prop]}
                    </div>}
                  </Fragment>
                )
              })}
            </Grid>
          )
        })}
      </Grid>
    </>
  )

}

export default FileList