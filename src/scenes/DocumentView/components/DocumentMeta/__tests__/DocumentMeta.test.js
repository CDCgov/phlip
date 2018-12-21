import React from 'react'
import { shallow } from 'enzyme'
import { DocumentMeta } from '../index'

const props = {
  document: {
    content: {},
    name: 'Test file',
    uploadedByName: 'Trung',
    projects: [1, 2],
    jurisdictions: [25332, 2932]
  },
  effectiveDate: new Date().toLocaleDateString(),
  projectList: ['Project1', 'Project2'],
  jurisdictionList: ['Georgia', 'Alabama'],
  loading: false,
  jurisdictionSuggestions: [
    { id: 2932 }, { id: 25332 },
    { id: 1 }, { id: 2 }, { id: 3 }
  ],
  projectSuggestions: [{ id: 1 }, { id: 2 }, { id: 4 }, { id: 5 }]
}

describe('DocumentMeta - DocumentContents', () => {
  test('should render correctly', () => {
    expect(shallow(<DocumentMeta {...props} />)).toMatchSnapshot()
  })
})

describe('DocumentMeta - Filtered Jurisditions search suggestions', () => {
  test('should not include existing jurisdictions', () => {
    const wrapper = shallow(<DocumentMeta {...props} />)
    const instance = wrapper.instance()

    expect(instance.props.jurisdictionSuggestions.filter(instance.filterJurisdiction)).toEqual(
      [
        { id: 1 },
        { id: 2 },
        { id: 3 }
      ]
    )
  })
})

describe('DocumentMeta - Filtered Projects search suggestions', () => {
  test('should not include existing jurisdictions', () => {
    const wrapper = shallow(<DocumentMeta {...props} />)
    const instance = wrapper.instance()

    expect(instance.props.projectSuggestions.filter(instance.filterProject)).toEqual(
      [
        { id: 4 },
        { id: 5 }
      ]
    )
  })
})