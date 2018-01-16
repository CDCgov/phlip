import React from 'react'
import PropTypes from 'prop-types'
import SelectInput from '../SelectInput'
import { Field } from 'redux-form'
import Button from 'components/Button'

export const AnswerList = ({ fields, answerType }) => {
  return (

    <div>
      {answerType === 5 ? <div></div>
        : <div>
          <div>
            {fields.map((answer, index) => (
              <div key={index}>
                <Field
                  name={`${answer}.text`}
                  type="text"
                  answerType={answerType}
                  placeholder='Add answer'
                  component={SelectInput}
                  label={index === 0 ? 'Answers' : ''} />
              </div>
            ))}
          </div>

          {answerType === 1
            ? <div></div>
            : <Button
              value='Add more'
              type="button"
              color='accent'
              raised={false}
              disableRipple={true}
              style={{ paddingLeft: '48px', fontWeight: 'normal' }}
              onClick={() => fields.push({})} />
          }
        </div>
      }
    </div>
  )
}

export default AnswerList