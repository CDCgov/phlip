import React from 'react'
import { shallow, mount } from 'enzyme'
import {DocumentContents, DocumentMeta} from '../index'
import { MemoryRouter } from 'react-router-dom'
import { MuiThemeProvider } from '@material-ui/core'
import theme from 'services/theme'

const props = {
  document: {
    content: {},
    name: 'Test file',
    uploadedByName: 'Trung',
    projects : [1,2],
    jurisdictions: [25332,2932]

  },

  effectiveDate : new Date().toLocaleDateString(),
  projectList : ['Project1','Project2'],
  jurisdictionList : ['Georgia','Alabama'],
  loading: false,
  jurisdictionSuggestions :   [
      {id: 2932}, {id: 25332},
      { id: 1},{id:2},{id:3}],
    projectSuggestions : [{id:1},{id:2},{id:4},{id:5}]
}

const setup = (otherProps = {}) => {
  return mount(
    <MemoryRouter>
      <MuiThemeProvider theme={theme}>
        <DocumentMeta {...props} {...otherProps} />
      </MuiThemeProvider>
    </MemoryRouter>
  )
}

describe('DocumentMeta - DocumentContents', () => {
  test('should render correctly', () => {
    expect(shallow(<DocumentMeta {...props} />)).toMatchSnapshot()
  })
})

describe('DocumentMeta - Filtered Jurisditions search suggestions', () => {
  test('should not include existing jurisdictions', () =>{
    const wrapper = shallow(<DocumentMeta {...props} />)
      const instance = wrapper.instance()

    expect(instance.props.jurisdictionSuggestions.filter(instance.filterJurisdiction)).toEqual(
        [
          {id:1},
          {id:2},
          {id:3}
        ]
    )
  })
})

describe('DocumentMeta - Filtered Projects search suggestions', () => {
    test('should not include existing jurisdictions', () =>{
        const wrapper = shallow(<DocumentMeta {...props} />)
        const instance = wrapper.instance()

        expect(instance.props.projectSuggestions.filter(instance.filterProject)).toEqual(
            [
                {id:4},
                {id:5},
            ]
        )
    })
})