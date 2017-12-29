import * as types from './actionTypes'

export const onChangeForm = (prop, value) => ({ type: types.ON_CHANGE_FORM, value, target: prop })