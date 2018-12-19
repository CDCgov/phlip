import React from 'react'
import { shallow } from 'enzyme'
import { DocumentList } from '../index'

const props = {
  actions: {
    getApprovedDocumentsRequest: jest.fn()
  },
  jurisdictionId: 1,
  projectId: 1,
  page: 'coding',
  documents: [
    { name: 'doc1', _id: 12344 }
  ],
  annotated: [],
  docSelected: false,
  openedDoc: {}
}

describe('DocumentList', () => {
  test('should render DocumentList component correctly', () => {
    expect(shallow(<DocumentList {...props} />)).toMatchSnapshot()
  })

  test('should show PDFViewer when docSelected is true', () => {
    const wrapper = shallow(<DocumentList {...props} docSelected={true} />)
    expect(wrapper.find('PDFViewer')).toHaveLength(1)
  })

  test('should have quote icons when document is in annotated list', () => {
    const wrapper = shallow(<DocumentList {...props} annotated={[12344]} />)
    expect(wrapper.find('Icon')).toHaveLength(1)
  })
})