const sliceTable = (data, page, rowsPerPage) => data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)


export default { sliceTable }