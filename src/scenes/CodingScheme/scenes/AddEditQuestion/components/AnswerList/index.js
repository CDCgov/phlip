import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import SelectInput from '../SelectInput'
import { Field } from 'redux-form'
import Button from 'components/Button'
import IconButton from 'components/IconButton'
import { Column, Row } from 'components/Layout'
import styles from '../../add-edit-question.scss'
import * as questionTypes from '../../constants'

export const AnswerList = ({ fields, answerType, isEdit }) => {
  return (
    <Fragment>
      {answerType === questionTypes.TEXT_FIELD ? <div></div>
        : <Row>
          {fields.map((answer, index) => (
            <Fragment key={index}>
              <Row>
                <Field
                  name={`${answer}.text`}
                  type="text"
                  answerType={answerType}
                  placeholder="Add answer"
                  handleDelete={() => fields.remove(index)}
                  component={SelectInput}
                  isEdit={isEdit}
                  label={index === 0 ? 'Answers' : ''} />

              </Row>

            </Fragment>
          ))}

          {answerType === questionTypes.BINARY
            ? <div></div>
            : <Button
              value="Add more"
              type="button"
              color="accent"
              raised={false}
              disableRipple={true}
              style={{ paddingLeft: '48px', fontWeight: 'normal' }}
              onClick={() => fields.push({})} />
          }
        </Row>
      }
    </Fragment>
  )
}

export default AnswerList