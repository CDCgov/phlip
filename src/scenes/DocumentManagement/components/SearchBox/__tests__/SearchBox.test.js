import React from 'react'
import { shallow } from 'enzyme'
import { SearchBox } from '../index'

const props = {
    searchTerms: {
        docNameSearchValue: 'doc1',
        uploadedBySearchValue: 'Tim',
        uploadedDateSearchValue: '1/1/2000',
        projectSearchValue: 'Project 1',
        jurisdictionSearchValue: 'Ohio (state)',
    }
}

describe('DocumentManagement - SearchBox', () => {
  test('should render correctly', () => {
    expect(shallow(<SearchBox {...props} />)).toMatchSnapshot()
  })
})