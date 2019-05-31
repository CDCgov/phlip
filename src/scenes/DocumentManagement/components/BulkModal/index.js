import React from 'react'
import PropTypes from 'prop-types'
import FlexGrid from 'components/FlexGrid'
import Icon from 'components/Icon'
import Autocomplete from 'components/Autocomplete'
import Typography from '@material-ui/core/Typography'
import Modal, { ModalActions, ModalContent, ModalTitle } from 'components/Modal'
import Divider from '@material-ui/core/Divider'
import { CircularLoader } from 'components'

const typeToTitle = {
  'delete': 'Delete',
  'approve': 'Approve',
  'project': 'Assign Project',
  'jurisdiction': 'Assign Jurisdiction'
}

/*
 * gets button modal text
 */
const getButtonText = (text, inProgress) => {
  return (
    <>
      {text}
      {inProgress && <CircularLoader thickness={5} style={{ height: 15, width: 15, marginRight: 5 }} />}
    </>
  )
}

export const BulkModal = props => {
  const {
    suggestions,
    searchValue,
    onClearSuggestions,
    onGetSuggestions,
    onSearchValueChange,
    onSuggestionSelected,
    bulkType,
    docCount,
    onCloseModal,
    open,
    buttonInfo,
    onConfirmAction
  } = props
  
  const cancelButton = {
    value: 'Cancel',
    type: 'button',
    otherProps: { 'aria-label': 'Close modal' },
    preferred: true,
    onClick: onCloseModal
  }
  
  const actions = [
    cancelButton,
    {
      value: getButtonText('Confirm', buttonInfo.inProgress),
      type: 'button',
      otherProps: { 'aria-label': 'Confirm', 'id': 'bulkConfirmBtn' },
      onClick: onConfirmAction,
      disabled: buttonInfo.disabled
    }
  ]
  
  return (
    <Modal onClose={onCloseModal} open={open} maxWidth="md" hideOverflow={false} id="bulkConfirmBox">
      <ModalTitle title={typeToTitle[bulkType]} />
      <Divider />
      <ModalContent
        style={{
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 24,
          width: 500,
          height: 250
        }}>
        <FlexGrid container flex justify="space-between">
          {['project', 'jurisdiction'].includes(bulkType) &&
          <FlexGrid container type="row" align="center" padding="0 0 20px">
            <Icon style={{ paddingRight: 8 }}>
              {bulkType === 'jurisdiction' ? 'account_balance' : 'dvr'}
            </Icon>
            <Autocomplete
              suggestions={suggestions}
              handleGetSuggestions={val => onGetSuggestions(bulkType, val)}
              handleClearSuggestions={() => onClearSuggestions(bulkType)}
              inputProps={{
                value: searchValue,
                onChange: (e, { newValue }) => {
                  e.target.value === undefined
                    ? onSearchValueChange(bulkType, newValue.name)
                    : onSearchValueChange(bulkType, e.target.value)
                },
                id: `${bulkType}-name`
              }}
              handleSuggestionSelected={onSuggestionSelected(bulkType)}
              InputProps={{
                placeholder: `Search ${bulkType}s`,
                fullWidth: true
              }}
            />
          </FlexGrid>}
          <FlexGrid>
            <Typography variant="body1" align="center">Number of Documents Selected: {docCount}</Typography>
          </FlexGrid>
        </FlexGrid>
      </ModalContent>
      <Divider />
      <ModalActions actions={actions} />
    </Modal>
  )
}

BulkModal.propTypes = {
  open: PropTypes.bool,
  suggestions: PropTypes.array,
  searchValue: PropTypes.string,
  onClearSuggestions: PropTypes.func,
  onGetSuggestions: PropTypes.func,
  onSearchValueChange: PropTypes.func,
  onSuggestionSelected: PropTypes.func,
  bulkType: PropTypes.oneOf(['', 'project', 'jurisdiction', 'delete', 'approve']),
  docCount: PropTypes.number,
  onCloseModal: PropTypes.func,
  onConfirmAction: PropTypes.func,
  buttonInfo: PropTypes.object
}

export default BulkModal