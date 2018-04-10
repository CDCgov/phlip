import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import SelectInput from '../SelectInput'
import { Field } from 'redux-form'
import Button from 'components/Button'
import IconButton from 'components/IconButton'
import { Column, Row } from 'components/Layout'
import styles from '../../add-edit-question.scss'
import * as questionTypes from '../../constants'

export const AnswerList = ({ fields, answerType, isEdit, canModify }) => {
  return (
    <Fragment>
      {answerType === questionTypes.TEXT_FIELD ? <div></div>
        : <Row>
          {fields.map((answer, index, fields) => {
            return (
              <Fragment key={index}>
                <Row>
                  <Field
                    name={`${answer}.text`}
                    type="text"
                    answerType={answerType}
                    placeholder={answerType === questionTypes.CATEGORY ? 'Add tab' : 'Add answer'}
                    handleDelete={() => fields.remove(index)}
                    component={SelectInput}
                    isEdit={isEdit}
                    canModify={canModify}
                    index={index}
                    fields={fields}
                    handleDown={() => fields.swap(index, index + 1)}
                    handleUp={() => fields.swap(index, index - 1)}
                    currentValue={fields.get(index)}
                    label={(index === 0 && answerType !== questionTypes.CATEGORY) ? 'Answers'
                      : (index === 0 && answerType === questionTypes.CATEGORY) ? 'Category/Tabs' : ''} />
                </Row>
              </Fragment>
            )
          })}

          {canModify && (answerType === questionTypes.BINARY
            ? null
            : <Button
              value="Add more"
              type="button"
              color="accent"
              raised={false}
              disableRipple={true}
              style={{ marginLeft: 32, fontWeight: 'normal' }}
              onClick={() => fields.push({ isNew: true, order: fields.length })} />)
          }
        </Row>
      }
    </Fragment>
  )
}

export default AnswerList