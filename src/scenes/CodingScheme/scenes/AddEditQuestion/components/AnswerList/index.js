import React, { Component } from 'react'
import PropTypes from 'prop-types'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import RadioInput from '../RadioInput'


export const AnswerList = ({ type, answers }) => (
  <div>{answers.map(answer => (
    <RadioInput answer={answer} key={answer.id} />
  ))} </div>
)

export default AnswerList