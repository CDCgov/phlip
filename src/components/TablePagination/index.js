import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'material-ui/styles/withStyles'
import IconButton from 'material-ui/IconButton'
import Input from 'material-ui/Input'
import { MenuItem } from 'material-ui/Menu'
import Select from 'material-ui/Select'
import { TableCell } from 'material-ui/Table'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import KeyboardArrowLeft from 'material-ui/internal/svg-icons/KeyboardArrowLeft'
import KeyboardArrowRight from 'material-ui/internal/svg-icons/KeyboardArrowRight'

export const styles = theme => ({
  root: {
    '&:last-child': {
      padding: 0
    }
  },
  toolbar: {
    height: 56,
    minHeight: 56,
    paddingRight: 2
  },
  spacer: {
    flex: '1 1 100%'
  },
  caption: {
    flexShrink: 0
  },
  input: {
    fontSize: 'inherit'
  },
  selectRoot: {
    marginRight: theme.spacing.unit * 4
  },
  select: {
    marginLeft: theme.spacing.unit,
    width: 34,
    textAlign: 'right',
    paddingRight: 22,
    color: theme.palette.text.secondary,
    height: 32,
    lineHeight: '32px'
  },
  actions: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5
  }
})

class TablePagination extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { count, onChangePage, rowsPerPage } = nextProps
    const newLastPage = Math.max(0, Math.ceil(count / rowsPerPage) - 1)
    if (this.props.page > newLastPage) {
      onChangePage(null, newLastPage)
    }
  }

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1)
  }

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1)
  }

  render() {
    const {
      classes,
      colSpan: colSpanProp,
      component: Component,
      count,
      labelDisplayedRows,
      labelRowsPerPage,
      onChangePage,
      onChangeRowsPerPage,
      page,
      rowsPerPage,
      rowsPerPageOptions,
      theme,
      ...other
    } = this.props

    let colSpan

    if (Component === TableCell || Component === 'td') {
      colSpan = colSpanProp || 1000 // col-span over everything
    }

    const themeDirection = theme && theme.direction
    const numberOptions = Object.keys(rowsPerPageOptions).length

    return (
      <Component className={classes.root} colSpan={colSpan} {...other}>
        <Toolbar className={classes.toolbar}>
          <div className={classes.spacer} />
          {numberOptions > 2 && (
            <Typography type="caption" className={classes.caption}>
              {labelRowsPerPage}
            </Typography>
          )}
          {numberOptions > 2 && (
            <Select
              classes={{ root: classes.selectRoot, select: classes.select }}
              input={
                <Input
                  classes={{
                    root: classes.input
                  }}
                  disableUnderline
                />
              }
              value={rowsPerPage}
              onChange={onChangeRowsPerPage}
            >
              {Object.keys(rowsPerPageOptions).map(rowsPerPageOption => (
                <MenuItem key={rowsPerPageOption} value={parseInt(rowsPerPageOption)}>
                  {rowsPerPageOptions[rowsPerPageOption].label}
                </MenuItem>
              ))}
              <MenuItem key="All" value={count}>
                All
              </MenuItem>
            </Select>
          )}
          <Typography type="caption" className={classes.caption}>
            {labelDisplayedRows({
              from: count === 0 ? 0 : page * rowsPerPage + 1,
              to: Math.min(count, (page + 1) * rowsPerPage),
              count,
              page
            })}
          </Typography>
          <div className={classes.actions}>
            <IconButton onClick={this.handleBackButtonClick} disabled={page === 0}>
              {themeDirection === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
              onClick={this.handleNextButtonClick}
              disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            >
              {themeDirection === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
          </div>
        </Toolbar>
      </Component>
    )
  }
}

TablePagination.propTypes = {
  classes: PropTypes.object.isRequired,
  colSpan: PropTypes.number,
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  count: PropTypes.number.isRequired,
  labelDisplayedRows: PropTypes.func,
  labelRowsPerPage: PropTypes.node,
  onChangePage: PropTypes.func.isRequired,
  onChangeRowsPerPage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  rowsPerPageOptions: PropTypes.object,
  theme: PropTypes.object.isRequired
}

TablePagination.defaultProps = {
  component: TableCell,
  labelDisplayedRows: ({ from, to, count }) => `${from}-${to} of ${count}`,
  labelRowsPerPage: 'Rows per page:',
  rowsPerPageOptions: { 5: { label: '5' }, 10: { label: '10' }, 25: { label: '25' } },
  count: 0
}

export default withStyles(styles, { withTheme: true, name: 'MuiTablePagination' })(TablePagination)