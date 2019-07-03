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
  'delete': 'Delete Documents',
  'approve': 'Approve Documents',
  'project': 'Assign Project',
  'jurisdiction': 'Assign Jurisdiction',
  'removeproject': 'Remove Project'
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
    onConfirmAction,
    ownerList,
    searching
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
  
  const genMessage = (bulkType) => {
    if (['project', 'jurisdiction'].includes(bulkType)) {
      return `Do you want to assign this ${bulkType} to other users' documents?`
    } else if (bulkType === 'removeproject') {
      return `Do you want to remove this ${typeToTitle[bulkType]} from other users' documents?`
    } else {
      return `Do you want to ${bulkType} other users' documents?`
    }
  }
  
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
          {['project', 'jurisdiction', 'removeproject'].includes(bulkType) &&
          <FlexGrid container type="row" align="center" padding="0 0 20px">
            <Icon style={{ paddingRight: 8 }}>
              {bulkType === 'jurisdiction' ? 'account_balance' : 'dvr'}
            </Icon>
            <Autocomplete
              suggestions={suggestions}
              handleGetSuggestions={val => onGetSuggestions(bulkType.includes('project') ? 'project' : bulkType, val)}
              handleClearSuggestions={() => onClearSuggestions(bulkType.includes('project') ? 'project' : bulkType)}
              isSearching={searching}
              inputProps={{
                value: searchValue,
                onChange: (e, { newValue }) => {
                  e.target.value === undefined
                    ? onSearchValueChange(bulkType.includes('project') ? 'project' : bulkType, newValue.name)
                    : onSearchValueChange(bulkType.includes('project') ? 'project' : bulkType, e.target.value)
                },
                id: `${bulkType.includes('project') ? 'project' : bulkType}-name`
              }}
              handleSuggestionSelected={onSuggestionSelected(bulkType.includes('project') ? 'project' : bulkType)}
              InputProps={{
                placeholder: `Search ${bulkType.includes('project') ? 'project' : bulkType}s`,
                fullWidth: true
              }}
            />
          </FlexGrid>}
          <FlexGrid>
            {ownerList.length > 0 &&
            <>
              <Typography variant="body1">{genMessage(bulkType)}</Typography>
              <Typography style={{ padding: 10 }} />
              <Typography variant="body1">Number of documents selected: {docCount}</Typography>
              <Typography variant="body2" style={{ paddingTop: 20 }}>Users: {ownerList.join(', ')}</Typography>
            </>}
            {ownerList.length === 0 && bulkType !== 'delete' &&
            <Typography variant="body1">Number of documents selected: {docCount}</Typography>
            }
            {bulkType === 'delete' &&
            <>
              {ownerList.length === 0 &&
              <Typography variant="body1">
                Do you want to delete {docCount} document{docCount > 1 ? 's' : ''}?
              </Typography>}
              <Typography style={{ paddingTop: 20 }}>
                <span style={{ fontSize: 18, fontWeight: 500 }}>Warning:</span> Deleting a document will remove all associated annotations for every project and jurisdiction.
              </Typography>
            </>}
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
  bulkType: PropTypes.oneOf(['', 'project', 'jurisdiction', 'delete', 'approve', 'removeproject']),
  docCount: PropTypes.number,
  onCloseModal: PropTypes.func,
  onConfirmAction: PropTypes.func,
  buttonInfo: PropTypes.object,
  ownerList: PropTypes.array,
  searching: PropTypes.bool
}

export default BulkModal
