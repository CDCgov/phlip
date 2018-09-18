import React from 'react'
import PropTypes from 'prop-types'
import Grid from 'components/Grid'
import Table from 'components/Table'
import TableBody from '@material-ui/core/TableBody'
import TableHead from '@material-ui/core/TableHead'
import TableFooter from '@material-ui/core/TableFooter'
import TableRow from '@material-ui/core/TableRow'
import SearchBar from 'components/SearchBar'
import DocListTableHead from './components/DocListTableHead'
import DocListTableRow from './components/DocListTableRow'

const DocList = props => {
  const { handleSearchDocs, handleSelectAll, documents } = props
  console.log(documents)

  return (
    <Grid container flex raised>
      <Grid type="row" container align="center" justify="space-between" padding="25px 20px 20px 20px">
        <Grid></Grid>
        <Grid>
          <SearchBar placeholder="Search" />
        </Grid>
      </Grid>
      <Grid container flex>
        <Table
          style={{ borderCollapse: 'separate', tableLayout: 'auto', overflow: 'unset' }}
          summary="List of documents">
          <TableHead style={{ width: '100%' }}>
            <DocListTableHead onSelectAll={handleSelectAll} />
          </TableHead>
          <TableBody>
            {documents.map(doc => {
              return <DocListTableRow key={`doc-${doc._id}`} {...doc} />
            })}
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  )
}

DocList.propTypes = {}

export default DocList