import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import SelectInput from '../SelectInput'
import { Field } from 'redux-form'
import Button from 'components/Button'
import styles from '../../add-edit-question.scss'
import * as questionTypes from '../../constants'

export const AnswerList = ({ fields, answerType }) => {
  return (
    <Fragment>
      {answerType === questionTypes.TEXT_FIELD ? <div></div>
        : <Fragment>
          {fields.map((answer, index) => (
            <Fragment key={index}>
              <Field
                name={`${answer}.text`}
                type="text"
                answerType={answerType}
                placeholder="Add answer"
                component={SelectInput}
                label={index === 0 ? 'Answers' : ''} />
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
        </Fragment>
      }
    </Fragment>
  )
}

export default AnswerList