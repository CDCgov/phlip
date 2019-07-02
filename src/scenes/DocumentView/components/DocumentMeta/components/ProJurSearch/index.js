import React from 'react'
import PropTypes from 'prop-types'
import { Icon, FlexGrid, Autocomplete, ModalTitle, ModalContent, ModalActions, CircularLoader } from 'components'
import Modal from 'components/Modal'
import Divider from '@material-ui/core/Divider'
import { capitalizeFirstLetter } from 'utils/formHelpers'

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

/**
 * The contents of the project jurisdiction autocomplete search modal
 * @param props
 * @returns {*}
 * @constructor
 */
const ProJurSearch = props => {
  const {
    suggestions,
    searchValue,
    onClearSuggestions,
    onGetSuggestions,
    onSearchValueChange,
    onSuggestionSelected,
    searchType,
    onMouseDown,
    open,
    onCloseModal,
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
      value: getButtonText('Update', buttonInfo.inProgress),
      type: 'button',
      otherProps: { 'aria-label': 'Update', 'id': 'updateConfirmBtn' },
      onClick: onConfirmAction,
      disabled: buttonInfo.disabled
    }
  ]
  
  return (
    <Modal onClose={onCloseModal} open={open} maxWidth="md" hideOverflow={false}>
      <ModalTitle title={`Assign ${searchType ? capitalizeFirstLetter(searchType) : ''}`} />
      <Divider />
      <ModalContent style={{ display: 'flex', flexDirection: 'column', paddingTop: 24, width: 500, height: 275 }}>
        <FlexGrid container type="row" align="center" onMouseDown={onMouseDown}>
          <FlexGrid container type="row" align="center" padding="0 0 20px" flex>
            <Icon style={{ paddingRight: 8 }}>
              {searchType === 'jurisdiction' ? 'account_balance' : 'dvr'}
            </Icon>
            <Autocomplete
              suggestions={suggestions}
              handleGetSuggestions={val => onGetSuggestions(searchType, val)}
              handleClearSuggestions={() => onClearSuggestions(searchType)}
              inputProps={{
                value: searchValue,
                onChange: (e, { newValue }) => {
                  e.target.value === undefined
                    ? onSearchValueChange(searchType, newValue.name)
                    : onSearchValueChange(searchType, e.target.value)
                },
                id: `${searchType}-name`
              }}
              handleSuggestionSelected={onSuggestionSelected(searchType)}
              InputProps={{
                placeholder: `Search ${searchType}s`,
                fullWidth: true
              }}
            />
          </FlexGrid>
        </FlexGrid>
      </ModalContent>
      <Divider />
      <ModalActions actions={actions} />
    </Modal>
  )
}

ProJurSearch.propTypes = {
  showProjectError: PropTypes.bool,
  onMouseDown: PropTypes.func,
  suggestions: PropTypes.array,
  searchValue: PropTypes.string,
  onClearSuggestions: PropTypes.func,
  onGetSuggestions: PropTypes.func,
  onSearchValueChange: PropTypes.func,
  onSuggestionSelected: PropTypes.func,
  searchType: PropTypes.oneOf(['project', 'jurisdiction', '']),
  open: PropTypes.bool,
  onCloseModal: PropTypes.func,
  buttonInfo: PropTypes.object,
  onConfirmAction: PropTypes.func
}

export default ProJurSearch
